package sitesql

import (
	"io/ioutil"
	site "mintter/backend/genproto/documents/v1alpha"
	"os"
	"path/filepath"
	"testing"
	"time"

	"crawshaw.io/sqlite"
	"crawshaw.io/sqlite/sqlitex"
	"github.com/stretchr/testify/require"
	"go.uber.org/multierr"
)

const (
	token1 = "ASDFG123"
	token2 = "QWERT987"
)

var (
	futureTime = time.Now().Add(time.Minute)
	pastTime   = time.Now().Add(-time.Minute)
)

func TestQueries(t *testing.T) {
	conn, closer, err := makeConn()
	require.NoError(t, err)
	defer func() { require.NoError(t, closer()) }()

	{
		require.NoError(t, AddToken(conn, token1, futureTime, site.Member_EDITOR))
		token, err := GetToken(conn, token1)
		require.NoError(t, err)
		require.Equal(t, futureTime.Unix(), token.ExpirationTime.Unix())
		require.Equal(t, site.Member_EDITOR, token.Role)

		require.NoError(t, AddToken(conn, token2, pastTime, site.Member_OWNER))
		token, err = GetToken(conn, token2)
		require.NoError(t, err)
		require.Equal(t, pastTime.Unix(), token.ExpirationTime.Unix())
		require.Equal(t, site.Member_OWNER, token.Role)

		tokenList, err := ListTokens(conn)
		require.NoError(t, err)
		require.Len(t, tokenList, 2)

		require.NoError(t, CleanExpiredTokens(conn))
		tokenList, err = ListTokens(conn)
		require.NoError(t, err)
		require.Len(t, tokenList, 1)
		token, ok := tokenList[token1]
		require.True(t, ok)
		require.Equal(t, futureTime.Unix(), token.ExpirationTime.Unix())
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
	CREATE TABLE invite_tokens (
		-- Unique token identification. Random 8 char words
		token TEXT PRIMARY KEY,
		-- The role the token will allow ROLE_UNSPECIFIED = 0 OWNER = 1 EDITOR = 2
		role INTEGER NOT NULL DEFAULT 2,
		-- Timestamp since the token will no longer be eligible to be redeemed. Seconds since  Jan 1, 1970
		expiration_time INTEGER NOT NULL CHECK (expiration_time > 0)
	) WITHOUT ROWID;

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
