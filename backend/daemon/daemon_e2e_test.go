package daemon

import (
	"context"
	"io/ioutil"
	"mintter/backend/config"
	"mintter/backend/core"
	"mintter/backend/core/coretest"
	accounts "mintter/backend/genproto/accounts/v1alpha"
	daemon "mintter/backend/genproto/daemon/v1alpha"
	documents "mintter/backend/genproto/documents/v1alpha"
	networking "mintter/backend/genproto/networking/v1alpha"
	p2p "mintter/backend/genproto/p2p/v1alpha"
	"mintter/backend/mttnet"
	"mintter/backend/pkg/must"
	"mintter/backend/testutil"
	"mintter/backend/vcs"
	"testing"
	"time"

	"github.com/ipfs/go-cid"
	"github.com/stretchr/testify/require"
	"golang.org/x/sync/errgroup"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/metadata"
	"google.golang.org/protobuf/proto"
)

func TestDaemonSmoke(t *testing.T) {
	t.Parallel()

	dmn := makeTestApp(t, "alice", makeTestConfig(t), false)
	ctx := context.Background()

	conn, err := grpc.Dial(dmn.GRPCListener.Addr().String(), grpc.WithBlock(), grpc.WithTransportCredentials(insecure.NewCredentials()))
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
		Alias:  "fulanito",
		Bio:    "Mintter Tester",
		Avatar: "bafkreibaejvf3wyblh3s4yhbrwtxto7wpcac7zkkx36cswjzjez2cbmzvu",
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
	require.NotEqual(t, "", infoResp.DeviceId)

	peerInfo, err := nc.GetPeerInfo(ctx, &networking.GetPeerInfoRequest{
		DeviceId: infoResp.DeviceId,
	})
	require.NoError(t, err)
	require.NotNil(t, peerInfo)
	require.NotEqual(t, "", peerInfo.AccountId)
}

func TestDaemonListPublications(t *testing.T) {
	t.Parallel()

	alice := makeTestApp(t, "alice", makeTestConfig(t), true)

	conn, err := grpc.Dial(alice.GRPCListener.Addr().String(), grpc.WithBlock(), grpc.WithTransportCredentials(insecure.NewCredentials()))
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

func TestSite(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())

	t.Cleanup(func() {
		cancel()
	})

	owner := makeTestApp(t, "alice", makeTestConfig(t), true)
	editor := makeTestApp(t, "bob", makeTestConfig(t), true)
	editorFriend := makeTestApp(t, "alice-2", makeTestConfig(t), true)
	reader := makeTestApp(t, "david", makeTestConfig(t), true)

	siteCfg := makeTestConfig(t)
	siteCfg.Site.Hostname = "http://127.0.0.1:59011"
	siteCfg.HTTPPort = 59011
	siteCfg.Identity.NoAccountWait = true
	siteCfg.Site.Title = "initial Site Title"
	siteCfg.Site.OwnerID = owner.Me.MustGet().AccountID().String()
	siteCfg.P2P.NoListing = true
	siteCfg.Syncing.NoInbound = true

	site := makeTestApp(t, "carol", siteCfg, false)
	time.Sleep(500 * time.Millisecond)
	newSite, err := owner.RPC.Documents.AddSite(ctx, &documents.AddSiteRequest{Hostname: siteCfg.Site.Hostname})
	require.NoError(t, err)
	require.Equal(t, siteCfg.Site.Hostname, newSite.Hostname)
	require.Equal(t, documents.Member_OWNER, newSite.Role)
	// The reader connects to the site via p2p only
	_, err = reader.RPC.Networking.Connect(ctx, &networking.ConnectRequest{Addrs: getAddrs(t, site)})
	require.NoError(t, err)
	// The editor and his friend connect to each other
	_, err = editorFriend.RPC.Networking.Connect(ctx, &networking.ConnectRequest{Addrs: getAddrs(t, editor)})
	require.NoError(t, err)
	// Adding twice a site must fail.
	_, err = owner.RPC.Documents.AddSite(ctx, &documents.AddSiteRequest{Hostname: siteCfg.Site.Hostname})
	require.Error(t, err)
	// Generate a token for the editor.
	header := metadata.New(map[string]string{string(mttnet.MttHeader): siteCfg.Site.Hostname})
	ctxWithHeaders := metadata.NewIncomingContext(ctx, header) // Typically, the headers are written by the client in the outgoing context and server receives them in the incoming. But here we are writing the server directly
	ctxWithHeaders = context.WithValue(ctxWithHeaders, mttnet.SiteAccountIDCtxKey, site.Me.MustGet().AccountID().String())
	token, err := owner.RPC.Site.CreateInviteToken(ctxWithHeaders, &documents.CreateInviteTokenRequest{Role: documents.Member_EDITOR})
	require.NoError(t, err)
	// Adding a site as an editor without token should fail.
	_, err = editor.RPC.Documents.AddSite(ctx, &documents.AddSiteRequest{Hostname: siteCfg.Site.Hostname})
	require.Error(t, err)
	// Adding a site as an editor with the previous token should succeed.
	editorSite, err := editor.RPC.Documents.AddSite(ctx, &documents.AddSiteRequest{Hostname: siteCfg.Site.Hostname, InviteToken: token.Token})
	require.NoError(t, err)
	require.Equal(t, siteCfg.Site.Hostname, editorSite.Hostname)
	require.Equal(t, documents.Member_EDITOR, editorSite.Role)
	// Get initial site info.
	siteInfo, err := owner.RPC.Site.GetSiteInfo(ctxWithHeaders, &documents.GetSiteInfoRequest{})
	require.NoError(t, err)
	require.Equal(t, "", siteInfo.Description)
	require.Equal(t, siteCfg.Site.Hostname, siteInfo.Hostname)
	require.Equal(t, siteCfg.Site.OwnerID, siteInfo.Owner)
	require.Equal(t, owner.Me.MustGet().AccountID().String(), siteInfo.Owner)
	require.Equal(t, siteCfg.Site.Title, siteInfo.Title)
	siteAcc, err := site.RPC.Accounts.GetAccount(ctx, &accounts.GetAccountRequest{})
	require.NoError(t, err)
	require.Equal(t, "", siteAcc.Profile.Bio)
	require.Equal(t, siteCfg.Site.Title, siteAcc.Profile.Alias)
	// Change site info by the editor should fail
	const newTitle = "new title"
	const newDescription = " new brief description"
	_, err = editor.RPC.Site.UpdateSiteInfo(ctxWithHeaders, &documents.UpdateSiteInfoRequest{Title: newTitle, Description: newDescription})
	require.Error(t, err)
	// Change site info by the owner shouldn't fail
	siteInfo, err = owner.RPC.Site.UpdateSiteInfo(ctxWithHeaders, &documents.UpdateSiteInfoRequest{Title: newTitle, Description: newDescription})
	require.NoError(t, err)
	require.Equal(t, newDescription, siteInfo.Description)
	require.Equal(t, siteCfg.Site.Hostname, siteInfo.Hostname)
	require.Equal(t, siteCfg.Site.OwnerID, siteInfo.Owner)
	require.Equal(t, owner.Me.MustGet().AccountID().String(), siteInfo.Owner)
	require.Equal(t, newTitle, siteInfo.Title)
	siteAcc, err = site.RPC.Accounts.GetAccount(ctx, &accounts.GetAccountRequest{})
	require.NoError(t, err)
	require.Equal(t, newDescription, siteAcc.Profile.Bio)
	require.Equal(t, newTitle, siteAcc.Profile.Alias)
	// Share a document.
	sharedDocument := publishDocument(t, ctx, editor)
	_, err = editor.RPC.Daemon.ForceSync(ctx, &daemon.ForceSyncRequest{})
	require.NoError(t, err)
	_, err = editorFriend.RPC.Daemon.ForceSync(ctx, &daemon.ForceSyncRequest{})
	require.NoError(t, err)
	time.Sleep(500 * time.Millisecond) // Sleeping just to make sure it has time to propagate
	publicationList, err := site.RPC.Documents.ListPublications(ctx, &documents.ListPublicationsRequest{})
	require.NoError(t, err)
	require.Len(t, publicationList.Publications, 0) // since site only works with pull request the document should not reach the site until published

	publicationList, err = editorFriend.RPC.Documents.ListPublications(ctx, &documents.ListPublicationsRequest{})
	require.NoError(t, err)
	require.Len(t, publicationList.Publications, 1) // since the friend is a peer, it should have received the document
	require.Equal(t, sharedDocument.Version, publicationList.Publications[0].Version)
	require.Equal(t, sharedDocument.Document.Author, publicationList.Publications[0].Document.Author)
	require.Equal(t, sharedDocument.Document.Id, publicationList.Publications[0].Document.Id)

	require.NoError(t, err)
	const indexPath = "/"
	_, err = editor.RPC.Site.PublishDocument(ctxWithHeaders, &documents.PublishDocumentRequest{
		DocumentId: sharedDocument.Document.Id,
		Version:    sharedDocument.Version,
		Path:       indexPath,
	})
	require.NoError(t, err)
	// Site should have the document
	publicationList, err = site.RPC.Documents.ListPublications(ctx, &documents.ListPublicationsRequest{})
	require.NoError(t, err)
	require.Len(t, publicationList.Publications, 1)
	require.Equal(t, sharedDocument.Version, publicationList.Publications[0].Version)
	require.Equal(t, sharedDocument.Document.Author, publicationList.Publications[0].Document.Author)
	require.Equal(t, sharedDocument.Document.Id, publicationList.Publications[0].Document.Id)
	// And owner should see it as well
	_, err = site.RPC.Daemon.ForceSync(ctx, &daemon.ForceSyncRequest{})
	require.NoError(t, err)
	_, err = owner.RPC.Daemon.ForceSync(ctx, &daemon.ForceSyncRequest{})
	require.NoError(t, err)
	time.Sleep(500 * time.Millisecond) // Sleeping just to make sure it has time to propagate

	publicationList, err = owner.RPC.Documents.ListPublications(ctx, &documents.ListPublicationsRequest{})
	require.NoError(t, err)
	require.Len(t, publicationList.Publications, 1)
	require.Equal(t, sharedDocument.Version, publicationList.Publications[0].Version)
	require.Equal(t, sharedDocument.Document.Author, publicationList.Publications[0].Document.Author)
	require.Equal(t, sharedDocument.Document.Id, publicationList.Publications[0].Document.Id)

	// But the reader should not have it since its only connected to the site
	publicationList, err = reader.RPC.Documents.ListPublications(ctx, &documents.ListPublicationsRequest{})
	require.NoError(t, err)
	require.Len(t, publicationList.Publications, 0)
	// Even if he syncs, since NoListing = true site wont sync anything with non members
	_, err = reader.RPC.Daemon.ForceSync(ctx, &daemon.ForceSyncRequest{})
	require.NoError(t, err)
	time.Sleep(500 * time.Millisecond) // Sleeping just to make sure it has time to propagate
	publicationList, err = reader.RPC.Documents.ListPublications(ctx, &documents.ListPublicationsRequest{})
	require.NoError(t, err)
	require.Len(t, publicationList.Publications, 0)
	// Owner should view it in the site as published
	sitePublications, err := owner.RPC.Site.ListWebPublications(ctxWithHeaders, &documents.ListWebPublicationsRequest{})
	require.NoError(t, err)
	require.Len(t, sitePublications.Publications, 1)
	require.Equal(t, sharedDocument.Version, sitePublications.Publications[0].Version)
	require.Equal(t, siteCfg.Site.Hostname, sitePublications.Publications[0].Hostname)
	require.Equal(t, indexPath, sitePublications.Publications[0].Path)
	require.Equal(t, sharedDocument.Document.Id, sitePublications.Publications[0].DocumentId)
	// publish same doc to another path
	const anotherPath = "another"
	_, err = editor.RPC.Site.PublishDocument(ctxWithHeaders, &documents.PublishDocumentRequest{
		DocumentId: sharedDocument.Document.Id,
		Version:    sharedDocument.Version,
		Path:       anotherPath,
	})
	require.Error(t, err)
	// publish a different version to another path
	const anotherTitle = "New Document title leading to a new version"
	newVersion := updateDocumenTitle(t, ctx, owner, sharedDocument.Document.Id, anotherTitle)
	require.Equal(t, sharedDocument.Document.Id, newVersion.Document.Id)
	_, err = editor.RPC.Site.PublishDocument(ctxWithHeaders, &documents.PublishDocumentRequest{
		DocumentId: newVersion.Document.Id,
		Version:    newVersion.Version,
		Path:       anotherPath,
	})
	require.Error(t, err)
	// publish different version in same path should update the old one
	_, err = editor.RPC.Site.PublishDocument(ctxWithHeaders, &documents.PublishDocumentRequest{
		DocumentId: newVersion.Document.Id,
		Version:    newVersion.Version,
		Path:       indexPath,
	})
	require.Error(t, err) // the editor does not have it, the owner does
	wantedDoc, err := editor.RPC.Documents.GetPublication(ctx, &documents.GetPublicationRequest{
		DocumentId: newVersion.Document.Id,
		Version:    newVersion.Version})
	require.NoError(t, err)
	require.Equal(t, newVersion.Version, wantedDoc.Version)
	require.Equal(t, newVersion.Document.Id, wantedDoc.Document.Id)
	// Now republish
	_, err = editor.RPC.Site.PublishDocument(ctxWithHeaders, &documents.PublishDocumentRequest{
		DocumentId: newVersion.Document.Id,
		Version:    newVersion.Version,
		Path:       indexPath,
	})
	require.NoError(t, err)
	doc, err := owner.RPC.Site.GetPath(ctxWithHeaders, &documents.GetPathRequest{Path: indexPath})
	require.NoError(t, err)
	require.Equal(t, newVersion.Version, doc.Publication.Version)
	require.Equal(t, anotherTitle, doc.Publication.Document.Title)
	// Different author changes the version and republishes to the same path
	const anotherAuthorTitle = "Is this a change in authorship? Nope"
	noNewAuthor := updateDocumenTitle(t, ctx, editor, newVersion.Document.Id, anotherAuthorTitle)
	require.Equal(t, sharedDocument.Document.Author, noNewAuthor.Document.Author)
	require.Equal(t, sharedDocument.Document.Id, noNewAuthor.Document.Id)
	_, err = editor.RPC.Site.PublishDocument(ctxWithHeaders, &documents.PublishDocumentRequest{
		DocumentId: noNewAuthor.Document.Id,
		Version:    noNewAuthor.Version,
		Path:       indexPath,
	})
	require.NoError(t, err)
	// Publish another document (owner) and give no time to sync and get it via getpublication in the editor.
	newDocument := publishDocument(t, ctx, owner)
	require.NoError(t, err)
	_, err = owner.RPC.Site.PublishDocument(ctxWithHeaders, &documents.PublishDocumentRequest{
		DocumentId: newDocument.Document.Id,
		Version:    newDocument.Version,
		Path:       anotherPath,
	})
	require.NoError(t, err)
	sitePublications, err = editor.RPC.Site.ListWebPublications(ctxWithHeaders, &documents.ListWebPublicationsRequest{})
	require.NoError(t, err)
	require.Len(t, sitePublications.Publications, 2)

	// Unpublish a document we haven't written should fail
	_, err = editor.RPC.Site.UnpublishDocument(ctxWithHeaders, &documents.UnpublishDocumentRequest{
		DocumentId: newDocument.Document.Id,
	})
	require.Error(t, err)
	// But the owner can unpublish
	_, err = owner.RPC.Site.UnpublishDocument(ctxWithHeaders, &documents.UnpublishDocumentRequest{
		DocumentId: newDocument.Document.Id,
	})
	require.NoError(t, err)
	sitePublications, err = editor.RPC.Site.ListWebPublications(ctxWithHeaders, &documents.ListWebPublicationsRequest{})
	require.NoError(t, err)
	require.Len(t, sitePublications.Publications, 1)
	require.Equal(t, noNewAuthor.Version, sitePublications.Publications[0].Version)
	require.Equal(t, indexPath, sitePublications.Publications[0].Path)
	require.Equal(t, noNewAuthor.Document.Id, sitePublications.Publications[0].DocumentId)

	// Publish the previous shared document to the site on a blank path becomes unlisted. but same ID fails
	_, err = editor.RPC.Site.PublishDocument(ctxWithHeaders, &documents.PublishDocumentRequest{
		DocumentId: sharedDocument.Document.Id,
		Version:    sharedDocument.Version,
	})
	require.Error(t, err)
	_, err = editor.RPC.Site.PublishDocument(ctxWithHeaders, &documents.PublishDocumentRequest{
		DocumentId: newDocument.Document.Id,
		Version:    newDocument.Version,
	})
	require.NoError(t, err)
	sitePublications, err = editor.RPC.Site.ListWebPublications(ctxWithHeaders, &documents.ListWebPublicationsRequest{})
	require.NoError(t, err)
	require.Len(t, sitePublications.Publications, 2)
	_, err = editor.RPC.Site.GetPath(ctxWithHeaders, &documents.GetPathRequest{})
	require.Error(t, err)
}

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

func TestBug_ListObjectsMustHaveCausalOrder(t *testing.T) {
	t.Parallel()

	alice := makeTestApp(t, "alice", makeTestConfig(t), true)
	bob := makeTestApp(t, "bob", makeTestConfig(t), true)
	ctx := context.Background()

	require.NoError(t, bob.Net.MustGet().Connect(ctx, alice.Net.MustGet().AddrInfo()))

	pub := publishDocument(t, ctx, alice)

	cc, err := bob.Net.MustGet().Client(ctx, alice.Repo.Device().CID())
	require.NoError(t, err)

	list, err := cc.ListObjects(ctx, &p2p.ListObjectsRequest{})
	require.NoError(t, err)

	require.Len(t, list.Objects, 2, "alice must list her account and the published document")

	var found *p2p.Object
	seen := map[cid.Cid]struct{}{}
	for _, obj := range list.Objects {
		if obj.Id == pub.Document.Id {
			found = obj
		}
		for _, ch := range obj.ChangeIds {
			c := must.Do2(cid.Decode(ch))

			blk, err := alice.VCSDB.Blockstore().Get(ctx, c)
			require.NoError(t, err)

			change, err := vcs.DecodeChange(blk.RawData())
			require.NoError(t, err)

			seen[blk.Cid()] = struct{}{}

			for _, dep := range change.Parents {
				_, ok := seen[dep]
				require.True(t, ok, "non causal order of IPLD links: haven't seen dep %s of %s", dep, blk.Cid())
			}
		}
	}

	require.NotNil(t, found, "published document must be in the list objects response")
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

	{
		sr := must.Do2(alice2.Syncing.MustGet().Sync(ctx))
		require.Equal(t, int64(1), sr.NumSyncOK)
		require.Equal(t, int64(0), sr.NumSyncFailed)
		require.Equal(t, []cid.Cid{alice2.Repo.Device().CID(), alice1.Repo.Device().CID()}, sr.Devices)
	}

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
			Alias:  name,
			Bio:    name + " bio",
			Avatar: name + "@example.com",
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

func updateDocumenTitle(t *testing.T, ctx context.Context, publisher *App, docID, newTitle string) *documents.Publication {
	draft, err := publisher.RPC.Documents.CreateDraft(ctx, &documents.CreateDraftRequest{
		ExistingDocumentId: docID,
	})
	require.NoError(t, err)

	updated, err := publisher.RPC.Documents.UpdateDraftV2(ctx, &documents.UpdateDraftRequestV2{
		DocumentId: draft.Id,
		Changes: []*documents.DocumentChange{
			{Op: &documents.DocumentChange_SetTitle{SetTitle: newTitle}},
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
