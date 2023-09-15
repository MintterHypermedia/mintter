// Code generated by sqlitegen. DO NOT EDIT.

package sitesql

import (
	"errors"
	"fmt"

	"crawshaw.io/sqlite"
	"mintter/backend/pkg/sqlitegen"
)

var _ = errors.New

func RegisterSite(conn *sqlite.Conn, servedSitesHostname string, group_eid string, servedSitesVersion string, publicKeysPrincipal []byte) error {
	const query = `INSERT OR REPLACE INTO served_sites (hostname, group_id, version, owner_id)
VALUES (:servedSitesHostname, (SELECT entities.id FROM entities WHERE entities.eid = :group_eid), :servedSitesVersion, (SELECT public_keys.id FROM public_keys WHERE public_keys.principal = :publicKeysPrincipal))`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":servedSitesHostname", servedSitesHostname)
		stmt.SetText(":group_eid", group_eid)
		stmt.SetText(":servedSitesVersion", servedSitesVersion)
		stmt.SetBytes(":publicKeysPrincipal", publicKeysPrincipal)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: RegisterSite: %w", err)
	}

	return err
}

type GetSiteInfoResult struct {
	EntitiesEID         string
	ServedSitesVersion  string
	PublicKeysPrincipal []byte
}

func GetSiteInfo(conn *sqlite.Conn, servedSitesHostname string) (GetSiteInfoResult, error) {
	const query = `SELECT entities.eid, served_sites.version, public_keys.principal
FROM served_sites
JOIN entities ON entities.id = served_sites.group_id
JOIN public_keys ON public_keys.principal = served_sites.owner_id
WHERE served_sites.hostname = :servedSitesHostname`

	var out GetSiteInfoResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":servedSitesHostname", servedSitesHostname)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("GetSiteInfo: more than one result return for a single-kind query")
		}

		out.EntitiesEID = stmt.ColumnText(0)
		out.ServedSitesVersion = stmt.ColumnText(1)
		out.PublicKeysPrincipal = stmt.ColumnBytes(2)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: GetSiteInfo: %w", err)
	}

	return out, err
}

func SetSiteRegistrationLink(conn *sqlite.Conn, link string) error {
	const query = `INSERT OR REPLACE INTO kv (key, value)
VALUES ('site_registration_link', :link)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":link", link)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: SetSiteRegistrationLink: %w", err)
	}

	return err
}

type GetSiteRegistrationLinkResult struct {
	KVValue string
}

func GetSiteRegistrationLink(conn *sqlite.Conn) (GetSiteRegistrationLinkResult, error) {
	const query = `SELECT kv.value FROM kv WHERE kv.key ='site_registration_link'`

	var out GetSiteRegistrationLinkResult

	before := func(stmt *sqlite.Stmt) {
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("GetSiteRegistrationLink: more than one result return for a single-kind query")
		}

		out.KVValue = stmt.ColumnText(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: GetSiteRegistrationLink: %w", err)
	}

	return out, err
}

func SetSiteGroupID(conn *sqlite.Conn, eid string) error {
	const query = `INSERT OR REPLACE INTO kv (key, value)
VALUES ('site_group_id', :eid)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":eid", eid)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: SetSiteGroupID: %w", err)
	}

	return err
}

type GetSiteGroupIDResult struct {
	KVValue string
}

func GetSiteGroupID(conn *sqlite.Conn) (GetSiteGroupIDResult, error) {
	const query = `SELECT kv.value FROM kv WHERE kv.key ='site_group_id'`

	var out GetSiteGroupIDResult

	before := func(stmt *sqlite.Stmt) {
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("GetSiteGroupID: more than one result return for a single-kind query")
		}

		out.KVValue = stmt.ColumnText(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: GetSiteGroupID: %w", err)
	}

	return out, err
}

func SetSiteGroupVersion(conn *sqlite.Conn, eid string) error {
	const query = `INSERT OR REPLACE INTO kv (key, value)
VALUES ('site_group_version', :eid)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":eid", eid)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: SetSiteGroupVersion: %w", err)
	}

	return err
}

type GetSiteGroupVersionResult struct {
	KVValue string
}

func GetSiteGroupVersion(conn *sqlite.Conn) (GetSiteGroupVersionResult, error) {
	const query = `SELECT kv.value FROM kv WHERE kv.key ='site_group_version'`

	var out GetSiteGroupVersionResult

	before := func(stmt *sqlite.Stmt) {
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("GetSiteGroupVersion: more than one result return for a single-kind query")
		}

		out.KVValue = stmt.ColumnText(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: GetSiteGroupVersion: %w", err)
	}

	return out, err
}
