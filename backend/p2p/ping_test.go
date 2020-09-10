package p2p_test

import (
	"context"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestPing(t *testing.T) {
	alice := makeTestNode(t, "alice")
	bob := makeTestNode(t, "bob")
	ctx := context.Background()

	connectPeers(t, ctx, alice, bob)

	dur, err := alice.Ping(ctx, bob.Account().ID)
	require.NoError(t, err, "alice must be able to ping bob")
	require.NotEqual(t, 0, dur)

	dur, err = bob.Ping(ctx, alice.Account().ID)
	require.NoError(t, err, "bob must be able to ping alice")
	require.NotEqual(t, 0, dur)

	dur, err = bob.Ping(ctx, bob.Account().ID)
	require.Error(t, err, "pinging youself must fail")
	require.Equal(t, 0, int(dur))
}
