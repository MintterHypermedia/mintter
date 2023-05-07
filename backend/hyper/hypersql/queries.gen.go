// Code generated by sqlitegen. DO NOT EDIT.

package hypersql

import (
	"errors"
	"fmt"

	"crawshaw.io/sqlite"
	"mintter/backend/db/sqlitegen"
)

var _ = errors.New

type BlobsHaveResult struct {
	Have int64
}

func BlobsHave(conn *sqlite.Conn, blobsMultihash []byte) (BlobsHaveResult, error) {
	const query = `SELECT 1 AS have
FROM blobs
WHERE blobs.multihash = :blobsMultihash
AND blobs.size >= 0`

	var out BlobsHaveResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":blobsMultihash", blobsMultihash)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("BlobsHave: more than one result return for a single-kind query")
		}

		out.Have = stmt.ColumnInt64(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: BlobsHave: %w", err)
	}

	return out, err
}

type BlobsGetResult struct {
	BlobsID        int64
	BlobsMultihash []byte
	BlobsCodec     int64
	BlobsData      []byte
	BlobsSize      int64
}

func BlobsGet(conn *sqlite.Conn, blobsMultihash []byte) (BlobsGetResult, error) {
	const query = `SELECT blobs.id, blobs.multihash, blobs.codec, blobs.data, blobs.size
FROM blobs
WHERE blobs.multihash = :blobsMultihash AND blobs.size >= 0`

	var out BlobsGetResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":blobsMultihash", blobsMultihash)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("BlobsGet: more than one result return for a single-kind query")
		}

		out.BlobsID = stmt.ColumnInt64(0)
		out.BlobsMultihash = stmt.ColumnBytes(1)
		out.BlobsCodec = stmt.ColumnInt64(2)
		out.BlobsData = stmt.ColumnBytes(3)
		out.BlobsSize = stmt.ColumnInt64(4)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: BlobsGet: %w", err)
	}

	return out, err
}

type BlobsGetSizeResult struct {
	BlobsID   int64
	BlobsSize int64
}

func BlobsGetSize(conn *sqlite.Conn, blobsMultihash []byte) (BlobsGetSizeResult, error) {
	const query = `SELECT blobs.id, blobs.size
FROM blobs
WHERE blobs.multihash = :blobsMultihash`

	var out BlobsGetSizeResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":blobsMultihash", blobsMultihash)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("BlobsGetSize: more than one result return for a single-kind query")
		}

		out.BlobsID = stmt.ColumnInt64(0)
		out.BlobsSize = stmt.ColumnInt64(1)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: BlobsGetSize: %w", err)
	}

	return out, err
}

func BlobsUpdate(conn *sqlite.Conn, blobsData []byte, blobsSize int64, blobsID int64) error {
	const query = `UPDATE blobs
SET (data, size) = (:blobsData, :blobsSize)
WHERE blobs.id = :blobsID`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":blobsData", blobsData)
		stmt.SetInt64(":blobsSize", blobsSize)
		stmt.SetInt64(":blobsID", blobsID)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: BlobsUpdate: %w", err)
	}

	return err
}

type BlobsInsertResult struct {
	BlobsID int64
}

func BlobsInsert(conn *sqlite.Conn, blobsMultihash []byte, blobsCodec int64, blobsData []byte, blobsSize int64) (BlobsInsertResult, error) {
	const query = `INSERT INTO blobs (multihash, codec, data, size)
VALUES (:blobsMultihash, :blobsCodec, :blobsData, :blobsSize)
RETURNING blobs.id`

	var out BlobsInsertResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":blobsMultihash", blobsMultihash)
		stmt.SetInt64(":blobsCodec", blobsCodec)
		stmt.SetBytes(":blobsData", blobsData)
		stmt.SetInt64(":blobsSize", blobsSize)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("BlobsInsert: more than one result return for a single-kind query")
		}

		out.BlobsID = stmt.ColumnInt64(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: BlobsInsert: %w", err)
	}

	return out, err
}

type BlobsDeleteResult struct {
	BlobsID int64
}

func BlobsDelete(conn *sqlite.Conn, blobsMultihash []byte) (BlobsDeleteResult, error) {
	const query = `DELETE FROM blobs
WHERE blobs.multihash = :blobsMultihash
RETURNING blobs.id`

	var out BlobsDeleteResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":blobsMultihash", blobsMultihash)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("BlobsDelete: more than one result return for a single-kind query")
		}

		out.BlobsID = stmt.ColumnInt64(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: BlobsDelete: %w", err)
	}

	return out, err
}

type BlobsListKnownResult struct {
	BlobsID        int64
	BlobsMultihash []byte
	BlobsCodec     int64
}

func BlobsListKnown(conn *sqlite.Conn) ([]BlobsListKnownResult, error) {
	const query = `SELECT blobs.id, blobs.multihash, blobs.codec
FROM blobs
WHERE blobs.size >= 0`

	var out []BlobsListKnownResult

	before := func(stmt *sqlite.Stmt) {
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, BlobsListKnownResult{
			BlobsID:        stmt.ColumnInt64(0),
			BlobsMultihash: stmt.ColumnBytes(1),
			BlobsCodec:     stmt.ColumnInt64(2),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: BlobsListKnown: %w", err)
	}

	return out, err
}

type PublicKeysLookupIDResult struct {
	PublicKeysID int64
}

func PublicKeysLookupID(conn *sqlite.Conn, publicKeysPrincipal []byte) (PublicKeysLookupIDResult, error) {
	const query = `SELECT public_keys.id
FROM public_keys
WHERE public_keys.principal = :publicKeysPrincipal
LIMIT 1`

	var out PublicKeysLookupIDResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":publicKeysPrincipal", publicKeysPrincipal)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("PublicKeysLookupID: more than one result return for a single-kind query")
		}

		out.PublicKeysID = stmt.ColumnInt64(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: PublicKeysLookupID: %w", err)
	}

	return out, err
}

type PublicKeysInsertResult struct {
	PublicKeysID int64
}

func PublicKeysInsert(conn *sqlite.Conn, publicKeysPrincipal []byte) (PublicKeysInsertResult, error) {
	const query = `INSERT INTO public_keys (principal)
VALUES (:publicKeysPrincipal)
RETURNING public_keys.id`

	var out PublicKeysInsertResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":publicKeysPrincipal", publicKeysPrincipal)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("PublicKeysInsert: more than one result return for a single-kind query")
		}

		out.PublicKeysID = stmt.ColumnInt64(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: PublicKeysInsert: %w", err)
	}

	return out, err
}

type KeyDelegationsInsertOrIgnoreResult struct {
	KeyDelegationsID int64
}

func KeyDelegationsInsertOrIgnore(conn *sqlite.Conn, keyDelegationsID int64, keyDelegationsIssuer int64, keyDelegationsDelegate int64, keyDelegationsIssueTime int64) (KeyDelegationsInsertOrIgnoreResult, error) {
	const query = `INSERT OR IGNORE INTO key_delegations (id, issuer, delegate, issue_time)
VALUES (:keyDelegationsID, :keyDelegationsIssuer, :keyDelegationsDelegate, :keyDelegationsIssueTime)
RETURNING key_delegations.id`

	var out KeyDelegationsInsertOrIgnoreResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt64(":keyDelegationsID", keyDelegationsID)
		stmt.SetInt64(":keyDelegationsIssuer", keyDelegationsIssuer)
		stmt.SetInt64(":keyDelegationsDelegate", keyDelegationsDelegate)
		stmt.SetInt64(":keyDelegationsIssueTime", keyDelegationsIssueTime)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("KeyDelegationsInsertOrIgnore: more than one result return for a single-kind query")
		}

		out.KeyDelegationsID = stmt.ColumnInt64(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: KeyDelegationsInsertOrIgnore: %w", err)
	}

	return out, err
}

type KeyDelegationsListResult struct {
	KeyDelegationsViewID             int64
	KeyDelegationsViewBlobCodec      int64
	KeyDelegationsViewBlobsMultihash []byte
	KeyDelegationsViewIssuer         []byte
	KeyDelegationsViewDelegate       []byte
	KeyDelegationsViewIssueTime      int64
}

func KeyDelegationsList(conn *sqlite.Conn, keyDelegationsViewIssuer []byte) ([]KeyDelegationsListResult, error) {
	const query = `SELECT key_delegations_view.id, key_delegations_view.blob_codec, key_delegations_view.blobs_multihash, key_delegations_view.issuer, key_delegations_view.delegate, key_delegations_view.issue_time
FROM key_delegations_view
WHERE key_delegations_view.issuer = :keyDelegationsViewIssuer`

	var out []KeyDelegationsListResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":keyDelegationsViewIssuer", keyDelegationsViewIssuer)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, KeyDelegationsListResult{
			KeyDelegationsViewID:             stmt.ColumnInt64(0),
			KeyDelegationsViewBlobCodec:      stmt.ColumnInt64(1),
			KeyDelegationsViewBlobsMultihash: stmt.ColumnBytes(2),
			KeyDelegationsViewIssuer:         stmt.ColumnBytes(3),
			KeyDelegationsViewDelegate:       stmt.ColumnBytes(4),
			KeyDelegationsViewIssueTime:      stmt.ColumnInt64(5),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: KeyDelegationsList: %w", err)
	}

	return out, err
}

type EntitiesInsertOrIgnoreResult struct {
	HyperEntitiesID int64
}

func EntitiesInsertOrIgnore(conn *sqlite.Conn, hyperEntitiesEid string) (EntitiesInsertOrIgnoreResult, error) {
	const query = `INSERT OR IGNORE INTO hyper_entities (eid)
VALUES (:hyperEntitiesEid)
RETURNING hyper_entities.id`

	var out EntitiesInsertOrIgnoreResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":hyperEntitiesEid", hyperEntitiesEid)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("EntitiesInsertOrIgnore: more than one result return for a single-kind query")
		}

		out.HyperEntitiesID = stmt.ColumnInt64(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: EntitiesInsertOrIgnore: %w", err)
	}

	return out, err
}

type EntitiesLookupIDResult struct {
	HyperEntitiesID int64
}

func EntitiesLookupID(conn *sqlite.Conn, hyperEntitiesEid string) (EntitiesLookupIDResult, error) {
	const query = `SELECT hyper_entities.id
FROM hyper_entities
WHERE hyper_entities.eid = :hyperEntitiesEid
LIMIT 1`

	var out EntitiesLookupIDResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":hyperEntitiesEid", hyperEntitiesEid)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("EntitiesLookupID: more than one result return for a single-kind query")
		}

		out.HyperEntitiesID = stmt.ColumnInt64(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: EntitiesLookupID: %w", err)
	}

	return out, err
}

func ChangesInsertOrIgnore(conn *sqlite.Conn, hyperChangesBlob int64, hyperChangesEntity int64, hyperChangesHlcTime int64) error {
	const query = `INSERT OR IGNORE INTO hyper_changes (blob, entity, hlc_time)
VALUES (:hyperChangesBlob, :hyperChangesEntity, :hyperChangesHlcTime)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt64(":hyperChangesBlob", hyperChangesBlob)
		stmt.SetInt64(":hyperChangesEntity", hyperChangesEntity)
		stmt.SetInt64(":hyperChangesHlcTime", hyperChangesHlcTime)
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

type ChangesListForEntityResult struct {
	HyperChangesByEntityViewBlobID    int64
	HyperChangesByEntityViewCodec     int64
	HyperChangesByEntityViewData      []byte
	HyperChangesByEntityViewHlcTime   int64
	HyperChangesByEntityViewMultihash []byte
	HyperChangesByEntityViewSize      int64
	IsDraft                           int64
}

func ChangesListForEntity(conn *sqlite.Conn, hyperChangesByEntityViewEntityID int64, is_draft int64) ([]ChangesListForEntityResult, error) {
	const query = `SELECT hyper_changes_by_entity_view.blob_id, hyper_changes_by_entity_view.codec, hyper_changes_by_entity_view.data, hyper_changes_by_entity_view.hlc_time, hyper_changes_by_entity_view.multihash, hyper_changes_by_entity_view.size, IIF(hyper_changes_by_entity_view.draft IS NULL, 0, 1) AS is_draft
FROM hyper_changes_by_entity_view
WHERE hyper_changes_by_entity_view.entity_id = :hyperChangesByEntityViewEntityID
AND is_draft <= :is_draft`

	var out []ChangesListForEntityResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt64(":hyperChangesByEntityViewEntityID", hyperChangesByEntityViewEntityID)
		stmt.SetInt64(":is_draft", is_draft)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, ChangesListForEntityResult{
			HyperChangesByEntityViewBlobID:    stmt.ColumnInt64(0),
			HyperChangesByEntityViewCodec:     stmt.ColumnInt64(1),
			HyperChangesByEntityViewData:      stmt.ColumnBytes(2),
			HyperChangesByEntityViewHlcTime:   stmt.ColumnInt64(3),
			HyperChangesByEntityViewMultihash: stmt.ColumnBytes(4),
			HyperChangesByEntityViewSize:      stmt.ColumnInt64(5),
			IsDraft:                           stmt.ColumnInt64(6),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: ChangesListForEntity: %w", err)
	}

	return out, err
}

type ChangesResolveHeadsResult struct {
	ResolvedJson []byte
}

func ChangesResolveHeads(conn *sqlite.Conn, heads []byte) (ChangesResolveHeadsResult, error) {
	const query = `WITH RECURSIVE changeset (change) AS (SELECT value FROM json_each(:heads) UNION SELECT hyper_links.target_blob FROM hyper_links JOIN changeset ON changeset.change = hyper_links.source_blob WHERE hyper_links.rel = change:depends)
SELECT json_group_array(change) AS resolved_json
FROM changeset
LIMIT 1`

	var out ChangesResolveHeadsResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":heads", heads)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("ChangesResolveHeads: more than one result return for a single-kind query")
		}

		out.ResolvedJson = stmt.ColumnBytes(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: ChangesResolveHeads: %w", err)
	}

	return out, err
}

func LinksInsert(conn *sqlite.Conn, hyperLinksSourceBlob int64, hyperLinksRel string, hyperLinksTargetBlob int64, hyperLinksTargetEntity int64, hyperLinksData []byte) error {
	const query = `INSERT OR IGNORE INTO hyper_links (source_blob, rel, target_blob, target_entity, data)
VALUES (:hyperLinksSourceBlob, :hyperLinksRel, NULLIF(:hyperLinksTargetBlob, 0), NULLIF(:hyperLinksTargetEntity, 0), :hyperLinksData)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt64(":hyperLinksSourceBlob", hyperLinksSourceBlob)
		stmt.SetText(":hyperLinksRel", hyperLinksRel)
		stmt.SetInt64(":hyperLinksTargetBlob", hyperLinksTargetBlob)
		stmt.SetInt64(":hyperLinksTargetEntity", hyperLinksTargetEntity)
		stmt.SetBytes(":hyperLinksData", hyperLinksData)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: LinksInsert: %w", err)
	}

	return err
}

func DraftsInsert(conn *sqlite.Conn, draftBlobsBlob int64) error {
	const query = `INSERT INTO draft_blobs (blob)
VALUES (:draftBlobsBlob)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt64(":draftBlobsBlob", draftBlobsBlob)
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

type DraftsListResult struct {
	HyperChangesBlob int64
}

func DraftsList(conn *sqlite.Conn, hyperChangesEntity int64) ([]DraftsListResult, error) {
	const query = `SELECT hyper_changes.blob
FROM hyper_changes
JOIN draft_blobs ON draft_blobs.blob = hyper_changes.blob
WHERE hyper_changes.entity = :hyperChangesEntity`

	var out []DraftsListResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt64(":hyperChangesEntity", hyperChangesEntity)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, DraftsListResult{
			HyperChangesBlob: stmt.ColumnInt64(0),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: DraftsList: %w", err)
	}

	return out, err
}
