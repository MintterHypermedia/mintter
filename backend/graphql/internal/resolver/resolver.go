package resolver

import (
	"context"
	"mintter/backend/wallet"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

// Service declares the needed functionality for the Resolver to work. This is to avoid
// implementing domain business logic inside the resolver. Think if this abstraction is needed at all.
// But let's be careful, and not make the resolver be very aware of the intricacies of our domain logic.
type Service interface {
	InsertWallet(context.Context, string, string, string) (wallet.Wallet, error)
	ListWallets(context.Context) ([]wallet.Wallet, error)
	DeleteWallet(context.Context, string) error
	SetDefaultWallet(context.Context, string) (wallet.Wallet, error)
	RequestInvoice(context.Context, string, int64, *string) (string, error)
}

// Resolver is the root of the GraphQL API.
type Resolver struct {
	svc Service
}

// New creates a new Resolver.
func New(svc Service) *Resolver {
	return &Resolver{
		svc: svc,
	}
}
