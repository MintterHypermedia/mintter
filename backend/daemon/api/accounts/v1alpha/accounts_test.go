package accounts

import (
	context "context"
	"mintter/backend/core"
	"mintter/backend/core/coretest"
	daemon "mintter/backend/daemon/api/daemon/v1alpha"
	"mintter/backend/db/sqliteschema"
	accounts "mintter/backend/genproto/accounts/v1alpha"
	"mintter/backend/hyper"
	"mintter/backend/logging"
	"mintter/backend/pkg/future"
	"mintter/backend/testutil"
	vcsdb "mintter/backend/vcs/sqlitevcs"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

func TestGetAccount_Own(t *testing.T) {
	alice := newTestServer(t, "alice")
	ctx := context.Background()

	want := &accounts.Account{
		Id:      "z6MkvFrq593SZ3QNsAgXdsHC2CJGrrwUdwxY2EdRGaT4UbYj",
		Profile: &accounts.Profile{},
		Devices: map[string]*accounts.Device{
			"12D3KooWFMTJanyH3XttUC2AmS9fZnbeYsxbAjSEvyCeHVbHBX3C": {
				DeviceId: "12D3KooWFMTJanyH3XttUC2AmS9fZnbeYsxbAjSEvyCeHVbHBX3C",
			},
		},
	}

	acc, err := alice.GetAccount(ctx, &accounts.GetAccountRequest{})
	require.NoError(t, err)
	testutil.ProtoEqual(t, want, acc, "accounts don't match")
}

func TestGetAccount_Failures(t *testing.T) {
	alice := newTestServer(t, "alice")
	bob := coretest.NewTester("bob")
	ctx := context.Background()

	acc, err := alice.GetAccount(ctx, &accounts.GetAccountRequest{
		Id: bob.Account.Principal().String(),
	})
	require.Error(t, err, "alice must not have bob's account")
	require.Nil(t, acc)
}

func TestAPIUpdateProfile(t *testing.T) {
	alice := newTestServer(t, "alice")
	ctx := context.Background()

	want := &accounts.Account{
		Id: "z6MkvFrq593SZ3QNsAgXdsHC2CJGrrwUdwxY2EdRGaT4UbYj",
		Profile: &accounts.Profile{
			Alias: "fake-alias",
			Bio:   "Hacker",
		},
		Devices: map[string]*accounts.Device{
			"12D3KooWFMTJanyH3XttUC2AmS9fZnbeYsxbAjSEvyCeHVbHBX3C": {
				DeviceId: "12D3KooWFMTJanyH3XttUC2AmS9fZnbeYsxbAjSEvyCeHVbHBX3C",
			},
		},
	}

	updated, err := alice.UpdateProfile(ctx, want.Profile)
	require.NoError(t, err)
	testutil.ProtoEqual(t, want, updated, "account must be equal")

	stored, err := alice.GetAccount(ctx, &accounts.GetAccountRequest{})
	require.NoError(t, err)
	testutil.ProtoEqual(t, want, stored, "get account must return updated account")

	// Removing bio inserting fake avatar.
	{
		want := &accounts.Account{
			Id: "z6MkvFrq593SZ3QNsAgXdsHC2CJGrrwUdwxY2EdRGaT4UbYj",
			Profile: &accounts.Profile{
				Alias:  "fake-alias",
				Avatar: "bafybeibjbq3tmmy7wuihhhwvbladjsd3gx3kfjepxzkq6wylik6wc3whzy",
			},
			Devices: map[string]*accounts.Device{
				"12D3KooWFMTJanyH3XttUC2AmS9fZnbeYsxbAjSEvyCeHVbHBX3C": {
					DeviceId: "12D3KooWFMTJanyH3XttUC2AmS9fZnbeYsxbAjSEvyCeHVbHBX3C",
				},
			},
		}

		updated, err := alice.UpdateProfile(ctx, want.Profile)
		require.NoError(t, err)
		testutil.ProtoEqual(t, want, updated, "account must be equal")

		stored, err := alice.GetAccount(ctx, &accounts.GetAccountRequest{})
		require.NoError(t, err)
		testutil.ProtoEqual(t, want, stored, "get account must return updated account")
	}
}

// TODO: update profile idempotent no change

func newTestServer(t *testing.T, name string) *Server {
	u := coretest.NewTester(name)

	pool := sqliteschema.MakeTestDB(t)
	db := vcsdb.New(pool)
	ctx := context.Background()
	bs := hyper.NewStorage(pool, logging.New("mintter/hyper", "debug"))

	_, err := daemon.Register(ctx, bs, u.Account, u.Device.PublicKey, time.Now().UTC().Add(-1*time.Hour))
	require.NoError(t, err)

	fut := future.New[core.Identity]()
	require.NoError(t, fut.Resolve(u.Identity))

	return NewServer(fut.ReadOnly, db)
}
