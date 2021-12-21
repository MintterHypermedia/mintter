// Code generated by sqlitegen. DO NOT EDIT.

package wallet

import (
	"errors"
	"fmt"

	"crawshaw.io/sqlite"
	"mintter/backend/db/sqlitegen"
)

var _ = errors.New

func insertWallet(conn *sqlite.Conn, walletsID string, walletsAddress string, walletsType string, walletsAuth []byte, walletsName string, walletsBalance int) error {
	const query = `INSERT INTO wallets (id, address, type, auth, name, balance)
VALUES (:walletsID, :walletsAddress, :walletsType, :walletsAuth, :walletsName, :walletsBalance)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":walletsID", walletsID)
		stmt.SetText(":walletsAddress", walletsAddress)
		stmt.SetText(":walletsType", walletsType)
		stmt.SetBytes(":walletsAuth", walletsAuth)
		stmt.SetText(":walletsName", walletsName)
		stmt.SetInt(":walletsBalance", walletsBalance)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: insertWallet: %w", err)
	}

	return err
}

type getWalletResult struct {
	WalletsID      string
	WalletsAddress string
	WalletsName    string
	WalletsBalance int
	WalletsType    string
}

func getWallet(conn *sqlite.Conn, walletsID string) (getWalletResult, error) {
	const query = `SELECT wallets.id, wallets.address, wallets.name, wallets.balance, wallets.type
FROM wallets WHERE wallets.id = :walletsID`

	var out getWalletResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":walletsID", walletsID)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("getWallet: more than one result return for a single-kind query")
		}

		out.WalletsID = stmt.ColumnText(0)
		out.WalletsAddress = stmt.ColumnText(1)
		out.WalletsName = stmt.ColumnText(2)
		out.WalletsBalance = stmt.ColumnInt(3)
		out.WalletsType = stmt.ColumnText(4)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: getWallet: %w", err)
	}

	return out, err
}

type listWalletsResult struct {
	WalletsID      string
	WalletsAddress string
	WalletsName    string
	WalletsType    string
	WalletsBalance int
}

func listWallets(conn *sqlite.Conn, cursor string, limit int) ([]listWalletsResult, error) {
	const query = `SELECT wallets.id, wallets.address, wallets.name, wallets.type, wallets.balance FROM wallets WHERE wallets.id > :cursor LIMIT :limit`

	var out []listWalletsResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":cursor", cursor)
		stmt.SetInt(":limit", limit)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, listWalletsResult{
			WalletsID:      stmt.ColumnText(0),
			WalletsAddress: stmt.ColumnText(1),
			WalletsName:    stmt.ColumnText(2),
			WalletsType:    stmt.ColumnText(3),
			WalletsBalance: stmt.ColumnInt(4),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: listWallets: %w", err)
	}

	return out, err
}

type getDefaultWalletResult struct {
	WalletsID       string
	WalletsAddress  string
	WalletsName     string
	WalletsBalance  int
	WalletsType     string
	GlobalMetaValue string
}

func getDefaultWallet(conn *sqlite.Conn, key string) (getDefaultWalletResult, error) {
	const query = `SELECT wallets.id, wallets.address, wallets.name, wallets.balance, wallets.type
FROM wallets
WHERE wallets.id IN (SELECT global_meta.value
FROM global_meta
WHERE global_meta.key = :key )`

	var out getDefaultWalletResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":key", key)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("getDefaultWallet: more than one result return for a single-kind query")
		}

		out.WalletsID = stmt.ColumnText(0)
		out.WalletsAddress = stmt.ColumnText(1)
		out.WalletsName = stmt.ColumnText(2)
		out.WalletsBalance = stmt.ColumnInt(3)
		out.WalletsType = stmt.ColumnText(4)
		out.GlobalMetaValue = stmt.ColumnText(5)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: getDefaultWallet: %w", err)
	}

	return out, err
}

func setDefaultWallet(conn *sqlite.Conn, globalMetaKey string, globalMetaValue string) error {
	const query = `INSERT OR REPLACE INTO global_meta (key, value)
VALUES (:globalMetaKey, :globalMetaValue)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":globalMetaKey", globalMetaKey)
		stmt.SetText(":globalMetaValue", globalMetaValue)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: setDefaultWallet: %w", err)
	}

	return err
}

func removeDefaultWallet(conn *sqlite.Conn, key string) error {
	const query = `DELETE FROM global_meta WHERE global_meta.key = :key `

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":key", key)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: removeDefaultWallet: %w", err)
	}

	return err
}

func updateWalletName(conn *sqlite.Conn, walletsName string, walletsID string) error {
	const query = `UPDATE wallets SET (name)
=( :walletsName ) WHERE wallets.id = :walletsID`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":walletsName", walletsName)
		stmt.SetText(":walletsID", walletsID)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: updateWalletName: %w", err)
	}

	return err
}

func removeWallet(conn *sqlite.Conn, walletsID string) error {
	const query = `DELETE FROM wallets WHERE wallets.id = :walletsID`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":walletsID", walletsID)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: removeWallet: %w", err)
	}

	return err
}

type getWalletCountResult struct {
	Count int
}

func getWalletCount(conn *sqlite.Conn) (getWalletCountResult, error) {
	const query = `SELECT COUNT(wallets.id) AS count FROM wallets`

	var out getWalletCountResult

	before := func(stmt *sqlite.Stmt) {
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("getWalletCount: more than one result return for a single-kind query")
		}

		out.Count = stmt.ColumnInt(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: getWalletCount: %w", err)
	}

	return out, err
}

type getWalletAuthResult struct {
	WalletsAuth []byte
}

func getWalletAuth(conn *sqlite.Conn, walletsID string) (getWalletAuthResult, error) {
	const query = `SELECT wallets.auth FROM wallets WHERE wallets.id = :walletsID`

	var out getWalletAuthResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":walletsID", walletsID)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("getWalletAuth: more than one result return for a single-kind query")
		}

		out.WalletsAuth = stmt.ColumnBytes(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: getWalletAuth: %w", err)
	}

	return out, err
}
