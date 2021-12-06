package sqlitegen

import (
	"go/format"
	"io/ioutil"
	"os"
	"path/filepath"
	"testing"

	"crawshaw.io/sqlite"
	"crawshaw.io/sqlite/sqlitex"
	"github.com/stretchr/testify/require"
)

func TestColumnShortName(t *testing.T) {
	tests := []struct {
		In   Column
		Want string
	}{
		{"foo.bar", "bar"},
		{"he_ho.foo_bar", "foo_bar"},
	}

	for _, tt := range tests {
		t.Run(string(tt.In), func(t *testing.T) {
			require.Equal(t, tt.Want, tt.In.ShortName())
		})
	}
}

func TestIntrospectSchema(t *testing.T) {
	dir, err := ioutil.TempDir("", "sqlitegen-")
	require.NoError(t, err)
	t.Cleanup(func() {
		require.NoError(t, os.RemoveAll(dir))
	})

	conn, err := sqlite.OpenConn(filepath.Join(dir, "db.sqlite"))
	require.NoError(t, err)
	defer conn.Close()

	err = sqlitex.ExecScript(conn, `
CREATE TABLE wallets (id TEXT, name TEXT, user_id INTEGER);

CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, avatar BLOB);
`)
	require.NoError(t, err)

	s, err := IntrospectSchema(conn)
	require.NoError(t, err)

	wantSchema := Schema{
		Columns: map[Column]ColumnInfo{
			"users.id":        {Table: "users", SQLType: "INTEGER"},
			"users.name":      {Table: "users", SQLType: "TEXT"},
			"users.age":       {Table: "users", SQLType: "INTEGER"},
			"users.avatar":    {Table: "users", SQLType: "BLOB"},
			"wallets.id":      {Table: "wallets", SQLType: "TEXT"},
			"wallets.name":    {Table: "wallets", SQLType: "TEXT"},
			"wallets.user_id": {Table: "wallets", SQLType: "INTEGER"},
		},
	}

	require.Equal(t, wantSchema, s)
}

func TestCodegenSchema(t *testing.T) {
	s := Schema{
		Columns: map[Column]ColumnInfo{
			"users.id":        {Table: "users", SQLType: "INTEGER"},
			"users.name":      {Table: "users", SQLType: "TEXT"},
			"users.age":       {Table: "users", SQLType: "INTEGER"},
			"users.avatar":    {Table: "users", SQLType: "BLOB"},
			"wallets.id":      {Table: "wallets", SQLType: "TEXT"},
			"wallets.name":    {Table: "wallets", SQLType: "TEXT"},
			"wallets.user_id": {Table: "wallets", SQLType: "INTEGER"},
		},
	}

	code, err := CodegenSchema("testschema", s)
	require.NoError(t, err)

	wantCode := formatCode(t, `// Code generated by sqlitegen. DO NOT EDIT.
	
package testschema

import (
	"mintter/backend/db/sqlitegen"
)

// Table users.
const (
	Users sqlitegen.Table = "users"
	UsersAge sqlitegen.Column = "users.age"
	UsersAvatar sqlitegen.Column = "users.avatar"   
	UsersID sqlitegen.Column = "users.id"
	UsersName sqlitegen.Column = "users.name"
)

// Table wallets.
const (
	Wallets sqlitegen.Table = "wallets"
	WalletsID sqlitegen.Column = "wallets.id"     
	WalletsName sqlitegen.Column = "wallets.name"   
	WalletsUserID sqlitegen.Column = "wallets.user_id"
)

// Schema describes SQLite columns.
var Schema = sqlitegen.Schema{
	Columns: map[sqlitegen.Column]sqlitegen.ColumnInfo{
		UsersAge:       {Table: Users, SQLType: "INTEGER"},
		UsersAvatar:    {Table: Users, SQLType: "BLOB"},
		UsersID:        {Table: Users, SQLType: "INTEGER"},
		UsersName:      {Table: Users, SQLType: "TEXT"},
		WalletsID:      {Table: Wallets, SQLType: "TEXT"},
		WalletsName:    {Table: Wallets, SQLType: "TEXT"},
		WalletsUserID:  {Table: Wallets, SQLType: "INTEGER"},
	},
}
`)

	require.Equal(t, wantCode, string(code))
}

func formatCode(t *testing.T, code string) string {
	src, err := format.Source([]byte(code))
	require.NoError(t, err)

	return string(src)
}
