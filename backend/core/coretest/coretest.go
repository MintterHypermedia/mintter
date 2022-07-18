// Package coretest provides testing utilities for core data types.
package coretest

import (
	"mintter/backend/core"

	"github.com/ipfs/go-cid"
	"github.com/libp2p/go-libp2p-core/crypto"
)

var fakeUsers = map[string]struct {
	Account []byte
	Device  []byte
}{
	"alice": {
		Account: []byte{8, 1, 18, 64, 250, 126, 64, 211, 185, 52, 213, 138, 129, 240, 49, 215, 8, 0, 143, 232, 142, 33, 34, 171, 16, 219, 41, 128, 102, 115, 188, 59, 39, 71, 124, 184, 234, 207, 90, 7, 190, 245, 13, 28, 12, 234, 139, 238, 38, 154, 82, 54, 239, 185, 155, 12, 144, 51, 65, 143, 172, 48, 165, 199, 34, 254, 25, 96},
		Device:  []byte{8, 1, 18, 64, 213, 232, 235, 251, 166, 90, 196, 40, 92, 6, 117, 221, 17, 45, 119, 64, 94, 176, 250, 246, 165, 166, 56, 72, 72, 99, 104, 15, 84, 187, 49, 22, 82, 65, 62, 253, 59, 94, 215, 195, 160, 66, 170, 155, 103, 56, 169, 247, 38, 144, 213, 227, 208, 241, 105, 186, 140, 149, 43, 218, 145, 69, 50, 135},
	},
	"bob": {
		Account: []byte{8, 1, 18, 64, 239, 61, 146, 110, 194, 138, 205, 79, 48, 26, 1, 87, 115, 7, 199, 114, 77, 59, 133, 221, 180, 222, 90, 251, 47, 142, 128, 130, 248, 146, 85, 247, 64, 73, 147, 66, 82, 131, 122, 186, 95, 234, 191, 116, 17, 28, 72, 149, 70, 143, 77, 127, 110, 61, 190, 95, 67, 2, 91, 82, 198, 87, 219, 111},
		Device:  []byte{8, 1, 18, 64, 209, 195, 195, 80, 169, 246, 177, 98, 57, 210, 159, 202, 188, 126, 192, 21, 115, 77, 203, 253, 186, 149, 117, 240, 237, 172, 228, 34, 78, 213, 240, 137, 215, 68, 78, 90, 99, 87, 96, 86, 34, 74, 120, 109, 243, 46, 255, 201, 171, 13, 122, 179, 182, 124, 227, 155, 155, 233, 13, 115, 18, 61, 74, 235},
	},
	"carol": {
		Account: []byte{8, 1, 18, 64, 16, 205, 244, 135, 138, 183, 103, 89, 187, 146, 155, 79, 127, 148, 224, 178, 157, 57, 171, 209, 26, 93, 160, 19, 113, 231, 90, 84, 97, 199, 48, 83, 154, 54, 33, 247, 94, 136, 217, 207, 62, 143, 174, 211, 120, 122, 78, 213, 19, 227, 7, 138, 234, 22, 204, 236, 193, 48, 150, 12, 133, 111, 135, 117},
		Device:  []byte{8, 1, 18, 64, 170, 177, 195, 250, 182, 30, 187, 136, 115, 176, 113, 7, 40, 26, 161, 138, 4, 220, 218, 180, 12, 33, 146, 20, 198, 16, 168, 235, 105, 118, 126, 82, 49, 29, 71, 232, 122, 167, 40, 196, 160, 108, 37, 130, 239, 178, 229, 118, 142, 78, 14, 202, 174, 173, 26, 248, 240, 61, 105, 125, 12, 79, 60, 61},
	},
	"derek": {
		Account: []byte{8, 1, 18, 64, 9, 144, 177, 144, 191, 160, 70, 204, 47, 27, 253, 106, 52, 65, 165, 215, 18, 138, 115, 31, 133, 242, 30, 12, 170, 133, 63, 117, 165, 90, 205, 227, 30, 11, 158, 207, 15, 9, 201, 208, 127, 188, 82, 5, 62, 44, 128, 80, 36, 75, 8, 206, 115, 130, 35, 189, 118, 205, 6, 95, 29, 66, 231, 95},
		Device:  []byte{8, 1, 18, 64, 213, 180, 8, 59, 161, 75, 15, 92, 212, 94, 225, 82, 81, 11, 32, 200, 62, 46, 190, 105, 121, 14, 176, 107, 195, 113, 153, 176, 198, 163, 215, 226, 79, 46, 215, 228, 133, 153, 14, 142, 52, 115, 21, 73, 202, 121, 204, 223, 53, 117, 164, 225, 248, 106, 231, 151, 180, 246, 107, 137, 227, 212, 98, 140},
	},
}

// Tester is a fake test user with full identity.
type Tester struct {
	AccountID cid.Cid
	DeviceID  cid.Cid

	Device  core.KeyPair
	Account core.KeyPair

	Identity core.Identity
}

// NewTester creates a new Tester with a given name. Data should exist
// in fakeUsers map for the name.
func NewTester(name string) Tester {
	fake, ok := fakeUsers[name]
	if !ok {
		panic("no test user with name " + name)
	}

	dpriv, err := crypto.UnmarshalPrivateKey(fake.Device)
	if err != nil {
		panic(err)
	}

	dev, err := core.NewKeyPair(core.CodecDeviceKey, dpriv.(*crypto.Ed25519PrivateKey))
	if err != nil {
		panic(err)
	}

	apriv, err := crypto.UnmarshalPrivateKey(fake.Account)
	if err != nil {
		panic(err)
	}

	acc, err := core.NewKeyPair(core.CodecAccountKey, apriv.(*crypto.Ed25519PrivateKey))
	if err != nil {
		panic(err)
	}

	return Tester{
		AccountID: acc.CID(),
		DeviceID:  dev.CID(),

		Device:  dev,
		Account: acc,

		Identity: core.NewIdentity(acc.PublicKey, dev),
	}
}
