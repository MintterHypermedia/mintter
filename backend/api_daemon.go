package backend

import (
	"context"

	"github.com/lightningnetwork/lnd/aezeed"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"

	daemon "mintter/backend/api/daemon/v1alpha"
)

type daemonAPI struct {
	back *backend
}

func newDaemonAPI(back *backend) daemon.DaemonServer {
	return &daemonAPI{
		back: back,
	}
}

func (srv *daemonAPI) GenSeed(ctx context.Context, req *daemon.GenSeedRequest) (*daemon.GenSeedResponse, error) {
	words, err := NewMnemonic(req.AezeedPassphrase)
	if err != nil {
		return nil, err
	}

	resp := &daemon.GenSeedResponse{
		Mnemonic: words,
	}

	return resp, nil
}

func (srv *daemonAPI) Register(ctx context.Context, req *daemon.RegisterRequest) (*daemon.RegisterResponse, error) {
	var m aezeed.Mnemonic
	copy(m[:], req.Mnemonic)

	aid, err := srv.back.Register(ctx, m, req.AezeedPassphrase)
	if err != nil {
		return nil, err
	}

	return &daemon.RegisterResponse{
		AccountId: aid.String(),
	}, nil
}

func (srv *daemonAPI) GetInfo(ctx context.Context, in *daemon.GetInfoRequest) (*daemon.Info, error) {
	pa, err := srv.back.repo.Account()
	if err != nil {
		return nil, status.Error(codes.FailedPrecondition, err.Error())
	}

	resp := &daemon.Info{
		AccountId: pa.id.String(),
		PeerId:    srv.back.repo.Device().id.String(),
		StartTime: timestamppb.New(srv.back.startTime),
	}

	return resp, nil
}
