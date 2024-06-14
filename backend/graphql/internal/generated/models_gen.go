// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package generated

import (
	"seed/backend/graphql/internal/model"
)

// Common interface for Lightning wallets. We support different types.
type LightningWallet interface {
	IsLightningWallet()
	// Globally unique ID of the wallet. Public key.
	GetID() string
	// Local-only name of the wallet. For user's convenience.
	GetName() string
	// Balance in Satoshis.
	GetBalanceSats() model.Satoshis
	// If this wallet is the default wallet to send/receive automatic payments
	GetIsDefault() bool
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

// Input to export a wallet.
type ExportWalletInput struct {
	// ID of the wallet to be exported. If empty, the built-in wallet will be exported.
	ID string `json:"id"`
}

// Response after exporting a wallet.
type ExportWalletPayload struct {
	// credentials of the exported wallet.
	Credentials string `json:"credentials"`
}

// Input to export a wallet.
type ImportWalletInput struct {
	// Local name for this wallet.
	Name string `json:"name"`
	// Credential string to connect to imported wallet service.
	URL string `json:"url"`
}

// Response after exporting a wallet.
type ImportWalletPayload struct {
	// Stored wallet.
	Wallet LightningWallet `json:"wallet"`
}

// Lightning Invoices
type Invoice struct {
	// Preimage hash of the payment.
	PaymentHash *string `json:"PaymentHash"`
	// Bolt-11 encoded invoice.
	PaymentRequest *string `json:"PaymentRequest"`
	// Memo field of the invoice.
	Description *string `json:"Description"`
	// Memo hash in case its too long
	DescriptionHash *string `json:"DescriptionHash"`
	// Invoice secret known at settlement. Proof of payment
	PaymentPreimage *string `json:"PaymentPreimage"`
	// Payee lightning node ID.
	Destination *string `json:"Destination"`
	// Invoice quantity in satoshis.
	Amount model.Satoshis `json:"Amount"`
	// Fees incurred by the payer when paying the invoice
	Fee *model.Satoshis `json:"Fee"`
	// Status of the invoice. (Settled, in-flight, expired, ...)
	Status *string `json:"Status"`
	// Invoice tyoe
	Type *string `json:"Type"`
	// Error of the invoice
	ErrorMessage *string `json:"ErrorMessage"`
	// Settlement date
	SettledAt *string `json:"SettledAt"`
	// Expiring date.
	ExpiresAt *string `json:"ExpiresAt"`
	// If the invoice has been paid or not.
	IsPaid *bool `json:"IsPaid"`
	// Whether or not this is a made up invoice corrensponding with a keysend payment
	Keysend *bool `json:"Keysend"`
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
	// If this wallet is the default wallet to send/receive automatic payments
	IsDefault bool `json:"isDefault"`
}

func (LndHubWallet) IsLightningWallet() {}

// Globally unique ID of the wallet. Public key.
func (this LndHubWallet) GetID() string { return this.ID }

// Local-only name of the wallet. For user's convenience.
func (this LndHubWallet) GetName() string { return this.Name }

// Balance in Satoshis.
func (this LndHubWallet) GetBalanceSats() model.Satoshis { return this.BalanceSats }

// If this wallet is the default wallet to send/receive automatic payments
func (this LndHubWallet) GetIsDefault() bool { return this.IsDefault }

// Information about the current user.
type Me struct {
	// List configured Lightning wallets.
	Wallets []LightningWallet `json:"wallets"`
	// Account-wide Lightning addres (lnaddress)
	Lnaddress *string `json:"lnaddress"`
}

// Input to pay an invoice.
type PayInvoiceInput struct {
	// Previously obtained payment request we want to pay for.
	PaymentRequest model.LightningPaymentRequest `json:"paymentRequest"`
	// Optional amount in satoshis to pay. In case this is not defined,
	// The amount showed in the invoice will be paid. If amountSats is
	// provided, then the invoice amount will be override. This will cause
	// an error unless both amounts are the same or the invoice amount is 0.
	AmountSats *model.Satoshis `json:"amountSats"`
	// Optional ID of the wallet to pay with. Otherwise the default one will be used.
	WalletID *string `json:"walletID"`
}

// Response after paying an invoice.
type PayInvoicePayload struct {
	// Wallet ID that was used to pay the invoice.
	WalletID string `json:"walletID"`
}

// Information about payments
type Payments struct {
	// Payments made. They can be unconfirmed
	Sent []*Invoice `json:"sent"`
	// Payments received. They can be unconfirmed
	Received []*Invoice `json:"received"`
}

// Input for requesting an invoice.
type RequestInvoiceInput struct {
	// Mintter Account ID or lnaddress we want the invoice from. Can be ourselves.
	User string `json:"user"`
	// Amount in Satoshis the invoice should be created for.
	AmountSats model.Satoshis `json:"amountSats"`
	// Optional description for the invoice.
	Memo *string `json:"memo"`
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

// Input to update lnaddress' nickname.
type UpdateNicknameInput struct {
	// New nickname to update.
	Nickname string `json:"nickname"`
}

// Response after updating the nickname.
type UpdateNicknamePayload struct {
	// Updated Nickname.
	Nickname string `json:"nickname"`
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
