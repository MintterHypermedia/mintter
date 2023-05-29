package syncing

import (
	"context"
	"errors"
	"fmt"
	"mintter/backend/core"
	p2p "mintter/backend/genproto/p2p/v1alpha"
	"mintter/backend/hyper"
	"mintter/backend/hyper/hypersql"
	"sync"
	"sync/atomic"
	"time"

	"crawshaw.io/sqlite"
	"crawshaw.io/sqlite/sqlitex"
	"github.com/ipfs/boxo/exchange"
	"github.com/ipfs/go-cid"
	cbornode "github.com/ipfs/go-ipld-cbor"
	"github.com/libp2p/go-libp2p/core/peer"
	"go.uber.org/zap"
)

// NetDialFunc is a function of the Mintter P2P node that creates an instance
// of a P2P RPC client for a given remote Device ID.
type NetDialFunc func(context.Context, peer.ID) (p2p.P2PClient, error)

// Bitswap is a subset of the Bitswap that is used by syncing service.
type Bitswap interface {
	NewSession(context.Context) exchange.Fetcher
	FindProvidersAsync(context.Context, cid.Cid, int) <-chan peer.AddrInfo
}

// Service manages syncing of Mintter objects among peers.
type Service struct {
	// warmupDuration defines how long to wait before the first sync after the service is started.
	// Can be changed before calling Start().
	warmupDuration time.Duration
	// syncInterval specifies how often global sync process is performed.
	// Can be changed before calling Start().
	syncInterval time.Duration
	// peerSyncTimeout defines the timeout for syncing with one peer.
	peerSyncTimeout time.Duration

	// onStart is a callback function which is called when the service is started.
	onStart func(context.Context) error
	// onSync is a callback function which is called after a single sync loop.
	onSync func(SyncResult) error

	log     *zap.Logger
	db      *sqlitex.Pool
	blobs   *hyper.Storage
	me      core.Identity
	bitswap Bitswap
	client  NetDialFunc

	// NoInbound disables syncing content from the remote peer to our peer.
	// If false, then documents get synced in both directions.
	NoInbound bool
	mu        sync.Mutex // Ensures only one sync loop is running at a time.
}

const (
	defaultWarmupDuration  = time.Minute
	defaultSyncInterval    = time.Minute
	defaultPeerSyncTimeout = time.Minute * 5
)

// NewService creates a new syncing service. Users must call Start() to start the periodic syncing.
func NewService(log *zap.Logger, me core.Identity, db *sqlitex.Pool, blobs *hyper.Storage, bitswap Bitswap, client NetDialFunc, inDisable bool) *Service {
	svc := &Service{
		warmupDuration:  defaultWarmupDuration,
		syncInterval:    defaultSyncInterval,
		peerSyncTimeout: defaultPeerSyncTimeout,

		log:       log,
		db:        db,
		blobs:     blobs,
		me:        me,
		bitswap:   bitswap,
		client:    client,
		NoInbound: inDisable,
	}

	return svc
}

// SetWarmupDuration sets the corresponding duration if it's non-zero.
// Must be called before calling Start().
func (s *Service) SetWarmupDuration(d time.Duration) {
	if d != 0 {
		s.warmupDuration = d
	}
}

// SetSyncInterval sets the corresponding duration if it's non-zero.
// Must be called before calling Start().
func (s *Service) SetSyncInterval(d time.Duration) {
	if d != 0 {
		s.syncInterval = d
	}
}

// SetPeerSyncTimeout sets the corresponding duration if it's non-zero.
// Must be called before calling Start().
func (s *Service) SetPeerSyncTimeout(d time.Duration) {
	if d != 0 {
		s.peerSyncTimeout = d
	}
}

// OnStart sets a callback which is called when the service is started by calling Start().
// Must be called before calling Start(), and multiple callbacks will be called in FIFO order.
func (s *Service) OnStart(fn func(context.Context) error) {
	old := s.onStart
	s.onStart = func(ctx context.Context) error {
		if old != nil {
			if err := old(ctx); err != nil {
				return err
			}
		}
		if err := fn(ctx); err != nil {
			return err
		}
		return nil
	}
}

// OnSync sets a callback which is called after each sync iteration.
// Must be called before calling Start(), and multiple callbacks will be called in FIFO order.
func (s *Service) OnSync(fn func(SyncResult) error) {
	old := s.onSync
	s.onSync = func(res SyncResult) error {
		if old != nil {
			if err := old(res); err != nil {
				return err
			}
		}
		if err := fn(res); err != nil {
			return err
		}
		return nil
	}
}

// Start the syncing service which will periodically perform global sync loop.
func (s *Service) Start(ctx context.Context) (err error) {
	s.log.Debug("SyncingServiceStarted")
	defer func() {
		s.log.Debug("SyncingServiceFinished", zap.Error(err))
	}()

	t := time.NewTimer(s.warmupDuration)

	if s.onStart != nil {
		if err := s.onStart(ctx); err != nil {
			return err
		}
	}

	for {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-t.C:
			if err := s.SyncAndLog(ctx); err != nil {
				return err
			}

			t.Reset(s.syncInterval)
		}
	}
}

// SyncAndLog is the same as Sync but will log the results instead of returning them.
// Calls will be de-duplicated as only one sync loop may be in progress at any given moment.
// Returned error indicates a fatal error. The behavior of calling Sync again after a fatal error is undefined.
func (s *Service) SyncAndLog(ctx context.Context) error {
	log := s.log.With(zap.Int64("traceID", time.Now().UnixMicro()))

	log.Info("SyncLoopStarted")

	res, err := s.Sync(ctx)
	if err != nil {
		if errors.Is(err, ErrSyncAlreadyRunning) {
			log.Debug("SyncLoopIsAlreadyRunning")
			return nil
		}
		return fmt.Errorf("fatal error in the sync background loop: %w", err)
	}

	for i, err := range res.Errs {
		if err != nil {
			log.Debug("SyncLoopError",
				zap.String("peer", res.Peers[i].String()),
				zap.Error(err),
			)
		}
	}

	log.Info("SyncLoopFinished",
		zap.Int64("failures", res.NumSyncFailed),
		zap.Int64("successes", res.NumSyncOK),
	)

	return nil
}

// ErrSyncAlreadyRunning is returned when calling Sync while one is already in progress.
var ErrSyncAlreadyRunning = errors.New("sync is already running")

// SyncResult is a summary of one Sync loop iteration.
type SyncResult struct {
	NumSyncOK     int64
	NumSyncFailed int64
	Peers         []peer.ID
	Errs          []error
}

// Sync attempts to sync the objects with connected peers.
func (s *Service) Sync(ctx context.Context) (res SyncResult, err error) {
	if !s.mu.TryLock() {
		return res, ErrSyncAlreadyRunning
	}
	defer s.mu.Unlock()

	var delegations []hypersql.KeyDelegationsListAllResult
	if err := s.blobs.Query(ctx, func(conn *sqlite.Conn) error {
		delegations, err = hypersql.KeyDelegationsListAll(conn)
		return err
	}); err != nil {
		return res, err
	}

	res.Peers = make([]peer.ID, len(delegations))
	res.Errs = make([]error, len(delegations))
	var wg sync.WaitGroup
	wg.Add(len(delegations))

	for i, del := range delegations {
		go func(i int, del hypersql.KeyDelegationsListAllResult) {
			var err error
			defer func() {
				res.Errs[i] = err
				if err == nil {
					atomic.AddInt64(&res.NumSyncOK, 1)
				} else {
					atomic.AddInt64(&res.NumSyncFailed, 1)
				}

				wg.Done()
			}()

			var pid peer.ID
			device := core.Principal(del.KeyDelegationsViewDelegate)
			pid, err = core.Principal(del.KeyDelegationsViewDelegate).PeerID()
			if err != nil {
				s.log.Warn("FailedToParsePeerID", zap.String("principal", device.String()))
				return
			}
			res.Peers[i] = pid

			err = s.SyncWithPeer(ctx, pid)
		}(i, del)
	}

	wg.Wait()

	// Subtracting one to account for our own device.
	res.NumSyncOK--

	if s.onSync != nil {
		if err := s.onSync(res); err != nil {
			return res, err
		}
	}

	return res, nil
}

func (s *Service) syncObject(ctx context.Context, sess exchange.Fetcher, obj *p2p.Object) error {
	ctx, cancel := context.WithTimeout(ctx, time.Minute)
	defer cancel()

	bs := s.blobs.IPFSBlockstoreReader()

	// oid, err := hyper.EntityID(obj.Id).CID()
	// if err != nil {
	// 	return fmt.Errorf("can't sync object: failed to cast CID: %w", err)
	// }

	// // Hint to bitswap to only talk to peers who have the object.
	// if _, err := sess.GetBlock(ctx, oid); err != nil {
	// 	return fmt.Errorf("failed to start bitswap session: %w", err)
	// }

	// We have to check which of the remote changes we're actually missing to avoid
	// doing bitswap unnecessarily.
	var missingSorted []cid.Cid
	{
		for _, c := range obj.ChangeIds {
			cc, err := cid.Decode(c)
			if err != nil {
				return fmt.Errorf("failed to decode change CID: %w", err)
			}

			has, err := bs.Has(ctx, cc)
			if err != nil {
				return err
			}
			if !has {
				missingSorted = append(missingSorted, cc)
			}
		}
	}

	type verifiedChange struct {
		cid    cid.Cid
		change hyper.Change
	}

	// Fetch missing changes and make sure we have their parents.
	// We assume causally sorted list, but verifying just in case.
	visited := make(map[cid.Cid]struct{}, len(missingSorted))
	{
		for _, c := range missingSorted {
			blk, err := sess.GetBlock(ctx, c)
			if err != nil {
				return fmt.Errorf("failed to sync blob %s: %w", c, err)
			}

			var ch hyper.Change
			if err := cbornode.DecodeInto(blk.RawData(), &ch); err != nil {
				return fmt.Errorf("failed to decode change after sync: %w", err)
			}

			if err := ch.Verify(); err != nil {
				return fmt.Errorf("failed to verify signature for change %s: %w", c.String(), err)
			}

			// get delegation
			ok, err := bs.Has(ctx, ch.Delegation)
			if err != nil {
				return err
			}
			if !ok {
				kdblk, err := sess.GetBlock(ctx, ch.Delegation)
				if err != nil {
					return err
				}
				var kd hyper.KeyDelegation
				if err := cbornode.DecodeInto(kdblk.RawData(), &kd); err != nil {
					return err
				}
				if err := kd.Verify(); err != nil {
					return fmt.Errorf("failed to verify key delegation: %w", err)
				}
				kdblob, err := hyper.EncodeBlob(hyper.TypeKeyDelegation, kd)
				if err != nil {
					return err
				}

				if !kdblob.CID.Equals(kdblk.Cid()) {
					return fmt.Errorf("reencoded key delegation cid doesn't match")
				}

				if err := s.blobs.SaveBlob(ctx, kdblob); err != nil {
					return fmt.Errorf("failed to save key delegation blob: %w", err)
				}
			}

			vc := verifiedChange{cid: c, change: ch}
			visited[vc.cid] = struct{}{}
			for _, dep := range vc.change.Deps {
				has, err := bs.Has(ctx, dep)
				if err != nil {
					return fmt.Errorf("failed to check parent %s of %s: %w", dep, c, err)
				}
				_, seen := visited[dep]
				if !has && !seen {
					return fmt.Errorf("won't sync object %s: missing parent %s of change %s", obj, dep, c)
				}
			}

			changeBlob, err := hyper.EncodeBlob(hyper.TypeChange, vc.change)
			if err != nil {
				return err
			}

			if !changeBlob.CID.Equals(vc.cid) {
				return fmt.Errorf("reencoded change CID must match")
			}

			if err := s.blobs.SaveBlob(ctx, changeBlob); err != nil {
				return fmt.Errorf("failed to save synced change: %w", err)
			}
		}
	}

	return nil
}

// SyncWithPeer syncs all documents from a given peer. given no initial objectsOptionally.
// if a list a list of initialObjects is provided, then only syncs objects from that list.
func (s *Service) SyncWithPeer(ctx context.Context, device peer.ID, initialObjects ...hyper.EntityID) error {
	// Can't sync with self.
	if s.me.DeviceKey().PeerID() == device {
		return nil
	}

	// Nodes such web sites can be configured to avoid automatic syncing with remote peers,
	// unless explicitly asked to sync some specific object IDs.
	if s.NoInbound && len(initialObjects) == 0 {
		return nil
	}

	var filter map[hyper.EntityID]struct{}
	if initialObjects != nil {
		filter = make(map[hyper.EntityID]struct{}, len(initialObjects))
		for _, o := range initialObjects {
			filter[o] = struct{}{}
		}
	}

	c, err := s.client(ctx, device)
	if err != nil {
		return err
	}

	remoteObjs, err := c.ListObjects(ctx, &p2p.ListObjectsRequest{})
	if err != nil {
		return err
	}

	// If only selected objects are requested to sync we filter them out here.
	var finalObjs []*p2p.Object
	if filter == nil {
		finalObjs = remoteObjs.Objects
	} else {
		for _, obj := range remoteObjs.Objects {
			_, ok := filter[hyper.EntityID(obj.Id)]
			if !ok {
				continue
			}
			finalObjs = append(finalObjs, obj)
		}
	}

	s.log.Debug("Syncing", zap.Int("remoteObjects", len(remoteObjs.Objects)), zap.Int("initialObjects", len(initialObjects)), zap.Int("finalObjects", len(finalObjs)))

	sess := s.bitswap.NewSession(ctx)
	for _, obj := range finalObjs {
		if err := s.syncObject(ctx, sess, obj); err != nil {
			return err
		}
	}
	return nil
}
