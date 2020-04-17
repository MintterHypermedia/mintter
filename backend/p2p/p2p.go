// Package p2p provides networking capabilities for Mintter protocol over libp2p.
package p2p

import (
	"context"
	"fmt"
	"net"
	"path/filepath"
	"time"

	"mintter/backend"
	"mintter/backend/identity"
	"mintter/backend/p2p/internal"

	"github.com/ipfs/go-datastore"
	badger "github.com/ipfs/go-ds-badger"
	"github.com/ipfs/go-ipns"
	"github.com/libp2p/go-libp2p"
	relay "github.com/libp2p/go-libp2p-circuit" // OMG someone should kill the people naming IPFS Go packages.
	connmgr "github.com/libp2p/go-libp2p-connmgr"
	host "github.com/libp2p/go-libp2p-core/host"
	peer "github.com/libp2p/go-libp2p-core/peer"
	"github.com/libp2p/go-libp2p-core/protocol"
	"github.com/libp2p/go-libp2p-core/routing"
	gostream "github.com/libp2p/go-libp2p-gostream"
	dht "github.com/libp2p/go-libp2p-kad-dht"
	"github.com/libp2p/go-libp2p-peerstore/pstoreds"
	record "github.com/libp2p/go-libp2p-record"
	"github.com/multiformats/go-multiaddr"
	"go.uber.org/multierr"
	"go.uber.org/zap"
	"golang.org/x/sync/errgroup"
	"google.golang.org/grpc"
)

// Prototcol values.
const (
	ProtocolVersion = "0.0.1"
	ProtocolName    = "mintter"

	ProtocolID protocol.ID = "/" + ProtocolName + "/" + ProtocolVersion
)

const (
	// Default value to give for peer connections in connmanager. Stolen from qri.
	supportValue = 100
	// Under this key we store support flag in the peer store.
	supportKey = "mtt-support"
)

// userAgent is type & version of the mtt service.
var userAgent = "mintter/" + backend.Version

// Errors.
const (
	ErrNotConnected        = Error("no p2p connection")
	ErrUnsupportedProtocol = Error("peer doesn't support the Mintter protocol")
)

// Error is a constant type for errors.
type Error string

func (e Error) Error() string {
	return string(e)
}

// Config for p2p node.
type Config struct {
	// Disable bool   `help:"disable p2p networking"`
	Addr string `help:"address for binding p2p listener" default:"/ip4/0.0.0.0/tcp/55000"`
}

// Node is a Mintter p2p node.
type Node struct {
	acc  identity.Account
	peer identity.Peer
	host host.Host
	log  *zap.Logger

	addrs    []multiaddr.Multiaddr // Libp2p peer addresses for this node.
	quitc    chan struct{}         // This channel will be closed to indicate all the goroutines to exit.
	lis      net.Listener          // Libp2p listener wrapped into net.Listener. Used by the underlying gRPC server.
	dialOpts []grpc.DialOption     // Default dial options for gRPC client. Cached to avoid allocating same options for every call.

	g errgroup.Group // Groups
}

// NewNode creates a new node.
func NewNode(h host.Host, prof identity.Profile, log *zap.Logger) (*Node, error) {
	addrs, err := wrapAddrs(prof.Peer.ID, h.Addrs()...)
	if err != nil {
		return nil, err
	}

	lis, err := gostream.Listen(h, ProtocolID)
	if err != nil {
		return nil, err
	}

	n := &Node{
		acc:      prof.Account,
		peer:     prof.Peer,
		host:     h,
		log:      log,
		addrs:    addrs,
		lis:      lis,
		quitc:    make(chan struct{}),
		dialOpts: dialOpts(h),
	}

	go n.start()

	return n, nil
}

// Close the node gracefully.
func (n *Node) Close() (err error) {
	close(n.quitc)

	// TODO(burdiyan): if host is passed as a dependency it shouldn't be closing here.
	err = multierr.Append(err, n.host.Close())
	err = multierr.Append(err, n.g.Wait())
	err = multierr.Append(err, n.lis.Close())

	return
}

// Host of the p2p node.
func (n *Node) Host() host.Host {
	return n.host
}

// Addrs return p2p multiaddresses this node is listening on.
func (n *Node) Addrs() []multiaddr.Multiaddr {
	return n.addrs
}

func (n *Node) start() {
	srv := grpc.NewServer()

	rpc := &rpcHandler{n}
	internal.RegisterPeerServiceServer(srv, rpc)

	n.g.Go(func() error {
		return srv.Serve(n.lis)
	})

	n.g.Go(func() error {
		<-n.quitc
		srv.GracefulStop()
		return nil
	})
}

func (n *Node) dial(ctx context.Context, pid peer.ID, opts ...grpc.DialOption) (*grpc.ClientConn, error) {
	opts = append(opts, n.dialOpts...)

	return grpc.DialContext(ctx, pid.String(), opts...)
}

func dialOpts(host host.Host) []grpc.DialOption {
	return []grpc.DialOption{
		grpc.WithContextDialer(func(ctx context.Context, target string) (net.Conn, error) {
			id, err := peer.Decode(target)
			if err != nil {
				return nil, fmt.Errorf("failed to dial peer %s: %w", target, err)
			}

			return gostream.Dial(ctx, host, id, ProtocolID)
		}),
		grpc.WithInsecure(),
		grpc.WithBlock(),
	}
}

// MakeHost creates a new libp2p host.
func MakeHost(ctx context.Context, p identity.Peer, db datastore.Batching, addrs []multiaddr.Multiaddr, opts ...libp2p.Option) (host.Host, error) {
	ps, err := pstoreds.NewPeerstore(ctx, db, pstoreds.DefaultOpts())
	if err != nil {
		return nil, err
	}

	// This is borrowed from Qri's makeBasicHost. Not sure if it's needed.
	{
		if err := ps.AddPrivKey(p.ID, p.PrivKey); err != nil {
			return nil, err
		}

		if err := ps.AddPubKey(p.ID, p.PubKey); err != nil {
			return nil, err
		}
	}

	o := []libp2p.Option{
		libp2p.ListenAddrs(addrs...),
		libp2p.UserAgent(userAgent),
		libp2p.Identity(p.PrivKey),
		libp2p.Peerstore(ps),
		// Borrowed from qri.
		libp2p.EnableRelay(relay.OptHop),
		// Borrowed from go-threads.
		libp2p.ConnectionManager(connmgr.NewConnManager(100, 400, time.Minute)),
		// Borrowed from ipfs-lite.
		libp2p.Routing(func(h host.Host) (routing.PeerRouting, error) {
			// TODO(burdiyan): Check if DHT closes properly.
			return newDHT(ctx, h, db)
		}),
		// Check out extra options from ipfs-lite.
	}

	o = append(o, opts...)

	return libp2p.New(ctx, o...)
}

// borrowed from ipfs-lite.
func newDHT(ctx context.Context, h host.Host, ds datastore.Batching) (*dht.IpfsDHT, error) {
	dhtOpts := []dht.Option{
		dht.NamespacedValidator("pk", record.PublicKeyValidator{}),
		dht.NamespacedValidator("ipns", ipns.Validator{KeyBook: h.Peerstore()}), // TODO(burdiyan): Shall we get rid of the ipns stuff here?
		dht.Concurrency(10),
		dht.Mode(dht.ModeAuto),
	}
	if ds != nil {
		dhtOpts = append(dhtOpts, dht.Datastore(ds))
	}

	return dht.New(ctx, h, dhtOpts...)
}

// NodeFromConfig builds default p2p node with all its dependencies.
func NodeFromConfig(ctx context.Context, repoPath string, prof identity.Profile, cfg Config) (*Node, error) {
	db, err := badger.NewDatastore(filepath.Join(repoPath, "ipfslite"), &badger.DefaultOptions)
	if err != nil {
		return nil, err
	}

	a, err := multiaddr.NewMultiaddr(cfg.Addr)
	if err != nil {
		return nil, err
	}

	host, err := MakeHost(ctx, prof.Peer, db, []multiaddr.Multiaddr{a})
	if err != nil {
		return nil, err
	}

	// TODO(burdiyan): provide proper logger.
	return NewNode(host, prof, zap.NewNop())
}

func wrapAddrs(pid peer.ID, addrs ...multiaddr.Multiaddr) ([]multiaddr.Multiaddr, error) {
	host, err := multiaddr.NewComponent("p2p", pid.String())
	if err != nil {
		return nil, err
	}

	res := make([]multiaddr.Multiaddr, len(addrs))
	for i, a := range addrs {
		res[i] = a.Encapsulate(host)
	}

	return res, nil
}

// rpcHandler wraps p2p Node implementing grpc server interface.
// This way we don't expose server handlers on the main type.
type rpcHandler struct {
	*Node
}
