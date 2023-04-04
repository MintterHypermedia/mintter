// Code generated by sqlitegen. DO NOT EDIT.

package sqliteschema

import (
	"mintter/backend/db/sqlitegen"
)

// Table account_devices.
const (
	AccountDevices             sqlitegen.Table  = "account_devices"
	AccountDevicesAccountID    sqlitegen.Column = "account_devices.account_id"
	AccountDevicesDelegationID sqlitegen.Column = "account_devices.delegation_id"
	AccountDevicesDeviceID     sqlitegen.Column = "account_devices.device_id"
)

// Table account_devices. Plain strings.
const (
	T_AccountDevices             = "account_devices"
	C_AccountDevicesAccountID    = "account_devices.account_id"
	C_AccountDevicesDelegationID = "account_devices.delegation_id"
	C_AccountDevicesDeviceID     = "account_devices.device_id"
)

// Table accounts.
const (
	Accounts           sqlitegen.Table  = "accounts"
	AccountsCreateTime sqlitegen.Column = "accounts.create_time"
	AccountsID         sqlitegen.Column = "accounts.id"
	AccountsMultihash  sqlitegen.Column = "accounts.multihash"
	AccountsPublicKey  sqlitegen.Column = "accounts.public_key"
)

// Table accounts. Plain strings.
const (
	T_Accounts           = "accounts"
	C_AccountsCreateTime = "accounts.create_time"
	C_AccountsID         = "accounts.id"
	C_AccountsMultihash  = "accounts.multihash"
	C_AccountsPublicKey  = "accounts.public_key"
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

// Table change_heads.
const (
	ChangeHeads            sqlitegen.Table  = "change_heads"
	ChangeHeadsAccountID   sqlitegen.Column = "change_heads.account_id"
	ChangeHeadsDeviceID    sqlitegen.Column = "change_heads.device_id"
	ChangeHeadsID          sqlitegen.Column = "change_heads.id"
	ChangeHeadsKind        sqlitegen.Column = "change_heads.kind"
	ChangeHeadsPermanodeID sqlitegen.Column = "change_heads.permanode_id"
	ChangeHeadsStartTime   sqlitegen.Column = "change_heads.start_time"
)

// Table change_heads. Plain strings.
const (
	T_ChangeHeads            = "change_heads"
	C_ChangeHeadsAccountID   = "change_heads.account_id"
	C_ChangeHeadsDeviceID    = "change_heads.device_id"
	C_ChangeHeadsID          = "change_heads.id"
	C_ChangeHeadsKind        = "change_heads.kind"
	C_ChangeHeadsPermanodeID = "change_heads.permanode_id"
	C_ChangeHeadsStartTime   = "change_heads.start_time"
)

// Table changes.
const (
	Changes            sqlitegen.Table  = "changes"
	ChangesAccountID   sqlitegen.Column = "changes.account_id"
	ChangesDeviceID    sqlitegen.Column = "changes.device_id"
	ChangesID          sqlitegen.Column = "changes.id"
	ChangesKind        sqlitegen.Column = "changes.kind"
	ChangesPermanodeID sqlitegen.Column = "changes.permanode_id"
	ChangesStartTime   sqlitegen.Column = "changes.start_time"
)

// Table changes. Plain strings.
const (
	T_Changes            = "changes"
	C_ChangesAccountID   = "changes.account_id"
	C_ChangesDeviceID    = "changes.device_id"
	C_ChangesID          = "changes.id"
	C_ChangesKind        = "changes.kind"
	C_ChangesPermanodeID = "changes.permanode_id"
	C_ChangesStartTime   = "changes.start_time"
)

// Table changes_deref.
const (
	ChangesDeref            sqlitegen.Table  = "changes_deref"
	ChangesDerefChangeCodec sqlitegen.Column = "changes_deref.change_codec"
	ChangesDerefChangeHash  sqlitegen.Column = "changes_deref.change_hash"
	ChangesDerefChangeID    sqlitegen.Column = "changes_deref.change_id"
	ChangesDerefIsDraft     sqlitegen.Column = "changes_deref.is_draft"
	ChangesDerefObjectCodec sqlitegen.Column = "changes_deref.object_codec"
	ChangesDerefObjectHash  sqlitegen.Column = "changes_deref.object_hash"
	ChangesDerefPermanodeID sqlitegen.Column = "changes_deref.permanode_id"
)

// Table changes_deref. Plain strings.
const (
	T_ChangesDeref            = "changes_deref"
	C_ChangesDerefChangeCodec = "changes_deref.change_codec"
	C_ChangesDerefChangeHash  = "changes_deref.change_hash"
	C_ChangesDerefChangeID    = "changes_deref.change_id"
	C_ChangesDerefIsDraft     = "changes_deref.is_draft"
	C_ChangesDerefObjectCodec = "changes_deref.object_codec"
	C_ChangesDerefObjectHash  = "changes_deref.object_hash"
	C_ChangesDerefPermanodeID = "changes_deref.permanode_id"
)

// Table content_links.
const (
	ContentLinks                 sqlitegen.Table  = "content_links"
	ContentLinksSourceBlockID    sqlitegen.Column = "content_links.source_block_id"
	ContentLinksSourceChangeID   sqlitegen.Column = "content_links.source_change_id"
	ContentLinksSourceDocumentID sqlitegen.Column = "content_links.source_document_id"
	ContentLinksSourceVersion    sqlitegen.Column = "content_links.source_version"
	ContentLinksTargetBlockID    sqlitegen.Column = "content_links.target_block_id"
	ContentLinksTargetDocumentID sqlitegen.Column = "content_links.target_document_id"
	ContentLinksTargetVersion    sqlitegen.Column = "content_links.target_version"
)

// Table content_links. Plain strings.
const (
	T_ContentLinks                 = "content_links"
	C_ContentLinksSourceBlockID    = "content_links.source_block_id"
	C_ContentLinksSourceChangeID   = "content_links.source_change_id"
	C_ContentLinksSourceDocumentID = "content_links.source_document_id"
	C_ContentLinksSourceVersion    = "content_links.source_version"
	C_ContentLinksTargetBlockID    = "content_links.target_block_id"
	C_ContentLinksTargetDocumentID = "content_links.target_document_id"
	C_ContentLinksTargetVersion    = "content_links.target_version"
)

// Table device_proofs.
const (
	DeviceProofs                sqlitegen.Table  = "device_proofs"
	DeviceProofsAccountHash     sqlitegen.Column = "device_proofs.account_hash"
	DeviceProofsDelegationCodec sqlitegen.Column = "device_proofs.delegation_codec"
	DeviceProofsDelegationHash  sqlitegen.Column = "device_proofs.delegation_hash"
	DeviceProofsDeviceHash      sqlitegen.Column = "device_proofs.device_hash"
)

// Table device_proofs. Plain strings.
const (
	T_DeviceProofs                = "device_proofs"
	C_DeviceProofsAccountHash     = "device_proofs.account_hash"
	C_DeviceProofsDelegationCodec = "device_proofs.delegation_codec"
	C_DeviceProofsDelegationHash  = "device_proofs.delegation_hash"
	C_DeviceProofsDeviceHash      = "device_proofs.device_hash"
)

// Table devices.
const (
	Devices           sqlitegen.Table  = "devices"
	DevicesCreateTime sqlitegen.Column = "devices.create_time"
	DevicesID         sqlitegen.Column = "devices.id"
	DevicesMultihash  sqlitegen.Column = "devices.multihash"
	DevicesPublicKey  sqlitegen.Column = "devices.public_key"
)

// Table devices. Plain strings.
const (
	T_Devices           = "devices"
	C_DevicesCreateTime = "devices.create_time"
	C_DevicesID         = "devices.id"
	C_DevicesMultihash  = "devices.multihash"
	C_DevicesPublicKey  = "devices.public_key"
)

// Table draft_changes.
const (
	DraftChanges            sqlitegen.Table  = "draft_changes"
	DraftChangesID          sqlitegen.Column = "draft_changes.id"
	DraftChangesPermanodeID sqlitegen.Column = "draft_changes.permanode_id"
)

// Table draft_changes. Plain strings.
const (
	T_DraftChanges            = "draft_changes"
	C_DraftChangesID          = "draft_changes.id"
	C_DraftChangesPermanodeID = "draft_changes.permanode_id"
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

// Table invite_tokens.
const (
	InviteTokens               sqlitegen.Table  = "invite_tokens"
	InviteTokensExpirationTime sqlitegen.Column = "invite_tokens.expiration_time"
	InviteTokensRole           sqlitegen.Column = "invite_tokens.role"
	InviteTokensToken          sqlitegen.Column = "invite_tokens.token"
)

// Table invite_tokens. Plain strings.
const (
	T_InviteTokens               = "invite_tokens"
	C_InviteTokensExpirationTime = "invite_tokens.expiration_time"
	C_InviteTokensRole           = "invite_tokens.role"
	C_InviteTokensToken          = "invite_tokens.token"
)

// Table ipfs_blocks.
const (
	IPFSBlocks           sqlitegen.Table  = "ipfs_blocks"
	IPFSBlocksCodec      sqlitegen.Column = "ipfs_blocks.codec"
	IPFSBlocksData       sqlitegen.Column = "ipfs_blocks.data"
	IPFSBlocksID         sqlitegen.Column = "ipfs_blocks.id"
	IPFSBlocksInsertTime sqlitegen.Column = "ipfs_blocks.insert_time"
	IPFSBlocksMultihash  sqlitegen.Column = "ipfs_blocks.multihash"
	IPFSBlocksSize       sqlitegen.Column = "ipfs_blocks.size"
)

// Table ipfs_blocks. Plain strings.
const (
	T_IPFSBlocks           = "ipfs_blocks"
	C_IPFSBlocksCodec      = "ipfs_blocks.codec"
	C_IPFSBlocksData       = "ipfs_blocks.data"
	C_IPFSBlocksID         = "ipfs_blocks.id"
	C_IPFSBlocksInsertTime = "ipfs_blocks.insert_time"
	C_IPFSBlocksMultihash  = "ipfs_blocks.multihash"
	C_IPFSBlocksSize       = "ipfs_blocks.size"
)

// Table ipld_links.
const (
	IPLDLinks       sqlitegen.Table  = "ipld_links"
	IPLDLinksChild  sqlitegen.Column = "ipld_links.child"
	IPLDLinksParent sqlitegen.Column = "ipld_links.parent"
	IPLDLinksPath   sqlitegen.Column = "ipld_links.path"
)

// Table ipld_links. Plain strings.
const (
	T_IPLDLinks       = "ipld_links"
	C_IPLDLinksChild  = "ipld_links.child"
	C_IPLDLinksParent = "ipld_links.parent"
	C_IPLDLinksPath   = "ipld_links.path"
)

// Table permanodes.
const (
	Permanodes           sqlitegen.Table  = "permanodes"
	PermanodesAccountID  sqlitegen.Column = "permanodes.account_id"
	PermanodesCreateTime sqlitegen.Column = "permanodes.create_time"
	PermanodesID         sqlitegen.Column = "permanodes.id"
	PermanodesType       sqlitegen.Column = "permanodes.type"
)

// Table permanodes. Plain strings.
const (
	T_Permanodes           = "permanodes"
	C_PermanodesAccountID  = "permanodes.account_id"
	C_PermanodesCreateTime = "permanodes.create_time"
	C_PermanodesID         = "permanodes.id"
	C_PermanodesType       = "permanodes.type"
)

// Table public_blobs.
const (
	PublicBlobs          sqlitegen.Table  = "public_blobs"
	PublicBlobsCodec     sqlitegen.Column = "public_blobs.codec"
	PublicBlobsMultihash sqlitegen.Column = "public_blobs.multihash"
)

// Table public_blobs. Plain strings.
const (
	T_PublicBlobs          = "public_blobs"
	C_PublicBlobsCodec     = "public_blobs.codec"
	C_PublicBlobsMultihash = "public_blobs.multihash"
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

// Table web_publication_records.
const (
	WebPublicationRecords                sqlitegen.Table  = "web_publication_records"
	WebPublicationRecordsBlockID         sqlitegen.Column = "web_publication_records.block_id"
	WebPublicationRecordsDocumentVersion sqlitegen.Column = "web_publication_records.document_version"
	WebPublicationRecordsPath            sqlitegen.Column = "web_publication_records.path"
)

// Table web_publication_records. Plain strings.
const (
	T_WebPublicationRecords                = "web_publication_records"
	C_WebPublicationRecordsBlockID         = "web_publication_records.block_id"
	C_WebPublicationRecordsDocumentVersion = "web_publication_records.document_version"
	C_WebPublicationRecordsPath            = "web_publication_records.path"
)

// Schema describes SQLite columns.
var Schema = sqlitegen.Schema{
	Columns: map[sqlitegen.Column]sqlitegen.ColumnInfo{
		AccountDevicesAccountID:              {Table: AccountDevices, SQLType: "INTEGER"},
		AccountDevicesDelegationID:           {Table: AccountDevices, SQLType: "INTEGER"},
		AccountDevicesDeviceID:               {Table: AccountDevices, SQLType: "INTEGER"},
		AccountsCreateTime:                   {Table: Accounts, SQLType: "INTEGER"},
		AccountsID:                           {Table: Accounts, SQLType: "INTEGER"},
		AccountsMultihash:                    {Table: Accounts, SQLType: "BLOB"},
		AccountsPublicKey:                    {Table: Accounts, SQLType: "BLOB"},
		ChangeDepsChild:                      {Table: ChangeDeps, SQLType: "INTEGER"},
		ChangeDepsParent:                     {Table: ChangeDeps, SQLType: "INTEGER"},
		ChangeHeadsAccountID:                 {Table: ChangeHeads, SQLType: "INTEGER"},
		ChangeHeadsDeviceID:                  {Table: ChangeHeads, SQLType: "INTEGER"},
		ChangeHeadsID:                        {Table: ChangeHeads, SQLType: "INTEGER"},
		ChangeHeadsKind:                      {Table: ChangeHeads, SQLType: "TEXT"},
		ChangeHeadsPermanodeID:               {Table: ChangeHeads, SQLType: "INTEGER"},
		ChangeHeadsStartTime:                 {Table: ChangeHeads, SQLType: "INTEGER"},
		ChangesAccountID:                     {Table: Changes, SQLType: "INTEGER"},
		ChangesDeviceID:                      {Table: Changes, SQLType: "INTEGER"},
		ChangesID:                            {Table: Changes, SQLType: "INTEGER"},
		ChangesKind:                          {Table: Changes, SQLType: "TEXT"},
		ChangesPermanodeID:                   {Table: Changes, SQLType: "INTEGER"},
		ChangesStartTime:                     {Table: Changes, SQLType: "INTEGER"},
		ChangesDerefChangeCodec:              {Table: ChangesDeref, SQLType: "INTEGER"},
		ChangesDerefChangeHash:               {Table: ChangesDeref, SQLType: "BLOB"},
		ChangesDerefChangeID:                 {Table: ChangesDeref, SQLType: "INTEGER"},
		ChangesDerefIsDraft:                  {Table: ChangesDeref, SQLType: ""},
		ChangesDerefObjectCodec:              {Table: ChangesDeref, SQLType: "INTEGER"},
		ChangesDerefObjectHash:               {Table: ChangesDeref, SQLType: "BLOB"},
		ChangesDerefPermanodeID:              {Table: ChangesDeref, SQLType: "INTEGER"},
		ContentLinksSourceBlockID:            {Table: ContentLinks, SQLType: "TEXT"},
		ContentLinksSourceChangeID:           {Table: ContentLinks, SQLType: "INTEGER"},
		ContentLinksSourceDocumentID:         {Table: ContentLinks, SQLType: "INTEGER"},
		ContentLinksSourceVersion:            {Table: ContentLinks, SQLType: "TEXT"},
		ContentLinksTargetBlockID:            {Table: ContentLinks, SQLType: "TEXT"},
		ContentLinksTargetDocumentID:         {Table: ContentLinks, SQLType: "INTEGER"},
		ContentLinksTargetVersion:            {Table: ContentLinks, SQLType: "TEXT"},
		DeviceProofsAccountHash:              {Table: DeviceProofs, SQLType: "BLOB"},
		DeviceProofsDelegationCodec:          {Table: DeviceProofs, SQLType: "INTEGER"},
		DeviceProofsDelegationHash:           {Table: DeviceProofs, SQLType: "BLOB"},
		DeviceProofsDeviceHash:               {Table: DeviceProofs, SQLType: "BLOB"},
		DevicesCreateTime:                    {Table: Devices, SQLType: "INTEGER"},
		DevicesID:                            {Table: Devices, SQLType: "INTEGER"},
		DevicesMultihash:                     {Table: Devices, SQLType: "BLOB"},
		DevicesPublicKey:                     {Table: Devices, SQLType: "BLOB"},
		DraftChangesID:                       {Table: DraftChanges, SQLType: "INTEGER"},
		DraftChangesPermanodeID:              {Table: DraftChanges, SQLType: "INTEGER"},
		GlobalMetaKey:                        {Table: GlobalMeta, SQLType: "TEXT"},
		GlobalMetaValue:                      {Table: GlobalMeta, SQLType: "TEXT"},
		InviteTokensExpirationTime:           {Table: InviteTokens, SQLType: "INTEGER"},
		InviteTokensRole:                     {Table: InviteTokens, SQLType: "INTEGER"},
		InviteTokensToken:                    {Table: InviteTokens, SQLType: "TEXT"},
		IPFSBlocksCodec:                      {Table: IPFSBlocks, SQLType: "INTEGER"},
		IPFSBlocksData:                       {Table: IPFSBlocks, SQLType: "BLOB"},
		IPFSBlocksID:                         {Table: IPFSBlocks, SQLType: "INTEGER"},
		IPFSBlocksInsertTime:                 {Table: IPFSBlocks, SQLType: "INTEGER"},
		IPFSBlocksMultihash:                  {Table: IPFSBlocks, SQLType: "BLOB"},
		IPFSBlocksSize:                       {Table: IPFSBlocks, SQLType: "INTEGER"},
		IPLDLinksChild:                       {Table: IPLDLinks, SQLType: "INTEGER"},
		IPLDLinksParent:                      {Table: IPLDLinks, SQLType: "INTEGER"},
		IPLDLinksPath:                        {Table: IPLDLinks, SQLType: "TEXT"},
		PermanodesAccountID:                  {Table: Permanodes, SQLType: "INTEGER"},
		PermanodesCreateTime:                 {Table: Permanodes, SQLType: "INTEGER"},
		PermanodesID:                         {Table: Permanodes, SQLType: "INTEGER"},
		PermanodesType:                       {Table: Permanodes, SQLType: "TEXT"},
		PublicBlobsCodec:                     {Table: PublicBlobs, SQLType: "INTEGER"},
		PublicBlobsMultihash:                 {Table: PublicBlobs, SQLType: "BLOB"},
		SiteMembersAccountID:                 {Table: SiteMembers, SQLType: "INTEGER"},
		SiteMembersRole:                      {Table: SiteMembers, SQLType: "INTEGER"},
		SitesAccountID:                       {Table: Sites, SQLType: "INTEGER"},
		SitesAddresses:                       {Table: Sites, SQLType: "TEXT"},
		SitesHostname:                        {Table: Sites, SQLType: "TEXT"},
		SitesRole:                            {Table: Sites, SQLType: "INTEGER"},
		SQLITESequenceName:                   {Table: SQLITESequence, SQLType: ""},
		SQLITESequenceSeq:                    {Table: SQLITESequence, SQLType: ""},
		WalletsAddress:                       {Table: Wallets, SQLType: "TEXT"},
		WalletsBalance:                       {Table: Wallets, SQLType: "INTEGER"},
		WalletsID:                            {Table: Wallets, SQLType: "TEXT"},
		WalletsLogin:                         {Table: Wallets, SQLType: "BLOB"},
		WalletsName:                          {Table: Wallets, SQLType: "TEXT"},
		WalletsPassword:                      {Table: Wallets, SQLType: "BLOB"},
		WalletsToken:                         {Table: Wallets, SQLType: "BLOB"},
		WalletsType:                          {Table: Wallets, SQLType: "TEXT"},
		WebPublicationRecordsBlockID:         {Table: WebPublicationRecords, SQLType: "INTEGER"},
		WebPublicationRecordsDocumentVersion: {Table: WebPublicationRecords, SQLType: "TEXT"},
		WebPublicationRecordsPath:            {Table: WebPublicationRecords, SQLType: "TEXT"},
	},
}
