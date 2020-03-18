package rpc

import (
	"context"
	"crypto/rand"
	"fmt"
	"mintter/proto"
	"time"

	"github.com/lightningnetwork/lnd/aezeed"
	"github.com/lightningnetwork/lnd/keychain"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// GenSeed implements GenSeed rpc.
func (s *Server) GenSeed(ctx context.Context, req *proto.GenSeedRequest) (*proto.GenSeedResponse, error) {
	mnemonic, seed, err := s.genSeed(req.AezeedPassphrase)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed GenSeed: %v", err)
	}

	resp := &proto.GenSeedResponse{
		Mnemonic:       mnemonic[:],
		EncipheredSeed: seed[:],
	}

	return resp, nil
}

func (s *Server) genSeed(passphrase []byte) (Mnemonic, EncipheredSeed, error) {
	seed, err := newSeed()
	if err != nil {
		return Mnemonic{}, EncipheredSeed{}, err
	}

	rawSeed, err := seed.Encipher(passphrase)
	if err != nil {
		return Mnemonic{}, EncipheredSeed{}, fmt.Errorf("failed to encipher seed: %w", err)
	}

	words, err := seed.ToMnemonic(passphrase)
	if err != nil {
		return Mnemonic{}, EncipheredSeed{}, fmt.Errorf("failed to create mnemonic: %w", err)
	}

	return words, rawSeed, nil
}

func newSeed() (*aezeed.CipherSeed, error) {
	var entropy [aezeed.EntropySize]byte

	if _, err := rand.Read(entropy[:]); err != nil {
		return nil, fmt.Errorf("unable to generate random seed: %w", err)
	}

	return aezeed.New(keychain.KeyDerivationVersion, &entropy, time.Now())
}
