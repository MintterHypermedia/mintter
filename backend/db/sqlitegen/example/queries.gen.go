// Code generated by sqlitegen. DO NOT EDIT.

package example

import (
	"errors"

	"crawshaw.io/sqlite"
	"go.uber.org/multierr"
)

func execStmt(conn *sqlite.Conn, query string, before func(*sqlite.Stmt), onStep func(int, *sqlite.Stmt) error) (err error) {
	stmt, err := conn.Prepare(query)
	if err != nil {
		return err
	}
	defer func() {
		err = multierr.Append(err, stmt.Reset())
	}()

	before(stmt)

	for i := 0; true; i++ {
		hasRow, err := stmt.Step()
		if err != nil {
			return err
		}

		if !hasRow {
			break
		}

		if err := onStep(i, stmt); err != nil {
			return err
		}
	}

	return err
}

func insertWallet(conn *sqlite.Conn, walletsID string, walletsName string) error {
	const query = `INSERT INTO wallets (id, name)
VALUES (?, ?)`

	before := func(stmt *sqlite.Stmt) {
		stmt.BindText(1, walletsID)
		stmt.BindText(2, walletsName)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	if err := execStmt(conn, query, before, onStep); err != nil {
		return err
	}

	return nil
}

type getWalletResult struct {
	WalletsID   string
	WalletsName string
}

func getWallet(conn *sqlite.Conn, walletsID string) (getWalletResult, error) {
	const query = `SELECT wallets.id, wallets.name
FROM wallets
WHERE wallets.id = ?`

	var out getWalletResult

	before := func(stmt *sqlite.Stmt) {
		stmt.BindText(1, walletsID)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("getWallet: more than one result return for a single-kind query")
		}

		out.WalletsID = stmt.ColumnText(0)
		out.WalletsName = stmt.ColumnText(1)
		return nil
	}

	if err := execStmt(conn, query, before, onStep); err != nil {
		return out, err
	}

	return out, nil
}

type listWalletsResult struct {
	WalletsID   string
	WalletsName string
}

func listWallets(conn *sqlite.Conn, cursor string, limit int) ([]listWalletsResult, error) {
	const query = `SELECT wallets.id, wallets.name FROM wallets WHERE wallets.id > ? LIMIT ?`

	var out []listWalletsResult

	before := func(stmt *sqlite.Stmt) {
		stmt.BindText(1, cursor)
		stmt.BindInt(2, limit)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, listWalletsResult{})
		out[i].WalletsID = stmt.ColumnText(0)
		out[i].WalletsName = stmt.ColumnText(1)
		return nil
	}

	if err := execStmt(conn, query, before, onStep); err != nil {
		return nil, err
	}

	return out, nil
}

func insertUser(conn *sqlite.Conn, usersID int, usersName string, usersAvatar []byte) error {
	const query = `INSERT INTO users (id, name, avatar)
VALUES (?, ?, ?)`

	before := func(stmt *sqlite.Stmt) {
		stmt.BindInt(1, usersID)
		stmt.BindText(2, usersName)
		stmt.BindBytes(3, usersAvatar)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	if err := execStmt(conn, query, before, onStep); err != nil {
		return err
	}

	return nil
}

type getUserResult struct {
	UsersID     int
	UsersName   string
	UsersAvatar []byte
}

func getUser(conn *sqlite.Conn, usersID int) (getUserResult, error) {
	const query = `SELECT users.id, users.name, users.avatar
FROM users
WHERE users.id = ?`

	var out getUserResult

	before := func(stmt *sqlite.Stmt) {
		stmt.BindInt(1, usersID)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("getUser: more than one result return for a single-kind query")
		}

		out.UsersID = stmt.ColumnInt(0)
		out.UsersName = stmt.ColumnText(1)
		out.UsersAvatar = stmt.ColumnBytes(2)
		return nil
	}

	if err := execStmt(conn, query, before, onStep); err != nil {
		return out, err
	}

	return out, nil
}
