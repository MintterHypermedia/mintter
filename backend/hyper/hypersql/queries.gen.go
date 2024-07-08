// Code generated by sqlitegen. DO NOT EDIT.

package hypersql

import (
	"errors"
	"fmt"

	"crawshaw.io/sqlite"
	"seed/backend/pkg/sqlitegen"
)

var _ = errors.New

type BlobsHaveResult struct {
	Have int64
}

func BlobsHave(conn *sqlite.Conn, blobsMultihash []byte) (BlobsHaveResult, error) {
	const query = `SELECT 1 AS have
FROM blobs INDEXED BY blobs_metadata_by_hash
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
FROM blobs INDEXED BY blobs_metadata_by_hash
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

func BlobsEmptyByHash(conn *sqlite.Conn, blobsMultihash []byte) error {
	const query = `UPDATE blobs
SET data ='NULL', size =-1
WHERE blobs.multihash = :blobsMultihash`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":blobsMultihash", blobsMultihash)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: BlobsEmptyByHash: %w", err)
	}

	return err
}

func BlobsEmptyByEID(conn *sqlite.Conn, eid string) error {
	const query = `UPDATE blobs
SET data = 'NULL', size =-1
WHERE blobs.id IN (SELECT structural_blobs_view.blob_id FROM structural_blobs_view WHERE structural_blobs_view.resource = :eid)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":eid", eid)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: BlobsEmptyByEID: %w", err)
	}

	return err
}

func BlobsStructuralDelete(conn *sqlite.Conn, eid string) error {
	const query = `DELETE FROM structural_blobs
WHERE structural_blobs.id IN (SELECT structural_blobs_view.blob_id FROM structural_blobs_view WHERE structural_blobs_view.resource = :eid)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":eid", eid)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: BlobsStructuralDelete: %w", err)
	}

	return err
}

type BlobsListKnownResult struct {
	BlobsID        int64
	BlobsMultihash []byte
	BlobsCodec     int64
}

func BlobsListKnown(conn *sqlite.Conn) ([]BlobsListKnownResult, error) {
	const query = `SELECT blobs.id, blobs.multihash, blobs.codec
FROM blobs INDEXED BY blobs_metadata
WHERE blobs.size >= 0
ORDER BY blobs.id`

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

func BlobLinksInsertOrIgnore(conn *sqlite.Conn, blobLinksSource int64, blobLinksType string, blobLinksTarget int64) error {
	const query = `INSERT OR IGNORE INTO blob_links (source, type, target)
VALUES (:blobLinksSource, :blobLinksType, :blobLinksTarget)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt64(":blobLinksSource", blobLinksSource)
		stmt.SetText(":blobLinksType", blobLinksType)
		stmt.SetInt64(":blobLinksTarget", blobLinksTarget)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: BlobLinksInsertOrIgnore: %w", err)
	}

	return err
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

type PublicKeysLookupPrincipalResult struct {
	PublicKeysPrincipal []byte
}

func PublicKeysLookupPrincipal(conn *sqlite.Conn, publicKeysID int64) (PublicKeysLookupPrincipalResult, error) {
	const query = `SELECT public_keys.principal
FROM public_keys
WHERE public_keys.id = :publicKeysID
LIMIT 1`

	var out PublicKeysLookupPrincipalResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt64(":publicKeysID", publicKeysID)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("PublicKeysLookupPrincipal: more than one result return for a single-kind query")
		}

		out.PublicKeysPrincipal = stmt.ColumnBytes(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: PublicKeysLookupPrincipal: %w", err)
	}

	return out, err
}

type PublicKeysInsertResult struct {
	PublicKeysID int64
}

func PublicKeysInsert(conn *sqlite.Conn, principal []byte) (PublicKeysInsertResult, error) {
	const query = `INSERT INTO public_keys (principal)
VALUES (:principal)
RETURNING public_keys.id AS public_keys_id`

	var out PublicKeysInsertResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":principal", principal)
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

func SetAccountTrust(conn *sqlite.Conn, publicKeysPrincipal []byte) error {
	const query = `INSERT OR REPLACE INTO trusted_accounts (id)
VALUES ((SELECT public_keys.id FROM public_keys WHERE public_keys.principal = :publicKeysPrincipal))`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":publicKeysPrincipal", publicKeysPrincipal)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: SetAccountTrust: %w", err)
	}

	return err
}

func UnsetAccountTrust(conn *sqlite.Conn, publicKeysPrincipal []byte) error {
	const query = `DELETE FROM trusted_accounts
WHERE trusted_accounts.id IN (SELECT public_keys.id FROM public_keys WHERE public_keys.principal = :publicKeysPrincipal)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":publicKeysPrincipal", publicKeysPrincipal)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: UnsetAccountTrust: %w", err)
	}

	return err
}

type IsTrustedAccountResult struct {
	TrustedAccountsID int64
}

func IsTrustedAccount(conn *sqlite.Conn, principal []byte) (IsTrustedAccountResult, error) {
	const query = `SELECT trusted_accounts.id
FROM trusted_accounts
WHERE trusted_accounts.id IN (SELECT public_keys.id FROM public_keys WHERE public_keys.principal = :principal)`

	var out IsTrustedAccountResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":principal", principal)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("IsTrustedAccount: more than one result return for a single-kind query")
		}

		out.TrustedAccountsID = stmt.ColumnInt64(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: IsTrustedAccount: %w", err)
	}

	return out, err
}

type KeyDelegationsListResult struct {
	KeyDelegationsViewBlob          int64
	KeyDelegationsViewBlobCodec     int64
	KeyDelegationsViewBlobMultihash []byte
	KeyDelegationsViewIssuer        []byte
	KeyDelegationsViewDelegate      []byte
}

func KeyDelegationsList(conn *sqlite.Conn, keyDelegationsViewIssuer []byte) ([]KeyDelegationsListResult, error) {
	const query = `SELECT key_delegations_view.blob, key_delegations_view.blob_codec, key_delegations_view.blob_multihash, key_delegations_view.issuer, key_delegations_view.delegate
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
}

func KeyDelegationsListAll(conn *sqlite.Conn) ([]KeyDelegationsListAllResult, error) {
	const query = `SELECT key_delegations_view.blob, key_delegations_view.blob_codec, key_delegations_view.blob_multihash, key_delegations_view.issuer, key_delegations_view.delegate
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
}

func KeyDelegationsListByDelegate(conn *sqlite.Conn, keyDelegationsViewDelegate []byte) ([]KeyDelegationsListByDelegateResult, error) {
	const query = `SELECT key_delegations_view.blob, key_delegations_view.blob_codec, key_delegations_view.blob_multihash, key_delegations_view.issuer, key_delegations_view.delegate
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
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: KeyDelegationsListByDelegate: %w", err)
	}

	return out, err
}

type KeyDelegationsGetIssuerResult struct {
	KeyDelegationsIssuer int64
}

func KeyDelegationsGetIssuer(conn *sqlite.Conn, blobsMultihash []byte) (KeyDelegationsGetIssuerResult, error) {
	const query = `SELECT key_delegations.issuer
FROM key_delegations
JOIN blobs INDEXED BY blobs_metadata_by_hash ON blobs.id = key_delegations.id
WHERE blobs.multihash = :blobsMultihash
LIMIT 1`

	var out KeyDelegationsGetIssuerResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetBytes(":blobsMultihash", blobsMultihash)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("KeyDelegationsGetIssuer: more than one result return for a single-kind query")
		}

		out.KeyDelegationsIssuer = stmt.ColumnInt64(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: KeyDelegationsGetIssuer: %w", err)
	}

	return out, err
}

type EntitiesInsertOrIgnoreResult struct {
	EntitiesID int64
}

func EntitiesInsertOrIgnore(conn *sqlite.Conn, entity_id string) (EntitiesInsertOrIgnoreResult, error) {
	const query = `INSERT OR IGNORE INTO resources (iri)
VALUES (:entity_id)
RETURNING resources.id AS entities_id`

	var out EntitiesInsertOrIgnoreResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":entity_id", entity_id)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("EntitiesInsertOrIgnore: more than one result return for a single-kind query")
		}

		out.EntitiesID = stmt.ColumnInt64(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: EntitiesInsertOrIgnore: %w", err)
	}

	return out, err
}

type EntitiesLookupIDResult struct {
	ResourcesID    int64
	ResourcesOwner int64
}

func EntitiesLookupID(conn *sqlite.Conn, entities_eid string) (EntitiesLookupIDResult, error) {
	const query = `SELECT resources.id, resources.owner
FROM resources
WHERE resources.iri = :entities_eid
LIMIT 1`

	var out EntitiesLookupIDResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":entities_eid", entities_eid)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("EntitiesLookupID: more than one result return for a single-kind query")
		}

		out.ResourcesID = stmt.ColumnInt64(0)
		out.ResourcesOwner = stmt.ColumnInt64(1)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: EntitiesLookupID: %w", err)
	}

	return out, err
}

type EntitiesListByPrefixResult struct {
	ResourcesID    int64
	ResourcesIRI   string
	ResourcesOwner int64
}

func EntitiesListByPrefix(conn *sqlite.Conn, prefix string) ([]EntitiesListByPrefixResult, error) {
	const query = `SELECT resources.id, resources.iri, resources.owner
FROM resources
WHERE resources.iri GLOB :prefix
ORDER BY resources.id`

	var out []EntitiesListByPrefixResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":prefix", prefix)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, EntitiesListByPrefixResult{
			ResourcesID:    stmt.ColumnInt64(0),
			ResourcesIRI:   stmt.ColumnText(1),
			ResourcesOwner: stmt.ColumnInt64(2),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: EntitiesListByPrefix: %w", err)
	}

	return out, err
}

func EntitiesDelete(conn *sqlite.Conn, entities_eid string) error {
	const query = `DELETE FROM resources
WHERE resources.iri = :entities_eid`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":entities_eid", entities_eid)
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

type EntitiesInsertRemovedRecordResult struct {
	ResourceEID string
}

func EntitiesInsertRemovedRecord(conn *sqlite.Conn, iri string, reason string, meta string) (EntitiesInsertRemovedRecordResult, error) {
	const query = `INSERT OR IGNORE INTO deleted_resources (iri, reason, meta)
VALUES (:iri, :reason, :meta)
RETURNING deleted_resources.iri AS resource_eid`

	var out EntitiesInsertRemovedRecordResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":iri", iri)
		stmt.SetText(":reason", reason)
		stmt.SetText(":meta", meta)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("EntitiesInsertRemovedRecord: more than one result return for a single-kind query")
		}

		out.ResourceEID = stmt.ColumnText(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: EntitiesInsertRemovedRecord: %w", err)
	}

	return out, err
}

func EntitiesDeleteRemovedRecord(conn *sqlite.Conn, resource_eid string) error {
	const query = `DELETE FROM deleted_resources
WHERE deleted_resources.iri = :resource_eid`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":resource_eid", resource_eid)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: EntitiesDeleteRemovedRecord: %w", err)
	}

	return err
}

type EntitiesLookupRemovedRecordResult struct {
	DeletedResourcesIRI        string
	DeletedResourcesDeleteTime int64
	DeletedResourcesReason     string
	DeletedResourcesMeta       string
}

func EntitiesLookupRemovedRecord(conn *sqlite.Conn, resource_eid string) (EntitiesLookupRemovedRecordResult, error) {
	const query = `SELECT deleted_resources.iri, deleted_resources.delete_time, deleted_resources.reason, deleted_resources.meta
FROM deleted_resources
WHERE deleted_resources.iri = :resource_eid
LIMIT 1`

	var out EntitiesLookupRemovedRecordResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":resource_eid", resource_eid)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("EntitiesLookupRemovedRecord: more than one result return for a single-kind query")
		}

		out.DeletedResourcesIRI = stmt.ColumnText(0)
		out.DeletedResourcesDeleteTime = stmt.ColumnInt64(1)
		out.DeletedResourcesReason = stmt.ColumnText(2)
		out.DeletedResourcesMeta = stmt.ColumnText(3)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: EntitiesLookupRemovedRecord: %w", err)
	}

	return out, err
}

type EntitiesListRemovedRecordsResult struct {
	DeletedResourcesIRI        string
	DeletedResourcesDeleteTime int64
	DeletedResourcesReason     string
	DeletedResourcesMeta       string
}

func EntitiesListRemovedRecords(conn *sqlite.Conn) ([]EntitiesListRemovedRecordsResult, error) {
	const query = `SELECT deleted_resources.iri, deleted_resources.delete_time, deleted_resources.reason, deleted_resources.meta
FROM deleted_resources`

	var out []EntitiesListRemovedRecordsResult

	before := func(stmt *sqlite.Stmt) {
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, EntitiesListRemovedRecordsResult{
			DeletedResourcesIRI:        stmt.ColumnText(0),
			DeletedResourcesDeleteTime: stmt.ColumnInt64(1),
			DeletedResourcesReason:     stmt.ColumnText(2),
			DeletedResourcesMeta:       stmt.ColumnText(3),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: EntitiesListRemovedRecords: %w", err)
	}

	return out, err
}

type ChangesListFromChangeSetResult struct {
	StructuralBlobsViewBlobID     int64
	StructuralBlobsViewCodec      int64
	StructuralBlobsViewData       []byte
	StructuralBlobsViewResourceID int64
	StructuralBlobsViewTs         int64
	StructuralBlobsViewMultihash  []byte
	StructuralBlobsViewSize       int64
}

func ChangesListFromChangeSet(conn *sqlite.Conn, cset string, structuralBlobsViewResource string) ([]ChangesListFromChangeSetResult, error) {
	const query = `SELECT structural_blobs_view.blob_id, structural_blobs_view.codec, structural_blobs_view.data, structural_blobs_view.resource_id, structural_blobs_view.ts, structural_blobs_view.multihash, structural_blobs_view.size
FROM structural_blobs_view, json_each(:cset) AS cset
WHERE structural_blobs_view.resource = :structuralBlobsViewResource
AND structural_blobs_view.blob_id = cset.value
ORDER BY structural_blobs_view.ts`

	var out []ChangesListFromChangeSetResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":cset", cset)
		stmt.SetText(":structuralBlobsViewResource", structuralBlobsViewResource)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, ChangesListFromChangeSetResult{
			StructuralBlobsViewBlobID:     stmt.ColumnInt64(0),
			StructuralBlobsViewCodec:      stmt.ColumnInt64(1),
			StructuralBlobsViewData:       stmt.ColumnBytes(2),
			StructuralBlobsViewResourceID: stmt.ColumnInt64(3),
			StructuralBlobsViewTs:         stmt.ColumnInt64(4),
			StructuralBlobsViewMultihash:  stmt.ColumnBytes(5),
			StructuralBlobsViewSize:       stmt.ColumnInt64(6),
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
	BlobsID           int64
	BlobsCodec        int64
	BlobsData         []byte
	BlobsMultihash    []byte
	BlobsSize         int64
	ResourcesID       int64
	StructuralBlobsTs int64
}

func ChangesListForEntity(conn *sqlite.Conn, resourcesIRI string) ([]ChangesListForEntityResult, error) {
	const query = `SELECT blobs.id, blobs.codec, blobs.data, blobs.multihash, blobs.size, resources.id, structural_blobs.ts
FROM structural_blobs
JOIN blobs ON blobs.id = structural_blobs.id
JOIN resources ON resources.id = structural_blobs.resource
WHERE resources.iri = :resourcesIRI
ORDER BY structural_blobs.ts`

	var out []ChangesListForEntityResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":resourcesIRI", resourcesIRI)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, ChangesListForEntityResult{
			BlobsID:           stmt.ColumnInt64(0),
			BlobsCodec:        stmt.ColumnInt64(1),
			BlobsData:         stmt.ColumnBytes(2),
			BlobsMultihash:    stmt.ColumnBytes(3),
			BlobsSize:         stmt.ColumnInt64(4),
			ResourcesID:       stmt.ColumnInt64(5),
			StructuralBlobsTs: stmt.ColumnInt64(6),
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
	ResolvedJSON string
}

func ChangesResolveHeads(conn *sqlite.Conn, heads string) (ChangesResolveHeadsResult, error) {
	const query = `WITH RECURSIVE changeset (change) AS (SELECT value FROM json_each(:heads) UNION SELECT change_deps.parent FROM change_deps JOIN changeset ON changeset.change = change_deps.child)
SELECT json_group_array(change) AS resolved_json
FROM changeset
LIMIT 1`

	var out ChangesResolveHeadsResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":heads", heads)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("ChangesResolveHeads: more than one result return for a single-kind query")
		}

		out.ResolvedJSON = stmt.ColumnText(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: ChangesResolveHeads: %w", err)
	}

	return out, err
}

type ChangesGetPublicHeadsJSONResult struct {
	Heads string
}

func ChangesGetPublicHeadsJSON(conn *sqlite.Conn, entity int64) (ChangesGetPublicHeadsJSONResult, error) {
	const query = `WITH
non_drafts (blob) AS (
	SELECT structural_blobs.id
	FROM structural_blobs
	LEFT JOIN drafts ON drafts.resource = structural_blobs.resource AND structural_blobs.id = drafts.blob
	WHERE structural_blobs.resource = :entity
	AND structural_blobs.type = 'Change'
	AND drafts.blob IS NULL
),
deps (blob) AS (
	SELECT DISTINCT change_deps.parent
	FROM change_deps
	JOIN non_drafts ON non_drafts.blob = change_deps.child
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

		out.Heads = stmt.ColumnText(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: ChangesGetPublicHeadsJSON: %w", err)
	}

	return out, err
}

func ChangesDeleteForEntity(conn *sqlite.Conn, structuralBlobsResource int64) error {
	const query = `DELETE FROM blobs
WHERE blobs.id IN (SELECT structural_blobs.id FROM structural_blobs WHERE structural_blobs.resource = :structuralBlobsResource)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt64(":structuralBlobsResource", structuralBlobsResource)
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

type ChangesGetInfoResult struct {
	StructuralBlobsID   int64
	StructuralBlobsTs   int64
	PublicKeysPrincipal []byte
	IsTrusted           int64
}

func ChangesGetInfo(conn *sqlite.Conn, structuralBlobsID int64) (ChangesGetInfoResult, error) {
	const query = `SELECT structural_blobs.id, structural_blobs.ts, public_keys.principal, trusted_accounts.id > 0 AS is_trusted
FROM structural_blobs
JOIN public_keys ON public_keys.id = structural_blobs.author
LEFT JOIN trusted_accounts ON trusted_accounts.id = structural_blobs.author
WHERE structural_blobs.id = :structuralBlobsID
LIMIT 1`

	var out ChangesGetInfoResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt64(":structuralBlobsID", structuralBlobsID)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("ChangesGetInfo: more than one result return for a single-kind query")
		}

		out.StructuralBlobsID = stmt.ColumnInt64(0)
		out.StructuralBlobsTs = stmt.ColumnInt64(1)
		out.PublicKeysPrincipal = stmt.ColumnBytes(2)
		out.IsTrusted = stmt.ColumnInt64(3)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: ChangesGetInfo: %w", err)
	}

	return out, err
}

type ChangesGetDepsResult struct {
	BlobsCodec     int64
	BlobsMultihash []byte
}

func ChangesGetDeps(conn *sqlite.Conn, changeDepsChild int64) ([]ChangesGetDepsResult, error) {
	const query = `SELECT blobs.codec, blobs.multihash
FROM change_deps
JOIN blobs INDEXED BY blobs_metadata ON blobs.id = change_deps.parent
WHERE change_deps.child = :changeDepsChild`

	var out []ChangesGetDepsResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt64(":changeDepsChild", changeDepsChild)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, ChangesGetDepsResult{
			BlobsCodec:     stmt.ColumnInt64(0),
			BlobsMultihash: stmt.ColumnBytes(1),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: ChangesGetDeps: %w", err)
	}

	return out, err
}

type BacklinksForDocumentResult struct {
	ResourcesID           int64
	ResourcesIRI          string
	BlobsCodec            int64
	BlobsMultihash        []byte
	StructuralBlobsID     int64
	ResourceLinksType     string
	ResourceLinksMeta     []byte
	ResourceLinksIsPinned int64
}

func BacklinksForDocument(conn *sqlite.Conn, resourceLinksTarget int64) ([]BacklinksForDocumentResult, error) {
	const query = `SELECT resources.id, resources.iri, blobs.codec, blobs.multihash, structural_blobs.id, resource_links.type, resource_links.meta, resource_links.is_pinned
FROM resource_links
JOIN structural_blobs ON structural_blobs.id = resource_links.source
JOIN resources ON resources.id = structural_blobs.resource
JOIN blobs INDEXED BY blobs_metadata ON blobs.id = structural_blobs.id
WHERE resource_links.type GLOB 'doc/*'
AND resource_links.target = :resourceLinksTarget`

	var out []BacklinksForDocumentResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt64(":resourceLinksTarget", resourceLinksTarget)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		out = append(out, BacklinksForDocumentResult{
			ResourcesID:           stmt.ColumnInt64(0),
			ResourcesIRI:          stmt.ColumnText(1),
			BlobsCodec:            stmt.ColumnInt64(2),
			BlobsMultihash:        stmt.ColumnBytes(3),
			StructuralBlobsID:     stmt.ColumnInt64(4),
			ResourceLinksType:     stmt.ColumnText(5),
			ResourceLinksMeta:     stmt.ColumnBytes(6),
			ResourceLinksIsPinned: stmt.ColumnInt64(7),
		})

		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: BacklinksForDocument: %w", err)
	}

	return out, err
}

func DraftsInsert(conn *sqlite.Conn, draftsResource int64, draftsBlob int64) error {
	const query = `INSERT INTO drafts (resource, blob)
VALUES (:draftsResource, :draftsBlob)`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt64(":draftsResource", draftsResource)
		stmt.SetInt64(":draftsBlob", draftsBlob)
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
	DraftsViewBlobID     int64
	DraftsViewCodec      int64
	DraftsViewResource   string
	DraftsViewResourceID int64
	DraftsViewMultihash  []byte
}

func DraftsGet(conn *sqlite.Conn, draftsViewResource string) (DraftsGetResult, error) {
	const query = `SELECT drafts_view.blob_id, drafts_view.codec, drafts_view.resource, drafts_view.resource_id, drafts_view.multihash
FROM drafts_view
WHERE drafts_view.resource = :draftsViewResource
LIMIT 1`

	var out DraftsGetResult

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":draftsViewResource", draftsViewResource)
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("DraftsGet: more than one result return for a single-kind query")
		}

		out.DraftsViewBlobID = stmt.ColumnInt64(0)
		out.DraftsViewCodec = stmt.ColumnInt64(1)
		out.DraftsViewResource = stmt.ColumnText(2)
		out.DraftsViewResourceID = stmt.ColumnInt64(3)
		out.DraftsViewMultihash = stmt.ColumnBytes(4)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: DraftsGet: %w", err)
	}

	return out, err
}

func DraftsDelete(conn *sqlite.Conn, draftsBlob int64) error {
	const query = `DELETE FROM drafts
WHERE drafts.blob = :draftsBlob`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetInt64(":draftsBlob", draftsBlob)
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

func SetReindexTime(conn *sqlite.Conn, kvValue string) error {
	const query = `INSERT OR REPLACE INTO kv (key, value)
VALUES ('last_reindex_time', :kvValue)
`

	before := func(stmt *sqlite.Stmt) {
		stmt.SetText(":kvValue", kvValue)
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
	KVValue string
}

func GetReindexTime(conn *sqlite.Conn) (GetReindexTimeResult, error) {
	const query = `SELECT kv.value
FROM kv
WHERE kv.key = 'last_reindex_time'
LIMIT 1`

	var out GetReindexTimeResult

	before := func(stmt *sqlite.Stmt) {
	}

	onStep := func(i int, stmt *sqlite.Stmt) error {
		if i > 1 {
			return errors.New("GetReindexTime: more than one result return for a single-kind query")
		}

		out.KVValue = stmt.ColumnText(0)
		return nil
	}

	err := sqlitegen.ExecStmt(conn, query, before, onStep)
	if err != nil {
		err = fmt.Errorf("failed query: GetReindexTime: %w", err)
	}

	return out, err
}
