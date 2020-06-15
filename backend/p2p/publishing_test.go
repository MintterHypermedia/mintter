package p2p_test

import (
	"context"
	"mintter/backend/publishing"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestPublishing(t *testing.T) {
	alice := makeTestNode(t, "alice")
	bob := makeTestNode(t, "bob")
	ctx := context.Background()

	s1 := publishing.Section{
		DocumentID: "bob-doc-1",
		Author:     bob.Account().ID.String(),
		Body:       "Hello! This is Bob!",
	}

	sects, err := bob.AddSections(ctx, s1)
	require.NoError(t, err)

	pub1 := publishing.Publication{
		DocumentID: "bob-doc-1",
		Title:      "Hello world",
		Author:     bob.Account().ID.String(),
		Sections:   sects,
	}

	pubcid, err := bob.AddPublication(ctx, pub1)
	require.NoError(t, err)

	connectPeers(t, ctx, bob, alice)

	pub, err := alice.GetPublication(ctx, pubcid)
	require.NoError(t, err)
	require.Equal(t, pub1, pub)
}

func TestSyncPublications(t *testing.T) {
	alice := makeTestNode(t, "alice")
	bob := makeTestNode(t, "bob")
	ctx := context.Background()

	s1 := publishing.Section{
		DocumentID: "bob-doc-1",
		Author:     bob.Account().ID.String(),
		Body:       "Hello! This is Bob!",
	}

	connectPeers(t, ctx, bob, alice)

	sects, err := bob.AddSections(ctx, s1)
	require.NoError(t, err)

	pub1 := publishing.Publication{
		DocumentID: "bob-doc-1",
		Title:      "Hello world",
		Author:     bob.Account().ID.String(),
		Sections:   sects,
	}

	pubcid, err := bob.AddPublication(ctx, pub1)
	require.NoError(t, err)

	require.NoError(t, alice.SyncPublications(ctx, bob.Account().ID))

	cids, err := alice.Store().ListPublications("", 0, 0)
	require.NoError(t, err)
	require.Len(t, cids, 1)
	require.Equal(t, pubcid, cids[0])
}
