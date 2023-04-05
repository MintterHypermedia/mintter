// Package mttnet provides Mintter P2P network functionality.
package mttnet

import (
	"context"
	"fmt"
	"io"
	"mintter/backend/config"
	"mintter/backend/core"
	site "mintter/backend/genproto/documents/v1alpha"
	p2p "mintter/backend/genproto/p2p/v1alpha"
	"mintter/backend/ipfs"
	"mintter/backend/mttnet/sitesql"
	"mintter/backend/pkg/cleanup"
	"mintter/backend/pkg/future"
	"mintter/backend/pkg/must"
	vcsdb "mintter/backend/vcs/sqlitevcs"
	"mintter/backend/vcs/vcssql"
	"strconv"
	"time"

	"crawshaw.io/sqlite/sqlitex"
	"github.com/ipfs/go-cid"
	"github.com/ipfs/go-datastore"
	dssync "github.com/ipfs/go-datastore/sync"
	blockstore "github.com/ipfs/go-ipfs-blockstore"
	provider "github.com/ipfs/go-ipfs-provider"
	"github.com/prometheus/client_golang/prometheus"
	"golang.org/x/sync/errgroup"

	"github.com/libp2p/go-libp2p"
	gostream "github.com/libp2p/go-libp2p-gostream"
	"github.com/libp2p/go-libp2p/core/crypto"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/libp2p/go-libp2p/core/protocol"
	"github.com/libp2p/go-libp2p/p2p/host/autorelay"
	"github.com/libp2p/go-libp2p/p2p/host/peerstore/pstoreds"
	"github.com/libp2p/go-libp2p/p2p/transport/tcp"
	"github.com/multiformats/go-multiaddr"
	"go.uber.org/multierr"
	"go.uber.org/zap"
	"google.golang.org/grpc"
)

// Prototcol values.
const (
	ProtocolVersion = "0.0.3"
	ProtocolName    = "mintter"

	ProtocolID protocol.ID = "/" + ProtocolName + "/" + ProtocolVersion

	protocolSupportKey = "mintter-support" // This is what we use as a key to protect the connection in ConnManager.
)

var userAgent = "mintter/<dev>"

// DefaultRelays bootstrap mintter-owned relays so they can reserve slots to do holepunch.
func DefaultRelays() []peer.AddrInfo {
	return []peer.AddrInfo{
		// Mintter prod server
		{
			ID: must.Do2(peer.Decode("12D3KooWNmjM4sMbSkDEA6ShvjTgkrJHjMya46fhZ9PjKZ4KVZYq")),
			Addrs: []multiaddr.Multiaddr{
				must.Do2(multiaddr.NewMultiaddr("/ip4/23.20.24.146/tcp/4002")),
				//must.Do2(multiaddr.NewMultiaddr("/ip4/23.20.24.146/udp/4002/quic")),
			},
		},
		// Mintter test server
		{
			ID: must.Do2(peer.Decode("12D3KooWGvsbBfcbnkecNoRBM7eUTiuriDqUyzu87pobZXSdUUsJ")),
			Addrs: []multiaddr.Multiaddr{
				must.Do2(multiaddr.NewMultiaddr("/ip4/52.22.139.174/tcp/4002")),
				//must.Do2(multiaddr.NewMultiaddr("/ip4/52.22.139.174/udp/4002/quic")),
			},
		},
	}
}

type wellKnownInfo struct {
	Addresses []string `json:"addresses,omitempty"`
	AccountID string   `json:"account_id,omitempty"`
}

type docInfo struct {
	ID      string
	Version string
}

// PublicationRecord holds the information of a published document (record) on a site.
type PublicationRecord struct {
	Document   docInfo
	Path       string
	Hostname   string
	References []docInfo
}

// Site is a hosted site.
type Site struct {
	hostname                   string
	InviteTokenExpirationDelay time.Duration
	ownerID                    string
}

// Server holds the p2p functionality to be accessed via gRPC.
type Server struct {
	Node *future.ReadOnly[*Node]
	*Site
	localFunctions LocalFunctions
	synchronizer   Synchronizer
}

// Node is a Mintter P2P node.
type Node struct {
	log             *zap.Logger
	vcs             *vcsdb.DB
	me              core.Identity
	cfg             config.P2P
	accountObjectID cid.Cid
	invoicer        Invoicer
	client          *Client

	p2p        *ipfs.Libp2p
	bitswap    *ipfs.Bitswap
	providing  provider.System
	grpc       *grpc.Server
	quit       io.Closer
	ready      chan struct{}
	registered chan struct{}
	ctx        context.Context // will be set after calling Start()
}

// LocalFunctions is an interface for not having to pass a full-fledged documents service,
// just the getPublication that is what we need to call in getPath.
type LocalFunctions interface {
	// GetPublication gets a local publication.
	GetPublication(ctx context.Context, in *site.GetPublicationRequest) (*site.Publication, error)
}

// Synchronizer is a subset of the syncing service that
// is able to sync content with remote peers on demand.
type Synchronizer interface {
	SyncWithPeer(ctx context.Context, device cid.Cid, initialObjects ...cid.Cid) error
}

// NewServer returns a new mttnet API server.
func NewServer(ctx context.Context, siteCfg config.Site, node *future.ReadOnly[*Node], localFunctions LocalFunctions, sync Synchronizer) *Server {
	expirationDelay := siteCfg.InviteTokenExpirationDelay

	srv := &Server{Site: &Site{
		hostname:                   siteCfg.Hostname,
		InviteTokenExpirationDelay: expirationDelay,
		ownerID:                    siteCfg.OwnerID,
	}, Node: node, localFunctions: localFunctions, synchronizer: sync}

	cleaningTokensTicker := time.NewTicker(5 * time.Minute)
	go func() {
		n, err := node.Await(ctx)
		if err != nil {
			return
		}
		conn, cancel, err := n.vcs.DB().Conn(ctx)
		if err != nil {
			return
		}
		defer cancel()

		for {
			select {
			case <-ctx.Done():
				return
			case <-cleaningTokensTicker.C:
				if err := sitesql.CleanExpiredTokens(conn); err != nil {
					return
				}
			}
		}
	}()
	go func() {
		n, err := node.Await(ctx)
		if err == nil {
			// this is how we respond to remote RPCs over libp2p.
			p2p.RegisterP2PServer(n.grpc, srv)
			site.RegisterWebSiteServer(n.grpc, srv)
			if srv.ownerID == "" {
				srv.ownerID = n.me.AccountID().String()
			}
			if siteCfg.Title != "" && n.vcs.DB() != nil {
				conn, cancel, err := n.vcs.DB().Conn(ctx)
				if err == nil {
					defer cancel()
					title, err := sitesql.GetSiteTitle(conn)
					if err == nil && title == "" {
						err = sitesql.SetSiteTitle(conn, siteCfg.Title)
						if err != nil {
							n.log.Warn("Could not set initial site title", zap.String("Title", siteCfg.Title), zap.Error(err))
						}
						err = srv.updateSiteBio(ctx, siteCfg.Title, "")
						if err != nil {
							n.log.Warn("Could not update site Bio according to title", zap.String("Title", siteCfg.Title), zap.Error(err))
						}
					}
				}
			}
		}
		defer func() {
			// Indicate we can now serve the already registered endpoints.
			if n != nil {
				close(n.registered)
			}
		}()
		if n != nil && n.vcs.DB() != nil {
			conn, cancel, err := n.vcs.DB().Conn(ctx)
			if err != nil {
				return
			}
			defer cancel()
			ownerCID, err := cid.Decode(srv.ownerID)
			if err != nil {
				return
			}
			_ = sitesql.AddMember(conn, ownerCID, int64(site.Member_OWNER))
		}
	}()
	return srv
}

// New creates a new P2P Node. The users must call Start() before using the node, and can use Ready() to wait
// for when the node is ready to use.
func New(cfg config.P2P, vcs *vcsdb.DB, accountObj cid.Cid, me core.Identity, log *zap.Logger) (*Node, error) {
	var clean cleanup.Stack

	host, closeHost, err := newLibp2p(cfg, me.DeviceKey().Wrapped(), vcs.DB())
	if err != nil {
		return nil, fmt.Errorf("failed to start libp2p host: %w", err)
	}
	clean.Add(closeHost)

	bitswap, err := ipfs.NewBitswap(host, host.Routing, vcs.Blockstore())
	if err != nil {
		return nil, fmt.Errorf("failed to start bitswap: %w", err)
	}
	clean.Add(bitswap)

	// TODO(burdiyan): find a better reproviding strategy than naive provide-everything.
	providing, err := ipfs.NewProviderSystem(host.Datastore(), host.Routing, makeProvidingStrategy(vcs.DB()))
	if err != nil {
		return nil, fmt.Errorf("failed to initialize providing: %w", err)
	}
	clean.Add(providing)

	client := NewClient(me, host)
	clean.Add(client)

	n := &Node{
		log:             log,
		vcs:             vcs,
		me:              me,
		cfg:             cfg,
		accountObjectID: accountObj,
		client:          client,
		p2p:             host,
		bitswap:         bitswap,
		providing:       providing,
		grpc:            grpc.NewServer(),
		quit:            &clean,
		ready:           make(chan struct{}),
		registered:      make(chan struct{}),
	}

	return n, nil
}

// SetInvoicer assign an invoicer service to the node struct.
func (n *Node) SetInvoicer(inv Invoicer) {
	n.invoicer = inv
}

// VCS returns the underlying VCS. Should not be here at all, but used in tests of other packages.
//
// TODO(burdiyan): get rid of this.
func (n *Node) VCS() *vcsdb.DB {
	return n.vcs
}

// ID returns the node's identity.
func (n *Node) ID() core.Identity {
	return n.me
}

// Blockstore returns the underlying IPFS blockstore for convenience.
func (n *Node) Blockstore() blockstore.Blockstore {
	return n.vcs.Blockstore()
}

// ProvideCID notifies the providing system to provide the given CID on the DHT.
func (n *Node) ProvideCID(c cid.Cid) error {
	return n.providing.Provide(c)
}

// Bitswap returns the underlying Bitswap service.
func (n *Node) Bitswap() *ipfs.Bitswap {
	return n.bitswap
}

// Client dials a remote peer if necessary and returns the RPC client handle.
func (n *Node) Client(ctx context.Context, device cid.Cid) (p2p.P2PClient, error) {
	pid, err := peer.FromCid(device)
	if err != nil {
		return nil, err
	}

	if err := n.Connect(ctx, n.p2p.Peerstore().PeerInfo(pid)); err != nil {
		return nil, err
	}

	return n.client.Dial(ctx, pid)
}

// AccountForDevice returns the linked AccountID of a given device.
func (n *Node) AccountForDevice(ctx context.Context, device cid.Cid) (cid.Cid, error) {
	conn, release, err := n.vcs.DB().Conn(ctx)
	if err != nil {
		return cid.Undef, err
	}
	defer release()

	res, err := vcssql.AccountsGetForDevice(conn, device.Hash())
	if err != nil {
		return cid.Undef, err
	}

	if res.AccountsMultihash == nil {
		return cid.Undef, fmt.Errorf("failed to find account for device %s", device)
	}

	return cid.NewCidV1(uint64(core.CodecAccountKey), res.AccountsMultihash), nil
}

// Libp2p returns the underlying libp2p host.
func (n *Node) Libp2p() *ipfs.Libp2p { return n.p2p }

// Start the node. It will block while node is running. To stop gracefully
// cancel the provided context and wait for Start to return.
func (n *Node) Start(ctx context.Context) (err error) {
	n.ctx = ctx

	n.log.Debug("P2PNodeStarted")
	defer func() { n.log.Debug("P2PNodeFinished", zap.Error(err)) }()

	if err := n.startLibp2p(ctx); err != nil {
		return err
	}

	n.providing.Run()

	lis, err := gostream.Listen(n.p2p.Host, ProtocolID)
	if err != nil {
		return fmt.Errorf("failed to start listener: %w", err)
	}

	g, ctx := errgroup.WithContext(ctx)

	// Start Mintter protocol listener over libp2p.
	{
		g.Go(func() error {
			select {
			case <-n.registered:
				return n.grpc.Serve(lis)
			case <-ctx.Done():
				return nil
			}
		})

		g.Go(func() error {
			<-ctx.Done()
			n.grpc.GracefulStop()
			return nil
		})
	}

	// Indicate that node is ready to work with.
	close(n.ready)

	werr := g.Wait()

	cerr := n.quit.Close()

	// When context is canceled the whole errgroup will be tearing down.
	// We have to wait until all goroutines finish, and then call the cleanup stack.
	return multierr.Combine(werr, cerr)
}

// AddrInfo returns info for our own peer.
func (n *Node) AddrInfo() peer.AddrInfo {
	return n.p2p.AddrInfo()
}

// Ready channel is closed when the node is ready to use. It can be used
// to await for the node to be bootstrapped and ready.
func (n *Node) Ready() <-chan struct{} {
	return n.ready
}

func (n *Node) startLibp2p(ctx context.Context) error {
	port := strconv.Itoa(n.cfg.Port)

	addrs := []multiaddr.Multiaddr{
		must.Do2(multiaddr.NewMultiaddr("/ip4/0.0.0.0/tcp/" + port)),
		must.Do2(multiaddr.NewMultiaddr("/ip6/::/tcp/" + port)),
		// TODO(burdiyan): uncomment this when quic is known to work. Find other places for `quic-support`.
		// must.Two(multiaddr.NewMultiaddr("/ip4/0.0.0.0/udp/" + port + "/quic")),
		// must.Two(multiaddr.NewMultiaddr("/ip6/::/udp/" + port + "/quic")),
	}

	if err := n.p2p.Network().Listen(addrs...); err != nil {
		return err
	}

	if !n.cfg.NoBootstrap() {
		bootInfo, err := peer.AddrInfosFromP2pAddrs(n.cfg.BootstrapPeers...)
		if err != nil {
			return fmt.Errorf("failed to parse bootstrap addresses %+v: %w", n.cfg.BootstrapPeers, err)
		}

		res := n.p2p.Bootstrap(ctx, bootInfo)

		n.log.Info("BootstrapFinished",
			zap.NamedError("dhtError", res.RoutingErr),
			zap.Int("peersTotal", len(res.Peers)),
			zap.Int("failedConnectionsTotal", int(res.NumFailedConnections)),
		)

		if res.NumFailedConnections > 0 {
			for i, err := range res.ConnectErrs {
				if err == nil {
					continue
				}
				n.log.Debug("BootstrapConnectionError",
					zap.String("peer", res.Peers[i].ID.String()),
					zap.Error(err),
				)
			}
		}
	}

	return nil
}

// AddrInfoToStrings returns address as string.
func AddrInfoToStrings(info peer.AddrInfo) []string {
	var addrs []string
	for _, a := range info.Addrs {
		addrs = append(addrs, a.Encapsulate(must.Do2(multiaddr.NewComponent("p2p", info.ID.String()))).String())
	}

	return addrs
}

// AddrInfoFromStrings converts a list of full multiaddrs belonging to the same peer ID into a AddrInfo structure.
func AddrInfoFromStrings(addrs ...string) (out peer.AddrInfo, err error) {
	for i, a := range addrs {
		ma, err := multiaddr.NewMultiaddr(a)
		if err != nil {
			return out, fmt.Errorf("failed to parse multiaddr %s: %w", a, err)
		}

		transport, id := peer.SplitAddr(ma)
		if id == "" {
			return peer.AddrInfo{}, peer.ErrInvalidAddr
		}

		if i == 0 {
			out.ID = id
		} else {
			if out.ID != id {
				return out, fmt.Errorf("peer IDs do not match: %s != %s", out.ID, id)
			}
		}

		if transport != nil {
			out.Addrs = append(out.Addrs, transport)
		}
	}

	return out, nil
}

func newLibp2p(cfg config.P2P, device crypto.PrivKey, pool *sqlitex.Pool) (*ipfs.Libp2p, io.Closer, error) {
	var clean cleanup.Stack

	ds := dssync.MutexWrap(datastore.NewMapDatastore())
	clean.Add(ds)

	ps, err := pstoreds.NewPeerstore(context.Background(), ds, pstoreds.DefaultOpts())
	if err != nil {
		return nil, nil, err
	}
	// Not adding peerstore to the cleanup stack because weirdly enough, libp2p host closes it,
	// even if it doesn't own it. See BasicHost#Close() inside libp2p.

	opts := []libp2p.Option{
		libp2p.UserAgent(userAgent),
		libp2p.Peerstore(ps),
		libp2p.EnableNATService(),
		// TODO: get rid of this when quic is known to work well. Find other places for `quic-support`.
		libp2p.Transport(tcp.NewTCPTransport),
		libp2p.AddrsFactory(func(addrs []multiaddr.Multiaddr) []multiaddr.Multiaddr {
			if cfg.ExtraAddrs == nil {
				return addrs
			}
			out := make([]multiaddr.Multiaddr, 0, len(addrs)+len(cfg.ExtraAddrs))
			out = append(out, addrs...)
			out = append(out, cfg.ExtraAddrs...)
			return out
		}),
	}

	libp2p.ListenAddrStrings()
	if !cfg.NoRelay {
		opts = append(opts,
			libp2p.ForceReachabilityPrivate(),
			libp2p.EnableHolePunching(),
			libp2p.EnableAutoRelay(autorelay.WithStaticRelays(DefaultRelays()),
				autorelay.WithBootDelay(time.Second*10),
				autorelay.WithNumRelays(2),
				autorelay.WithMinCandidates(2),
				autorelay.WithBackoff(cfg.RelayBackoff)),
		)
	}

	m := ipfs.NewLibp2pMetrics()

	if !cfg.NoMetrics {
		opts = append(opts, libp2p.BandwidthReporter(m))
	}

	node, err := ipfs.NewLibp2pNode(device, ds, opts...)
	if err != nil {
		return nil, nil, err
	}
	clean.Add(node)

	m.SetHost(node.Host)

	if !cfg.NoMetrics {
		prometheus.MustRegister(m)
	}

	return node, &clean, nil
}
