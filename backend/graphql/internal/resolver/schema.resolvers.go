package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"mintter/backend/graphql/internal/generated"
	"mintter/backend/graphql/internal/model"
	"mintter/backend/lndhub"
	"strings"
	"time"
)

// Wallets is the resolver for the wallets field.
func (r *meResolver) Wallets(ctx context.Context, obj *generated.Me) ([]generated.LightningWallet, error) {
	wallets, err := r.svc.ListWallets(ctx)
	ret := []generated.LightningWallet{}

	if err != nil {
		return ret, err
	}
	defaultWallet, err := r.svc.GetDefaultWallet(ctx)
	if err != nil {
		return ret, err
	}

	for _, w := range wallets {
		ret = append(ret, generated.LndHubWallet{
			ID:          w.ID,
			APIURL:      w.Address,
			Name:        w.Name,
			BalanceSats: model.Satoshis(w.Balance),
			IsDefault:   w.ID == defaultWallet.ID,
		})
	}

	return ret, nil
}

// Lnaddress is the resolver for the lnaddress field.
func (r *meResolver) Lnaddress(ctx context.Context, obj *generated.Me) (*string, error) {
	lnaddress, err := r.svc.GetLnAddress(ctx)
	if err != nil {
		return nil, err
	}
	return &lnaddress, nil
}

// SetupLndHubWallet is the resolver for the setupLndHubWallet field.
func (r *mutationResolver) SetupLndHubWallet(ctx context.Context, input generated.SetupLndHubWalletInput) (*generated.SetupLndHubWalletPayload, error) {
	lndhubWallet, err := r.svc.InsertWallet(ctx, input.URL, input.Name)
	if err != nil {
		return nil, err
	}

	return &generated.SetupLndHubWalletPayload{
		Wallet: &generated.LndHubWallet{
			APIURL:      lndhubWallet.Address,
			Name:        lndhubWallet.Name,
			BalanceSats: model.Satoshis(lndhubWallet.Balance),
			ID:          lndhubWallet.ID,
		},
	}, nil
}

// SetDefaultWallet is the resolver for the setDefaultWallet field.
func (r *mutationResolver) SetDefaultWallet(ctx context.Context, input generated.SetDefaultWalletInput) (*generated.SetDefaultWalletPayload, error) {
	defaultWallet, err := r.svc.SetDefaultWallet(ctx, input.ID)
	if err != nil {
		return nil, err
	}

	return &generated.SetDefaultWalletPayload{
		Wallet: &generated.LndHubWallet{
			APIURL:      defaultWallet.Address,
			Name:        defaultWallet.Name,
			BalanceSats: model.Satoshis(defaultWallet.Balance),
			ID:          defaultWallet.ID,
		},
	}, nil
}

// UpdateWallet is the resolver for the updateWallet field.
func (r *mutationResolver) UpdateWallet(ctx context.Context, input generated.UpdateWalletInput) (*generated.UpdateWalletPayload, error) {
	newWallet, err := r.svc.UpdateWalletName(ctx, input.ID, input.Name)
	if err != nil {
		return nil, err
	}

	return &generated.UpdateWalletPayload{
		Wallet: &generated.LndHubWallet{
			APIURL:      newWallet.Address,
			Name:        newWallet.Name,
			BalanceSats: model.Satoshis(newWallet.Balance),
			ID:          newWallet.ID,
		},
	}, nil
}

// DeleteWallet is the resolver for the deleteWallet field.
func (r *mutationResolver) DeleteWallet(ctx context.Context, input generated.DeleteWalletInput) (*generated.DeleteWalletPayload, error) {
	if err := r.svc.DeleteWallet(ctx, input.ID); err != nil {
		return nil, err
	}

	return &generated.DeleteWalletPayload{ID: input.ID}, nil
}

// ExportWallet is the resolver for the exportWallet field.
func (r *mutationResolver) ExportWallet(ctx context.Context, input generated.ExportWalletInput) (*generated.ExportWalletPayload, error) {
	uri, err := r.svc.ExportWallet(ctx, input.ID)
	if err != nil {
		return &generated.ExportWalletPayload{}, err
	}
	return &generated.ExportWalletPayload{Credentials: uri}, nil
}

// RequestInvoice is the resolver for the requestInvoice field.
func (r *mutationResolver) RequestInvoice(ctx context.Context, input generated.RequestInvoiceInput) (*generated.RequestInvoicePayload, error) {
	lnaddress := strings.Split(input.User, "@")
	if len(lnaddress) == 2 && !strings.Contains(lnaddress[1], "mintter") {
		return nil, fmt.Errorf("currently only supported mintter lndaddress")
	}
	payReq, err := r.svc.RequestRemoteInvoice(ctx, lnaddress[0], int64(input.AmountSats), input.Memo)
	if err != nil {
		return nil, err
	}
	return &generated.RequestInvoicePayload{PaymentRequest: model.LightningPaymentRequest(payReq)}, nil
}

// PayInvoice is the resolver for the payInvoice field.
func (r *mutationResolver) PayInvoice(ctx context.Context, input generated.PayInvoiceInput) (*generated.PayInvoicePayload, error) {
	var amount uint64
	if input.AmountSats != nil {
		amount = uint64(*input.AmountSats)
	} else {
		amount = 0
	}

	walletID, err := r.svc.PayInvoice(ctx, string(input.PaymentRequest), input.WalletID, &amount)
	if err != nil {
		return nil, err
	}

	return &generated.PayInvoicePayload{
		WalletID: walletID,
	}, nil
}

// UpdateNickname is the resolver for the updateNickname field.
func (r *mutationResolver) UpdateNickname(ctx context.Context, input generated.UpdateNicknameInput) (*generated.UpdateNicknamePayload, error) {
	return &generated.UpdateNicknamePayload{Nickname: input.Nickname}, r.svc.UpdateLnaddressNickname(ctx, input.Nickname)
}

// Me is the resolver for the me field.
func (r *queryResolver) Me(ctx context.Context) (*generated.Me, error) {
	return &generated.Me{}, nil
}

// Payments is the resolver for the payments field.
func (r *queryResolver) Payments(ctx context.Context, walletID string, excludeUnpaid *bool, excludeKeysend *bool, excludeExpired *bool) (*generated.Payments, error) {
	var ret generated.Payments
	received, err := r.svc.ListReceivednvoices(ctx, walletID)
	if err != nil {
		return &ret, err
	}
	sent, err := r.svc.ListPaidInvoices(ctx, walletID)
	if err != nil {
		return &ret, err
	}
	validRxInvoices := make([]lndhub.Invoice, len(received))
	for i, invoice := range received {
		incInvoice := false
		if excludeExpired != nil && *excludeExpired {
			expiresAt, err := time.Parse(time.RFC3339, invoice.ExpiresAt)
			if err != nil {
				return &ret, fmt.Errorf("Can't parse expiration date. %s", err.Error())
			}
			incInvoice = time.Until(expiresAt) > 0
		}
		if (excludeUnpaid == nil || (excludeUnpaid != nil && !*excludeUnpaid) || (excludeUnpaid != nil && *excludeUnpaid && invoice.IsPaid)) &&
			(excludeKeysend == nil || (excludeKeysend != nil && !*excludeKeysend) || (excludeKeysend != nil && *excludeKeysend && invoice.Keysend)) &&
			(excludeExpired == nil || (excludeExpired != nil && !*excludeExpired) || incInvoice) {
			validRxInvoices[i] = invoice // otherwise the address is always the same
			ret.Received = append(ret.Received, &generated.Invoice{
				PaymentHash:     &validRxInvoices[i].PaymentHash,
				PaymentRequest:  &validRxInvoices[i].PaymentRequest,
				Description:     &validRxInvoices[i].Description,
				DescriptionHash: &validRxInvoices[i].Description,
				PaymentPreimage: &validRxInvoices[i].PaymentHash,
				Destination:     &validRxInvoices[i].Destination,
				Amount:          model.Satoshis(validRxInvoices[i].Amount),
				Fee:             (*model.Satoshis)(&validRxInvoices[i].Fee),
				Status:          &validRxInvoices[i].Status,
				Type:            &validRxInvoices[i].Type,
				ErrorMessage:    &validRxInvoices[i].ErrorMessage,
				SettledAt:       &validRxInvoices[i].SettledAt,
				ExpiresAt:       &validRxInvoices[i].ExpiresAt,
				IsPaid:          &validRxInvoices[i].IsPaid,
				Keysend:         &validRxInvoices[i].Keysend,
			})
		}
	}
	validTxInvoices := make([]lndhub.Invoice, len(sent))
	for i, invoice := range sent {
		incInvoice := false
		if excludeExpired != nil && *excludeExpired {
			expiresAt, err := time.Parse(time.RFC3339, invoice.ExpiresAt)
			if err != nil {
				return &ret, fmt.Errorf("Can't parse expiration date. %s", err.Error())
			}
			incInvoice = time.Until(expiresAt) > 0
		}
		if (excludeUnpaid == nil || (excludeUnpaid != nil && !*excludeUnpaid) || (excludeUnpaid != nil && *excludeUnpaid && invoice.IsPaid)) &&
			(excludeKeysend == nil || (excludeKeysend != nil && !*excludeKeysend) || (excludeKeysend != nil && *excludeKeysend && invoice.Keysend)) &&
			(excludeExpired == nil || (excludeExpired != nil && !*excludeExpired) || incInvoice) {
			validTxInvoices[i] = invoice // otherwise the address is always the same
			ret.Sent = append(ret.Sent, &generated.Invoice{
				PaymentHash:     &validTxInvoices[i].PaymentHash,
				PaymentRequest:  &validTxInvoices[i].PaymentRequest,
				Description:     &validTxInvoices[i].Description,
				DescriptionHash: &validTxInvoices[i].Description,
				PaymentPreimage: &validTxInvoices[i].PaymentHash,
				Destination:     &validTxInvoices[i].Destination,
				Amount:          model.Satoshis(validTxInvoices[i].Amount),
				Fee:             (*model.Satoshis)(&validTxInvoices[i].Fee),
				Status:          &validTxInvoices[i].Status,
				Type:            &validTxInvoices[i].Type,
				ErrorMessage:    &validTxInvoices[i].ErrorMessage,
				SettledAt:       &validTxInvoices[i].SettledAt,
				ExpiresAt:       &validTxInvoices[i].ExpiresAt,
				IsPaid:          &validTxInvoices[i].IsPaid,
				Keysend:         &validTxInvoices[i].Keysend,
			})
		}
	}
	return &ret, nil
}

// Me returns generated.MeResolver implementation.
func (r *Resolver) Me() generated.MeResolver { return &meResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type meResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
