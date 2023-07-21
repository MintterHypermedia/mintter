// Code generated by sqlitegen. DO NOT EDIT.

package hypersql

import (
	"errors"
	"fmt"

	"crawshaw.io/sqlite"
	"mintter/backend/pkg/sqlitegen"
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

func BlobsInsert(conn *sqlite.Conn, blobsID int64, blobsMultihash []byte, blobsCodec int64, blobsData []byte, blobsSize int64) (BlobsInsertResult, error) {
	const query = `INSERT INTO blobs (id, multihash, codec, data, size)
VALUES (NULLIF(:blobsID, 0), :blobsMultihash, :blobsCodec, :blobsData, :blobsSize)
RETURNING blobs.id`

	var out BlobsInsertResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt64(":blobsID", blobsID)
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
	KeyDelegationsBlob int64
}

func KeyDelegationsInsertOrIgnore(conn *sqlite.Conn, keyDelegationsBlob int64, keyDelegationsIssuer int64, keyDelegationsDelegate int64, keyDelegationsIssueTime int64) (KeyDelegationsInsertOrIgnoreResult, error) {
	const query = `INSERT OR IGNORE INTO key_delegations (blob, issuer, delegate, issue_time)
VALUES (:keyDelegationsBlob, :keyDelegationsIssuer, :keyDelegationsDelegate, :keyDelegationsIssueTime)
RETURNING key_delegations.blob`

	var out KeyDelegationsInsertOrIgnoreResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt64(":keyDelegationsBlob", keyDelegationsBlob)
		stmt.SetInt64(":keyDelegationsIssuer", keyDelegationsIssuer)
		stmt.SetInt64(":keyDelegationsDelegate", keyDelegationsDelegate)
		stmt.SetInt64(":keyDelegationsIssueTime", keyDelegationsIssueTime)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("KeyDelegationsInsertOrIgnore: more than one result return for a single-kind query")
		}

		out.KeyDelegationsBlob = stmt.ColumnInt64(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: KeyDelegationsInsertOrIgnore: %w", err)
	}

	return out, err
}

type KeyDelegationsListResult struct {
	KeyDelegationsViewBlob          int64
	KeyDelegationsViewBlobCodec     int64
	KeyDelegationsViewBlobMultihash []byte
	KeyDelegationsViewIssuer        []byte
	KeyDelegationsViewDelegate      []byte
	KeyDelegationsViewIssueTime     int64
}

func KeyDelegationsList(conn *sqlite.Conn, keyDelegationsViewIssuer []byte) ([]KeyDelegationsListResult, error) {
	const query = `SELECT key_delegations_view.blob, key_delegations_view.blob_codec, key_delegations_view.blob_multihash, key_delegations_view.issuer, key_delegations_view.delegate, key_delegations_view.issue_time
FROM key_delegations_view
WHERE key_delegations_view.issuer = :keyDelegationsViewIssuer`

	var out []KeyDelegationsListResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":keyDelegationsViewIssuer", keyDelegationsViewIssuer)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, KeyDelegationsListResult{
			KeyDelegationsViewBlob:          stmt.ColumnInt64(0),
			KeyDelegationsViewBlobCodec:     stmt.ColumnInt64(1),
			KeyDelegationsViewBlobMultihash: stmt.ColumnBytes(2),
			KeyDelegationsViewIssuer:        stmt.ColumnBytes(3),
			KeyDelegationsViewDelegate:      stmt.ColumnBytes(4),
			KeyDelegationsViewIssueTime:     stmt.ColumnInt64(5),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: KeyDelegationsList: %w", err)
	}

	return out, err
}

type KeyDelegationsListAllResult struct {
	KeyDelegationsViewBlob          int64
	KeyDelegationsViewBlobCodec     int64
	KeyDelegationsViewBlobMultihash []byte
	KeyDelegationsViewIssuer        []byte
	KeyDelegationsViewDelegate      []byte
	KeyDelegationsViewIssueTime     int64
}

func KeyDelegationsListAll(conn *sqlite.Conn) ([]KeyDelegationsListAllResult, error) {
	const query = `SELECT key_delegations_view.blob, key_delegations_view.blob_codec, key_delegations_view.blob_multihash, key_delegations_view.issuer, key_delegations_view.delegate, key_delegations_view.issue_time
FROM key_delegations_view`

	var out []KeyDelegationsListAllResult

	before := func(stmt *sqlite.Stmt) {
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, KeyDelegationsListAllResult{
			KeyDelegationsViewBlob:          stmt.ColumnInt64(0),
			KeyDelegationsViewBlobCodec:     stmt.ColumnInt64(1),
			KeyDelegationsViewBlobMultihash: stmt.ColumnBytes(2),
			KeyDelegationsViewIssuer:        stmt.ColumnBytes(3),
			KeyDelegationsViewDelegate:      stmt.ColumnBytes(4),
			KeyDelegationsViewIssueTime:     stmt.ColumnInt64(5),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: KeyDelegationsListAll: %w", err)
	}

	return out, err
}

type KeyDelegationsListByDelegateResult struct {
	KeyDelegationsViewBlob          int64
	KeyDelegationsViewBlobCodec     int64
	KeyDelegationsViewBlobMultihash []byte
	KeyDelegationsViewIssuer        []byte
	KeyDelegationsViewDelegate      []byte
	KeyDelegationsViewIssueTime     int64
}

func KeyDelegationsListByDelegate(conn *sqlite.Conn, keyDelegationsViewDelegate []byte) ([]KeyDelegationsListByDelegateResult, error) {
	const query = `SELECT key_delegations_view.blob, key_delegations_view.blob_codec, key_delegations_view.blob_multihash, key_delegations_view.issuer, key_delegations_view.delegate, key_delegations_view.issue_time
FROM key_delegations_view
WHERE key_delegations_view.delegate = :keyDelegationsViewDelegate`

	var out []KeyDelegationsListByDelegateResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":keyDelegationsViewDelegate", keyDelegationsViewDelegate)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, KeyDelegationsListByDelegateResult{
			KeyDelegationsViewBlob:          stmt.ColumnInt64(0),
			KeyDelegationsViewBlobCodec:     stmt.ColumnInt64(1),
			KeyDelegationsViewBlobMultihash: stmt.ColumnBytes(2),
			KeyDelegationsViewIssuer:        stmt.ColumnBytes(3),
			KeyDelegationsViewDelegate:      stmt.ColumnBytes(4),
			KeyDelegationsViewIssueTime:     stmt.ColumnInt64(5),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: KeyDelegationsListByDelegate: %w", err)
	}

	return out, err
}

type EntitiesInsertOrIgnoreResult struct {
	HDEntitiesID int64
}

func EntitiesInsertOrIgnore(conn *sqlite.Conn, hdEntitiesEID string) (EntitiesInsertOrIgnoreResult, error) {
	const query = `INSERT OR IGNORE INTO hd_entities (eid)
VALUES (:hdEntitiesEID)
RETURNING hd_entities.id`

	var out EntitiesInsertOrIgnoreResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":hdEntitiesEID", hdEntitiesEID)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("EntitiesInsertOrIgnore: more than one result return for a single-kind query")
		}

		out.HDEntitiesID = stmt.ColumnInt64(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: EntitiesInsertOrIgnore: %w", err)
	}

	return out, err
}

type EntitiesLookupIDResult struct {
	HDEntitiesID int64
}

func EntitiesLookupID(conn *sqlite.Conn, hdEntitiesEID string) (EntitiesLookupIDResult, error) {
	const query = `SELECT hd_entities.id
FROM hd_entities
WHERE hd_entities.eid = :hdEntitiesEID
LIMIT 1`

	var out EntitiesLookupIDResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":hdEntitiesEID", hdEntitiesEID)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("EntitiesLookupID: more than one result return for a single-kind query")
		}

		out.HDEntitiesID = stmt.ColumnInt64(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: EntitiesLookupID: %w", err)
	}

	return out, err
}

type EntitiesListByPrefixResult struct {
	HDEntitiesID  int64
	HDEntitiesEID string
}

func EntitiesListByPrefix(conn *sqlite.Conn, prefix string) ([]EntitiesListByPrefixResult, error) {
	const query = `SELECT hd_entities.id, hd_entities.eid
FROM hd_entities
WHERE hd_entities.eid GLOB :prefix
ORDER BY hd_entities.id`

	var out []EntitiesListByPrefixResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":prefix", prefix)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, EntitiesListByPrefixResult{
			HDEntitiesID:  stmt.ColumnInt64(0),
			HDEntitiesEID: stmt.ColumnText(1),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: EntitiesListByPrefix: %w", err)
	}

	return out, err
}

func EntitiesDelete(conn *sqlite.Conn, hdEntitiesEID string) error {
	const query = `DELETE FROM hd_entities
WHERE hd_entities.eid = :hdEntitiesEID`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":hdEntitiesEID", hdEntitiesEID)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: EntitiesDelete: %w", err)
	}

	return err
}

func ChangesInsertOrIgnore(conn *sqlite.Conn, hdChangesBlob int64, hdChangesEntity int64, hdChangesHlcTime int64) error {
	const query = `INSERT OR IGNORE INTO hd_changes (blob, entity, hlc_time)
VALUES (:hdChangesBlob, :hdChangesEntity, :hdChangesHlcTime)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt64(":hdChangesBlob", hdChangesBlob)
		stmt.SetInt64(":hdChangesEntity", hdChangesEntity)
		stmt.SetInt64(":hdChangesHlcTime", hdChangesHlcTime)
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

type ChangesListFromChangeSetResult struct {
	HDChangesViewBlobID    int64
	HDChangesViewCodec     int64
	HDChangesViewData      []byte
	HDChangesViewEntityID  int64
	HDChangesViewHlcTime   int64
	HDChangesViewMultihash []byte
	HDChangesViewSize      int64
}

func ChangesListFromChangeSet(conn *sqlite.Conn, cset []byte, hdChangesViewEntity string) ([]ChangesListFromChangeSetResult, error) {
	const query = `SELECT hd_changes_view.blob_id, hd_changes_view.codec, hd_changes_view.data, hd_changes_view.entity_id, hd_changes_view.hlc_time, hd_changes_view.multihash, hd_changes_view.size
FROM hd_changes_view, json_each(:cset) AS cset
WHERE hd_changes_view.entity = :hdChangesViewEntity
AND hd_changes_view.blob_id = cset.value
ORDER BY hd_changes_view.hlc_time`

	var out []ChangesListFromChangeSetResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":cset", cset)
		stmt.SetText(":hdChangesViewEntity", hdChangesViewEntity)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, ChangesListFromChangeSetResult{
			HDChangesViewBlobID:    stmt.ColumnInt64(0),
			HDChangesViewCodec:     stmt.ColumnInt64(1),
			HDChangesViewData:      stmt.ColumnBytes(2),
			HDChangesViewEntityID:  stmt.ColumnInt64(3),
			HDChangesViewHlcTime:   stmt.ColumnInt64(4),
			HDChangesViewMultihash: stmt.ColumnBytes(5),
			HDChangesViewSize:      stmt.ColumnInt64(6),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: ChangesListFromChangeSet: %w", err)
	}

	return out, err
}

type ChangesListForEntityResult struct {
	HDChangesViewBlobID    int64
	HDChangesViewCodec     int64
	HDChangesViewData      []byte
	HDChangesViewEntityID  int64
	HDChangesViewHlcTime   int64
	HDChangesViewMultihash []byte
	HDChangesViewSize      int64
}

func ChangesListForEntity(conn *sqlite.Conn, hdChangesViewEntity string) ([]ChangesListForEntityResult, error) {
	const query = `SELECT hd_changes_view.blob_id, hd_changes_view.codec, hd_changes_view.data, hd_changes_view.entity_id, hd_changes_view.hlc_time, hd_changes_view.multihash, hd_changes_view.size
FROM hd_changes_view
WHERE hd_changes_view.entity = :hdChangesViewEntity
ORDER BY hd_changes_view.hlc_time`

	var out []ChangesListForEntityResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":hdChangesViewEntity", hdChangesViewEntity)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, ChangesListForEntityResult{
			HDChangesViewBlobID:    stmt.ColumnInt64(0),
			HDChangesViewCodec:     stmt.ColumnInt64(1),
			HDChangesViewData:      stmt.ColumnBytes(2),
			HDChangesViewEntityID:  stmt.ColumnInt64(3),
			HDChangesViewHlcTime:   stmt.ColumnInt64(4),
			HDChangesViewMultihash: stmt.ColumnBytes(5),
			HDChangesViewSize:      stmt.ColumnInt64(6),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: ChangesListForEntity: %w", err)
	}

	return out, err
}

type ChangesListPublicNoDataResult struct {
	HDChangesViewBlobID    int64
	HDChangesViewCodec     int64
	HDChangesViewEntityID  int64
	HDChangesViewHlcTime   int64
	HDChangesViewMultihash []byte
	HDChangesViewSize      int64
	HDChangesViewEntity    string
	HDDraftsBlob           int64
}

func ChangesListPublicNoData(conn *sqlite.Conn) ([]ChangesListPublicNoDataResult, error) {
	const query = `SELECT hd_changes_view.blob_id, hd_changes_view.codec, hd_changes_view.entity_id, hd_changes_view.hlc_time, hd_changes_view.multihash, hd_changes_view.size, hd_changes_view.entity, hd_drafts.blob
FROM hd_changes_view
LEFT JOIN hd_drafts ON hd_drafts.entity = hd_changes_view.entity_id
WHERE hd_drafts.blob IS NULL
ORDER BY hd_changes_view.entity, hd_changes_view.hlc_time`

	var out []ChangesListPublicNoDataResult

	before := func(stmt *sqlite.Stmt) {
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, ChangesListPublicNoDataResult{
			HDChangesViewBlobID:    stmt.ColumnInt64(0),
			HDChangesViewCodec:     stmt.ColumnInt64(1),
			HDChangesViewEntityID:  stmt.ColumnInt64(2),
			HDChangesViewHlcTime:   stmt.ColumnInt64(3),
			HDChangesViewMultihash: stmt.ColumnBytes(4),
			HDChangesViewSize:      stmt.ColumnInt64(5),
			HDChangesViewEntity:    stmt.ColumnText(6),
			HDDraftsBlob:           stmt.ColumnInt64(7),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: ChangesListPublicNoData: %w", err)
	}

	return out, err
}

type ChangesResolveHeadsResult struct {
	ResolvedJSON []byte
}

func ChangesResolveHeads(conn *sqlite.Conn, heads []byte) (ChangesResolveHeadsResult, error) {
	const query = `WITH RECURSIVE changeset (change) AS (SELECT value FROM json_each(:heads) UNION SELECT hd_change_deps.parent FROM hd_change_deps JOIN changeset ON changeset.change = hd_change_deps.child)
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

		out.ResolvedJSON = stmt.ColumnBytes(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: ChangesResolveHeads: %w", err)
	}

	return out, err
}

type ChangesGetPublicHeadsJSONResult struct {
	Heads []byte
}

func ChangesGetPublicHeadsJSON(conn *sqlite.Conn, entity int64) (ChangesGetPublicHeadsJSONResult, error) {
	const query = `WITH
non_drafts (blob) AS (
	SELECT hd_changes.blob
	FROM hd_changes
	LEFT JOIN hd_drafts ON hd_drafts.entity = hd_changes.entity AND hd_changes.blob = hd_drafts.blob
	WHERE hd_changes.entity = :entity
	AND hd_drafts.blob IS NULL
),
deps (blob) AS (
	SELECT DISTINCT hd_change_deps.parent
	FROM hd_change_deps
	JOIN non_drafts ON non_drafts.blob = hd_change_deps.child
)
SELECT json_group_array(blob) AS heads
FROM non_drafts
WHERE blob NOT IN deps`

	var out ChangesGetPublicHeadsJSONResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt64(":entity", entity)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("ChangesGetPublicHeadsJSON: more than one result return for a single-kind query")
		}

		out.Heads = stmt.ColumnBytes(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: ChangesGetPublicHeadsJSON: %w", err)
	}

	return out, err
}

func ChangesDeleteForEntity(conn *sqlite.Conn, hdChangesEntity int64) error {
	const query = `DELETE FROM blobs
WHERE blobs.id IN (SELECT hd_changes.blob FROM hd_changes WHERE hd_changes.entity = :hdChangesEntity)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt64(":hdChangesEntity", hdChangesEntity)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: ChangesDeleteForEntity: %w", err)
	}

	return err
}

func LinksInsert(conn *sqlite.Conn, hdLinksSourceBlob int64, hdLinksRel string, hdLinksTargetBlob int64, hdLinksTargetEntity int64, hdLinksData []byte) error {
	const query = `INSERT OR IGNORE INTO hd_links (source_blob, rel, target_blob, target_entity, data)
VALUES (:hdLinksSourceBlob, :hdLinksRel, NULLIF(:hdLinksTargetBlob, 0), NULLIF(:hdLinksTargetEntity, 0), :hdLinksData)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt64(":hdLinksSourceBlob", hdLinksSourceBlob)
		stmt.SetText(":hdLinksRel", hdLinksRel)
		stmt.SetInt64(":hdLinksTargetBlob", hdLinksTargetBlob)
		stmt.SetInt64(":hdLinksTargetEntity", hdLinksTargetEntity)
		stmt.SetBytes(":hdLinksData", hdLinksData)
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

type BacklinksForEntityResult struct {
	ContentLinksViewData                []byte
	ContentLinksViewRel                 string
	ContentLinksViewSourceBlob          int64
	ContentLinksViewSourceBlobCodec     int64
	ContentLinksViewSourceBlobMultihash []byte
	ContentLinksViewSourceEID           string
	ContentLinksViewSourceEntity        int64
	ContentLinksViewTargetEID           string
	ContentLinksViewTargetEntity        int64
}

func BacklinksForEntity(conn *sqlite.Conn, contentLinksViewTargetEID string) ([]BacklinksForEntityResult, error) {
	const query = `SELECT content_links_view.data, content_links_view.rel, content_links_view.source_blob, content_links_view.source_blob_codec, content_links_view.source_blob_multihash, content_links_view.source_eid, content_links_view.source_entity, content_links_view.target_eid, content_links_view.target_entity
FROM content_links_view
WHERE content_links_view.target_eid = :contentLinksViewTargetEID`

	var out []BacklinksForEntityResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":contentLinksViewTargetEID", contentLinksViewTargetEID)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, BacklinksForEntityResult{
			ContentLinksViewData:                stmt.ColumnBytes(0),
			ContentLinksViewRel:                 stmt.ColumnText(1),
			ContentLinksViewSourceBlob:          stmt.ColumnInt64(2),
			ContentLinksViewSourceBlobCodec:     stmt.ColumnInt64(3),
			ContentLinksViewSourceBlobMultihash: stmt.ColumnBytes(4),
			ContentLinksViewSourceEID:           stmt.ColumnText(5),
			ContentLinksViewSourceEntity:        stmt.ColumnInt64(6),
			ContentLinksViewTargetEID:           stmt.ColumnText(7),
			ContentLinksViewTargetEntity:        stmt.ColumnInt64(8),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: BacklinksForEntity: %w", err)
	}

	return out, err
}

func DraftsInsert(conn *sqlite.Conn, hdDraftsEntity int64, hdDraftsBlob int64) error {
	const query = `INSERT INTO hd_drafts (entity, blob)
VALUES (:hdDraftsEntity, :hdDraftsBlob)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt64(":hdDraftsEntity", hdDraftsEntity)
		stmt.SetInt64(":hdDraftsBlob", hdDraftsBlob)
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

type DraftsGetResult struct {
	HDDraftsViewBlobID    int64
	HDDraftsViewCodec     int64
	HDDraftsViewEntity    string
	HDDraftsViewEntityID  int64
	HDDraftsViewMultihash []byte
}

func DraftsGet(conn *sqlite.Conn, hdDraftsViewEntity string) (DraftsGetResult, error) {
	const query = `SELECT hd_drafts_view.blob_id, hd_drafts_view.codec, hd_drafts_view.entity, hd_drafts_view.entity_id, hd_drafts_view.multihash
FROM hd_drafts_view
WHERE hd_drafts_view.entity = :hdDraftsViewEntity LIMIT 1`

	var out DraftsGetResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":hdDraftsViewEntity", hdDraftsViewEntity)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("DraftsGet: more than one result return for a single-kind query")
		}

		out.HDDraftsViewBlobID = stmt.ColumnInt64(0)
		out.HDDraftsViewCodec = stmt.ColumnInt64(1)
		out.HDDraftsViewEntity = stmt.ColumnText(2)
		out.HDDraftsViewEntityID = stmt.ColumnInt64(3)
		out.HDDraftsViewMultihash = stmt.ColumnBytes(4)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: DraftsGet: %w", err)
	}

	return out, err
}

func DraftsDelete(conn *sqlite.Conn, hdDraftsBlob int64) error {
	const query = `DELETE FROM hd_drafts
WHERE hd_drafts.blob = :hdDraftsBlob`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt64(":hdDraftsBlob", hdDraftsBlob)
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

func SetReindexTime(conn *sqlite.Conn, globalMetaValue string) error {
	const query = `INSERT OR REPLACE INTO global_meta (key, value)
VALUES ('last_reindex_time', :globalMetaValue)
`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":globalMetaValue", globalMetaValue)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: SetReindexTime: %w", err)
	}

	return err
}

type GetReindexTimeResult struct {
	GlobalMetaValue string
}

func GetReindexTime(conn *sqlite.Conn) (GetReindexTimeResult, error) {
	const query = `SELECT global_meta.value
FROM global_meta
WHERE global_meta.key = 'last_reindex_time'
LIMIT 1`

	var out GetReindexTimeResult

	before := func(stmt *sqlite.Stmt) {
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("GetReindexTime: more than one result return for a single-kind query")
		}

		out.GlobalMetaValue = stmt.ColumnText(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: GetReindexTime: %w", err)
	}

	return out, err
}
