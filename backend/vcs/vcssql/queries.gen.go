// Code generated by sqlitegen. DO NOT EDIT.

package vcssql

import (
	"errors"
	"fmt"

	"crawshaw.io/sqlite"
	"mintter/backend/db/sqlitegen"
)

var _ = errors.New

func WorkingCopyReplace(conn *sqlite.Conn, workingCopyObjectID int, workingCopyName string, workingCopyVersion string, workingCopyData []byte, workingCopyCreateTime int, workingCopyUpdateTime int) error {
	const query = `INSERT OR REPLACE INTO working_copy (object_id, name, version, data, create_time, update_time)
VALUES (:workingCopyObjectID, :workingCopyName, :workingCopyVersion, :workingCopyData, :workingCopyCreateTime, :workingCopyUpdateTime)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt(":workingCopyObjectID", workingCopyObjectID)
		stmt.SetText(":workingCopyName", workingCopyName)
		stmt.SetText(":workingCopyVersion", workingCopyVersion)
		stmt.SetBytes(":workingCopyData", workingCopyData)
		stmt.SetInt(":workingCopyCreateTime", workingCopyCreateTime)
		stmt.SetInt(":workingCopyUpdateTime", workingCopyUpdateTime)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: WorkingCopyReplace: %w", err)
	}

	return err
}

type WorkingCopyGetResult struct {
	WorkingCopyData       []byte
	WorkingCopyCreateTime int
	WorkingCopyUpdateTime int
	WorkingCopyVersion    string
}

func WorkingCopyGet(conn *sqlite.Conn, workingCopyObjectID int, workingCopyName string) (WorkingCopyGetResult, error) {
	const query = `SELECT working_copy.data, working_copy.create_time, working_copy.update_time, working_copy.version
FROM working_copy
WHERE working_copy.object_id = :workingCopyObjectID
AND working_copy.name = :workingCopyName
LIMIT 1`

	var out WorkingCopyGetResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt(":workingCopyObjectID", workingCopyObjectID)
		stmt.SetText(":workingCopyName", workingCopyName)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("WorkingCopyGet: more than one result return for a single-kind query")
		}

		out.WorkingCopyData = stmt.ColumnBytes(0)
		out.WorkingCopyCreateTime = stmt.ColumnInt(1)
		out.WorkingCopyUpdateTime = stmt.ColumnInt(2)
		out.WorkingCopyVersion = stmt.ColumnText(3)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: WorkingCopyGet: %w", err)
	}

	return out, err
}

func WorkingCopyDelete(conn *sqlite.Conn, workingCopyObjectID int, workingCopyName string) error {
	const query = `DELETE FROM working_copy
WHERE working_copy.object_id = :workingCopyObjectID
AND working_copy.name = :workingCopyName`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt(":workingCopyObjectID", workingCopyObjectID)
		stmt.SetText(":workingCopyName", workingCopyName)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: WorkingCopyDelete: %w", err)
	}

	return err
}

type AccountsLookupPKResult struct {
	AccountsID int
}

func AccountsLookupPK(conn *sqlite.Conn, accountsMultihash []byte) (AccountsLookupPKResult, error) {
	const query = `SELECT accounts.id
FROM accounts
WHERE accounts.multihash = :accountsMultihash`

	var out AccountsLookupPKResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":accountsMultihash", accountsMultihash)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("AccountsLookupPK: more than one result return for a single-kind query")
		}

		out.AccountsID = stmt.ColumnInt(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: AccountsLookupPK: %w", err)
	}

	return out, err
}

type AccountsInsertPKResult struct {
	AccountsID int
}

func AccountsInsertPK(conn *sqlite.Conn, accountsMultihash []byte) (AccountsInsertPKResult, error) {
	const query = `INSERT INTO accounts (multihash)
VALUES (:accountsMultihash) RETURNING accounts.id`

	var out AccountsInsertPKResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":accountsMultihash", accountsMultihash)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("AccountsInsertPK: more than one result return for a single-kind query")
		}

		out.AccountsID = stmt.ColumnInt(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: AccountsInsertPK: %w", err)
	}

	return out, err
}

type AccountsGetForDeviceResult struct {
	AccountsID        int
	AccountsMultihash []byte
}

func AccountsGetForDevice(conn *sqlite.Conn, devicesMultihash []byte) (AccountsGetForDeviceResult, error) {
	const query = `SELECT accounts.id, accounts.multihash
FROM accounts
JOIN account_devices ON account_devices.account_id = accounts.id
WHERE account_devices.device_id = COALESCE((SELECT devices.id FROM devices WHERE devices.multihash = :devicesMultihash LIMIT 1), -1000)`

	var out AccountsGetForDeviceResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":devicesMultihash", devicesMultihash)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("AccountsGetForDevice: more than one result return for a single-kind query")
		}

		out.AccountsID = stmt.ColumnInt(0)
		out.AccountsMultihash = stmt.ColumnBytes(1)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: AccountsGetForDevice: %w", err)
	}

	return out, err
}

type AccountsListResult struct {
	AccountsID        int
	AccountsMultihash []byte
}

func AccountsList(conn *sqlite.Conn, ownAccountMultihash []byte) ([]AccountsListResult, error) {
	const query = `SELECT accounts.id, accounts.multihash
FROM accounts
WHERE accounts.multihash != :ownAccountMultihash`

	var out []AccountsListResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":ownAccountMultihash", ownAccountMultihash)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, AccountsListResult{
			AccountsID:        stmt.ColumnInt(0),
			AccountsMultihash: stmt.ColumnBytes(1),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: AccountsList: %w", err)
	}

	return out, err
}

func AccountsIndexProfile(conn *sqlite.Conn, profilesAccountID int, profilesAlias string, profilesEmail string, profilesBio string, profilesChangeID int) error {
	const query = `INSERT OR IGNORE INTO profiles (account_id, alias, email, bio, change_id)
VALUES (:profilesAccountID, :profilesAlias, :profilesEmail, :profilesBio, :profilesChangeID)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt(":profilesAccountID", profilesAccountID)
		stmt.SetText(":profilesAlias", profilesAlias)
		stmt.SetText(":profilesEmail", profilesEmail)
		stmt.SetText(":profilesBio", profilesBio)
		stmt.SetInt(":profilesChangeID", profilesChangeID)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: AccountsIndexProfile: %w", err)
	}

	return err
}

type AccountsListProfilesResult struct {
	ProfilesAccountID int
	ProfilesAlias     string
	ProfilesEmail     string
	ProfilesBio       string
	ProfilesChangeID  int
}

func AccountsListProfiles(conn *sqlite.Conn) ([]AccountsListProfilesResult, error) {
	const query = `SELECT profiles.account_id, profiles.alias, profiles.email, profiles.bio, profiles.change_id
FROM profiles
`

	var out []AccountsListProfilesResult

	before := func(stmt *sqlite.Stmt) {
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, AccountsListProfilesResult{
			ProfilesAccountID: stmt.ColumnInt(0),
			ProfilesAlias:     stmt.ColumnText(1),
			ProfilesEmail:     stmt.ColumnText(2),
			ProfilesBio:       stmt.ColumnText(3),
			ProfilesChangeID:  stmt.ColumnInt(4),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: AccountsListProfiles: %w", err)
	}

	return out, err
}

func DocumentsIndex(conn *sqlite.Conn, documentsID int, documentsTitle string, documentsSubtitle string, documentsChangeID int) error {
	const query = `INSERT OR IGNORE INTO documents (id, title, subtitle, change_id)
VALUES (:documentsID, :documentsTitle, :documentsSubtitle, :documentsChangeID)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt(":documentsID", documentsID)
		stmt.SetText(":documentsTitle", documentsTitle)
		stmt.SetText(":documentsSubtitle", documentsSubtitle)
		stmt.SetInt(":documentsChangeID", documentsChangeID)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: DocumentsIndex: %w", err)
	}

	return err
}

type DocumentsListIndexedResult struct {
	DocumentsID       int
	DocumentsTitle    string
	DocumentsSubtitle string
	DocumentsChangeID int
	ChangeData        []byte
}

func DocumentsListIndexed(conn *sqlite.Conn) ([]DocumentsListIndexedResult, error) {
	const query = `SELECT documents.id, documents.title, documents.subtitle, documents.change_id, ipfs_blocks.data AS change_data
FROM documents
JOIN ipfs_blocks ON ipfs_blocks.id = documents.change_id
`

	var out []DocumentsListIndexedResult

	before := func(stmt *sqlite.Stmt) {
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, DocumentsListIndexedResult{
			DocumentsID:       stmt.ColumnInt(0),
			DocumentsTitle:    stmt.ColumnText(1),
			DocumentsSubtitle: stmt.ColumnText(2),
			DocumentsChangeID: stmt.ColumnInt(3),
			ChangeData:        stmt.ColumnBytes(4),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: DocumentsListIndexed: %w", err)
	}

	return out, err
}

func ContentLinksInsert(conn *sqlite.Conn, contentLinksSourceDocumentID int, contentLinksSourceBlockID string, contentLinksSourceChangeID int, contentLinksSourceVersion string, contentLinksTargetDocumentID int, contentLinksTargetBlockID string, contentLinksTargetVersion string) error {
	const query = `INSERT OR IGNORE INTO content_links (source_document_id, source_block_id, source_change_id, source_version, target_document_id, target_block_id, target_version)
VALUES (:contentLinksSourceDocumentID, :contentLinksSourceBlockID, :contentLinksSourceChangeID, :contentLinksSourceVersion, :contentLinksTargetDocumentID, :contentLinksTargetBlockID, :contentLinksTargetVersion)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt(":contentLinksSourceDocumentID", contentLinksSourceDocumentID)
		stmt.SetText(":contentLinksSourceBlockID", contentLinksSourceBlockID)
		stmt.SetInt(":contentLinksSourceChangeID", contentLinksSourceChangeID)
		stmt.SetText(":contentLinksSourceVersion", contentLinksSourceVersion)
		stmt.SetInt(":contentLinksTargetDocumentID", contentLinksTargetDocumentID)
		stmt.SetText(":contentLinksTargetBlockID", contentLinksTargetBlockID)
		stmt.SetText(":contentLinksTargetVersion", contentLinksTargetVersion)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: ContentLinksInsert: %w", err)
	}

	return err
}

type BacklinksListByTargetDocumentResult struct {
	SourceDocumentMultihash   []byte
	ContentLinksSourceBlockID string
	ContentLinksSourceVersion string
	TargetDocumentMultihash   []byte
	ContentLinksTargetBlockID string
	ContentLinksTargetVersion string
}

func BacklinksListByTargetDocument(conn *sqlite.Conn, targetDocumentID int, depth int) ([]BacklinksListByTargetDocumentResult, error) {
	const query = `WITH RECURSIVE parent AS (SELECT content_links.*, 0 AS level FROM content_links WHERE content_links.target_document_id = :targetDocumentID UNION ALL SELECT content_links.*, parent.level + 1 AS child_level FROM content_links, parent WHERE parent.source_document_id = content_links.target_document_id AND child_level <= :depth ORDER BY child_level) SELECT s.multihash, content_links.source_block_id, content_links.source_version, t.multihash, content_links.target_block_id, content_links.target_version FROM parent AS content_links JOIN ipfs_blocks s ON s.id = content_links.source_document_id JOIN ipfs_blocks t on t.id = content_links.target_document_id WHERE content_links.source_document_id != :targetDocumentID`

	var out []BacklinksListByTargetDocumentResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt(":targetDocumentID", targetDocumentID)
		stmt.SetInt(":depth", depth)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, BacklinksListByTargetDocumentResult{
			SourceDocumentMultihash:   stmt.ColumnBytes(0),
			ContentLinksSourceBlockID: stmt.ColumnText(1),
			ContentLinksSourceVersion: stmt.ColumnText(2),
			TargetDocumentMultihash:   stmt.ColumnBytes(3),
			ContentLinksTargetBlockID: stmt.ColumnText(4),
			ContentLinksTargetVersion: stmt.ColumnText(5),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: BacklinksListByTargetDocument: %w", err)
	}

	return out, err
}

type DevicesLookupPKResult struct {
	DevicesID int
}

func DevicesLookupPK(conn *sqlite.Conn, devicesMultihash []byte) (DevicesLookupPKResult, error) {
	const query = `SELECT devices.id
FROM devices
WHERE devices.multihash = :devicesMultihash`

	var out DevicesLookupPKResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":devicesMultihash", devicesMultihash)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("DevicesLookupPK: more than one result return for a single-kind query")
		}

		out.DevicesID = stmt.ColumnInt(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: DevicesLookupPK: %w", err)
	}

	return out, err
}

type DevicesInsertPKResult struct {
	DevicesID int
}

func DevicesInsertPK(conn *sqlite.Conn, devicesMultihash []byte) (DevicesInsertPKResult, error) {
	const query = `INSERT INTO devices (multihash)
VALUES (:devicesMultihash) RETURNING devices.id`

	var out DevicesInsertPKResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":devicesMultihash", devicesMultihash)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("DevicesInsertPK: more than one result return for a single-kind query")
		}

		out.DevicesID = stmt.ColumnInt(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: DevicesInsertPK: %w", err)
	}

	return out, err
}

func AccountDevicesInsertOrIgnore(conn *sqlite.Conn, accountDevicesAccountID int, accountDevicesDeviceID int, accountDevicesChangeID int) error {
	const query = `INSERT OR IGNORE INTO account_devices (account_id, device_id, change_id) VALUES (:accountDevicesAccountID, :accountDevicesDeviceID, :accountDevicesChangeID)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt(":accountDevicesAccountID", accountDevicesAccountID)
		stmt.SetInt(":accountDevicesDeviceID", accountDevicesDeviceID)
		stmt.SetInt(":accountDevicesChangeID", accountDevicesChangeID)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: AccountDevicesInsertOrIgnore: %w", err)
	}

	return err
}

type AccountDevicesListResult struct {
	DevicesMultihash  []byte
	AccountsMultihash []byte
}

func AccountDevicesList(conn *sqlite.Conn) ([]AccountDevicesListResult, error) {
	const query = `SELECT devices.multihash, accounts.multihash
FROM account_devices
JOIN accounts ON accounts.id = account_devices.account_id JOIN devices ON devices.id = account_devices.device_id`

	var out []AccountDevicesListResult

	before := func(stmt *sqlite.Stmt) {
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, AccountDevicesListResult{
			DevicesMultihash:  stmt.ColumnBytes(0),
			AccountsMultihash: stmt.ColumnBytes(1),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: AccountDevicesList: %w", err)
	}

	return out, err
}

type DevicesListResult struct {
	DevicesMultihash        []byte
	AccountDevicesDeviceID  int
	AccountDevicesAccountID int
}

func DevicesList(conn *sqlite.Conn) ([]DevicesListResult, error) {
	const query = `SELECT devices.multihash, account_devices.device_id, account_devices.account_id
FROM account_devices
JOIN devices ON devices.id = account_devices.device_id`

	var out []DevicesListResult

	before := func(stmt *sqlite.Stmt) {
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, DevicesListResult{
			DevicesMultihash:        stmt.ColumnBytes(0),
			AccountDevicesDeviceID:  stmt.ColumnInt(1),
			AccountDevicesAccountID: stmt.ColumnInt(2),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: DevicesList: %w", err)
	}

	return out, err
}

func NamedVersionsReplace(conn *sqlite.Conn, namedVersionsObjectID int, namedVersionsAccountID int, namedVersionsDeviceID int, namedVersionsName string, namedVersionsVersion string) error {
	const query = `INSERT OR REPLACE INTO named_versions (object_id, account_id, device_id, name, version)
VALUES (:namedVersionsObjectID, :namedVersionsAccountID, :namedVersionsDeviceID, :namedVersionsName, :namedVersionsVersion)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt(":namedVersionsObjectID", namedVersionsObjectID)
		stmt.SetInt(":namedVersionsAccountID", namedVersionsAccountID)
		stmt.SetInt(":namedVersionsDeviceID", namedVersionsDeviceID)
		stmt.SetText(":namedVersionsName", namedVersionsName)
		stmt.SetText(":namedVersionsVersion", namedVersionsVersion)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: NamedVersionsReplace: %w", err)
	}

	return err
}

type NamedVersionsGetResult struct {
	NamedVersionsVersion string
}

func NamedVersionsGet(conn *sqlite.Conn, namedVersionsObjectID int, namedVersionsAccountID int, namedVersionsDeviceID int, namedVersionsName string) (NamedVersionsGetResult, error) {
	const query = `SELECT named_versions.version
FROM named_versions
WHERE named_versions.object_id = :namedVersionsObjectID
AND named_versions.account_id = :namedVersionsAccountID
AND named_versions.device_id = :namedVersionsDeviceID
AND named_versions.name = :namedVersionsName
LIMIT 1`

	var out NamedVersionsGetResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt(":namedVersionsObjectID", namedVersionsObjectID)
		stmt.SetInt(":namedVersionsAccountID", namedVersionsAccountID)
		stmt.SetInt(":namedVersionsDeviceID", namedVersionsDeviceID)
		stmt.SetText(":namedVersionsName", namedVersionsName)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("NamedVersionsGet: more than one result return for a single-kind query")
		}

		out.NamedVersionsVersion = stmt.ColumnText(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: NamedVersionsGet: %w", err)
	}

	return out, err
}

type NamedVersionsListByObjectOwnerResult struct {
	AccountsMultihash    []byte
	DevicesMultihash     []byte
	NamedVersionsVersion string
	PermanodeCodec       int
	PermanodeMultihash   []byte
}

func NamedVersionsListByObjectOwner(conn *sqlite.Conn, permanodeOwnersAccountID int) ([]NamedVersionsListByObjectOwnerResult, error) {
	const query = `SELECT accounts.multihash, devices.multihash, named_versions.version, ipfs_blocks.codec AS permanode_codec, ipfs_blocks.multihash AS permanode_multihash
FROM named_versions
INNER JOIN permanode_owners ON permanode_owners.permanode_id = named_versions.object_id
INNER JOIN devices ON devices.id = named_versions.device_id
INNER JOIN accounts ON accounts.id = named_versions.account_id
INNER JOIN ipfs_blocks ON ipfs_blocks.id = named_versions.object_id
WHERE permanode_owners.account_id = :permanodeOwnersAccountID
`

	var out []NamedVersionsListByObjectOwnerResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt(":permanodeOwnersAccountID", permanodeOwnersAccountID)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, NamedVersionsListByObjectOwnerResult{
			AccountsMultihash:    stmt.ColumnBytes(0),
			DevicesMultihash:     stmt.ColumnBytes(1),
			NamedVersionsVersion: stmt.ColumnText(2),
			PermanodeCodec:       stmt.ColumnInt(3),
			PermanodeMultihash:   stmt.ColumnBytes(4),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: NamedVersionsListByObjectOwner: %w", err)
	}

	return out, err
}

type IPFSBlocksLookupPKResult struct {
	IPFSBlocksID int
}

func IPFSBlocksLookupPK(conn *sqlite.Conn, ipfsBlocksMultihash []byte) (IPFSBlocksLookupPKResult, error) {
	const query = `SELECT ipfs_blocks.id
FROM ipfs_blocks
WHERE ipfs_blocks.multihash = :ipfsBlocksMultihash
`

	var out IPFSBlocksLookupPKResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":ipfsBlocksMultihash", ipfsBlocksMultihash)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("IPFSBlocksLookupPK: more than one result return for a single-kind query")
		}

		out.IPFSBlocksID = stmt.ColumnInt(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: IPFSBlocksLookupPK: %w", err)
	}

	return out, err
}

func DraftsInsert(conn *sqlite.Conn, ipfsBlocksMultihash []byte, draftsTitle string, draftsSubtitle string, draftsCreateTime int, draftsUpdateTime int) error {
	const query = `INSERT INTO drafts (id, title, subtitle, create_time, update_time)
VALUES (COALESCE((SELECT ipfs_blocks.id FROM ipfs_blocks WHERE ipfs_blocks.multihash = :ipfsBlocksMultihash LIMIT 1), -1000), :draftsTitle, :draftsSubtitle, :draftsCreateTime, :draftsUpdateTime)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":ipfsBlocksMultihash", ipfsBlocksMultihash)
		stmt.SetText(":draftsTitle", draftsTitle)
		stmt.SetText(":draftsSubtitle", draftsSubtitle)
		stmt.SetInt(":draftsCreateTime", draftsCreateTime)
		stmt.SetInt(":draftsUpdateTime", draftsUpdateTime)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: DraftsInsert: %w", err)
	}

	return err
}

func DraftsUpdate(conn *sqlite.Conn, draftsTitle string, draftsSubtitle string, draftsUpdateTime int, ipfsBlocksMultihash []byte) error {
	const query = `UPDATE drafts
SET (title, subtitle, update_time) = (:draftsTitle, :draftsSubtitle, :draftsUpdateTime)
WHERE drafts.id = COALESCE((SELECT ipfs_blocks.id FROM ipfs_blocks WHERE ipfs_blocks.multihash = :ipfsBlocksMultihash LIMIT 1), -1000)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":draftsTitle", draftsTitle)
		stmt.SetText(":draftsSubtitle", draftsSubtitle)
		stmt.SetInt(":draftsUpdateTime", draftsUpdateTime)
		stmt.SetBytes(":ipfsBlocksMultihash", ipfsBlocksMultihash)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: DraftsUpdate: %w", err)
	}

	return err
}

type DraftsListResult struct {
	IPFSBlocksMultihash []byte
	IPFSBlocksCodec     int
	DraftsTitle         string
	DraftsSubtitle      string
	DraftsCreateTime    int
	DraftsUpdateTime    int
}

func DraftsList(conn *sqlite.Conn) ([]DraftsListResult, error) {
	const query = `SELECT ipfs_blocks.multihash, ipfs_blocks.codec, drafts.title, drafts.subtitle, drafts.create_time, drafts.update_time
FROM drafts
JOIN ipfs_blocks ON ipfs_blocks.id = drafts.id
`

	var out []DraftsListResult

	before := func(stmt *sqlite.Stmt) {
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, DraftsListResult{
			IPFSBlocksMultihash: stmt.ColumnBytes(0),
			IPFSBlocksCodec:     stmt.ColumnInt(1),
			DraftsTitle:         stmt.ColumnText(2),
			DraftsSubtitle:      stmt.ColumnText(3),
			DraftsCreateTime:    stmt.ColumnInt(4),
			DraftsUpdateTime:    stmt.ColumnInt(5),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: DraftsList: %w", err)
	}

	return out, err
}

func DraftsDelete(conn *sqlite.Conn, ipfsBlocksMultihash []byte) error {
	const query = `DELETE FROM drafts
WHERE drafts.id = COALESCE((SELECT ipfs_blocks.id FROM ipfs_blocks WHERE ipfs_blocks.multihash = :ipfsBlocksMultihash LIMIT 1), -1000)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":ipfsBlocksMultihash", ipfsBlocksMultihash)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: DraftsDelete: %w", err)
	}

	return err
}

func PermanodesInsertOrIgnore(conn *sqlite.Conn, permanodesType string, permanodesID int, permanodesCreateTime int) error {
	const query = `INSERT OR IGNORE INTO permanodes (type, id, create_time)
VALUES (:permanodesType, :permanodesID, :permanodesCreateTime)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":permanodesType", permanodesType)
		stmt.SetInt(":permanodesID", permanodesID)
		stmt.SetInt(":permanodesCreateTime", permanodesCreateTime)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: PermanodesInsertOrIgnore: %w", err)
	}

	return err
}

func PermanodeOwnersInsertOrIgnore(conn *sqlite.Conn, permanodeOwnersAccountID int, permanodeOwnersPermanodeID int) error {
	const query = `INSERT OR IGNORE INTO permanode_owners (account_id, permanode_id)
VALUES (:permanodeOwnersAccountID, :permanodeOwnersPermanodeID)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt(":permanodeOwnersAccountID", permanodeOwnersAccountID)
		stmt.SetInt(":permanodeOwnersPermanodeID", permanodeOwnersPermanodeID)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: PermanodeOwnersInsertOrIgnore: %w", err)
	}

	return err
}

type PermanodesListWithVersionsByTypeResult struct {
	PermanodesID             int
	PermanodeOwnersAccountID int
	AccountsMultihash        []byte
	PermanodeCodec           int
	PermanodeMultihash       []byte
	PermanodesCreateTime     int
}

func PermanodesListWithVersionsByType(conn *sqlite.Conn, permanodesType string) ([]PermanodesListWithVersionsByTypeResult, error) {
	const query = `SELECT permanodes.id, permanode_owners.account_id, accounts.multihash, ipfs_blocks.codec AS permanode_codec, ipfs_blocks.multihash AS permanode_multihash, permanodes.create_time
FROM permanodes
JOIN ipfs_blocks ON ipfs_blocks.id = permanodes.id
JOIN permanode_owners ON permanode_owners.permanode_id = permanodes.id
JOIN accounts ON accounts.id = permanode_owners.account_id
WHERE permanodes.type = :permanodesType
AND permanodes.id IN (SELECT DISTINCT named_versions.object_id FROM named_versions)`

	var out []PermanodesListWithVersionsByTypeResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":permanodesType", permanodesType)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, PermanodesListWithVersionsByTypeResult{
			PermanodesID:             stmt.ColumnInt(0),
			PermanodeOwnersAccountID: stmt.ColumnInt(1),
			AccountsMultihash:        stmt.ColumnBytes(2),
			PermanodeCodec:           stmt.ColumnInt(3),
			PermanodeMultihash:       stmt.ColumnBytes(4),
			PermanodesCreateTime:     stmt.ColumnInt(5),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: PermanodesListWithVersionsByType: %w", err)
	}

	return out, err
}

type PermanodesListByTypeResult struct {
	PermanodesID             int
	PermanodeOwnersAccountID int
	AccountsMultihash        []byte
	PermanodeCodec           int
	PermanodeMultihash       []byte
	PermanodesCreateTime     int
}

func PermanodesListByType(conn *sqlite.Conn, permanodesType string) ([]PermanodesListByTypeResult, error) {
	const query = `SELECT permanodes.id, permanode_owners.account_id, accounts.multihash, ipfs_blocks.codec AS permanode_codec, ipfs_blocks.multihash AS permanode_multihash, permanodes.create_time
FROM permanodes
JOIN ipfs_blocks ON ipfs_blocks.id = permanodes.id
JOIN permanode_owners ON permanode_owners.permanode_id = permanodes.id JOIN accounts ON accounts.id = permanode_owners.account_id WHERE permanodes.type = :permanodesType`

	var out []PermanodesListByTypeResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":permanodesType", permanodesType)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, PermanodesListByTypeResult{
			PermanodesID:             stmt.ColumnInt(0),
			PermanodeOwnersAccountID: stmt.ColumnInt(1),
			AccountsMultihash:        stmt.ColumnBytes(2),
			PermanodeCodec:           stmt.ColumnInt(3),
			PermanodeMultihash:       stmt.ColumnBytes(4),
			PermanodesCreateTime:     stmt.ColumnInt(5),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: PermanodesListByType: %w", err)
	}

	return out, err
}

func ChangesInsertOrIgnore(conn *sqlite.Conn, changesID int, changesPermanodeID int, changesKind string, changesLamportTime int, changesCreateTime int) error {
	const query = `INSERT OR IGNORE INTO changes (id, permanode_id, kind, lamport_time, create_time)
VALUES (:changesID, :changesPermanodeID, :changesKind, :changesLamportTime, :changesCreateTime)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt(":changesID", changesID)
		stmt.SetInt(":changesPermanodeID", changesPermanodeID)
		stmt.SetText(":changesKind", changesKind)
		stmt.SetInt(":changesLamportTime", changesLamportTime)
		stmt.SetInt(":changesCreateTime", changesCreateTime)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: ChangesInsertOrIgnore: %w", err)
	}

	return err
}

func ChangeAuthorsInsertOrIgnore(conn *sqlite.Conn, changeAuthorsAccountID int, changeAuthorsChangeID int) error {
	const query = `INSERT OR IGNORE INTO change_authors (account_id, change_id)
VALUES (:changeAuthorsAccountID, :changeAuthorsChangeID)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt(":changeAuthorsAccountID", changeAuthorsAccountID)
		stmt.SetInt(":changeAuthorsChangeID", changeAuthorsChangeID)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: ChangeAuthorsInsertOrIgnore: %w", err)
	}

	return err
}
