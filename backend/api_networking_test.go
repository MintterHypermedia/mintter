package backend

import (
	"context"
	"fmt"
	"testing"

	"github.com/stretchr/testify/require"

	networking "mintter/api/go/networking/v1alpha"
)

func TestNetworkingGetPeerInfo(t *testing.T) {
	ctx := context.Background()
	back := makeTestBackend(t, "alice", true)
	net := newNetworkingAPI(back)

	did := back.repo.Device().ID()

	acc, err := back.repo.Account()
	require.NoError(t, err)

	pinfo, err := net.GetPeerInfo(ctx, &networking.GetPeerInfoRequest{
		PeerId: did.String(),
	})
	require.NoError(t, err)
	require.NotNil(t, pinfo)
	require.Equal(t, acc.id.String(), pinfo.AccountId, "account ids must match")
	fmt.Println(pinfo)
}
