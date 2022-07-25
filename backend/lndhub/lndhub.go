package lndhub

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"github.com/btcsuite/btcd/chaincfg"
	"github.com/lightningnetwork/lnd/zpay32"
	"github.com/mitchellh/mapstructure"
)

const (
	createRoute        = "/v2/create" // v2 is the one created by our fork
	balanceRoute       = "/balance"
	authRoute          = "/auth"
	createInvoiceRoute = "/addinvoice"
	payInvoiceRoute    = "/payinvoice"
	decodeInvoiceRoute = "/decodeinvoice" // Not used, using internal LND decoder instead
	getInvoiceRoute    = "/getuserinvoice"
	LndhubWalletType   = "lndhub"
	LndhubGoWalletType = "lndhub.go"
	IDSalt             = "salted URL to ID CeIirxsuTMZz9h1e"
)

var (
	validCredentials = regexp.MustCompile(`([A-Za-z0-9_\-\.]+):\/\/([0-9a-z]+):([0-9a-f]+)@(https:\/\/[A-Za-z0-9_\-\.]+)\/?$`)
)

type httpRequest struct {
	URL     string      // The url endpoint where the rest api is located
	Method  string      // POST and GET supported
	Token   string      // Authorization token to be inserted in the header
	Payload interface{} // In POST method, the body of the request as a struct
}
type lndhubErrorTemplate struct {
	Error   bool   `mapstructure:"error"`
	Code    int    `mapstructure:"code"`
	Message string `mapstructure:"message"`
}

type Client struct {
	http *http.Client
}

type Credentials struct {
	ConnectionURL string `json:"connectionURL"`
	WalletType    string `json:"wallettype"`
	Login         string `json:"login"`
	Password      string `json:"password"`
	Nickname      string `json:"nickname,omitempty"`
	Token         string `json:"token,omitempty"`
	ID            string `json:"id,omitempty"`
}

type CreateResponse struct {
	Login    string `mapstructure:"login"`
	Password string `mapstructure:"password"`
	Nickname string `mapstructure:"nickname"`
}

func NewClient(h *http.Client) *Client {
	return &Client{
		http: h,
	}
}

// The constructor takes a credential string of the form
// <wallet_type>://<alphanumeric_login>:<alphanumeric_password>@https://<domain>
// lndhub://c227a7fb5c71a22fac33:d2a48ab779aa1b02e858@https://lndhub.io
func DecodeCredentialsURL(url string) (Credentials, error) {
	credentials := Credentials{}

	res := validCredentials.FindStringSubmatch(url)
	if res == nil || len(res) != 5 {
		if res != nil {
			return credentials, fmt.Errorf("credentials contained more than necessary fields. it shoud be " +
				"<wallet_type>://<alphanumeric_login>:<alphanumeric_password>@https://<domain>")
		}
		return credentials, fmt.Errorf("couldn't parse credentials, probalby wrong format. it shoud be " +
			"<wallet_type>://<alphanumeric_login>:<alphanumeric_password>@https://<domain>")

	}
	credentials.WalletType = strings.ToLower(res[1])
	credentials.Login = res[2]
	credentials.Password = res[3]
	credentials.ConnectionURL = res[4]
	credentials.ID = Url2Id(url)
	return credentials, nil

}

// Url2Id constructs a unique and collision-free ID out of a credentials URL
func Url2Id(url string) string {
	h := hmac.New(sha256.New, []byte(IDSalt))
	h.Write([]byte(url))
	return hex.EncodeToString(h.Sum(nil))
}

// EncodeCredentialsURL generates a credential URL out of credential parameters.
// the resulting url will have this format
// <wallet_type>://<alphanumeric_login>:<alphanumeric_password>@https://<domain>
func EncodeCredentialsURL(creds Credentials) (string, error) {
	url := creds.WalletType + "://" + creds.Login + ":" + creds.Password + "@https://" + creds.ConnectionURL
	_, err := DecodeCredentialsURL(url)
	return url, err
}

// Try to get authorized with the provided user and password. Returns
// access_token , error (if any)
func (c *Client) Auth(ctx context.Context, creds Credentials) (string, error) {
	type authResponse struct {
		AccessToken string `mapstructure:"access_token"`
	}

	type authRequest struct {
		Login    string `json:"login"`
		Password string `json:"password"`
	}

	var resp authResponse

	err := c.do(ctx, httpRequest{
		URL:    creds.ConnectionURL + authRoute,
		Method: http.MethodPost,
		Payload: authRequest{
			Login:    creds.Login,
			Password: creds.Password,
		},
	}, &resp)

	return resp.AccessToken, err
}

// Creates an account or changes the nickname on already created one. If the login is a CID, then the password must
// be the signature of the message 'sign in into mintter lndhub' and the token the pubkey whose private counterpart
// was used to sign the password. If login is not a CID, then there is no need for the token and password can be
// anything. Nickname can be anything in both cases as long as it's unique across all mintter lndhub users (it will
// fail otherwise).
func (c *Client) Create(ctx context.Context, creds Credentials) (CreateResponse, error) {

	type createRequest struct {
		Login    string `json:"login"`
		Password string `json:"password"`
		Nickname string `json:"nickname"`
	}
	var resp CreateResponse

	if creds.WalletType != LndhubGoWalletType {
		return resp, fmt.Errorf("Create only supports %s wallet type", LndhubGoWalletType)
	}

	err := c.do(ctx, httpRequest{
		URL:    creds.ConnectionURL + createRoute,
		Method: http.MethodPost,
		Payload: createRequest{
			Login:    creds.Login,    // CID
			Password: creds.Password, // signed message
			Nickname: creds.Nickname,
		},
		Token: creds.Token, // this token should be in reality the pubkey whose private counterpart was used to sign the password
	}, &resp)

	return resp, err
}

// Get the confirmed balance in satoshis of the account
func (c *Client) GetBalance(ctx context.Context, creds Credentials) (uint64, error) {
	type btcBalance struct {
		Sats uint64 `mapstructure:"AvailableBalance"`
	}
	type balanceResponse struct {
		Btc btcBalance `mapstructure:"BTC"`
	}

	var resp balanceResponse

	err := c.do(ctx, httpRequest{
		URL:    creds.ConnectionURL + balanceRoute,
		Method: http.MethodGet,
		Token:  creds.Token,
	}, &resp)
	return resp.Btc.Sats, err

}

// This function creates an invoice of amount sats (in satoshis). zero amount invoices
// are not supported, so make sure amount > 0.We also accept a short memo or description of
// purpose of payment, to attach along with the invoice. The generated invoice
// will have an expiration time of 24 hours and a random preimage
func (c *Client) CreateInvoice(ctx context.Context, creds Credentials, amount int64, memo string) (string, error) {
	type createInvoiceRequest struct {
		Amt  int64  `json:"amt"`
		Memo string `json:"memo"`
	}

	type createInvoiceResponse struct {
		PayReq string `mapstructure:"payment_request"`
	}

	var resp createInvoiceResponse

	err := c.do(ctx, httpRequest{
		URL:    creds.ConnectionURL + createInvoiceRoute,
		Method: http.MethodPost,
		Token:  creds.Token,
		Payload: createInvoiceRequest{
			Amt:  amount,
			Memo: memo,
		},
	}, &resp)

	return resp.PayReq, err
}

// This function decodes a BOLT-11 invoice in text format. It uses the lnd functions to do it.
func DecodeInvoice(payReq string) (*zpay32.Invoice, error) {
	decodedInvoice, err := zpay32.Decode(payReq, &chaincfg.MainNetParams)
	if err != nil {
		return nil, err
	}
	return decodedInvoice, nil

}

// PayInvoice tries to pay the invoice provided. With the amount provided in satoshis. The
// enconded amount in the invoice should match the provided amount as a double check in case
// the amount on the invoice is different than 0.
func (c *Client) PayInvoice(ctx context.Context, creds Credentials, payReq string, sats uint64) error {
	if invoice, err := DecodeInvoice(payReq); err != nil {
		return nil
	} else if uint64(invoice.MilliSat.ToSatoshis()) != 0 && uint64(invoice.MilliSat.ToSatoshis()) != sats {
		return fmt.Errorf("amount mismatch. Invoice amt is " + invoice.MilliSat.ToSatoshis().String() +
			" and provided amount is " + strconv.FormatInt(int64(sats), 10) + " sats")
	}

	type payInvoiceRequest struct {
		Invoice string `json:"invoice"`
		Amount  uint64 `json:"amount"`
	}

	err := c.do(ctx, httpRequest{
		URL:    creds.ConnectionURL + payInvoiceRoute,
		Method: http.MethodPost,
		Token:  creds.Token,
		Payload: payInvoiceRequest{
			Invoice: payReq,
			Amount:  sats,
		},
	}, nil)

	return err

}

func (c *Client) do(ctx context.Context, request httpRequest, respValue interface{}) error {
	var bodyRaw io.Reader
	var genericResponse map[string]interface{}
	var errorRes lndhubErrorTemplate
	if request.Payload != nil && request.Method != http.MethodGet {
		buf := &bytes.Buffer{}

		if err := json.NewEncoder(buf).Encode(request.Payload); err != nil {
			return err
		}
		bodyRaw = buf
	}

	req, err := http.NewRequestWithContext(ctx, request.Method, request.URL, bodyRaw)
	if err != nil {
		return err
	}

	// add authorization header to the request
	if request.Token != "" {
		req.Header.Add("Authorization", "Bearer "+request.Token)
	}
	req.Header.Add("Content-Type", `application/json`)

	resp, err := c.http.Do(req)
	if err != nil {
		return err
	}

	defer resp.Body.Close()

	if resp.StatusCode > 299 || resp.StatusCode < 200 {
		return fmt.Errorf("failed to make a request url=%s method=%s status=%s", request.URL, request.Method, resp.Status)
	}

	// Try to decode the request body into the struct. If there is an error,
	// respond to the client with the error message and a 400 status code.

	if err := json.NewDecoder(resp.Body).Decode(&genericResponse); err != nil {
		return err
	}

	if err := mapstructure.Decode(genericResponse, &errorRes); err == nil && errorRes.Error {
		return fmt.Errorf("failed to make a request url=%s method=%s status=%s error_code=%d error_message=%s",
			request.URL, request.Method, resp.Status, errorRes.Code, errorRes.Message)
	}

	if respValue != nil {
		if err := mapstructure.Decode(genericResponse, respValue); err != nil {
			return err
		}

	}

	return nil

}
