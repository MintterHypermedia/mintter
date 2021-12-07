package sqlitebs

import (
	"context"
	"fmt"
	"testing"

	"crawshaw.io/sqlite/sqlitex"
	blocks "github.com/ipfs/go-block-format"
	"github.com/ipfs/go-cid"
	blockstore "github.com/ipfs/go-ipfs-blockstore"
	"github.com/multiformats/go-multihash"
	"github.com/stretchr/testify/require"
)

func TestGet(t *testing.T) {
	t.Parallel()

	bs := newBlockstore(t)

	data := []byte("some data")
	c := makeCID(t, data)

	blk, err := blocks.NewBlockWithCid(data, c)
	require.NoError(t, err)

	require.NoError(t, bs.Put(context.Background(), blk))

	got, err := bs.Get(context.Background(), c)
	require.NoError(t, err)

	require.Equal(t, blk.RawData(), got.RawData())
	require.True(t, got.Cid().Equals(blk.Cid()))

	ok, err := bs.Has(context.Background(), c)
	require.NoError(t, err)
	require.True(t, ok)

	size, err := bs.GetSize(context.Background(), c)
	require.NoError(t, err)
	require.Equal(t, len(data), size)
}

func TestGet_Missing(t *testing.T) {
	t.Parallel()

	bs := newBlockstore(t)

	c := makeCID(t, []byte("missing-data"))
	got, err := bs.Get(context.Background(), c)
	require.Nil(t, got)
	require.Equal(t, blockstore.ErrNotFound, err)

	ok, err := bs.Has(context.Background(), c)
	require.False(t, ok)
	require.NoError(t, err)

	size, err := bs.GetSize(context.Background(), c)
	require.Equal(t, blockstore.ErrNotFound, err)
	require.Equal(t, 0, size)
}

func TestHashOnRead(t *testing.T) {
	t.Parallel()

	bs := newBlockstore(t)

	require.Panics(t, func() { bs.HashOnRead(true) })
}

func TestHas(t *testing.T) {
	t.Parallel()

	bs := newBlockstore(t)

	orig := blocks.NewBlock([]byte("some data"))
	err := bs.Put(context.Background(), orig)
	require.NoError(t, err)

	ok, err := bs.Has(context.Background(), orig.Cid())
	require.NoError(t, err)
	require.True(t, ok)

	ok, err = bs.Has(context.Background(), blocks.NewBlock([]byte("another thing")).Cid())
	require.NoError(t, err)
	require.False(t, ok)
}

func TestCidv0v1(t *testing.T) {
	t.Parallel()

	bs := newBlockstore(t)

	orig := blocks.NewBlock([]byte("some data"))

	err := bs.Put(context.Background(), orig)
	require.NoError(t, err)

	fetched, err := bs.Get(context.Background(), cid.NewCidV1(cid.DagProtobuf, orig.Cid().Hash()))
	require.NoError(t, err)
	require.Equal(t, orig.RawData(), fetched.RawData())
}

func TestAllKeysSimple(t *testing.T) {
	t.Parallel()

	bs := newBlockstore(t)

	keys := insertBlocks(t, bs, 100)

	ctx := context.Background()
	ch, err := bs.AllKeysChan(ctx)
	require.NoError(t, err)
	actual := collect(ch)

	require.ElementsMatch(t, keys, actual)
}

func TestAllKeysRespectsContext(t *testing.T) {
	t.Parallel()

	bs := newBlockstore(t)

	keys := insertBlocks(t, bs, 100)

	ctx, cancel := context.WithCancel(context.Background())
	ch, err := bs.AllKeysChan(ctx)
	require.NoError(t, err)

	// consume 2, then cancel context.
	v, ok := <-ch
	require.NotEqual(t, keys[0], v)
	require.True(t, ok)

	v, ok = <-ch
	require.NotEqual(t, keys[1], v)
	require.True(t, ok)

	cancel()

	received := 0
	for range ch {
		received++
		require.LessOrEqual(t, received, 20, "expected query to be canceled")
	}
}

func TestPutMany(t *testing.T) {
	t.Parallel()

	bs := newBlockstore(t)

	blks := []blocks.Block{
		blocks.NewBlock([]byte("foo1")),
		blocks.NewBlock([]byte("foo2")),
		blocks.NewBlock([]byte("foo3")),
	}
	err := bs.PutMany(context.Background(), blks)
	require.NoError(t, err)

	for _, blk := range blks {
		fetched, err := bs.Get(context.Background(), blk.Cid())
		require.NoError(t, err)
		require.Equal(t, blk.RawData(), fetched.RawData())

		ok, err := bs.Has(context.Background(), blk.Cid())
		require.NoError(t, err)
		require.True(t, ok)
	}

	ch, err := bs.AllKeysChan(context.Background())
	require.NoError(t, err)

	cids := collect(ch)
	require.Len(t, cids, 3)
}

func TestDelete(t *testing.T) {
	t.Parallel()

	bs := newBlockstore(t)

	blks := []blocks.Block{
		blocks.NewBlock([]byte("foo1")),
		blocks.NewBlock([]byte("foo2")),
		blocks.NewBlock([]byte("foo3")),
	}
	err := bs.PutMany(context.Background(), blks)
	require.NoError(t, err)

	err = bs.DeleteBlock(context.Background(), blks[1].Cid())
	require.NoError(t, err)

	ch, err := bs.AllKeysChan(context.Background())
	require.NoError(t, err)

	cids := collect(ch)
	require.Len(t, cids, 2)
	require.ElementsMatch(t, cids, []cid.Cid{
		cid.NewCidV1(cid.DagProtobuf, blks[0].Cid().Hash()),
		cid.NewCidV1(cid.DagProtobuf, blks[2].Cid().Hash()),
	})

	has, err := bs.Has(context.Background(), blks[1].Cid())
	require.NoError(t, err)
	require.False(t, has)
}

func newBlockstore(t testing.TB) *Blockstore {
	t.Helper()

	pool, err := sqlitex.Open("file::memory:?mode=memory", 0, 1)
	require.NoError(t, err)

	t.Cleanup(func() {
		require.NoError(t, pool.Close())
	})

	bs := New(pool, DefaultConfig())
	require.NoError(t, bs.CreateTables(context.Background()))

	return bs
}

func makeCID(t *testing.T, data []byte) cid.Cid {
	t.Helper()

	mh, err := multihash.Sum(data, multihash.SHA2_256, -1)
	require.NoError(t, err)

	return cid.NewCidV1(cid.Raw, mh)
}

func insertBlocks(t *testing.T, bs *Blockstore, count int) []cid.Cid {
	keys := make([]cid.Cid, count)
	for i := 0; i < count; i++ {
		data := []byte(fmt.Sprintf("some data %d", i))
		c := makeCID(t, data)
		block, err := blocks.NewBlockWithCid(data, c)
		require.NoError(t, err)
		require.NoError(t, bs.Put(context.Background(), block))
		keys[i] = c
	}

	return keys
}

func collect(ch <-chan cid.Cid) []cid.Cid {
	var keys []cid.Cid
	for k := range ch {
		keys = append(keys, k)
	}
	return keys
}
