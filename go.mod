module mintter

go 1.13

replace github.com/textileio/go-threads => ./third_party/go-threads

require (
	github.com/alecthomas/kong v0.2.4
	github.com/burdiyan/go/kongcli v0.0.0-20200124222818-6f87e0e684b6
	github.com/burdiyan/go/mainutil v0.0.0-20200124222818-6f87e0e684b6
	github.com/golang/groupcache v0.0.0-20191002201903-404acd9df4cc // indirect
	github.com/golang/mock v1.3.1 // indirect
	github.com/golang/protobuf v1.3.4
	github.com/google/go-cmp v0.3.1 // indirect
	github.com/hsanjuan/ipfs-lite v0.1.8
	github.com/improbable-eng/grpc-web v0.12.0
	github.com/ipfs/go-datastore v0.3.1
	github.com/ipfs/go-ds-badger v0.2.0
	github.com/ipfs/go-ipfs-chunker v0.0.3 // indirect
	github.com/ipfs/go-ipld-cbor v0.0.3
	github.com/libp2p/go-libp2p v0.4.2
	github.com/libp2p/go-libp2p-connmgr v0.1.1
	github.com/libp2p/go-libp2p-core v0.3.0
	github.com/libp2p/go-libp2p-kad-dht v0.3.0
	github.com/libp2p/go-libp2p-peer v0.2.0
	github.com/libp2p/go-libp2p-peerstore v0.1.4
	github.com/lightningnetwork/lnd v0.9.0-beta
	github.com/mr-tron/base58 v1.1.3
	github.com/multiformats/go-multiaddr v0.2.0
	github.com/multiformats/go-multihash v0.0.13
	github.com/stretchr/testify v1.4.0
	github.com/textileio/go-textile v0.7.7
	github.com/textileio/go-threads v0.0.0-local
	go.uber.org/multierr v1.1.0
	go.uber.org/zap v1.10.0
	golang.org/x/crypto v0.0.0-20200210222208-86ce3cb69678 // indirect
	golang.org/x/net v0.0.0-20200301022130-244492dfa37a // indirect
	golang.org/x/sync v0.0.0-20190911185100-cd5d95a43a6e
	golang.org/x/sys v0.0.0-20200302150141-5c8b2ff67527 // indirect
	google.golang.org/genproto v0.0.0-20200306153348-d950eab6f860 // indirect
	google.golang.org/grpc v1.27.1
)
