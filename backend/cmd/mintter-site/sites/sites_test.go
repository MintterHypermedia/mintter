package sites

import (
	"context"
	"errors"
	"mintter/backend/config"
	"mintter/backend/core/coretest"
	"mintter/backend/daemon"
	groups "mintter/backend/genproto/groups/v1alpha"
	"mintter/backend/ipfs"
	"mintter/backend/pkg/must"
	"net"
	"strconv"
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func TestSiteInit(t *testing.T) {
	t.Parallel()

	site := makeTestSite(t, "carol")
	ctx := context.Background()

	// Check that we announce our hardcoded web address.
	{
		wantAnnounceAddrs := must.Do2(ipfs.ParseMultiaddrs(ipfs.DefaultListenAddrsDNS(site.Address.Hostname(), site.Config.P2P.Port)))
		require.Equal(t, wantAnnounceAddrs, site.Config.P2P.AnnounceAddrs, "announce addrs don't match")
	}

	// Check that our secret setup URL is on the correct domain.
	require.True(t, strings.HasPrefix(site.Website.GetSetupURL(ctx), site.Address.String()), "init secret must have a prefix of the announce address")

	alice := daemon.MakeTestApp(t, "alice", daemon.MakeTestConfig(t), true)

	group, err := alice.RPC.Groups.CreateGroup(ctx, &groups.CreateGroupRequest{
		Title:        "My test group",
		SiteSetupUrl: site.Website.GetSetupURL(ctx),
	})
	require.NoError(t, err)

	require.Equal(t, group.Id, must.Do2(site.Website.GetGroupID(ctx)), "site must serve the correct group ID")

	init, err := site.Website.InitializeServer(ctx, &groups.InitializeServerRequest{
		Secret:  site.Website.GetSetupURL(ctx),
		GroupId: "my-test-group",
	})
	require.Nil(t, init)
	require.Error(t, err, "subsequent init must fail")
	require.Equal(t, codes.FailedPrecondition, status.Code(err), "subsequent init must fail with precondition error")
}

func makeTestSite(t *testing.T, name string) *App {
	ctx, cancel := context.WithCancel(context.Background())

	user := coretest.NewTester(name)

	cfg := testConfig(t)
	dir, err := daemon.InitRepo(cfg.Base.DataDir, user.Device.Wrapped())
	require.NoError(t, err)

	app, err := Load(ctx, "http://127.0.0.1:"+strconv.Itoa(cfg.HTTP.Port), cfg, dir)
	require.NoError(t, err)
	t.Cleanup(func() {
		cancel()
		err := app.Wait()
		if err != nil {
			require.True(t, errors.Is(err, context.Canceled), "unexpected app error: %v", err)
		}
	})

	return app
}

func testConfig(t *testing.T) config.Config {
	dir := t.TempDir()
	cfg := DefaultConfig()
	cfg.Base.DataDir = dir
	cfg.HTTP.Port = freePort(t)
	cfg.GRPC.Port = 0
	cfg.P2P.Port = freePort(t)
	cfg.P2P.BootstrapPeers = nil
	cfg.P2P.NoMetrics = true

	return cfg
}

func freePort(t *testing.T) int {
	addr, err := net.ResolveTCPAddr("tcp", "localhost:0")
	require.NoError(t, err)

	l, err := net.ListenTCP("tcp", addr)
	require.NoError(t, err)
	defer l.Close()
	return l.Addr().(*net.TCPAddr).Port
}
