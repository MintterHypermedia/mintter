// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package generated

import (
	"mintter/backend/graphql/internal/model"
)

// Common interface for Lightning wallets. We support different types.
type LightningWallet interface {
	IsLightningWallet()
}

// Input to delete a wallet.
type DeleteWalletInput struct {
	// ID of the wallet to be deleted.
	ID string `json:"id"`
}

// Response after deleting a wallet.
type DeleteWalletPayload struct {
	// ID of the deleted wallet.
	ID string `json:"id"`
}

// Lightning wallet compatible with LndHub.
type LndHubWallet struct {
	// Globally unique ID of the wallet. Since this type of wallet doesn't have unique addresses
	// we decided to use the cryptographic hash of the credentials URL as an ID.
	ID string `json:"id"`
	// URL of the LndHub server this wallet is connected to.
	APIURL string `json:"apiURL"`
	// Name of the wallet.
	Name string `json:"name"`
	// Balance in Satoshis.
	BalanceSats model.Satoshis `json:"balanceSats"`
}

func (LndHubWallet) IsLightningWallet() {}

// Information about the current user.
type Me struct {
	// List configured Lightning wallets.
	Wallets []LightningWallet `json:"wallets"`
}

// Input to pay an invoice.
type PayInvoiceInput struct {
	// Previously obtained payment request we want to pay for.
	PaymentRequest model.LightningPaymentRequest `json:"paymentRequest"`
	// Optional ID of the wallet to pay with. Otherwise the default one will be used.
	WalletID *string `json:"walletID"`
}

// Response after paying an invoice.
type PayInvoicePayload struct {
	// Wallet ID that was used to pay the invoice.
	WalletID string `json:"walletID"`
}

// Input for requesting an invoice for tipping.
type RequestInvoiceInput struct {
	// Mintter Account ID we want to tip.
	AccountID string `json:"accountID"`
	// Amount in Satoshis the invoice should be created for.
	AmountSats model.Satoshis `json:"amountSats"`
	// Optional ID of the publication we want to tip for.
	PublicationID *string `json:"publicationID"`
}

// Response with the invoice to pay.
type RequestInvoicePayload struct {
	// Payment request is a string-encoded Lightning Network Payment Request.
	// It's ready to be used in a wallet app to pay.
	PaymentRequest model.LightningPaymentRequest `json:"paymentRequest"`
}

// Input for setting the default wallet.
type SetDefaultWalletInput struct {
	// ID of the wallet to become the default one.
	ID string `json:"id"`
}

// Response after setting default wallet.
type SetDefaultWalletPayload struct {
	// The new default wallet.
	Wallet LightningWallet `json:"wallet"`
}

// Input to setup LndHub wallet.
type SetupLndHubWalletInput struct {
	// Local name for this wallet.
	Name string `json:"name"`
	// Configuration URL with credentials for an LndHub wallet.
	URL string `json:"url"`
}

// Response from setting up LndHub wallet.
type SetupLndHubWalletPayload struct {
	// The newly created wallet.
	Wallet *LndHubWallet `json:"wallet"`
}

// Input to update Lightning wallets.
type UpdateWalletInput struct {
	// ID of the wallet to be updated.
	ID string `json:"id"`
	// New name for the wallet.
	Name string `json:"name"`
}

// Response with the updated wallet.
type UpdateWalletPayload struct {
	// Updated wallet.
	Wallet LightningWallet `json:"wallet"`
}
