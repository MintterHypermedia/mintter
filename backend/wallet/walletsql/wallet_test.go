package walletsql

import (
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"crawshaw.io/sqlite"
	"crawshaw.io/sqlite/sqlitex"
	"github.com/stretchr/testify/require"
	"go.uber.org/multierr"
)

const (
	id1      = "2bd1fb78d1fbc89ea80629500b58b6f50da462b36c9fdc893776593f33cb6d46"
	address1 = "https://lndhub.io"
	name1    = "my LND wallet"
	type1    = "LND"
	balance1 = 0

	id2      = "fcbe2645d60556c3842971934ee836eec07898fa8357597c37fd86377fa95478"
	address2 = "https://lndhub.io"
	name2    = "my LNDHub wallet"
	type2    = "LNDHUB"
	balance2 = 102345
)

var (
	auth1 = []byte("f7b32cb8ae914a1706b94bbe46d304e3")
	auth2 = []byte("4f671cadcf0e5977559ed7727b2ee2f4f7b32ca8ae914a1703b94bbe4fd304e3")
)

func TestQueries(t *testing.T) {
	conn, closer, err := makeConn()
	require.NoError(t, err)
	defer func() { require.NoError(t, closer()) }()

	{
		err = InsertWallet(conn, Wallet{
			ID:      id1,
			Address: address1,
			Name:    name1,
			Type:    type1,
			Balance: balance1,
		}, auth1)
		require.NoError(t, err)

		got, err := getWallet(conn, id1)
		require.NoError(t, err)

		require.Equal(t, id1, got.WalletsID)
		require.Equal(t, address1, got.WalletsAddress)
		require.Equal(t, name1, got.WalletsName)
		require.Equal(t, strings.ToLower(type1), got.WalletsType)
		require.Equal(t, balance1, got.WalletsBalance)

		defaultWallet, err := GetDefaultWallet(conn)
		require.NoError(t, err)
		require.Equal(t, defaultWallet.ID, got.WalletsID)

		err = InsertWallet(conn, Wallet{
			ID:      id2,
			Address: address2,
			Name:    name2,
			Type:    type2,
			Balance: balance2,
		}, auth2)
		require.NoError(t, err)

		defaultWallet, err = GetDefaultWallet(conn)
		require.NoError(t, err)
		require.Equal(t, defaultWallet.ID, got.WalletsID)

		got, err = getWallet(conn, id2)
		require.NoError(t, err)

		require.Equal(t, id2, got.WalletsID)
		require.Equal(t, address2, got.WalletsAddress)
		require.Equal(t, name2, got.WalletsName)
		require.Equal(t, strings.ToLower(type2), got.WalletsType)
		require.Equal(t, balance2, got.WalletsBalance)

		err = InsertWallet(conn, Wallet{
			ID:      id2,
			Name:    name2,
			Type:    type2,
			Balance: balance2,
		}, auth2)
		require.Error(t, err)

		newDefaultWallet, err := UpdateDefaultWallet(conn, id2)
		require.NoError(t, err)
		require.Equal(t, newDefaultWallet.ID, got.WalletsID)

		nwallets, err := getWalletCount(conn)
		require.NoError(t, err)
		require.Equal(t, 2, nwallets.Count)

		require.NoError(t, RemoveWallet(conn, newDefaultWallet.ID))
		defaultWallet, err = GetDefaultWallet(conn)
		require.NoError(t, err)
		require.Equal(t, defaultWallet.ID, id1)

		newwallet1, err := UpdateWalletName(conn, id1, name2)
		require.NoError(t, err)
		require.Equal(t, newwallet1.Name, name2)
	}
}

func makeConn() (conn *sqlite.Conn, closer func() error, err error) {
	dir, err := ioutil.TempDir("", "sqlitegen-")
	if err != nil {
		return nil, nil, err
	}
	defer func() {
		if err != nil {
			os.RemoveAll(dir)
		}
	}()

	conn, err = sqlite.OpenConn(filepath.Join(dir, "db.sqlite"))
	if err != nil {
		return nil, nil, err
	}
	defer func() {
		if err != nil {
			conn.Close()
		}
	}()

	err = sqlitex.ExecScript(conn, `
	CREATE TABLE wallets (
		-- Wallet unique ID. Is the url hash in case of lndhub or the pubkey in case of LND.
		id TEXT PRIMARY KEY,
		-- Address of the LND node backing up this wallet. In case lndhub, this will be the
		-- URL to connect via rest api. In case LND wallet, this will be the clearnet/onion address.
		address TEXT NOT NULL,
		-- The type of the wallet. Either lnd or lndhub
		type TEXT CHECK( type IN ('lnd','lndhub') ) NOT NULL DEFAULT 'lndhub',
		-- The Authentication of the wallet. api token in case lndhub and macaroon
		-- bytes in case lnd. This blob should be encrypted
		auth BLOB NOT NULL,
		-- Human readable name to help the user identify each wallet
		name TEXT NOT NULL,
		-- The balance in satoshis the wallet had at the moment of creation. For audit purposes
		balance INTEGER DEFAULT 0
	);
	-- Stores global metadata/configuration about any other table
	CREATE TABLE global_meta (
		key TEXT PRIMARY KEY,
		value TEXT
	) WITHOUT ROWID;

`)
	if err != nil {
		return nil, nil, err
	}

	return conn, func() error {
		return multierr.Combine(
			os.RemoveAll(dir),
			conn.Close(),
		)
	}, nil

}
