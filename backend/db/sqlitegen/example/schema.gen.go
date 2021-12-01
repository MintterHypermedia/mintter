// Code generated by sqlitegen. DO NOT EDIT.

package example

import (
	"mintter/backend/db/sqlitegen"
)

// Table users.
const (
	Users       sqlitegen.Table  = "users"
	UsersAvatar sqlitegen.Column = "users.avatar"
	UsersID     sqlitegen.Column = "users.id"
	UsersName   sqlitegen.Column = "users.name"
)

// Table wallets.
const (
	Wallets     sqlitegen.Table  = "wallets"
	WalletsID   sqlitegen.Column = "wallets.id"
	WalletsName sqlitegen.Column = "wallets.name"
)

// Schema describes SQLite columns.
var Schema = sqlitegen.Schema{
	Columns: map[sqlitegen.Column]sqlitegen.ColumnInfo{
		UsersAvatar: {Table: Users, SQLType: "BLOB"},
		UsersID:     {Table: Users, SQLType: "INTEGER"},
		UsersName:   {Table: Users, SQLType: "TEXT"},
		WalletsID:   {Table: Wallets, SQLType: "TEXT"},
		WalletsName: {Table: Wallets, SQLType: "TEXT"},
	},
}
