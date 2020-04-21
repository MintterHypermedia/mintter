package store

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"mintter/backend/identity"
	"mintter/backend/logbook"
	"os"
	"sync"

	"github.com/ipfs/go-datastore/query"
)

// UpdateProfile updates mutable fields of the current user. It will merge new fields with old ones.
func (s *Store) UpdateProfile(ctx context.Context, a identity.About) (identity.Profile, error) {
	// TODO(burdiyan): Check to only update current profile.

	prof := identity.Profile{About: a}

	old, err := s.pc.load()
	if err != nil {
		return identity.Profile{}, err
	}

	merged := old
	if err := merged.Merge(prof); err != nil {
		return identity.Profile{}, err
	}

	if err := s.pc.store(merged); err != nil {
		return identity.Profile{}, err
	}

	diff, ok := old.About.Diff(merged.About)
	if !ok {
		return merged, nil
	}

	lg, err := s.lb.Get(logbook.LogID{
		LogName: logbook.NameProfile,
		Account: s.pc.p.Account,
	})
	if err != nil {
		return identity.Profile{}, fmt.Errorf("failed to get profile log: %w", err)
	}

	// TODO(burdiyan): verify the signature of the record?
	if _, err := lg.Append(eventAbout.New(diff)); err != nil {
		return identity.Profile{}, fmt.Errorf("failed to append to log: %w", err)
	}

	return merged, nil
}

// StoreProfile in the database.
func (s *Store) StoreProfile(ctx context.Context, prof identity.Profile) error {
	data, err := json.Marshal(prof)
	if err != nil {
		return err
	}

	return s.db.Put(s.profilesKey.ChildString(prof.ID.String()), data)
}

// GetProfile from the store by its ID.
func (s *Store) GetProfile(ctx context.Context, pid identity.ProfileID) (identity.Profile, error) {
	if pid == s.prof.ID {
		return s.CurrentProfile(ctx)
	}

	data, err := s.db.Get(s.profilesKey.ChildString(pid.String()))
	if err != nil {
		return identity.Profile{}, err
	}

	var p identity.Profile
	if err := json.Unmarshal(data, &p); err != nil {
		return identity.Profile{}, err
	}

	return p, nil
}

// ListProfileIDs of known profiles.
func (s *Store) ListProfileIDs(ctx context.Context) ([]identity.ProfileID, error) {
	res, err := s.db.Query(query.Query{
		Prefix:   s.profilesKey.String(),
		KeysOnly: true,
	})
	if err != nil {
		return nil, err
	}

	entries, err := res.Rest()
	if err != nil {
		return nil, err
	}

	out := make([]identity.ProfileID, len(entries))
	for i, e := range entries {
		_ = out
		_ = i
		fmt.Println(e.Key)
	}

	panic("not implemented")

	return nil, nil
}

// CurrentProfile returns current user's profile.
func (s *Store) CurrentProfile(ctx context.Context) (identity.Profile, error) {
	return s.pc.load()
}

type profileCache struct {
	filename string

	mu sync.Mutex
	p  identity.Profile
}

func (pc *profileCache) load() (identity.Profile, error) {
	pc.mu.Lock()
	defer pc.mu.Unlock()
	if pc.p.Account.ID.ID != "" {
		return pc.p, nil
	}

	f, err := os.Open(pc.filename)
	if err != nil {
		return identity.Profile{}, fmt.Errorf("failed to load profile: %w", err)
	}
	defer f.Close()

	if err := json.NewDecoder(f).Decode(&pc.p); err != nil {
		return identity.Profile{}, fmt.Errorf("failed to decode json profile: %w", err)
	}

	if pc.p.Account.ID.ID == "" {
		return identity.Profile{}, errors.New("profile is not initialized")
	}

	return pc.p, nil
}

func (pc *profileCache) store(p identity.Profile) error {
	pc.mu.Lock()
	defer pc.mu.Unlock()

	f, err := os.Create(pc.filename)
	if err != nil {
		return fmt.Errorf("failed to create profile file: %w", err)
	}
	defer f.Close()

	enc := json.NewEncoder(f)
	enc.SetIndent("", "  ")

	if err := enc.Encode(p); err != nil {
		return fmt.Errorf("failed to encode json: %w", err)
	}

	pc.p = p

	return nil
}
