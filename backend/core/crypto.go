package core

import (
	"crypto/ed25519"
	"crypto/rand"
	"encoding"
	"errors"
	"fmt"
	"unsafe"

	"github.com/ipfs/go-cid"
	"github.com/libp2p/go-libp2p/core/crypto"
	"github.com/libp2p/go-libp2p/core/peer"
	"github.com/multiformats/go-multihash"
)

// Multicodecs.
const (
	CodecDeviceKey = cid.Libp2pKey
	// TODO: need to register this codec withing the multicodecs repo table.
	CodecAccountKey = 1091161161
)

// Ensure interface implementations.
var (
	_ Verifier                 = PublicKey{}
	_ encoding.BinaryMarshaler = PublicKey{}

	_ Signer = KeyPair{}
)

// Meaningful errors.
var (
	ErrBadSignature = errors.New("bad signature")
)

// Signer signs data and produces cryptographic signature.
type Signer interface {
	Sign([]byte) (Signature, error)
	SignatureSize() int
}

// CIDer provides CID of an object.
type CIDer interface {
	CID() cid.Cid
}

// Verifier checks that signature corresponds to the data.
type Verifier interface {
	Verify(data []byte, s Signature) error
}

// Signature is a cryptographic signature of some piece of data.
type Signature []byte

func (s Signature) verify(k crypto.PubKey, data []byte) error {
	ok, err := k.Verify(data, s)
	if err != nil {
		return fmt.Errorf("%s: %w", err, ErrBadSignature)
	}

	if !ok {
		return ErrBadSignature
	}

	return nil
}

// KeyID is an ID of a Public Key. It has
// identical semantics as Libp2p's Peer ID.
type KeyID = peer.ID

// PublicKey is the public part of a KeyPair.
type PublicKey struct {
	k     *crypto.Ed25519PublicKey
	id    KeyID
	codec uint64

	abbrev uint64
}

// NewPublicKey creates a new public key from an existing Ed25519 public key.
func NewPublicKey(codec uint64, pub *crypto.Ed25519PublicKey) (pk PublicKey, err error) {
	pid, err := peer.IDFromPublicKey(pub)
	if err != nil {
		return pk, err
	}

	raw, err := pub.Raw()
	if err != nil {
		return pk, err
	}

	var b [8]byte
	if copy(b[:], raw) != 8 {
		panic("didn't copy 8 bytes for abbreviating public key")
	}

	return PublicKey{
		k:      pub,
		id:     pid,
		codec:  codec,
		abbrev: *(*uint64)(unsafe.Pointer(&b)),
	}, nil
}

// PublicKeyFromCID attempts to extract a public key from CID.
// This can only work with smaller keys like Ed25519.
func PublicKeyFromCID(c cid.Cid) (pk PublicKey, err error) {
	pid, err := peer.FromCid(c)
	if err != nil {
		return pk, err
	}

	pub, err := pid.ExtractPublicKey()
	if err != nil {
		return pk, err
	}

	return NewPublicKey(c.Prefix().Codec, pub.(*crypto.Ed25519PublicKey))
}

// ParsePublicKey parses existing libp2p-encoded key material.
func ParsePublicKey(codec uint64, data []byte) (pk PublicKey, err error) {
	pub, err := crypto.UnmarshalPublicKey(data)
	if err != nil {
		return pk, err
	}

	if pub.Type() != crypto.Ed25519 {
		return pk, fmt.Errorf("only ed25519 keys are supported")
	}

	return NewPublicKey(codec, pub.(*crypto.Ed25519PublicKey))
}

// Abbrev returns the abbreviated form of the public key,
// i.e. first 8 bytes of the key (or hash of the key).
func (pk PublicKey) Abbrev() uint64 {
	return pk.abbrev
}

// ID of the public key.
func (pk PublicKey) ID() KeyID { return pk.id }

// CID returns CID representation of the public key.
func (pk PublicKey) CID() cid.Cid {
	mh, err := multihash.Cast([]byte(pk.id))
	if err != nil {
		panic(err)
	}

	return cid.NewCidV1(pk.codec, mh)
}

// String creates string representation of the public key.
func (pk PublicKey) String() string {
	return pk.CID().String()
}

// Principal returns the principal representation of the public key.
func (pk PublicKey) Principal() Principal {
	return PrincipalFromPubKey(pk.k)
}

// Codec returns multicodec of the public key.
func (pk PublicKey) Codec() uint64 {
	return pk.codec
}

// Verify implements Verifier.
func (pk PublicKey) Verify(data []byte, s Signature) error {
	return s.verify(pk.k, data)
}

// MarshalBinary implements encoding.BinaryMarshaler.
func (pk PublicKey) MarshalBinary() ([]byte, error) {
	return crypto.MarshalPublicKey(pk.k)
}

// KeyPair is a wrapper libp2p crypto package, to provide some convenience function for
// encoding/decoding and other things, like having the public key pre-generated and cached
// instead of generating it with every method call like libp2p does. Also, libp2p cryptographic
// keys are interfaces, which makes unmarshaling into a zero-value variables impossible. E.g.
// you can't put a public key into a struct and then unmarshal the whole struct, because nil zero-value
// of the interface doesn't know how to unmarshal to a concrete type.
type KeyPair struct {
	k *crypto.Ed25519PrivateKey

	PublicKey
}

// NewKeyPairRandom creates a new random KeyPair with a given multicodec prefix.
func NewKeyPairRandom(codec uint64) (kp KeyPair, err error) {
	priv, _, err := crypto.GenerateEd25519Key(rand.Reader)
	if err != nil {
		return kp, fmt.Errorf("failed to generate device private key: %w", err)
	}

	return NewKeyPair(codec, priv.(*crypto.Ed25519PrivateKey))
}

// NewKeyPair creates a new KeyPair with a given multicodec prefix from an existing instance
// of the private key. At the moment only Ed25519 keys are supported.
func NewKeyPair(codec uint64, priv *crypto.Ed25519PrivateKey) (kp KeyPair, err error) {
	pub, err := NewPublicKey(codec, priv.GetPublic().(*crypto.Ed25519PublicKey))
	if err != nil {
		return kp, err
	}

	return KeyPair{
		k:         priv,
		PublicKey: pub,
	}, nil
}

// Sign implements Signer.
func (kp KeyPair) Sign(data []byte) (Signature, error) {
	return kp.k.Sign(data)
}

// SignatureSize returns the number of bytes that for the signature of this key type.
func (kp KeyPair) SignatureSize() int {
	switch kp.k.Type() {
	case crypto.Ed25519:
		return ed25519.SignatureSize
	case crypto.Secp256k1:
		panic("TODO: implement support for secp256k1")
	default:
		panic("BUG: unsupported key type")
	}
}

// Wrapped returns the wrapped libp2p key.
func (kp KeyPair) Wrapped() crypto.PrivKey {
	return kp.k
}
