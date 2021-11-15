// Package model exposes overrides for autogenerated GraphQL models.
package model

import (
	"encoding/json"
	"errors"
	"io"
)

// // Satoshis implements the custom GraphQL scalar.
type Satoshis int64

// MarshalGQL implements the graphql.Marshaler interface found in
// gqlgen, allowing the type to be marshaled by gqlgen and sent over
// the wire.
func (b Satoshis) MarshalGQL(w io.Writer) {
	if err := json.NewEncoder(w).Encode(b); err != nil {
		panic(err)
	}
}

// UnmarshalGQL implements the graphql.Unmarshaler interface found in
// gqlgen, allowing the type to be received by a graphql client and unmarshaled.
func (b *Satoshis) UnmarshalGQL(v interface{}) error {
	check, ok := v.(json.Number)
	if !ok {
		return errors.New("BigInt must be a valid integer value")
	}

	conv, err := check.Int64()
	if err != nil {
		return err
	}

	*b = Satoshis(conv)

	return nil
}

// // LightningPaymentRequest implement the custom GraphQL scalar.
type LightningPaymentRequest string
