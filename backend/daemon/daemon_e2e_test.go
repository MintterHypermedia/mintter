package daemon

import (
	"context"
	"fmt"
	"io/ioutil"
	"mintter/backend/config"
	"mintter/backend/core"
	"mintter/backend/core/coretest"
	"mintter/backend/db/sqlitedbg"
	accounts "mintter/backend/genproto/accounts/v1alpha"
	daemon "mintter/backend/genproto/daemon/v1alpha"
	documents "mintter/backend/genproto/documents/v1alpha"
	networking "mintter/backend/genproto/networking/v1alpha"
	"mintter/backend/mttnet"
	"mintter/backend/pkg/must"
	"mintter/backend/testutil"
	"os"
	"testing"
	"time"

	"github.com/ipfs/go-cid"
	"github.com/stretchr/testify/require"
	"golang.org/x/sync/errgroup"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/proto"
)

func TestAPIGetRemotePublication(t *testing.T) {
	t.Parallel()

	ctx := context.Background()

	// Carol will be the DHT server
	dhtProvider := makeTestApp(t, "carol", makeTestConfig(t), true)

	requester, publishedDocument, _ := makeRemotePublication(t, ctx, dhtProvider)

	remotePublication, err := requester.RPC.Documents.GetPublication(ctx, &documents.GetPublicationRequest{DocumentId: publishedDocument.Document.Id})
	require.NoError(t, err)
	testutil.ProtoEqual(t, publishedDocument, remotePublication, "remote publication doesn't match")
}

/*
	func TestSite(t *testing.T) {
		ctx, cancel := context.WithCancel(context.Background())

		siteConf := makeTestConfig(t)
		siteConf.Syncing.NoInbound = true

		gw, err := Load(ctx, siteConf, nil)
		require.NoError(t, err)
		t.Cleanup(func() {
			cancel()
			require.Equal(t, context.Canceled, gw.Wait())
		})

		ownerSrv, docSrv, stopowner := makeTestSrv(t, "alice")
		owner, ok := ownerSrv.Node.Get()
		require.True(t, ok)
		defer stopowner()

		editorSrv, _, stopeditor := makeTestSrv(t, "bob")
		editor, ok := editorSrv.Node.Get()
		require.True(t, ok)
		defer stopeditor()

		readerSrv, _, stopreader := makeTestSrv(t, "derek")
		reader, ok := readerSrv.Node.Get()
		require.True(t, ok)
		defer stopreader()

		cfg := config.Default()
		cfg.Site.Hostname = "127.0.0.1:55001"

		cfg.Site.OwnerID = owner.me.AccountID().String()
		siteSrv, _, stopSite := makeTestSrv(t, "carol", cfg.Site)
		site, ok := siteSrv.Node.Get()
		require.True(t, ok)
		defer stopSite()

		docSrv.SetSiteAccount(site.me.AccountID().String())

		ctx := context.Background()
		require.NoError(t, owner.Connect(ctx, site.AddrInfo()))
		header := metadata.New(map[string]string{string(MttHeader): cfg.Site.Hostname})
		ctx = metadata.NewIncomingContext(ctx, header) // Typically, the headers are written by the client in the outgoing context and server receives them in the incoming. But here we are writing the server directly
		ctx = context.WithValue(ctx, SiteAccountIDCtxKey, site.me.AccountID().String())
		res, err := ownerSrv.RedeemInviteToken(ctx, &siteproto.RedeemInviteTokenRequest{})
		require.NoError(t, err)
		require.Equal(t, documents.Member_OWNER, res.Role)
		token, err := ownerSrv.CreateInviteToken(ctx, &documents.CreateInviteTokenRequest{
			Role:       documents.Member_EDITOR,
			ExpireTime: &timestamppb.Timestamp{Seconds: time.Now().Add(10 * time.Minute).Unix()},
		})
		require.NoError(t, err)

		//Publish as owner

		//An editor should receive the document just by having a connection with the site
		require.NoError(t, editor.Connect(ctx, site.AddrInfo()))
		res, err = editorSrv.RedeemInviteToken(ctx, &siteproto.RedeemInviteTokenRequest{Token: token.Token})
		require.NoError(t, err)

		require.Equal(t, documents.Member_EDITOR, res.Role)
		require.NoError(t, editorSrv.synchronizer.SyncWithPeer(ctx, site.me.DeviceKey().CID()))
		pub, err := editorSrv.localFunctions.GetPublication(ctx, &siteproto.GetPublicationRequest{
			DocumentId: "",
			Version:    "",
			LocalOnly:  true,
		})
		require.NoError(t, err)

		// A reader must not receive the document just by having a connection with the site
		require.NoError(t, reader.Connect(ctx, site.AddrInfo()))
		require.NoError(t, editorSrv.synchronizer.SyncWithPeer(ctx, site.me.DeviceKey().CID()))
		pub, err = readerSrv.localFunctions.GetPublication(ctx, &siteproto.GetPublicationRequest{
			DocumentId: "",
			Version:    "",
			LocalOnly:  true,
		})
		require.Error(t, err)

		//Unpublish
	}
*/
func TestGateway(t *testing.T) {
	t.Parallel()
	ctx, cancel := context.WithCancel(context.Background())

	gwConf := makeTestConfig(t)
	gwConf.P2P.NoListing = true

	f, err := ioutil.TempFile("", "device.key")
	require.NoError(t, err)
	t.Cleanup(func() {
		f.Close()
	})

	gwConf.Identity.DeviceKeyPath = f.Name()

	var deviceKeyBytes = []byte{8, 1, 18, 64, 213, 180, 8, 59, 161, 75, 15, 92, 212, 94, 225, 82, 81, 11, 32, 200, 62, 46, 190, 105, 121, 14, 176, 107, 195, 113, 153, 176, 198, 163, 215, 226, 79, 46, 215, 228, 133, 153, 14, 142, 52, 115, 21, 73, 202, 121, 204, 223, 53, 117, 164, 225, 248, 106, 231, 151, 180, 246, 107, 137, 227, 212, 98, 140}
	bytes, err := f.Write(deviceKeyBytes)
	require.NoError(t, err)
	require.Equal(t, len(deviceKeyBytes), bytes)

	gw, err := Load(ctx, gwConf, WithMiddleware(GwEssentials))
	require.NoError(t, err)
	t.Cleanup(func() {
		cancel()
		require.Equal(t, context.Canceled, gw.Wait())
	})

	const mnemonicWords = 12
	mnemonic, err := core.NewMnemonic(mnemonicWords)
	require.NoError(t, err)

	_, err = gw.RPC.Daemon.Register(ctx, &daemon.RegisterRequest{
		Mnemonic:   mnemonic,
		Passphrase: "",
	})
	require.NoError(t, err)
	_, err = gw.Net.Await(ctx)
	require.NoError(t, err)

	_, err = gw.Me.Await(ctx)
	require.NoError(t, err)
	// Create new document so the gateway owns at least 1. This one must not be transferred to the requester, since the
	// gateway only syncs in one direction (in order not to flood requesters with documents from everybody)
	publishDocument(t, ctx, gw)
	res, err := gw.RPC.Documents.ListPublications(ctx, &documents.ListPublicationsRequest{})
	require.NoError(t, err)
	require.Equal(t, 1, len(res.Publications))
	// Create the publication that will be gotten by the gateway
	_, publishedDocument, publisher := makeRemotePublication(t, ctx, gw)
	remotePublication, err := gw.RPC.Documents.GetPublication(ctx, &documents.GetPublicationRequest{DocumentId: publishedDocument.Document.Id})
	require.NoError(t, err)
	testutil.ProtoEqual(t, publishedDocument, remotePublication, "remote publication doesn't match")
	// Gateway now should have two publications, the one created by itself and the one gotten from publisher
	pubsGw, err := gw.RPC.Documents.ListPublications(ctx, &documents.ListPublicationsRequest{})
	require.NoError(t, err)
	require.Equal(t, 2, len(pubsGw.Publications))
	pubPublisher, err := publisher.RPC.Documents.ListPublications(ctx, &documents.ListPublicationsRequest{})
	require.NoError(t, err)
	require.Equal(t, 1, len(pubPublisher.Publications))
	// We force the publisher to sync all the content to see if it does not get the gateway's own article.
	_, err = publisher.RPC.Daemon.ForceSync(ctx, &daemon.ForceSyncRequest{})
	require.NoError(t, err)
	time.Sleep(time.Second)
	pubPublisher, err = publisher.RPC.Documents.ListPublications(ctx, &documents.ListPublicationsRequest{})
	require.NoError(t, err)
	require.Equal(t, 1, len(pubPublisher.Publications))
}
func TestBug_SyncHangs(t *testing.T) {
	// See: https://github.com/mintterteam/mintter/issues/712.
	t.Parallel()

	alice := makeTestApp(t, "alice", makeTestConfig(t), true)
	bob := makeTestApp(t, "bob", makeTestConfig(t), true)
	carol := makeTestApp(t, "carol", makeTestConfig(t), true)
	ctx := context.Background()

	var g errgroup.Group
	g.Go(func() error {
		_, err := alice.RPC.Networking.Connect(ctx, &networking.ConnectRequest{
			Addrs: getAddrs(t, bob),
		})
		return err
	})

	g.Go(func() error {
		_, err := alice.RPC.Daemon.ForceSync(ctx, &daemon.ForceSyncRequest{})
		return err
	})

	require.NoError(t, func() error {
		_, err := alice.RPC.Networking.Connect(ctx, &networking.ConnectRequest{
			Addrs: getAddrs(t, carol),
		})
		return err
	}())

	require.NoError(t, g.Wait())

}

func TestBug_PublicationsListInconsistent(t *testing.T) {
	// See: https://github.com/mintterteam/mintter/issues/692.
	// Although it turns out this bug may not be the daemon's issue.
	t.Parallel()

	alice := makeTestApp(t, "alice", makeTestConfig(t), true)
	ctx := context.Background()

	publish := func(ctx context.Context, t *testing.T, title, text string) *documents.Publication {
		draft, err := alice.RPC.Documents.CreateDraft(ctx, &documents.CreateDraftRequest{})
		require.NoError(t, err)

		_, err = alice.RPC.Documents.UpdateDraftV2(ctx, &documents.UpdateDraftRequestV2{
			DocumentId: draft.Id,
			Changes: []*documents.DocumentChange{
				{
					Op: &documents.DocumentChange_SetTitle{SetTitle: title},
				},
				{
					Op: &documents.DocumentChange_MoveBlock_{MoveBlock: &documents.DocumentChange_MoveBlock{
						BlockId:     "b1",
						Parent:      "",
						LeftSibling: "",
					}},
				},
				{
					Op: &documents.DocumentChange_ReplaceBlock{ReplaceBlock: &documents.Block{
						Id:   "b1",
						Text: "Hello world",
					}},
				},
			},
		})
		require.NoError(t, err)

		pub, err := alice.RPC.Documents.PublishDraft(ctx, &documents.PublishDraftRequest{
			DocumentId: draft.Id,
		})
		require.NoError(t, err)

		return pub
	}

	want := []*documents.Publication{
		publish(ctx, t, "Doc-1", "This is a doc-1"),
		publish(ctx, t, "Doc-2", "This is a doc-2"),
		publish(ctx, t, "Doc-3", "This is a doc-3"),
		publish(ctx, t, "Doc-4", "This is a doc-4"),
	}

	var g errgroup.Group

	// Trying this more than once and expecting it to return the same result. This is what bug was mostly about.
	// Arbitrary number of attempts was chosen.
	for i := 0; i < 15; i++ {
		g.Go(func() error {
			list, err := alice.RPC.Documents.ListPublications(ctx, &documents.ListPublicationsRequest{})
			require.NoError(t, err)

			require.Len(t, list.Publications, len(want))

			for w := range want {
				testutil.ProtoEqual(t, want[w], list.Publications[w], "publication %d doesn't match", w)
			}
			return nil
		})
	}

	require.NoError(t, g.Wait())
}

func TestDaemonList(t *testing.T) {
	t.Parallel()

	alice := makeTestApp(t, "alice", makeTestConfig(t), true)

	conn, err := grpc.Dial(alice.GRPCListener.Addr().String(), grpc.WithBlock(), grpc.WithInsecure())
	require.NoError(t, err)
	defer conn.Close()

	client := documents.NewPublicationsClient(conn)

	list, err := client.ListPublications(context.Background(), &documents.ListPublicationsRequest{})
	require.NoError(t, err)
	require.Len(t, list.Publications, 0, "account object must not be listed as publication")

	_, err = client.DeletePublication(context.Background(), &documents.DeletePublicationRequest{
		DocumentId: alice.Me.MustGet().AccountID().String(),
	})
	require.Error(t, err, "we must not be able to delete other objects than publications")
}

func TestDaemonSmoke(t *testing.T) {
	t.Parallel()

	dmn := makeTestApp(t, "alice", makeTestConfig(t), false)
	ctx := context.Background()

	conn, err := grpc.Dial(dmn.GRPCListener.Addr().String(), grpc.WithBlock(), grpc.WithInsecure())
	require.NoError(t, err)
	defer conn.Close()

	ac := accounts.NewAccountsClient(conn)
	dc := daemon.NewDaemonClient(conn)
	nc := networking.NewNetworkingClient(conn)

	acc, err := ac.GetAccount(ctx, &accounts.GetAccountRequest{})
	require.Error(t, err)
	require.Nil(t, acc)

	seed, err := dc.GenMnemonic(ctx, &daemon.GenMnemonicRequest{
		MnemonicsLength: 12,
	})
	require.NoError(t, err)

	reg, err := dc.Register(ctx, &daemon.RegisterRequest{
		Mnemonic: seed.Mnemonic,
	})
	require.NoError(t, err)
	require.NotNil(t, reg)
	require.NotEqual(t, "", reg.AccountId, "account ID must be generated after registration")

	_, err = dmn.Me.Await(ctx)
	require.NoError(t, err)

	_, err = dmn.Net.Await(ctx)
	require.NoError(t, err)

	acc, err = ac.GetAccount(ctx, &accounts.GetAccountRequest{})
	require.NoError(t, err)
	require.Equal(t, reg.AccountId, acc.Id, "must return account after registration")
	require.Equal(t, 1, len(acc.Devices), "must return our own device after registration")

	profileUpdate := &accounts.Profile{
		Alias: "fulanito",
		Bio:   "Mintter Tester",
		Email: "fulanito@example.com",
	}

	updatedAcc, err := ac.UpdateProfile(ctx, profileUpdate)
	require.NoError(t, err)
	require.Equal(t, acc.Id, updatedAcc.Id)
	require.Equal(t, acc.Devices, updatedAcc.Devices)
	testutil.ProtoEqual(t, profileUpdate, updatedAcc.Profile, "profile update must return full profile")

	acc, err = ac.GetAccount(ctx, &accounts.GetAccountRequest{})
	require.NoError(t, err)
	testutil.ProtoEqual(t, updatedAcc, acc, "get account after update must match")

	infoResp, err := dc.GetInfo(ctx, &daemon.GetInfoRequest{})
	require.NoError(t, err)
	require.NotNil(t, infoResp)
	require.NotEqual(t, "", infoResp.AccountId)
	require.NotEqual(t, "", infoResp.PeerId)

	peerInfo, err := nc.GetPeerInfo(ctx, &networking.GetPeerInfoRequest{
		PeerId: infoResp.PeerId,
	})
	require.NoError(t, err)
	require.NotNil(t, peerInfo)
	require.NotEqual(t, "", peerInfo.AccountId)
}

func TestPeriodicSync(t *testing.T) {
	t.Parallel()

	acfg := makeTestConfig(t)
	bcfg := makeTestConfig(t)

	acfg.Syncing.WarmupDuration = 1 * time.Millisecond
	bcfg.Syncing.WarmupDuration = 1 * time.Millisecond

	acfg.Syncing.Interval = 150 * time.Millisecond
	bcfg.Syncing.Interval = 150 * time.Millisecond

	alice := makeTestApp(t, "alice", acfg, true)
	bob := makeTestApp(t, "bob", bcfg, true)
	ctx := context.Background()

	_, err := alice.RPC.Networking.Connect(ctx, &networking.ConnectRequest{
		Addrs: getAddrs(t, bob),
	})
	require.NoError(t, err)

	time.Sleep(200 * time.Millisecond)

	checkListAccounts := func(t *testing.T, a, b *App, msg string) {
		accs, err := a.RPC.Accounts.ListAccounts(ctx, &accounts.ListAccountsRequest{})
		require.NoError(t, err)

		bacc := must.Do2(b.RPC.Accounts.GetAccount(ctx, &accounts.GetAccountRequest{}))

		require.Len(t, accs.Accounts, 1, msg)
		testutil.ProtoEqual(t, bacc, accs.Accounts[0], "a must fetch b's account fully")
	}

	checkListAccounts(t, alice, bob, "alice to bob")
	checkListAccounts(t, bob, alice, "bob to alice")
}

func TestMultiDevice(t *testing.T) {
	t.Skip()

	t.Parallel()

	alice1 := makeTestApp(t, "alice", makeTestConfig(t), true)
	alice2 := makeTestApp(t, "alice-2", makeTestConfig(t), true)
	ctx := context.Background()

	_, err := alice1.RPC.Networking.Connect(ctx, &networking.ConnectRequest{
		Addrs: getAddrs(t, alice2),
	})
	require.NoError(t, err)

	acc1 := must.Do2(alice1.RPC.Accounts.GetAccount(ctx, &accounts.GetAccountRequest{}))
	acc2 := must.Do2(alice2.RPC.Accounts.GetAccount(ctx, &accounts.GetAccountRequest{}))
	require.False(t, proto.Equal(acc1, acc2), "accounts must not match before syncing")

	{
		sr := must.Do2(alice1.Syncing.MustGet().Sync(ctx))
		require.Equal(t, int64(1), sr.NumSyncOK)
		require.Equal(t, int64(0), sr.NumSyncFailed)
		require.Equal(t, []cid.Cid{alice1.Repo.Device().CID(), alice2.Repo.Device().CID()}, sr.Devices)
	}

	// TODO(burdiyan): build11: here it must handle the concurrency properly. See: https://github.com/mintterteam/mintter/issues/687.
	sqlitedbg.ExecPool(alice1.DB, os.Stdout, "select * from named_versions")
	return
	{
		sr := must.Do2(alice2.Syncing.MustGet().Sync(ctx))
		require.Equal(t, int64(1), sr.NumSyncOK)
		require.Equal(t, int64(0), sr.NumSyncFailed)
		require.Equal(t, []cid.Cid{alice2.Repo.Device().CID(), alice1.Repo.Device().CID()}, sr.Devices)
	}

	time.Sleep(2 * time.Second)

	fmt.Println("alice1")
	sqlitedbg.ExecPool(alice1.DB, os.Stdout, "SELECT multihash, id FROM ipfs_blocks ORDER BY multihash")
	fmt.Println("alice2")
	sqlitedbg.ExecPool(alice2.DB, os.Stdout, "SELECT multihash, id FROM ipfs_blocks ORDER BY multihash")

	return

	acc1 = must.Do2(alice1.RPC.Accounts.GetAccount(ctx, &accounts.GetAccountRequest{}))
	acc2 = must.Do2(alice2.RPC.Accounts.GetAccount(ctx, &accounts.GetAccountRequest{}))
	testutil.ProtoEqual(t, acc1, acc2, "accounts must match after sync")

	require.Len(t, acc2.Devices, 2, "must have two devices after syncing")
}

func getAddrs(t *testing.T, a *App) []string {
	return mttnet.AddrInfoToStrings(a.Net.MustGet().AddrInfo())
}

func makeTestApp(t *testing.T, name string, cfg config.Config, register bool) *App {
	ctx, cancel := context.WithCancel(context.Background())

	u := coretest.NewTester(name)

	repo, err := initRepo(cfg, u.Device.Wrapped())
	require.NoError(t, err)

	app, err := loadApp(ctx, cfg, repo)
	require.NoError(t, err)
	t.Cleanup(func() {
		cancel()
		require.Equal(t, context.Canceled, app.Wait())
	})

	if register {
		err = app.RPC.Daemon.RegisterAccount(ctx, u.Account)
		require.NoError(t, err)

		_, err = app.Net.Await(ctx)
		require.NoError(t, err)

		_, err = app.Me.Await(ctx)
		require.NoError(t, err)

		prof := &accounts.Profile{
			Alias: name,
			Bio:   name + " bio",
			Email: name + "@example.com",
		}
		acc, err := app.RPC.Accounts.UpdateProfile(ctx, prof)
		require.NoError(t, err)
		testutil.ProtoEqual(t, prof, acc.Profile, "profile update must return full profile")
	}

	return app
}

func makeRemotePublication(t *testing.T, ctx context.Context, dhtProvider *App) (*App, *documents.Publication, *App) {
	var publisher *App
	{
		cfg := makeTestConfig(t)
		cfg.P2P.BootstrapPeers = dhtProvider.Net.MustGet().Libp2p().AddrsFull()
		publisher = makeTestApp(t, "alice", cfg, true)
	}

	var bob *App
	{
		cfg := makeTestConfig(t)
		cfg.P2P.BootstrapPeers = dhtProvider.Net.MustGet().Libp2p().AddrsFull()
		bob = makeTestApp(t, "bob", cfg, true)
	}

	// Make sure bob does't know anything about publisher.
	require.NoError(t, bob.Net.MustGet().Libp2p().Network().ClosePeer(publisher.Repo.Device().ID()))
	bob.Net.MustGet().Libp2p().Peerstore().RemovePeer(publisher.Repo.Device().ID())

	publishedDocument := publishDocument(t, ctx, publisher)

	// Sleeping just in case to make sure alices publication propagates.
	time.Sleep(time.Second)
	return bob, publishedDocument, publisher
}

func publishDocument(t *testing.T, ctx context.Context, publisher *App) *documents.Publication {
	draft, err := publisher.RPC.Documents.CreateDraft(ctx, &documents.CreateDraftRequest{})
	require.NoError(t, err)

	updated, err := publisher.RPC.Documents.UpdateDraftV2(ctx, &documents.UpdateDraftRequestV2{
		DocumentId: draft.Id,
		Changes: []*documents.DocumentChange{
			{Op: &documents.DocumentChange_SetTitle{SetTitle: "My new document title"}},
			{Op: &documents.DocumentChange_SetSubtitle{SetSubtitle: "This is my document's abstract"}},
			{Op: &documents.DocumentChange_MoveBlock_{MoveBlock: &documents.DocumentChange_MoveBlock{BlockId: "b1"}}},
			{Op: &documents.DocumentChange_ReplaceBlock{ReplaceBlock: &documents.Block{
				Id:   "b1",
				Type: "statement",
				Text: "Hello world!",
			}}},
		},
	})
	require.NoError(t, err)
	require.NotNil(t, updated)
	published, err := publisher.RPC.Documents.PublishDraft(ctx, &documents.PublishDraftRequest{DocumentId: draft.Id})
	require.NoError(t, err)
	return published
}
func makeTestConfig(t *testing.T) config.Config {
	cfg := config.Default()

	cfg.HTTPPort = 0
	cfg.GRPCPort = 0
	cfg.RepoPath = testutil.MakeRepoPath(t)
	cfg.P2P.Port = 0
	cfg.P2P.BootstrapPeers = nil
	cfg.P2P.NoRelay = true
	cfg.P2P.NoMetrics = true

	return cfg
}
