// Package ipfsutil provides a lightweight IPFS node that can deal with IPLDs.
// Most of the content of this package is highly borrowed from https://github.com/hsanjuan/ipfs-lite.
// Some of the changes include better error handlling and graceful shutdown.
package ipfsutil

import (
	"context"
	"time"

	"github.com/ipfs/go-bitswap"
	"github.com/ipfs/go-bitswap/network"
	blocks "github.com/ipfs/go-block-format"
	"github.com/ipfs/go-cid"
	"github.com/ipfs/go-datastore"
	"github.com/ipfs/go-ipfs-provider/queue"
	"github.com/ipfs/go-ipfs-provider/simple"
	"github.com/libp2p/go-libp2p-core/host"
	"github.com/libp2p/go-libp2p-core/peer"
	"github.com/libp2p/go-libp2p-core/routing"
	dht "github.com/libp2p/go-libp2p-kad-dht"
	"github.com/libp2p/go-libp2p-kad-dht/dual"

	blockstore "github.com/ipfs/go-ipfs-blockstore"
	provider "github.com/ipfs/go-ipfs-provider"
	"github.com/multiformats/go-multiaddr"
	multihash "github.com/multiformats/go-multihash"
)

const defaultReprovideInterval = 12 * time.Hour

// NewBlock creates a new IPFS block assuming data is dag-cbor. It uses
// blake2 as the hash function as looks like this is what the community is going for now.
func NewBlock(codec uint64, data []byte) (blocks.Block, error) {
	id, err := NewCID(codec, multihash.BLAKE2B_MIN+31, data)
	if err != nil {
		return nil, err
	}

	return blocks.NewBlockWithCid(data, id)
}

// NewBlockstore creates a new Block Store from a given datastore.
// It adds caching and bloom-filters, in addition to support for ID hashed blocks.
func NewBlockstore(store datastore.Batching) (blockstore.Blockstore, error) {
	var bs blockstore.Blockstore
	bs = blockstore.NewBlockstore(store)
	bs = blockstore.NewIdStore(bs)
	return blockstore.CachedBlockstore(context.Background(), bs, blockstore.DefaultCacheOpts())
}

// StringAddrs converts a slice of multiaddrs into their string representation.
func StringAddrs(mas []multiaddr.Multiaddr) []string {
	out := make([]string, len(mas))

	for i, ma := range mas {
		out[i] = ma.String()
	}

	return out
}

// PeerIDFromCIDString converts a string-cid into Peer ID.
func PeerIDFromCIDString(s string) (peer.ID, error) {
	c, err := cid.Decode(s)
	if err != nil {
		return "", err
	}

	return peer.FromCid(c)
}

// Bitswap exposes the bitswap network and exchange interface.
type Bitswap struct {
	*bitswap.Bitswap
	Net network.BitSwapNetwork

	cancel context.CancelFunc
}

// NewBitswap creates a new Bitswap wrapper.
// Users must call Close() for shutdown.
func NewBitswap(host host.Host, rt routing.ContentRouting, bs blockstore.Blockstore) (*Bitswap, error) {
	net := network.NewFromIpfsHost(host, rt)
	ctx, cancel := context.WithCancel(context.Background())
	b := bitswap.New(ctx, net, bs, bitswap.ProvideEnabled(true))

	return &Bitswap{
		Bitswap: b.(*bitswap.Bitswap),
		Net:     net,
		cancel:  cancel,
	}, nil
}

// Close closes bitswap.
func (b *Bitswap) Close() error {
	err := b.Bitswap.Close()
	b.cancel()
	return err
}

// NewProviderSystem creates a new provider.System. Users must call Run() to start and Close() to shutdown.
func NewProviderSystem(bs blockstore.Blockstore, ds datastore.Datastore, rt routing.ContentRouting) (provider.System, error) {
	ctx := context.Background() // This will be canceled when Close() is called explicitly.
	q, err := queue.NewQueue(ctx, "provider-v1", ds)
	if err != nil {
		return nil, err
	}

	// No need to call q.Close() because provider will call it.
	// It's weird but this is how it works at the moment.

	prov := simple.NewProvider(ctx, q, rt)

	sp := simple.NewReprovider(ctx, defaultReprovideInterval, rt, simple.NewBlockstoreProvider(bs))

	return provider.NewSystem(prov, sp), nil
}

// WaitRouting blocks until the content routing is ready. It's best-effort.
func WaitRouting(ctx context.Context, rti routing.ContentRouting) error {
	var rt *dht.IpfsDHT

	switch d := rti.(type) {
	case *dht.IpfsDHT:
		rt = d
	case *dual.DHT:
		rt = d.WAN
	default:
		return nil
	}

	ticker := time.NewTicker(50 * time.Millisecond)
	defer ticker.Stop()

	for rt.RoutingTable().Size() <= 0 {
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-ticker.C:
			continue
		}
	}

	return nil
}
