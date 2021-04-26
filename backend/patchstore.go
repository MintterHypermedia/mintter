package backend

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/dgraph-io/badger/v3"
	blocks "github.com/ipfs/go-block-format"
	"github.com/ipfs/go-cid"
	blockstore "github.com/ipfs/go-ipfs-blockstore"
	exchange "github.com/ipfs/go-ipfs-exchange-interface"
	"github.com/libp2p/go-libp2p-core/crypto"
	"github.com/libp2p/go-libp2p-core/peer"
	"golang.org/x/sync/errgroup"
)

// nowFunc is overwritten in tests.
var nowFunc = func() time.Time {
	return time.Now().UTC()
}

type patchStore struct {
	db *badger.DB

	patches map[cid.Cid]map[cid.Cid][]patchIndexItem // object-id -> peer-id => patches
	deps    map[cid.Cid][]cid.Cid                    // object-id => cids of unreferenced patches

	bs   blockstore.Blockstore
	k    crypto.PrivKey
	peer cid.Cid

	exchange exchange.Interface

	mu   sync.RWMutex
	subs map[chan<- signedPatch]struct{}
}

func newPatchStore(k crypto.PrivKey, bs blockstore.Blockstore, db *badger.DB) (*patchStore, error) {
	pid, err := peer.IDFromPrivateKey(k)
	if err != nil {
		return nil, err
	}

	return &patchStore{
		db: db,

		patches: make(map[cid.Cid]map[cid.Cid][]patchIndexItem),
		deps:    make(map[cid.Cid][]cid.Cid),
		k:       k,
		peer:    peer.ToCid(pid),
		bs:      bs,
		subs:    make(map[chan<- signedPatch]struct{}),
	}, nil
}

func (s *patchStore) AddPatch(ctx context.Context, sp signedPatch) error {
	txn := s.db.NewTransaction(true)
	defer txn.Discard()

	headKey := makeKeyHead(sp.ObjectID, sp.peer)
	var h head
	{
		item, err := txn.Get(headKey)
		switch err {
		case nil:
			if err := item.Value(func(data []byte) error {
				return json.Unmarshal(data, &h)
			}); err != nil {
				return err
			}
		case badger.ErrKeyNotFound:
			// Leave head with 0 value.
		default:
			return err
		}
	}

	if h.Seq+1 != sp.Seq {
		return fmt.Errorf("concurrency error: precondition failed: stored seq = %d, incoming seq = %d", h.Seq, sp.Seq)
	}

	if len(sp.Deps) > 0 {
		if !sp.Deps[0].Equals(h.CID) {
			return fmt.Errorf("first dep must be previous head of this peer")
		}
	}

	// TODO: use the same txn to store blocks.
	if err := s.bs.Put(sp.blk); err != nil {
		return fmt.Errorf("failed to put patch in blockstore: %w", err)
	}

	h.CID = sp.cid
	h.Seq = sp.Seq
	h.LamportTime = sp.LamportTime

	newHead, err := json.Marshal(h)
	if err != nil {
		return err
	}

	if err := txn.Set(headKey, newHead); err != nil {
		return err
	}

	if err := txn.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	// Notify
	s.mu.RLock()
	defer s.mu.RUnlock()

	for s := range s.subs {
		s <- sp
	}

	return nil
}

func (s *patchStore) LoadState(ctx context.Context, obj cid.Cid) (*state, error) {
	txn := s.db.NewTransaction(false)
	defer txn.Discard()

	opts := badger.DefaultIteratorOptions
	opts.PrefetchSize = 10
	opts.Prefix = makePrefixHead(obj)
	it := txn.NewIterator(opts)
	defer it.Close()

	out := make([][]signedPatch, 0, 10) // Cap is arbitrary.

	g, ctx := errgroup.WithContext(ctx)

	var i int
	for it.Rewind(); it.Valid(); it.Next() {
		var h head

		item := it.Item()
		if err := item.Value(func(data []byte) error {
			if err := json.Unmarshal(data, &h); err != nil {
				return err
			}
			return nil
		}); err != nil {
			return nil, err
		}

		out = append(out, make([]signedPatch, h.Seq))

		byPeerIdx := i
		g.Go(func() error {
			next := h.CID
			idx := h.Seq - 1

			// TODO: check if object and peer are the same between iterations.
			for next.Defined() {
				select {
				case <-ctx.Done():
					return ctx.Err()
				default:
					blk, err := s.bs.Get(next)
					if err != nil {
						return err
					}

					sp, err := decodePatchBlock(blk)
					if err != nil {
						return err
					}

					out[byPeerIdx][idx] = sp
					idx--

					if len(sp.Deps) > 1 {
						panic("BUG: multiple deps are not implemented yet")
					}

					if len(sp.Deps) == 0 {
						next = cid.Undef
					} else {
						next = sp.Deps[0]
					}
				}
			}

			return nil
		})
		i++
	}

	if err := g.Wait(); err != nil {
		return nil, err
	}

	return newState(obj, out), nil
}

func (s *patchStore) ReplicateFromHead(ctx context.Context, h head) error {
	exists, err := s.bs.Has(h.CID)
	if err != nil {
		return err
	}

	if exists {
		return nil
	}

	// Get local head.
	// Create buffer of size h.Seq - local seq.

	var blk blocks.Block
	// blk, err := s.exchange.Get(h.CID)
	// if err != nil {
	// 	return err
	// }

	sp, err := decodePatchBlock(blk)
	if err != nil {
		return err
	}

	_ = sp

	txn := s.db.NewTransaction(false)
	defer txn.Discard()

	if err := txn.Commit(); err != nil {
		return err
	}

	return nil
}

// Watch will notify the given channel when new patches get added to the store.
// Callers must make sure to drain the channels and not block for too long.
func (s *patchStore) Watch(c chan<- signedPatch) {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.subs[c] = struct{}{}
}

// Unwatch will remove the given channel from the subscribers list in the store.
func (s *patchStore) Unwatch(c chan<- signedPatch) {
	s.mu.Lock()
	defer s.mu.Unlock()

	delete(s.subs, c)
}

func makePrefixHead(obj cid.Cid) []byte {
	var b bytes.Buffer
	b.WriteString("mtt/objects/")
	b.Write(obj.Bytes())
	return b.Bytes()
}

func makeKeyHead(obj, peer cid.Cid) []byte {
	var b bytes.Buffer
	b.WriteString("mtt/objects/")
	b.Write(obj.Bytes())
	b.WriteString("/peers/")
	b.Write(peer.Bytes())
	return b.Bytes()
}

type head struct {
	Peer        cid.Cid
	CID         cid.Cid
	Seq         uint64
	LamportTime uint64
}

type patchIndexItem struct {
	Seq         uint64
	LamportTime uint64
	CID         cid.Cid
}
