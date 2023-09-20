// Package server is the serve to monitor site status.
package server

import (
	"context"
	"fmt"
	"io"
	groups "mintter/backend/genproto/groups/v1alpha"
	"net/http"
	"time"

	peer "github.com/libp2p/go-libp2p/core/peer"
	peerstore "github.com/libp2p/go-libp2p/core/peerstore"
	ping "github.com/libp2p/go-libp2p/p2p/protocol/ping"
	"github.com/multiformats/go-multiaddr"
	"google.golang.org/protobuf/encoding/protojson"
)

func (s *Srv) checkP2P(ctx context.Context, peer peer.AddrInfo, numPings int) (time.Duration, error) {
	ttl := peerstore.TempAddrTTL
	deadline, hasDeadline := ctx.Deadline()
	if hasDeadline {
		ttl = time.Until(deadline)
	}
	s.node.Peerstore().AddAddrs(peer.ID, peer.Addrs, ttl)

	pings := ping.Ping(ctx, s.node, peer.ID)

	var (
		count int
		total time.Duration
	)
	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()

	for i := 0; i < numPings; i++ {
		res, ok := <-pings
		if !ok {
			break
		}
		if res.Error != nil {
			return total, fmt.Errorf("Could not ping: %w", res.Error)
		}
		count++
		total += res.RTT

		select {
		case <-ticker.C:
		case <-ctx.Done():
			return total, ctx.Err()
		}
	}

	if count == 0 {
		return total, fmt.Errorf("Ping Failed")
	}
	pingAvg := time.Duration((total.Nanoseconds()) / int64(count))
	return pingAvg, nil
}

func (s *Srv) checkMintterAddrs(ctx context.Context, hostname, mustInclude string) (info peer.AddrInfo, err error) {
	resp, err := s.getSiteInfoHTTP(ctx, hostname)
	if err != nil {
		return info, err
	}

	if resp.PeerInfo == nil {
		return info, fmt.Errorf("no peer info got from site")
	}

	pid, err := peer.Decode(resp.PeerInfo.PeerId)
	if err != nil {
		return info, fmt.Errorf("failed to decode peer ID %s: %w", resp.PeerInfo.PeerId, err)
	}

	info.ID = pid
	info.Addrs = make([]multiaddr.Multiaddr, len(resp.PeerInfo.Addrs))
	for i, as := range resp.PeerInfo.Addrs {
		info.Addrs[i], err = multiaddr.NewMultiaddr(as)
		if err != nil {
			return info, err
		}
	}

	return info, nil
}

func (s *Srv) getSiteInfoHTTP(ctx context.Context, SiteHostname string) (*groups.PublicSiteInfo, error) {
	requestURL := fmt.Sprintf("%s/%s", SiteHostname, ".well-known/hypermedia-site")

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, requestURL, nil)
	if err != nil {
		return nil, fmt.Errorf("could not create request to well-known site: %w ", err)
	}

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("could not contact to provided site [%s]: %w ", requestURL, err)
	}
	defer res.Body.Close()
	if res.StatusCode < 200 || res.StatusCode > 299 {
		return nil, fmt.Errorf("site info url [%s] not working. Status code: %d", requestURL, res.StatusCode)
	}

	data, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read json body: %w", err)
	}

	resp := &groups.PublicSiteInfo{}
	if err := protojson.Unmarshal(data, resp); err != nil {
		return nil, fmt.Errorf("failed to unmarshal JSON body: %w", err)
	}
	return resp, nil
}
