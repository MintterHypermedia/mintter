// Code generated by sqlitegen. DO NOT EDIT.

package storage

import (
	"mintter/backend/pkg/sqlitegen"
)

// Table blob_links.
const (
	BlobLinks       sqlitegen.Table  = "blob_links"
	BlobLinksSource sqlitegen.Column = "blob_links.source"
	BlobLinksTarget sqlitegen.Column = "blob_links.target"
	BlobLinksType   sqlitegen.Column = "blob_links.type"
)

// Table blob_links. Plain strings.
const (
	T_BlobLinks       = "blob_links"
	C_BlobLinksSource = "blob_links.source"
	C_BlobLinksTarget = "blob_links.target"
	C_BlobLinksType   = "blob_links.type"
)

// Table blobs.
const (
	Blobs           sqlitegen.Table  = "blobs"
	BlobsCodec      sqlitegen.Column = "blobs.codec"
	BlobsData       sqlitegen.Column = "blobs.data"
	BlobsID         sqlitegen.Column = "blobs.id"
	BlobsInsertTime sqlitegen.Column = "blobs.insert_time"
	BlobsMultihash  sqlitegen.Column = "blobs.multihash"
	BlobsSize       sqlitegen.Column = "blobs.size"
)

// Table blobs. Plain strings.
const (
	T_Blobs           = "blobs"
	C_BlobsCodec      = "blobs.codec"
	C_BlobsData       = "blobs.data"
	C_BlobsID         = "blobs.id"
	C_BlobsInsertTime = "blobs.insert_time"
	C_BlobsMultihash  = "blobs.multihash"
	C_BlobsSize       = "blobs.size"
)

// Table change_deps.
const (
	ChangeDeps       sqlitegen.Table  = "change_deps"
	ChangeDepsChild  sqlitegen.Column = "change_deps.child"
	ChangeDepsParent sqlitegen.Column = "change_deps.parent"
)

// Table change_deps. Plain strings.
const (
	T_ChangeDeps       = "change_deps"
	C_ChangeDepsChild  = "change_deps.child"
	C_ChangeDepsParent = "change_deps.parent"
)

// Table drafts.
const (
	Drafts         sqlitegen.Table  = "drafts"
	DraftsBlob     sqlitegen.Column = "drafts.blob"
	DraftsResource sqlitegen.Column = "drafts.resource"
)

// Table drafts. Plain strings.
const (
	T_Drafts         = "drafts"
	C_DraftsBlob     = "drafts.blob"
	C_DraftsResource = "drafts.resource"
)

// Table drafts_view.
const (
	DraftsView           sqlitegen.Table  = "drafts_view"
	DraftsViewBlobID     sqlitegen.Column = "drafts_view.blob_id"
	DraftsViewCodec      sqlitegen.Column = "drafts_view.codec"
	DraftsViewMultihash  sqlitegen.Column = "drafts_view.multihash"
	DraftsViewResource   sqlitegen.Column = "drafts_view.resource"
	DraftsViewResourceID sqlitegen.Column = "drafts_view.resource_id"
)

// Table drafts_view. Plain strings.
const (
	T_DraftsView           = "drafts_view"
	C_DraftsViewBlobID     = "drafts_view.blob_id"
	C_DraftsViewCodec      = "drafts_view.codec"
	C_DraftsViewMultihash  = "drafts_view.multihash"
	C_DraftsViewResource   = "drafts_view.resource"
	C_DraftsViewResourceID = "drafts_view.resource_id"
)

// Table group_sites.
const (
	GroupSites               sqlitegen.Table  = "group_sites"
	GroupSitesGroupID        sqlitegen.Column = "group_sites.group_id"
	GroupSitesHLCOrigin      sqlitegen.Column = "group_sites.hlc_origin"
	GroupSitesHLCTime        sqlitegen.Column = "group_sites.hlc_time"
	GroupSitesLastOkSyncTime sqlitegen.Column = "group_sites.last_ok_sync_time"
	GroupSitesLastSyncError  sqlitegen.Column = "group_sites.last_sync_error"
	GroupSitesLastSyncTime   sqlitegen.Column = "group_sites.last_sync_time"
	GroupSitesRemoteVersion  sqlitegen.Column = "group_sites.remote_version"
	GroupSitesURL            sqlitegen.Column = "group_sites.url"
)

// Table group_sites. Plain strings.
const (
	T_GroupSites               = "group_sites"
	C_GroupSitesGroupID        = "group_sites.group_id"
	C_GroupSitesHLCOrigin      = "group_sites.hlc_origin"
	C_GroupSitesHLCTime        = "group_sites.hlc_time"
	C_GroupSitesLastOkSyncTime = "group_sites.last_ok_sync_time"
	C_GroupSitesLastSyncError  = "group_sites.last_sync_error"
	C_GroupSitesLastSyncTime   = "group_sites.last_sync_time"
	C_GroupSitesRemoteVersion  = "group_sites.remote_version"
	C_GroupSitesURL            = "group_sites.url"
)

// Table key_delegations.
const (
	KeyDelegations         sqlitegen.Table  = "key_delegations"
	KeyDelegationsDelegate sqlitegen.Column = "key_delegations.delegate"
	KeyDelegationsID       sqlitegen.Column = "key_delegations.id"
	KeyDelegationsIssuer   sqlitegen.Column = "key_delegations.issuer"
)

// Table key_delegations. Plain strings.
const (
	T_KeyDelegations         = "key_delegations"
	C_KeyDelegationsDelegate = "key_delegations.delegate"
	C_KeyDelegationsID       = "key_delegations.id"
	C_KeyDelegationsIssuer   = "key_delegations.issuer"
)

// Table key_delegations_view.
const (
	KeyDelegationsView              sqlitegen.Table  = "key_delegations_view"
	KeyDelegationsViewBlob          sqlitegen.Column = "key_delegations_view.blob"
	KeyDelegationsViewBlobCodec     sqlitegen.Column = "key_delegations_view.blob_codec"
	KeyDelegationsViewBlobMultihash sqlitegen.Column = "key_delegations_view.blob_multihash"
	KeyDelegationsViewDelegate      sqlitegen.Column = "key_delegations_view.delegate"
	KeyDelegationsViewIssuer        sqlitegen.Column = "key_delegations_view.issuer"
)

// Table key_delegations_view. Plain strings.
const (
	T_KeyDelegationsView              = "key_delegations_view"
	C_KeyDelegationsViewBlob          = "key_delegations_view.blob"
	C_KeyDelegationsViewBlobCodec     = "key_delegations_view.blob_codec"
	C_KeyDelegationsViewBlobMultihash = "key_delegations_view.blob_multihash"
	C_KeyDelegationsViewDelegate      = "key_delegations_view.delegate"
	C_KeyDelegationsViewIssuer        = "key_delegations_view.issuer"
)

// Table kv.
const (
	KV      sqlitegen.Table  = "kv"
	KVKey   sqlitegen.Column = "kv.key"
	KVValue sqlitegen.Column = "kv.value"
)

// Table kv. Plain strings.
const (
	T_KV      = "kv"
	C_KVKey   = "kv.key"
	C_KVValue = "kv.value"
)

// Table public_keys.
const (
	PublicKeys          sqlitegen.Table  = "public_keys"
	PublicKeysID        sqlitegen.Column = "public_keys.id"
	PublicKeysPrincipal sqlitegen.Column = "public_keys.principal"
)

// Table public_keys. Plain strings.
const (
	T_PublicKeys          = "public_keys"
	C_PublicKeysID        = "public_keys.id"
	C_PublicKeysPrincipal = "public_keys.principal"
)

// Table resource_links.
const (
	ResourceLinks         sqlitegen.Table  = "resource_links"
	ResourceLinksIsPinned sqlitegen.Column = "resource_links.is_pinned"
	ResourceLinksMeta     sqlitegen.Column = "resource_links.meta"
	ResourceLinksSource   sqlitegen.Column = "resource_links.source"
	ResourceLinksTarget   sqlitegen.Column = "resource_links.target"
	ResourceLinksType     sqlitegen.Column = "resource_links.type"
)

// Table resource_links. Plain strings.
const (
	T_ResourceLinks         = "resource_links"
	C_ResourceLinksIsPinned = "resource_links.is_pinned"
	C_ResourceLinksMeta     = "resource_links.meta"
	C_ResourceLinksSource   = "resource_links.source"
	C_ResourceLinksTarget   = "resource_links.target"
	C_ResourceLinksType     = "resource_links.type"
)

// Table resources.
const (
	Resources           sqlitegen.Table  = "resources"
	ResourcesCreateTime sqlitegen.Column = "resources.create_time"
	ResourcesID         sqlitegen.Column = "resources.id"
	ResourcesIRI        sqlitegen.Column = "resources.iri"
	ResourcesOwner      sqlitegen.Column = "resources.owner"
)

// Table resources. Plain strings.
const (
	T_Resources           = "resources"
	C_ResourcesCreateTime = "resources.create_time"
	C_ResourcesID         = "resources.id"
	C_ResourcesIRI        = "resources.iri"
	C_ResourcesOwner      = "resources.owner"
)

// Table sqlite_sequence.
const (
	SQLiteSequence     sqlitegen.Table  = "sqlite_sequence"
	SQLiteSequenceName sqlitegen.Column = "sqlite_sequence.name"
	SQLiteSequenceSeq  sqlitegen.Column = "sqlite_sequence.seq"
)

// Table sqlite_sequence. Plain strings.
const (
	T_SQLiteSequence     = "sqlite_sequence"
	C_SQLiteSequenceName = "sqlite_sequence.name"
	C_SQLiteSequenceSeq  = "sqlite_sequence.seq"
)

// Table structural_blobs.
const (
	StructuralBlobs         sqlitegen.Table  = "structural_blobs"
	StructuralBlobsAuthor   sqlitegen.Column = "structural_blobs.author"
	StructuralBlobsID       sqlitegen.Column = "structural_blobs.id"
	StructuralBlobsResource sqlitegen.Column = "structural_blobs.resource"
	StructuralBlobsTs       sqlitegen.Column = "structural_blobs.ts"
	StructuralBlobsType     sqlitegen.Column = "structural_blobs.type"
)

// Table structural_blobs. Plain strings.
const (
	T_StructuralBlobs         = "structural_blobs"
	C_StructuralBlobsAuthor   = "structural_blobs.author"
	C_StructuralBlobsID       = "structural_blobs.id"
	C_StructuralBlobsResource = "structural_blobs.resource"
	C_StructuralBlobsTs       = "structural_blobs.ts"
	C_StructuralBlobsType     = "structural_blobs.type"
)

// Table structural_blobs_view.
const (
	StructuralBlobsView           sqlitegen.Table  = "structural_blobs_view"
	StructuralBlobsViewBlobID     sqlitegen.Column = "structural_blobs_view.blob_id"
	StructuralBlobsViewBlobType   sqlitegen.Column = "structural_blobs_view.blob_type"
	StructuralBlobsViewCodec      sqlitegen.Column = "structural_blobs_view.codec"
	StructuralBlobsViewData       sqlitegen.Column = "structural_blobs_view.data"
	StructuralBlobsViewMultihash  sqlitegen.Column = "structural_blobs_view.multihash"
	StructuralBlobsViewResource   sqlitegen.Column = "structural_blobs_view.resource"
	StructuralBlobsViewResourceID sqlitegen.Column = "structural_blobs_view.resource_id"
	StructuralBlobsViewSize       sqlitegen.Column = "structural_blobs_view.size"
	StructuralBlobsViewTs         sqlitegen.Column = "structural_blobs_view.ts"
)

// Table structural_blobs_view. Plain strings.
const (
	T_StructuralBlobsView           = "structural_blobs_view"
	C_StructuralBlobsViewBlobID     = "structural_blobs_view.blob_id"
	C_StructuralBlobsViewBlobType   = "structural_blobs_view.blob_type"
	C_StructuralBlobsViewCodec      = "structural_blobs_view.codec"
	C_StructuralBlobsViewData       = "structural_blobs_view.data"
	C_StructuralBlobsViewMultihash  = "structural_blobs_view.multihash"
	C_StructuralBlobsViewResource   = "structural_blobs_view.resource"
	C_StructuralBlobsViewResourceID = "structural_blobs_view.resource_id"
	C_StructuralBlobsViewSize       = "structural_blobs_view.size"
	C_StructuralBlobsViewTs         = "structural_blobs_view.ts"
)

// Table syncing_cursors.
const (
	SyncingCursors       sqlitegen.Table  = "syncing_cursors"
	SyncingCursorsCursor sqlitegen.Column = "syncing_cursors.cursor"
	SyncingCursorsPeer   sqlitegen.Column = "syncing_cursors.peer"
)

// Table syncing_cursors. Plain strings.
const (
	T_SyncingCursors       = "syncing_cursors"
	C_SyncingCursorsCursor = "syncing_cursors.cursor"
	C_SyncingCursorsPeer   = "syncing_cursors.peer"
)

// Table trusted_accounts.
const (
	TrustedAccounts   sqlitegen.Table  = "trusted_accounts"
	TrustedAccountsID sqlitegen.Column = "trusted_accounts.id"
)

// Table trusted_accounts. Plain strings.
const (
	T_TrustedAccounts   = "trusted_accounts"
	C_TrustedAccountsID = "trusted_accounts.id"
)

// Table wallets.
const (
	Wallets         sqlitegen.Table  = "wallets"
	WalletsAddress  sqlitegen.Column = "wallets.address"
	WalletsBalance  sqlitegen.Column = "wallets.balance"
	WalletsID       sqlitegen.Column = "wallets.id"
	WalletsLogin    sqlitegen.Column = "wallets.login"
	WalletsName     sqlitegen.Column = "wallets.name"
	WalletsPassword sqlitegen.Column = "wallets.password"
	WalletsToken    sqlitegen.Column = "wallets.token"
	WalletsType     sqlitegen.Column = "wallets.type"
)

// Table wallets. Plain strings.
const (
	T_Wallets         = "wallets"
	C_WalletsAddress  = "wallets.address"
	C_WalletsBalance  = "wallets.balance"
	C_WalletsID       = "wallets.id"
	C_WalletsLogin    = "wallets.login"
	C_WalletsName     = "wallets.name"
	C_WalletsPassword = "wallets.password"
	C_WalletsToken    = "wallets.token"
	C_WalletsType     = "wallets.type"
)

// Schema describes SQLite columns.
var Schema = sqlitegen.Schema{
	Columns: map[sqlitegen.Column]sqlitegen.ColumnInfo{
		BlobLinksSource:                 {Table: BlobLinks, SQLType: "INTEGER"},
		BlobLinksTarget:                 {Table: BlobLinks, SQLType: "INTEGER"},
		BlobLinksType:                   {Table: BlobLinks, SQLType: "TEXT"},
		BlobsCodec:                      {Table: Blobs, SQLType: "INTEGER"},
		BlobsData:                       {Table: Blobs, SQLType: "BLOB"},
		BlobsID:                         {Table: Blobs, SQLType: "INTEGER"},
		BlobsInsertTime:                 {Table: Blobs, SQLType: "INTEGER"},
		BlobsMultihash:                  {Table: Blobs, SQLType: "BLOB"},
		BlobsSize:                       {Table: Blobs, SQLType: "INTEGER"},
		ChangeDepsChild:                 {Table: ChangeDeps, SQLType: "INTEGER"},
		ChangeDepsParent:                {Table: ChangeDeps, SQLType: "INTEGER"},
		DraftsBlob:                      {Table: Drafts, SQLType: "INTEGER"},
		DraftsResource:                  {Table: Drafts, SQLType: "INTEGER"},
		DraftsViewBlobID:                {Table: DraftsView, SQLType: "INTEGER"},
		DraftsViewCodec:                 {Table: DraftsView, SQLType: "INTEGER"},
		DraftsViewMultihash:             {Table: DraftsView, SQLType: "BLOB"},
		DraftsViewResource:              {Table: DraftsView, SQLType: "TEXT"},
		DraftsViewResourceID:            {Table: DraftsView, SQLType: "INTEGER"},
		GroupSitesGroupID:               {Table: GroupSites, SQLType: "TEXT"},
		GroupSitesHLCOrigin:             {Table: GroupSites, SQLType: "TEXT"},
		GroupSitesHLCTime:               {Table: GroupSites, SQLType: "INTEGER"},
		GroupSitesLastOkSyncTime:        {Table: GroupSites, SQLType: "INTEGER"},
		GroupSitesLastSyncError:         {Table: GroupSites, SQLType: "TEXT"},
		GroupSitesLastSyncTime:          {Table: GroupSites, SQLType: "INTEGER"},
		GroupSitesRemoteVersion:         {Table: GroupSites, SQLType: "TEXT"},
		GroupSitesURL:                   {Table: GroupSites, SQLType: "TEXT"},
		KeyDelegationsDelegate:          {Table: KeyDelegations, SQLType: "INTEGER"},
		KeyDelegationsID:                {Table: KeyDelegations, SQLType: "INTEGER"},
		KeyDelegationsIssuer:            {Table: KeyDelegations, SQLType: "INTEGER"},
		KeyDelegationsViewBlob:          {Table: KeyDelegationsView, SQLType: "INTEGER"},
		KeyDelegationsViewBlobCodec:     {Table: KeyDelegationsView, SQLType: "INTEGER"},
		KeyDelegationsViewBlobMultihash: {Table: KeyDelegationsView, SQLType: "BLOB"},
		KeyDelegationsViewDelegate:      {Table: KeyDelegationsView, SQLType: "BLOB"},
		KeyDelegationsViewIssuer:        {Table: KeyDelegationsView, SQLType: "BLOB"},
		KVKey:                           {Table: KV, SQLType: "TEXT"},
		KVValue:                         {Table: KV, SQLType: "TEXT"},
		PublicKeysID:                    {Table: PublicKeys, SQLType: "INTEGER"},
		PublicKeysPrincipal:             {Table: PublicKeys, SQLType: "BLOB"},
		ResourceLinksIsPinned:           {Table: ResourceLinks, SQLType: "INTEGER"},
		ResourceLinksMeta:               {Table: ResourceLinks, SQLType: "BLOB"},
		ResourceLinksSource:             {Table: ResourceLinks, SQLType: "INTEGER"},
		ResourceLinksTarget:             {Table: ResourceLinks, SQLType: "INTEGER"},
		ResourceLinksType:               {Table: ResourceLinks, SQLType: "TEXT"},
		ResourcesCreateTime:             {Table: Resources, SQLType: "INTEGER"},
		ResourcesID:                     {Table: Resources, SQLType: "INTEGER"},
		ResourcesIRI:                    {Table: Resources, SQLType: "TEXT"},
		ResourcesOwner:                  {Table: Resources, SQLType: "INTEGER"},
		SQLiteSequenceName:              {Table: SQLiteSequence, SQLType: ""},
		SQLiteSequenceSeq:               {Table: SQLiteSequence, SQLType: ""},
		StructuralBlobsAuthor:           {Table: StructuralBlobs, SQLType: "INTEGER"},
		StructuralBlobsID:               {Table: StructuralBlobs, SQLType: "INTEGER"},
		StructuralBlobsResource:         {Table: StructuralBlobs, SQLType: "INTEGER"},
		StructuralBlobsTs:               {Table: StructuralBlobs, SQLType: "INTEGER"},
		StructuralBlobsType:             {Table: StructuralBlobs, SQLType: "TEXT"},
		StructuralBlobsViewBlobID:       {Table: StructuralBlobsView, SQLType: "INTEGER"},
		StructuralBlobsViewBlobType:     {Table: StructuralBlobsView, SQLType: "TEXT"},
		StructuralBlobsViewCodec:        {Table: StructuralBlobsView, SQLType: "INTEGER"},
		StructuralBlobsViewData:         {Table: StructuralBlobsView, SQLType: "BLOB"},
		StructuralBlobsViewMultihash:    {Table: StructuralBlobsView, SQLType: "BLOB"},
		StructuralBlobsViewResource:     {Table: StructuralBlobsView, SQLType: "TEXT"},
		StructuralBlobsViewResourceID:   {Table: StructuralBlobsView, SQLType: "INTEGER"},
		StructuralBlobsViewSize:         {Table: StructuralBlobsView, SQLType: "INTEGER"},
		StructuralBlobsViewTs:           {Table: StructuralBlobsView, SQLType: "INTEGER"},
		SyncingCursorsCursor:            {Table: SyncingCursors, SQLType: "TEXT"},
		SyncingCursorsPeer:              {Table: SyncingCursors, SQLType: "INTEGER"},
		TrustedAccountsID:               {Table: TrustedAccounts, SQLType: "INTEGER"},
		WalletsAddress:                  {Table: Wallets, SQLType: "TEXT"},
		WalletsBalance:                  {Table: Wallets, SQLType: "INTEGER"},
		WalletsID:                       {Table: Wallets, SQLType: "TEXT"},
		WalletsLogin:                    {Table: Wallets, SQLType: "BLOB"},
		WalletsName:                     {Table: Wallets, SQLType: "TEXT"},
		WalletsPassword:                 {Table: Wallets, SQLType: "BLOB"},
		WalletsToken:                    {Table: Wallets, SQLType: "BLOB"},
		WalletsType:                     {Table: Wallets, SQLType: "TEXT"},
	},
}
