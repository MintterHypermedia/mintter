// Code generated by sqlitegen. DO NOT EDIT.

package sqliteschema

import (
	"mintter/backend/pkg/sqlitegen"
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

// Table content_links_view.
const (
	ContentLinksView                    sqlitegen.Table  = "content_links_view"
	ContentLinksViewData                sqlitegen.Column = "content_links_view.data"
	ContentLinksViewRel                 sqlitegen.Column = "content_links_view.rel"
	ContentLinksViewSourceBlob          sqlitegen.Column = "content_links_view.source_blob"
	ContentLinksViewSourceBlobCodec     sqlitegen.Column = "content_links_view.source_blob_codec"
	ContentLinksViewSourceBlobMultihash sqlitegen.Column = "content_links_view.source_blob_multihash"
	ContentLinksViewSourceEID           sqlitegen.Column = "content_links_view.source_eid"
	ContentLinksViewSourceEntity        sqlitegen.Column = "content_links_view.source_entity"
	ContentLinksViewTargetEID           sqlitegen.Column = "content_links_view.target_eid"
	ContentLinksViewTargetEntity        sqlitegen.Column = "content_links_view.target_entity"
)

// Table content_links_view. Plain strings.
const (
	T_ContentLinksView                    = "content_links_view"
	C_ContentLinksViewData                = "content_links_view.data"
	C_ContentLinksViewRel                 = "content_links_view.rel"
	C_ContentLinksViewSourceBlob          = "content_links_view.source_blob"
	C_ContentLinksViewSourceBlobCodec     = "content_links_view.source_blob_codec"
	C_ContentLinksViewSourceBlobMultihash = "content_links_view.source_blob_multihash"
	C_ContentLinksViewSourceEID           = "content_links_view.source_eid"
	C_ContentLinksViewSourceEntity        = "content_links_view.source_entity"
	C_ContentLinksViewTargetEID           = "content_links_view.target_eid"
	C_ContentLinksViewTargetEntity        = "content_links_view.target_entity"
)

// Table global_meta.
const (
	GlobalMeta      sqlitegen.Table  = "global_meta"
	GlobalMetaKey   sqlitegen.Column = "global_meta.key"
	GlobalMetaValue sqlitegen.Column = "global_meta.value"
)

// Table global_meta. Plain strings.
const (
	T_GlobalMeta      = "global_meta"
	C_GlobalMetaKey   = "global_meta.key"
	C_GlobalMetaValue = "global_meta.value"
)

// Table hd_change_deps.
const (
	HDChangeDeps       sqlitegen.Table  = "hd_change_deps"
	HDChangeDepsChild  sqlitegen.Column = "hd_change_deps.child"
	HDChangeDepsParent sqlitegen.Column = "hd_change_deps.parent"
)

// Table hd_change_deps. Plain strings.
const (
	T_HDChangeDeps       = "hd_change_deps"
	C_HDChangeDepsChild  = "hd_change_deps.child"
	C_HDChangeDepsParent = "hd_change_deps.parent"
)

// Table hd_changes.
const (
	HDChanges        sqlitegen.Table  = "hd_changes"
	HDChangesBlob    sqlitegen.Column = "hd_changes.blob"
	HDChangesEntity  sqlitegen.Column = "hd_changes.entity"
	HDChangesHlcTime sqlitegen.Column = "hd_changes.hlc_time"
)

// Table hd_changes. Plain strings.
const (
	T_HDChanges        = "hd_changes"
	C_HDChangesBlob    = "hd_changes.blob"
	C_HDChangesEntity  = "hd_changes.entity"
	C_HDChangesHlcTime = "hd_changes.hlc_time"
)

// Table hd_changes_view.
const (
	HDChangesView          sqlitegen.Table  = "hd_changes_view"
	HDChangesViewBlobID    sqlitegen.Column = "hd_changes_view.blob_id"
	HDChangesViewCodec     sqlitegen.Column = "hd_changes_view.codec"
	HDChangesViewData      sqlitegen.Column = "hd_changes_view.data"
	HDChangesViewEntity    sqlitegen.Column = "hd_changes_view.entity"
	HDChangesViewEntityID  sqlitegen.Column = "hd_changes_view.entity_id"
	HDChangesViewHlcTime   sqlitegen.Column = "hd_changes_view.hlc_time"
	HDChangesViewMultihash sqlitegen.Column = "hd_changes_view.multihash"
	HDChangesViewSize      sqlitegen.Column = "hd_changes_view.size"
)

// Table hd_changes_view. Plain strings.
const (
	T_HDChangesView          = "hd_changes_view"
	C_HDChangesViewBlobID    = "hd_changes_view.blob_id"
	C_HDChangesViewCodec     = "hd_changes_view.codec"
	C_HDChangesViewData      = "hd_changes_view.data"
	C_HDChangesViewEntity    = "hd_changes_view.entity"
	C_HDChangesViewEntityID  = "hd_changes_view.entity_id"
	C_HDChangesViewHlcTime   = "hd_changes_view.hlc_time"
	C_HDChangesViewMultihash = "hd_changes_view.multihash"
	C_HDChangesViewSize      = "hd_changes_view.size"
)

// Table hd_drafts.
const (
	HDDrafts       sqlitegen.Table  = "hd_drafts"
	HDDraftsBlob   sqlitegen.Column = "hd_drafts.blob"
	HDDraftsEntity sqlitegen.Column = "hd_drafts.entity"
)

// Table hd_drafts. Plain strings.
const (
	T_HDDrafts       = "hd_drafts"
	C_HDDraftsBlob   = "hd_drafts.blob"
	C_HDDraftsEntity = "hd_drafts.entity"
)

// Table hd_drafts_view.
const (
	HDDraftsView          sqlitegen.Table  = "hd_drafts_view"
	HDDraftsViewBlobID    sqlitegen.Column = "hd_drafts_view.blob_id"
	HDDraftsViewCodec     sqlitegen.Column = "hd_drafts_view.codec"
	HDDraftsViewEntity    sqlitegen.Column = "hd_drafts_view.entity"
	HDDraftsViewEntityID  sqlitegen.Column = "hd_drafts_view.entity_id"
	HDDraftsViewMultihash sqlitegen.Column = "hd_drafts_view.multihash"
)

// Table hd_drafts_view. Plain strings.
const (
	T_HDDraftsView          = "hd_drafts_view"
	C_HDDraftsViewBlobID    = "hd_drafts_view.blob_id"
	C_HDDraftsViewCodec     = "hd_drafts_view.codec"
	C_HDDraftsViewEntity    = "hd_drafts_view.entity"
	C_HDDraftsViewEntityID  = "hd_drafts_view.entity_id"
	C_HDDraftsViewMultihash = "hd_drafts_view.multihash"
)

// Table hd_entities.
const (
	HDEntities    sqlitegen.Table  = "hd_entities"
	HDEntitiesEID sqlitegen.Column = "hd_entities.eid"
	HDEntitiesID  sqlitegen.Column = "hd_entities.id"
)

// Table hd_entities. Plain strings.
const (
	T_HDEntities    = "hd_entities"
	C_HDEntitiesEID = "hd_entities.eid"
	C_HDEntitiesID  = "hd_entities.id"
)

// Table hd_links.
const (
	HDLinks             sqlitegen.Table  = "hd_links"
	HDLinksData         sqlitegen.Column = "hd_links.data"
	HDLinksRel          sqlitegen.Column = "hd_links.rel"
	HDLinksSourceBlob   sqlitegen.Column = "hd_links.source_blob"
	HDLinksTargetBlob   sqlitegen.Column = "hd_links.target_blob"
	HDLinksTargetEntity sqlitegen.Column = "hd_links.target_entity"
)

// Table hd_links. Plain strings.
const (
	T_HDLinks             = "hd_links"
	C_HDLinksData         = "hd_links.data"
	C_HDLinksRel          = "hd_links.rel"
	C_HDLinksSourceBlob   = "hd_links.source_blob"
	C_HDLinksTargetBlob   = "hd_links.target_blob"
	C_HDLinksTargetEntity = "hd_links.target_entity"
)

// Table invite_tokens.
const (
	InviteTokens           sqlitegen.Table  = "invite_tokens"
	InviteTokensExpireTime sqlitegen.Column = "invite_tokens.expire_time"
	InviteTokensRole       sqlitegen.Column = "invite_tokens.role"
	InviteTokensToken      sqlitegen.Column = "invite_tokens.token"
)

// Table invite_tokens. Plain strings.
const (
	T_InviteTokens           = "invite_tokens"
	C_InviteTokensExpireTime = "invite_tokens.expire_time"
	C_InviteTokensRole       = "invite_tokens.role"
	C_InviteTokensToken      = "invite_tokens.token"
)

// Table key_delegations.
const (
	KeyDelegations          sqlitegen.Table  = "key_delegations"
	KeyDelegationsBlob      sqlitegen.Column = "key_delegations.blob"
	KeyDelegationsDelegate  sqlitegen.Column = "key_delegations.delegate"
	KeyDelegationsIssueTime sqlitegen.Column = "key_delegations.issue_time"
	KeyDelegationsIssuer    sqlitegen.Column = "key_delegations.issuer"
)

// Table key_delegations. Plain strings.
const (
	T_KeyDelegations          = "key_delegations"
	C_KeyDelegationsBlob      = "key_delegations.blob"
	C_KeyDelegationsDelegate  = "key_delegations.delegate"
	C_KeyDelegationsIssueTime = "key_delegations.issue_time"
	C_KeyDelegationsIssuer    = "key_delegations.issuer"
)

// Table key_delegations_view.
const (
	KeyDelegationsView              sqlitegen.Table  = "key_delegations_view"
	KeyDelegationsViewBlob          sqlitegen.Column = "key_delegations_view.blob"
	KeyDelegationsViewBlobCodec     sqlitegen.Column = "key_delegations_view.blob_codec"
	KeyDelegationsViewBlobMultihash sqlitegen.Column = "key_delegations_view.blob_multihash"
	KeyDelegationsViewDelegate      sqlitegen.Column = "key_delegations_view.delegate"
	KeyDelegationsViewIssueTime     sqlitegen.Column = "key_delegations_view.issue_time"
	KeyDelegationsViewIssuer        sqlitegen.Column = "key_delegations_view.issuer"
)

// Table key_delegations_view. Plain strings.
const (
	T_KeyDelegationsView              = "key_delegations_view"
	C_KeyDelegationsViewBlob          = "key_delegations_view.blob"
	C_KeyDelegationsViewBlobCodec     = "key_delegations_view.blob_codec"
	C_KeyDelegationsViewBlobMultihash = "key_delegations_view.blob_multihash"
	C_KeyDelegationsViewDelegate      = "key_delegations_view.delegate"
	C_KeyDelegationsViewIssueTime     = "key_delegations_view.issue_time"
	C_KeyDelegationsViewIssuer        = "key_delegations_view.issuer"
)

// Table public_blobs_view.
const (
	PublicBlobsView          sqlitegen.Table  = "public_blobs_view"
	PublicBlobsViewCodec     sqlitegen.Column = "public_blobs_view.codec"
	PublicBlobsViewID        sqlitegen.Column = "public_blobs_view.id"
	PublicBlobsViewMultihash sqlitegen.Column = "public_blobs_view.multihash"
)

// Table public_blobs_view. Plain strings.
const (
	T_PublicBlobsView          = "public_blobs_view"
	C_PublicBlobsViewCodec     = "public_blobs_view.codec"
	C_PublicBlobsViewID        = "public_blobs_view.id"
	C_PublicBlobsViewMultihash = "public_blobs_view.multihash"
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

// Table site_members.
const (
	SiteMembers          sqlitegen.Table  = "site_members"
	SiteMembersAccountID sqlitegen.Column = "site_members.account_id"
	SiteMembersRole      sqlitegen.Column = "site_members.role"
)

// Table site_members. Plain strings.
const (
	T_SiteMembers          = "site_members"
	C_SiteMembersAccountID = "site_members.account_id"
	C_SiteMembersRole      = "site_members.role"
)

// Table sites.
const (
	Sites          sqlitegen.Table  = "sites"
	SitesAccountID sqlitegen.Column = "sites.account_id"
	SitesAddresses sqlitegen.Column = "sites.addresses"
	SitesHostname  sqlitegen.Column = "sites.hostname"
	SitesRole      sqlitegen.Column = "sites.role"
)

// Table sites. Plain strings.
const (
	T_Sites          = "sites"
	C_SitesAccountID = "sites.account_id"
	C_SitesAddresses = "sites.addresses"
	C_SitesHostname  = "sites.hostname"
	C_SitesRole      = "sites.role"
)

// Table sqlite_sequence.
const (
	SQLITESequence     sqlitegen.Table  = "sqlite_sequence"
	SQLITESequenceName sqlitegen.Column = "sqlite_sequence.name"
	SQLITESequenceSeq  sqlitegen.Column = "sqlite_sequence.seq"
)

// Table sqlite_sequence. Plain strings.
const (
	T_SQLITESequence     = "sqlite_sequence"
	C_SQLITESequenceName = "sqlite_sequence.name"
	C_SQLITESequenceSeq  = "sqlite_sequence.seq"
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

// Table web_publications.
const (
	WebPublications         sqlitegen.Table  = "web_publications"
	WebPublicationsDocument sqlitegen.Column = "web_publications.document"
	WebPublicationsPath     sqlitegen.Column = "web_publications.path"
	WebPublicationsVersion  sqlitegen.Column = "web_publications.version"
)

// Table web_publications. Plain strings.
const (
	T_WebPublications         = "web_publications"
	C_WebPublicationsDocument = "web_publications.document"
	C_WebPublicationsPath     = "web_publications.path"
	C_WebPublicationsVersion  = "web_publications.version"
)

// Schema describes SQLite columns.
var Schema = sqlitegen.Schema{
	Columns: map[sqlitegen.Column]sqlitegen.ColumnInfo{
		BlobsCodec:                          {Table: Blobs, SQLType: "INTEGER"},
		BlobsData:                           {Table: Blobs, SQLType: "BLOB"},
		BlobsID:                             {Table: Blobs, SQLType: "INTEGER"},
		BlobsInsertTime:                     {Table: Blobs, SQLType: "INTEGER"},
		BlobsMultihash:                      {Table: Blobs, SQLType: "BLOB"},
		BlobsSize:                           {Table: Blobs, SQLType: "INTEGER"},
		ContentLinksViewData:                {Table: ContentLinksView, SQLType: "BLOB"},
		ContentLinksViewRel:                 {Table: ContentLinksView, SQLType: "TEXT"},
		ContentLinksViewSourceBlob:          {Table: ContentLinksView, SQLType: "INTEGER"},
		ContentLinksViewSourceBlobCodec:     {Table: ContentLinksView, SQLType: "INTEGER"},
		ContentLinksViewSourceBlobMultihash: {Table: ContentLinksView, SQLType: "BLOB"},
		ContentLinksViewSourceEID:           {Table: ContentLinksView, SQLType: "TEXT"},
		ContentLinksViewSourceEntity:        {Table: ContentLinksView, SQLType: "INTEGER"},
		ContentLinksViewTargetEID:           {Table: ContentLinksView, SQLType: "TEXT"},
		ContentLinksViewTargetEntity:        {Table: ContentLinksView, SQLType: "INTEGER"},
		GlobalMetaKey:                       {Table: GlobalMeta, SQLType: "TEXT"},
		GlobalMetaValue:                     {Table: GlobalMeta, SQLType: "TEXT"},
		HDChangeDepsChild:                   {Table: HDChangeDeps, SQLType: "INTEGER"},
		HDChangeDepsParent:                  {Table: HDChangeDeps, SQLType: "INTEGER"},
		HDChangesBlob:                       {Table: HDChanges, SQLType: "INTEGER"},
		HDChangesEntity:                     {Table: HDChanges, SQLType: "INTEGER"},
		HDChangesHlcTime:                    {Table: HDChanges, SQLType: "INTEGER"},
		HDChangesViewBlobID:                 {Table: HDChangesView, SQLType: "INTEGER"},
		HDChangesViewCodec:                  {Table: HDChangesView, SQLType: "INTEGER"},
		HDChangesViewData:                   {Table: HDChangesView, SQLType: "BLOB"},
		HDChangesViewEntity:                 {Table: HDChangesView, SQLType: "TEXT"},
		HDChangesViewEntityID:               {Table: HDChangesView, SQLType: "INTEGER"},
		HDChangesViewHlcTime:                {Table: HDChangesView, SQLType: "INTEGER"},
		HDChangesViewMultihash:              {Table: HDChangesView, SQLType: "BLOB"},
		HDChangesViewSize:                   {Table: HDChangesView, SQLType: "INTEGER"},
		HDDraftsBlob:                        {Table: HDDrafts, SQLType: "INTEGER"},
		HDDraftsEntity:                      {Table: HDDrafts, SQLType: "INTEGER"},
		HDDraftsViewBlobID:                  {Table: HDDraftsView, SQLType: "INTEGER"},
		HDDraftsViewCodec:                   {Table: HDDraftsView, SQLType: "INTEGER"},
		HDDraftsViewEntity:                  {Table: HDDraftsView, SQLType: "TEXT"},
		HDDraftsViewEntityID:                {Table: HDDraftsView, SQLType: "INTEGER"},
		HDDraftsViewMultihash:               {Table: HDDraftsView, SQLType: "BLOB"},
		HDEntitiesEID:                       {Table: HDEntities, SQLType: "TEXT"},
		HDEntitiesID:                        {Table: HDEntities, SQLType: "INTEGER"},
		HDLinksData:                         {Table: HDLinks, SQLType: "BLOB"},
		HDLinksRel:                          {Table: HDLinks, SQLType: "TEXT"},
		HDLinksSourceBlob:                   {Table: HDLinks, SQLType: "INTEGER"},
		HDLinksTargetBlob:                   {Table: HDLinks, SQLType: "INTEGER"},
		HDLinksTargetEntity:                 {Table: HDLinks, SQLType: "INTEGER"},
		InviteTokensExpireTime:              {Table: InviteTokens, SQLType: "INTEGER"},
		InviteTokensRole:                    {Table: InviteTokens, SQLType: "INTEGER"},
		InviteTokensToken:                   {Table: InviteTokens, SQLType: "TEXT"},
		KeyDelegationsBlob:                  {Table: KeyDelegations, SQLType: "INTEGER"},
		KeyDelegationsDelegate:              {Table: KeyDelegations, SQLType: "INTEGER"},
		KeyDelegationsIssueTime:             {Table: KeyDelegations, SQLType: "INTEGER"},
		KeyDelegationsIssuer:                {Table: KeyDelegations, SQLType: "INTEGER"},
		KeyDelegationsViewBlob:              {Table: KeyDelegationsView, SQLType: "INTEGER"},
		KeyDelegationsViewBlobCodec:         {Table: KeyDelegationsView, SQLType: "INTEGER"},
		KeyDelegationsViewBlobMultihash:     {Table: KeyDelegationsView, SQLType: "BLOB"},
		KeyDelegationsViewDelegate:          {Table: KeyDelegationsView, SQLType: "BLOB"},
		KeyDelegationsViewIssueTime:         {Table: KeyDelegationsView, SQLType: "INTEGER"},
		KeyDelegationsViewIssuer:            {Table: KeyDelegationsView, SQLType: "BLOB"},
		PublicBlobsViewCodec:                {Table: PublicBlobsView, SQLType: "INTEGER"},
		PublicBlobsViewID:                   {Table: PublicBlobsView, SQLType: "INTEGER"},
		PublicBlobsViewMultihash:            {Table: PublicBlobsView, SQLType: "BLOB"},
		PublicKeysID:                        {Table: PublicKeys, SQLType: "INTEGER"},
		PublicKeysPrincipal:                 {Table: PublicKeys, SQLType: "BLOB"},
		SiteMembersAccountID:                {Table: SiteMembers, SQLType: "INTEGER"},
		SiteMembersRole:                     {Table: SiteMembers, SQLType: "INTEGER"},
		SitesAccountID:                      {Table: Sites, SQLType: "INTEGER"},
		SitesAddresses:                      {Table: Sites, SQLType: "TEXT"},
		SitesHostname:                       {Table: Sites, SQLType: "TEXT"},
		SitesRole:                           {Table: Sites, SQLType: "INTEGER"},
		SQLITESequenceName:                  {Table: SQLITESequence, SQLType: ""},
		SQLITESequenceSeq:                   {Table: SQLITESequence, SQLType: ""},
		WalletsAddress:                      {Table: Wallets, SQLType: "TEXT"},
		WalletsBalance:                      {Table: Wallets, SQLType: "INTEGER"},
		WalletsID:                           {Table: Wallets, SQLType: "TEXT"},
		WalletsLogin:                        {Table: Wallets, SQLType: "BLOB"},
		WalletsName:                         {Table: Wallets, SQLType: "TEXT"},
		WalletsPassword:                     {Table: Wallets, SQLType: "BLOB"},
		WalletsToken:                        {Table: Wallets, SQLType: "BLOB"},
		WalletsType:                         {Table: Wallets, SQLType: "TEXT"},
		WebPublicationsDocument:             {Table: WebPublications, SQLType: "INTEGER"},
		WebPublicationsPath:                 {Table: WebPublications, SQLType: "TEXT"},
		WebPublicationsVersion:              {Table: WebPublications, SQLType: "TEXT"},
	},
}
