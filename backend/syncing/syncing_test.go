package syncing

import (
	"bytes"
	"context"
	"fmt"
	"seed/backend/config"
	"seed/backend/core"
	"seed/backend/core/coretest"
	daemon "seed/backend/daemon/api/daemon/v1alpha"
	"seed/backend/daemon/storage"
	"seed/backend/hyper"
	"seed/backend/hyper/hypersql"
	"seed/backend/logging"
	"seed/backend/mttnet"
	"seed/backend/pkg/future"
	"seed/backend/pkg/must"
	"testing"
	"time"

	"crawshaw.io/sqlite"
	"github.com/ipfs/go-cid"
	"github.com/stretchr/testify/require"
	"go.uber.org/zap"
)

func TestSync(t *testing.T) {
	t.Parallel()

	alice := makeTestNode(t, "alice")
	bob := makeTestNode(t, "bob")
	ctx := context.Background()

	require.NoError(t, alice.Connect(ctx, bob.AddrInfo()))

	entity := hyper.NewEntity("foo")
	blob, err := entity.CreateChange(entity.NextTimestamp(), alice.ID().DeviceKey(), getDelegation(ctx, alice.ID(), alice.Blobs), map[string]any{
		"name": "alice",
	})
	require.NoError(t, err)
	require.NoError(t, alice.Blobs.SaveBlob(ctx, blob))

	require.NoError(t, bob.Blobs.SetAccountTrust(ctx, alice.Syncer.me.Account().Principal()))

	res, err := bob.Syncer.SyncAll(ctx)
	require.NoError(t, err)
	require.Equalf(t, int64(0), res.NumSyncFailed, "unexpected number of sync failures: %v", res.Errs)
	require.Equal(t, int64(1), res.NumSyncOK, "unexpected number of successful syncs")

	{
		blk, err := bob.Blobs.IPFSBlockstoreReader().Get(ctx, blob.CID)
		require.NoError(t, err)

		require.Equal(t, blob.Data, blk.RawData(), "bob must sync alice's change intact")
	}
}

func makeTestNode(t *testing.T, name string) testNode {
	u := coretest.NewTester(name)
	db := storage.MakeTestDB(t)

	blobs := hyper.NewStorage(db, logging.New("seed/hyper", "debug"))
	_, err := daemon.Register(context.Background(), blobs, u.Account, u.Device.PublicKey, time.Now())
	require.NoError(t, err)

	cfg := config.Default()
	cfg.P2P.Port = 0
	cfg.P2P.NoRelay = true
	cfg.P2P.BootstrapPeers = nil
	cfg.P2P.NoMetrics = true
	n, err := mttnet.New(cfg.P2P, db, blobs, u.Identity, must.Do2(zap.NewDevelopment()).Named(name), "debug")
	require.NoError(t, err)

	errc := make(chan error, 1)
	ctx, cancel := context.WithCancel(context.Background())
	f := future.New[*mttnet.Node]()

	require.NoError(t, f.Resolve(n))
	go func() {
		errc <- n.Start(ctx)
	}()

	t.Cleanup(func() {
		require.NoError(t, <-errc)
	})

	select {
	case <-n.Ready():
	case err := <-errc:
		require.NoError(t, err)
	}

	t.Cleanup(cancel)

	return testNode{
		Node:   n,
		Blobs:  blobs,
		Syncer: NewService(cfg.Syncing, must.Do2(zap.NewDevelopment()).Named(name), n.ID(), db, blobs, n),
	}
}

func getDelegation(ctx context.Context, me core.Identity, blobs *hyper.Storage) cid.Cid {
	var out cid.Cid

	// TODO(burdiyan): need to cache this. Makes no sense to always do this.
	if err := blobs.Query(ctx, func(conn *sqlite.Conn) error {
		acc := me.Account().Principal()
		dev := me.DeviceKey().Principal()

		list, err := hypersql.KeyDelegationsList(conn, acc)
		if err != nil {
			panic(err)
		}

		for _, res := range list {
			if bytes.Equal(dev, res.KeyDelegationsViewDelegate) {
				out = cid.NewCidV1(uint64(res.KeyDelegationsViewBlobCodec), res.KeyDelegationsViewBlobMultihash)
				return nil
			}
		}

		return nil
	}); err != nil {
		panic(err)
	}

	if !out.Defined() {
		panic(fmt.Errorf("BUG: failed to find our own key delegation"))
	}

	return out
}

type testNode struct {
	*mttnet.Node
	Blobs  *hyper.Storage
	Syncer *Service
}
