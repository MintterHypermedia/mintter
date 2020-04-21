package p2p

import (
	"context"
	"errors"
	"time"

	"mintter/backend/p2p/internal"

	peer "github.com/libp2p/go-libp2p-core/peer"
)

// Ping another peer to check the connectivity.
func (n *Node) Ping(ctx context.Context, pid peer.ID) (time.Duration, error) {
	// Libp2p doesn't allow to open a stream to yourself.
	if pid == n.peer.ID || pid == n.acc.ID {
		return 0, errors.New("must not ping yourself")
	}

	conn, err := n.dial(ctx, pid)
	if err != nil {
		return 0, err
	}
	defer logClose(n.log, conn.Close, "failed closing grpc connection")

	start := time.Now()
	if _, err = internal.NewPeerServiceClient(conn).Ping(ctx, &internal.PingRequest{}); err != nil {
		return 0, err
	}

	return time.Since(start), nil
}

func (n *rpcHandler) Ping(ctx context.Context, in *internal.PingRequest) (*internal.PingResponse, error) {
	time.Sleep(1 * time.Second) // TODO(burdiyan): remove this :)
	return &internal.PingResponse{}, nil
}
