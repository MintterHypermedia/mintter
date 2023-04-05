package vcs

import (
	"fmt"
	"mintter/backend/core"
	"mintter/backend/ipfs"
	"mintter/backend/vcs/hlc"
	"sort"

	blocks "github.com/ipfs/go-block-format"
	"github.com/ipfs/go-cid"
	cbornode "github.com/ipfs/go-ipld-cbor"
	"github.com/libp2p/go-libp2p/core/crypto"
	"github.com/libp2p/go-libp2p/core/peer"
)

// Change kinds.
const (
	ChangeKindV1 = "mintter.vcsdb.v1"
)

// ChangeType is the object type for Change.
const ChangeType ObjectType = "https://schema.mintter.org/Change"

func init() {
	cbornode.RegisterCborType(Change{})
}

// ChangeInfo is the metadata of the Change.
type ChangeInfo struct {
	Object    cid.Cid        `refmt:"object"`
	Author    cid.Cid        `refmt:"author"` // TODO: should this be a DID instead?
	Parents   []cid.Cid      `refmt:"parents,omitempty"`
	Kind      string         `refmt:"kind"`
	Message   string         `refmt:"message,omitempty"`
	Time      hlc.Time       `refmt:"time"`             // Hybrid Logical Timestamp.
	Signer    cid.Cid        `refmt:"signer,omitempty"` // CID-formatter Libp2p key.
	Signature core.Signature `refmt:"signature,omitempty"`
}

// Change is the one of the foundational concepts of Mintter VCS.
// If a Permanode "instantiates" a Mintter Object, a Change mutates the corresponding object.
// Future changes depend on previous changes, forming a DAG (directed acyclic graph).
type Change struct {
	ChangeInfo
	Type ObjectType `refmt:"@type"`
	Body []byte     `refmt:"body"`
}

// NewChange creates a new signed change.
// This function will sort the deps slice in place.
func NewChange(me core.Identity, obj cid.Cid, deps []cid.Cid, kind string, ts hlc.Time, body []byte) Change {
	if deps != nil {
		sort.Slice(deps, func(i, j int) bool {
			ii := deps[i].KeyString()
			jj := deps[j].KeyString()
			return ii < jj
		})
	}

	ch := Change{
		Type: ChangeType,
		ChangeInfo: ChangeInfo{
			Object:  obj,
			Author:  me.AccountID(),
			Parents: deps,
			Kind:    kind,
			// TODO(burdiyan): message
			Time:   ts,
			Signer: me.DeviceKey().PublicKey.CID(),
		},
		Body: body,
	}

	return ch.Sign(me.DeviceKey())
}

// Block encodes the change into the IPFS block.
func (ch Change) Block() (vc VerifiedChange, err error) {
	data, err := cbornode.DumpObject(ch)
	if err != nil {
		return vc, fmt.Errorf("failed to encode change block: %w", err)
	}

	blk := ipfs.NewBlock(cid.DagCBOR, data)
	vc = VerifiedChange{
		Block:   blk,
		Decoded: ch,
	}

	return vc, nil
}

// Less defines total order among changes.
func (ch Change) Less(other Change) bool {
	if ch.Time.Equal(other.Time) {
		return ch.Signer.KeyString() < other.Signer.KeyString()
	}

	return ch.Time.Before(other.Time)
}

// Sign the change with a given key.
// The returned copy will contain the signature.
func (ch Change) Sign(k signer) Change {
	if !ch.Signer.Defined() {
		ch.Signer = k.CID()
	}

	if !ch.Signer.Equals(k.CID()) {
		panic("BUG: change signer doesn't match the provided key")
	}

	if ch.Signature != nil {
		panic("BUG: change is already signed")
	}

	sig, err := k.Sign(ch.signingBytes())
	if err != nil {
		panic(err)
	}

	ch.Signature = sig

	return ch
}

// Verify signature of a Change.
func (ch Change) Verify() error {
	pid, err := peer.FromCid(ch.Signer)
	if err != nil {
		return err
	}

	key, err := pid.ExtractPublicKey()
	if err != nil {
		return fmt.Errorf("failed to extract public key for signer: %w", err)
	}

	pk, err := core.NewPublicKey(core.CodecDeviceKey, key.(*crypto.Ed25519PublicKey))
	if err != nil {
		return err
	}

	return pk.Verify(ch.signingBytes(), ch.Signature)
}

type signer interface {
	core.Signer
	core.CIDer
}

func (ch Change) signingBytes() []byte {
	if !ch.Signer.Defined() {
		panic("BUG: signer is not defined")
	}
	ch.Signature = nil

	data, err := cbornode.DumpObject(ch)
	if err != nil {
		panic(err)
	}

	return data
}

// DecodeChange from its byte representation.
// It doesn't verify the signature, or anything else.
func DecodeChange(data []byte) (out Change, err error) {
	// Decode into tuple representation.
	// Process each datom.
	// Convert into datoms representation.
	// It's similar to json.RawMessage

	if err := cbornode.DecodeInto(data, &out); err != nil {
		return out, fmt.Errorf("failed to parse change data: %w", err)
	}

	return out, nil
}

// VerifiedChange is a change with a verified signature.
type VerifiedChange struct {
	blocks.Block

	Decoded Change
}

// VerifyChangeBlock ensures that a signature of a change IPLD block is valid.
func VerifyChangeBlock(blk blocks.Block) (vc VerifiedChange, err error) {
	c, err := DecodeChange(blk.RawData())
	if err != nil {
		return vc, err
	}

	if err := c.Verify(); err != nil {
		return vc, fmt.Errorf("failed to verify change %s: %w", blk.Cid(), err)
	}

	return VerifiedChange{Block: blk, Decoded: c}, nil
}
