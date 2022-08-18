package lndhub

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"io/ioutil"
	"math/rand"
	"mintter/backend/core"
	"mintter/backend/db/sqliteschema"
	"mintter/backend/lndhub/lndhubsql"
	"mintter/backend/pkg/future"
	"mintter/backend/wallet/walletsql"
	"net/http"
	"os"
	"path/filepath"
	"testing"
	"time"

	"crawshaw.io/sqlite"
	"crawshaw.io/sqlite/sqlitex"
	"github.com/libp2p/go-libp2p-core/crypto"
	"github.com/stretchr/testify/require"
)

const (
	syntaxErrorCredentials   = "lndhub://c227a7fb5c71a22fac33:d2a48ab779aa1b02e858@http://lndhub.io"
	syntaxErrorCredentials2  = "lndhub://c227a7fb5c71a22fac33d2a48ab779aa1b02e858@https://lndhub.io"
	syntaxErrorCredentials3  = "c227a7fb5c71a22fac33:d2a48ab779aa1b02e858@https://lndhub.io"
	semanticErrorCredentials = "lndhub://c227a7fb5c71a22fac33:d2a48ab779aa1b02e858@https://lndhub.io"
	goodCredentials          = "lndhub://c02fa7989240c12194fc:7d06cfd829af4790116f@https://lndhub.io"
	connectionURL            = "https://" + MintterDomain
)

func TestCreate(t *testing.T) {
	t.Skip("Uncomment skip to run integration tests with mintter lndhub.go")

	const invoiceAmt = 12543
	const invoiceMemo = "test invoice go"
	var nickname = randStringRunes(6)

	pool, err := makeConn(t)
	require.NoError(t, err)
	conn := pool.Get(context.Background())
	defer pool.Put(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(640)*time.Second)
	defer cancel()
	identity := future.New[core.Identity]()
	lndHubClient := NewClient(context.Background(), &http.Client{}, pool, identity.ReadOnly)
	keypair, err := core.NewKeyPairRandom(core.CodecDeviceKey)
	require.NoError(t, err)
	priv, pub, err := crypto.GenerateEd25519Key(nil)
	require.NoError(t, err)
	pubkeyBytes, err := pub.Raw()
	require.NoError(t, err)

	pubkey, err := core.NewPublicKey(core.CodecAccountKey, pub.(*crypto.Ed25519PublicKey))
	require.NoError(t, err)

	login := pubkey.CID().String()
	passwordBytes, err := priv.Sign([]byte(SigninMessage))
	password := hex.EncodeToString(passwordBytes)
	require.NoError(t, err)
	require.NoError(t, identity.Resolve(core.NewIdentity(pubkey, keypair)))
	lndHubClient.WalletID = credentials2Id("lndhub.go", login, password, MintterDomain)

	makeTestWallet(t, conn, walletsql.Wallet{
		ID:      lndHubClient.WalletID,
		Address: connectionURL,
		Name:    nickname,
		Type:    "lndhub.go",
		Balance: 0,
	}, login, password, hex.EncodeToString(pubkeyBytes))

	user, err := lndHubClient.Create(ctx, connectionURL, login, password, nickname)
	require.NoError(t, err)
	require.EqualValues(t, login, user.Login)
	require.EqualValues(t, password, user.Password)
	require.EqualValues(t, nickname, user.Nickname)
	require.NoError(t, err)
	_, err = lndHubClient.Auth(ctx)
	require.NoError(t, err)
	var newNickname = randStringRunes(6)
	err = lndHubClient.UpdateNickname(ctx, newNickname)
	require.NoError(t, err)
	lnaddress, err := lndHubClient.GetLnAddress(ctx)
	require.NoError(t, err)
	require.EqualValues(t, newNickname+"@"+LnaddressDomain, lnaddress)
	balance, err := lndHubClient.GetBalance(ctx)
	require.NoError(t, err)
	require.EqualValues(t, 0, balance)
	payreq, err := lndHubClient.CreateLocalInvoice(ctx, invoiceAmt, invoiceMemo)
	require.NoError(t, err)
	decodedInvoice, err := DecodeInvoice(payreq)
	require.NoError(t, err)
	require.EqualValues(t, invoiceMemo, *decodedInvoice.Description)
	require.EqualValues(t, invoiceAmt, uint64(decodedInvoice.MilliSat.ToSatoshis()))
	const zeroAmt = 0
	const invoiceMemo2 = "zero invoice test amount"
	payreq, err = lndHubClient.RequestRemoteInvoice(ctx, newNickname, zeroAmt, invoiceMemo2)
	require.NoError(t, err)
	decodedInvoice, err = DecodeInvoice(payreq)
	require.NoError(t, err)
	require.EqualValues(t, invoiceMemo2, *decodedInvoice.Description)
	require.Nil(t, decodedInvoice.MilliSat) // when amt is zero, the result is nil
	//TODO: test for invoice metadata
}

func TestListInvoices(t *testing.T) {
	t.Skip("Uncomment skip to run integration tests with mintter lndhub.go")
	pool, err := makeConn(t)
	require.NoError(t, err)
	conn := pool.Get(context.Background())
	defer pool.Put(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(640)*time.Second)
	defer cancel()
	identity := future.New[core.Identity]()
	lndHubClient := NewClient(context.Background(), &http.Client{}, pool, identity.ReadOnly)
	keypair, err := core.NewKeyPairRandom(core.CodecDeviceKey)
	require.NoError(t, err)
	_, pub, err := crypto.GenerateEd25519Key(nil)
	require.NoError(t, err)

	pubkey, err := core.NewPublicKey(core.CodecAccountKey, pub.(*crypto.Ed25519PublicKey))
	require.NoError(t, err)

	require.NoError(t, identity.Resolve(core.NewIdentity(pubkey, keypair)))

	const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzEsImlzUmVmcmVzaCI6ZmFsc2UsImV4cCI6MTY2MDY1NzcyN30.2_LCZvV58ARij8KcmEZbIlEyqOKmCc5fMgC75guUwek"
	const walletID = "97186e34480d6aabcf59ebd37a893a0d02223f6a38822c8e6213c810384f0dc7"
	lndHubClient.WalletID = walletID
	require.NoError(t, lndhubsql.SetToken(conn, walletID, token))
	invoices, err := lndHubClient.ListReceivedInvoices(ctx)
	require.NoError(t, err)
	require.Greater(t, len(invoices), 1)
}
func randStringRunes(n int) string {
	var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
	rand.Seed(time.Now().UnixNano())
	b := make([]rune, n)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}

func makeTestWallet(t *testing.T, conn *sqlite.Conn, wallet walletsql.Wallet, login, pass, token string) {
	binaryToken := []byte(token)   // TODO: encrypt the token before storing
	binaryLogin := []byte(login)   // TODO: encrypt the login before storing
	binaryPassword := []byte(pass) // TODO: encrypt the password before storing

	require.NoError(t, walletsql.InsertWallet(conn, wallet, binaryLogin, binaryPassword, binaryToken))
}

func makeConn(t *testing.T) (*sqlitex.Pool, error) {
	dir, err := ioutil.TempDir("", "sqlitegen-")
	if err != nil {
		return nil, err
	}
	defer func() {
		if err != nil {
			os.RemoveAll(dir)
		}
	}()

	pool, err := sqliteschema.Open(filepath.Join(dir, "db.sqlite"), 0, 16)
	require.NoError(t, err)
	t.Cleanup(func() {
		require.NoError(t, pool.Close())
	})

	conn := pool.Get(context.Background())
	defer pool.Put(conn)
	require.NoError(t, sqliteschema.Migrate(conn))

	return pool, nil

}

func credentials2Id(wType, login, password, domain string) string {
	url := wType + "://" + login + ":" + password + "@https://" + domain
	h := sha256.Sum256([]byte(url))
	return hex.EncodeToString(h[:])
}
