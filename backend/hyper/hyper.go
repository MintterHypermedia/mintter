// Package hyper implements Mintter Hypermedia System.
package hyper

import (
	"context"
	"errors"
	"fmt"
	"mintter/backend/hyper/hypersql"
	"mintter/backend/ipfs"

	"crawshaw.io/sqlite"
	"crawshaw.io/sqlite/sqlitex"
	"github.com/fxamacker/cbor/v2"
	"github.com/ipfs/boxo/blockstore"
	blocks "github.com/ipfs/go-block-format"
	"github.com/ipfs/go-cid"
	cbornode "github.com/ipfs/go-ipld-cbor"
	dagpb "github.com/ipld/go-codec-dagpb"
	"github.com/multiformats/go-multicodec"
	"go.uber.org/zap"
)

// BlobType is a named type for Mintter Terra Blobs.
type BlobType string

// Storage is an indexing blob storage.
type Storage struct {
	db  *sqlitex.Pool
	bs  *indexingBlockStore
	log *zap.Logger

	*indexer
}

// NewStorage creates a new blob storage.
func NewStorage(db *sqlitex.Pool, log *zap.Logger) *Storage {
	bs := newBlockstore(db)

	idx := &indexer{
		db:  db,
		log: log,
		bs:  bs,
	}

	return &Storage{
		db:      db,
		bs:      &indexingBlockStore{blockStore: bs, indexBlob: idx.indexBlob},
		log:     log,
		indexer: idx,
	}
}

// Query allows to execute raw SQLite queries.
func (bs *Storage) Query(ctx context.Context, fn func(conn *sqlite.Conn) error) (err error) {
	conn, release, err := bs.db.Conn(ctx)
	if err != nil {
		return err
	}
	defer release()

	// TODO(burdiyan): make the main database read-only.
	// This is commented because we want to allow writing into an attached in-memory database
	// while keeping the main database read-only. Apparently this is not possible in SQLite.
	// There're a bunch of other ways to achieve this but there's currently no time for implementing them.
	//
	// if err := sqlitex.ExecTransient(conn, "PRAGMA query_only = on;", nil); err != nil {
	// 	return err
	// }
	// defer func() {
	// 	err = multierr.Combine(err, sqlitex.ExecTransient(conn, "PRAGMA query_only = off;", nil))
	// }()

	return fn(conn)
}

// SaveBlob into the internal storage. Index if necessary.
func (bs *Storage) SaveBlob(ctx context.Context, blob Blob) error {
	conn, release, err := bs.db.Conn(ctx)
	if err != nil {
		return err
	}
	defer release()

	codec, hash := ipfs.DecodeCID(blob.CID)

	return sqlitex.WithTx(conn, func() error {
		id, exists, err := bs.bs.putBlock(conn, 0, uint64(codec), hash, blob.Data)
		if err != nil {
			return err
		}

		// No need to index if exists.
		if exists {
			return nil
		}

		if err := bs.indexBlob(conn, id, blob.CID, blob.Decoded); err != nil {
			return fmt.Errorf("failed to index blob %s: %w", blob.CID, err)
		}

		return nil
	})
}

// SetAccountTrust sets an account to trusted.
func (bs *Storage) SetAccountTrust(ctx context.Context, acc []byte) error {
	conn, release, err := bs.db.Conn(ctx)
	if err != nil {
		return err
	}
	defer release()

	return sqlitex.WithTx(conn, func() error {
		return hypersql.SetAccountTrust(conn, acc)
	})
}

// UnsetAccountTrust untrust the provided account.
func (bs *Storage) UnsetAccountTrust(ctx context.Context, acc []byte) error {
	conn, release, err := bs.db.Conn(ctx)
	if err != nil {
		return err
	}
	defer release()

	return sqlitex.WithTx(conn, func() error {
		return hypersql.UnsetAccountTrust(conn, acc)
	})
}

func (bs *Storage) SaveDraftBlob(ctx context.Context, eid EntityID, blob Blob) error {
	conn, release, err := bs.db.Conn(ctx)
	if err != nil {
		return err
	}
	defer release()

	codec, hash := ipfs.DecodeCID(blob.CID)

	return sqlitex.WithTx(conn, func() error {
		id, exists, err := bs.bs.putBlock(conn, 0, uint64(codec), hash, blob.Data)
		if err != nil {
			return err
		}

		// No need to index if exists.
		if exists {
			return nil
		}

		if err := bs.indexBlob(conn, id, blob.CID, blob.Decoded); err != nil {
			return fmt.Errorf("failed to index blob %s: %w", blob.CID, err)
		}

		resp, err := hypersql.EntitiesLookupID(conn, string(eid))
		if err != nil {
			return err
		}
		if resp.EntitiesID == 0 {
			panic("BUG: failed to lookup entity after inserting the blob")
		}

		return hypersql.DraftsInsert(conn, resp.EntitiesID, id)
	})
}

func (bs *Storage) ListEntities(ctx context.Context, prefix string) ([]EntityID, error) {
	conn, release, err := bs.db.Conn(ctx)
	if err != nil {
		return nil, err
	}
	defer release()

	resp, err := hypersql.EntitiesListByPrefix(conn, prefix+"*")
	if err != nil {
		return nil, err
	}

	out := make([]EntityID, len(resp))
	for i, r := range resp {
		out[i] = EntityID(r.EntitiesEID)
	}

	return out, nil
}

func (bs *Storage) PublishDraft(ctx context.Context, eid EntityID) (cid.Cid, error) {
	conn, release, err := bs.db.Conn(ctx)
	if err != nil {
		return cid.Undef, err
	}
	defer release()

	var out cid.Cid
	if err := sqlitex.WithTx(conn, func() error {
		res, err := hypersql.DraftsGet(conn, string(eid))
		if err != nil {
			return err
		}
		if res.DraftsViewBlobID == 0 {
			return fmt.Errorf("no draft to publish for entity %s", eid)
		}

		if err := hypersql.DraftsDelete(conn, res.DraftsViewBlobID); err != nil {
			return err
		}

		out = cid.NewCidV1(uint64(res.DraftsViewCodec), res.DraftsViewMultihash)

		return nil
	}); err != nil {
		return cid.Undef, err
	}

	if !out.Defined() {
		return cid.Undef, fmt.Errorf("BUG: got draft without CID")
	}

	return out, nil
}

func (bs *Storage) DeleteDraft(ctx context.Context, eid EntityID) error {
	conn, release, err := bs.db.Conn(ctx)
	if err != nil {
		return err
	}
	defer release()

	return sqlitex.WithTx(conn, func() error {
		res, err := hypersql.DraftsGet(conn, string(eid))
		if err != nil {
			return err
		}
		if res.DraftsViewBlobID == 0 {
			return fmt.Errorf("no draft to publish for entity %s", eid)
		}

		if err := hypersql.DraftsDelete(conn, res.DraftsViewBlobID); err != nil {
			return err
		}

		_, err = hypersql.BlobsDelete(conn, res.DraftsViewMultihash)
		if err != nil {
			return err
		}

		// Trying to delete the entity. It will fail if there're more changes left for it.
		err = hypersql.EntitiesDelete(conn, string(eid))
		if sqlite.ErrCode(err) == sqlite.SQLITE_CONSTRAINT_FOREIGNKEY {
			return nil
		}
		return err
	})
}

func (bs *Storage) DeleteEntity(ctx context.Context, eid EntityID) error {
	conn, release, err := bs.db.Conn(ctx)
	if err != nil {
		return err
	}
	defer release()

	return sqlitex.WithTx(conn, func() error {
		edb, err := hypersql.EntitiesLookupID(conn, string(eid))
		if err != nil {
			return err
		}
		if edb.EntitiesID == 0 {
			return fmt.Errorf("no such entity: %s", eid)
		}

		if err := hypersql.ChangesDeleteForEntity(conn, edb.EntitiesID); err != nil {
			return err
		}

		if err := hypersql.EntitiesDelete(conn, string(eid)); err != nil {
			return err
		}

		return nil
	})
}

func (bs *Storage) ReplaceDraftBlob(ctx context.Context, eid EntityID, old cid.Cid, blob Blob) error {
	if !old.Defined() {
		return fmt.Errorf("BUG: can't replace: old CID is not defined")
	}

	conn, release, err := bs.db.Conn(ctx)
	if err != nil {
		return err
	}
	defer release()

	return sqlitex.WithTx(conn, func() error {
		oldid, err := bs.bs.deleteBlock(conn, old)
		if err != nil {
			return err
		}

		codec, hash := ipfs.DecodeCID(blob.CID)

		id, exists, err := bs.bs.putBlock(conn, oldid, uint64(codec), hash, blob.Data)
		if err != nil {
			return fmt.Errorf("replace draft blob error when insert: %w", err)
		}

		// No need to index if exists.
		if exists {
			return nil
		}

		if err := bs.indexBlob(conn, id, blob.CID, blob.Decoded); err != nil {
			return fmt.Errorf("failed to index blob %s: %w", blob.CID, err)
		}

		resp, err := hypersql.EntitiesLookupID(conn, string(eid))
		if err != nil {
			return err
		}
		if resp.EntitiesID == 0 {
			panic("BUG: failed to lookup entity after inserting the blob")
		}

		return hypersql.DraftsInsert(conn, resp.EntitiesID, id)
	})
}

func (bs *Storage) LoadBlob(ctx context.Context, c cid.Cid, v any) error {
	codec, _ := ipfs.DecodeCID(c)
	if codec != uint64(multicodec.DagCbor) {
		return fmt.Errorf("TODO: can't load non-cbor blobs")
	}

	blk, err := bs.bs.Get(ctx, c)
	if err != nil {
		return err
	}

	if err := cbornode.DecodeInto(blk.RawData(), v); err != nil {
		return fmt.Errorf("failed to decode CBOR blob %s: %w", c, err)
	}

	return nil
}

type IPFSBlockstoreReader interface {
	Has(context.Context, cid.Cid) (bool, error)
	Get(context.Context, cid.Cid) (blocks.Block, error)
	GetSize(context.Context, cid.Cid) (int, error)
}

func (bs *Storage) IPFSBlockstoreReader() IPFSBlockstoreReader {
	return bs.bs
}

func (bs *Storage) IPFSBlockstore() blockstore.Blockstore {
	return bs.bs
}

// Blob is a structural artifact.
type Blob struct {
	CID     cid.Cid
	Data    []byte
	Decoded any
}

// EncodeBlob produces a Blob from any object.
func EncodeBlob(v any) (hb Blob, err error) {
	data, err := cbornode.DumpObject(v)
	if err != nil {
		return hb, fmt.Errorf("failed to encode blob %T: %w", v, err)
	}

	blk := ipfs.NewBlock(uint64(multicodec.DagCbor), data)
	c := blk.Cid()

	return Blob{
		CID:     c,
		Data:    data,
		Decoded: v,
	}, nil
}

var errNotHyperBlob = errors.New("not a hyper blob")

// DecodeBlob attempts to infer hyper Blob information from arbitrary IPFS block.
func DecodeBlob(c cid.Cid, data []byte) (hb Blob, err error) {
	codec := c.Prefix().Codec

	switch multicodec.Code(codec) {
	case multicodec.DagPb:
		b := dagpb.Type.PBNode.NewBuilder()
		if err := dagpb.DecodeBytes(b, data); err != nil {
			return hb, fmt.Errorf("failed to decode dagpb node %s: %w", c, err)
		}

		hb.Decoded = b.Build()
	case multicodec.DagCbor:
		var v struct {
			Type string `cbor:"@type"`
		}
		if err := cbor.Unmarshal(data, &v); err != nil {
			return hb, fmt.Errorf("failed to infer hyper blob %s: %w", c, err)
		}

		switch BlobType(v.Type) {
		case TypeKeyDelegation:
			var v KeyDelegation
			if err := cbornode.DecodeInto(data, &v); err != nil {
				return hb, err
			}
			hb.Decoded = v
		case TypeChange:
			var v Change
			if err := cbornode.DecodeInto(data, &v); err != nil {
				return hb, err
			}
			hb.Decoded = v
		default:
			return hb, fmt.Errorf("unknown hyper blob type: '%s'", v.Type)
		}
	default:
		return hb, fmt.Errorf("%s: %w", c, errNotHyperBlob)
	}

	hb.CID = c
	hb.Data = data

	return hb, nil
}

type indexingBlockStore struct {
	*blockStore
	indexBlob func(conn *sqlite.Conn, id int64, c cid.Cid, blob any) error
}

func (b *indexingBlockStore) Put(ctx context.Context, block blocks.Block) error {
	// conn, release, err := b.db.Conn(ctx)
	// if err != nil {
	// 	return err
	// }
	// defer release()

	// return sqlitex.WithTx(conn, func() error {
	// 	codec, hash := ipfs.DecodeCID(block.Cid())
	// 	id, exists, err := b.putBlock(conn, 0, codec, hash, block.RawData())
	// 	if err != nil {
	// 		return err
	// 	}

	// 	if exists {
	// 		return nil
	// 	}

	// 	hb, err := DecodeBlob(block.Cid(), block.RawData())
	// 	if err != nil {
	// 		return err
	// 	}

	// 	return b.indexBlob(conn, id, hb.CID, hb.Decoded)
	// })

	return b.blockStore.Put(ctx, block)
}

// PutMany implements blockstore.Blockstore interface.
func (b *indexingBlockStore) PutMany(ctx context.Context, blocks []blocks.Block) error {
	// conn, release, err := b.db.Conn(ctx)
	// if err != nil {
	// 	return err
	// }
	// defer release()

	// return sqlitex.WithTx(conn, func() error {
	// 	for _, blk := range blocks {
	// 		codec, hash := ipfs.DecodeCID(blk.Cid())
	// 		if _, _, err := b.putBlock(conn, 0, codec, hash, blk.RawData()); err != nil {
	// 			return err
	// 		}
	// 	}
	// 	return nil
	// })

	return b.blockStore.PutMany(ctx, blocks)
}
