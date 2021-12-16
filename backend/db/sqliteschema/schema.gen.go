// Code generated by sqlitegen. DO NOT EDIT.

package sqliteschema

import (
	"mintter/backend/db/sqlitegen"
)

// Table accounts.
const (
	Accounts          sqlitegen.Table  = "accounts"
	AccountsAlias     sqlitegen.Column = "accounts.alias"
	AccountsBio       sqlitegen.Column = "accounts.bio"
	AccountsCodec     sqlitegen.Column = "accounts.codec"
	AccountsEmail     sqlitegen.Column = "accounts.email"
	AccountsID        sqlitegen.Column = "accounts.id"
	AccountsMultihash sqlitegen.Column = "accounts.multihash"
)

// Table backlinks.
const (
	Backlinks      sqlitegen.Table  = "backlinks"
	BacklinksDepth sqlitegen.Column = "backlinks.depth"
	BacklinksID    sqlitegen.Column = "backlinks.id"
)

// Table changes.
const (
	Changes            sqlitegen.Table  = "changes"
	ChangesDeviceID    sqlitegen.Column = "changes.device_id"
	ChangesID          sqlitegen.Column = "changes.id"
	ChangesIPFSBlockID sqlitegen.Column = "changes.ipfs_block_id"
	ChangesLamportTime sqlitegen.Column = "changes.lamport_time"
	ChangesObjectID    sqlitegen.Column = "changes.object_id"
	ChangesSeq         sqlitegen.Column = "changes.seq"
)

// Table devices.
const (
	Devices           sqlitegen.Table  = "devices"
	DevicesAccountID  sqlitegen.Column = "devices.account_id"
	DevicesCodec      sqlitegen.Column = "devices.codec"
	DevicesCreateTime sqlitegen.Column = "devices.create_time"
	DevicesID         sqlitegen.Column = "devices.id"
	DevicesMultihash  sqlitegen.Column = "devices.multihash"
	DevicesPublicKey  sqlitegen.Column = "devices.public_key"
)

// Table drafts.
const (
	Drafts           sqlitegen.Table  = "drafts"
	DraftsContent    sqlitegen.Column = "drafts.content"
	DraftsCreateTime sqlitegen.Column = "drafts.create_time"
	DraftsID         sqlitegen.Column = "drafts.id"
	DraftsSubtitle   sqlitegen.Column = "drafts.subtitle"
	DraftsTitle      sqlitegen.Column = "drafts.title"
	DraftsUpdateTime sqlitegen.Column = "drafts.update_time"
)

// Table global_meta.
const (
	GlobalMeta      sqlitegen.Table  = "global_meta"
	GlobalMetaKey   sqlitegen.Column = "global_meta.key"
	GlobalMetaValue sqlitegen.Column = "global_meta.value"
)

// Table heads.
const (
	Heads            sqlitegen.Table  = "heads"
	HeadsDeviceID    sqlitegen.Column = "heads.device_id"
	HeadsIPFSBlockID sqlitegen.Column = "heads.ipfs_block_id"
	HeadsLamportTime sqlitegen.Column = "heads.lamport_time"
	HeadsObjectID    sqlitegen.Column = "heads.object_id"
	HeadsSeq         sqlitegen.Column = "heads.seq"
)

// Table ipfs_blocks.
const (
	IPFSBlocks           sqlitegen.Table  = "ipfs_blocks"
	IPFSBlocksCodec      sqlitegen.Column = "ipfs_blocks.codec"
	IPFSBlocksCreateTime sqlitegen.Column = "ipfs_blocks.create_time"
	IPFSBlocksData       sqlitegen.Column = "ipfs_blocks.data"
	IPFSBlocksID         sqlitegen.Column = "ipfs_blocks.id"
	IPFSBlocksMultihash  sqlitegen.Column = "ipfs_blocks.multihash"
)

// Table links.
const (
	Links               sqlitegen.Table  = "links"
	LinksDraftID        sqlitegen.Column = "links.draft_id"
	LinksIPFSBlockID    sqlitegen.Column = "links.ipfs_block_id"
	LinksSourceBlockID  sqlitegen.Column = "links.source_block_id"
	LinksSourceObjectID sqlitegen.Column = "links.source_object_id"
	LinksTargetBlockID  sqlitegen.Column = "links.target_block_id"
	LinksTargetObjectID sqlitegen.Column = "links.target_object_id"
	LinksTargetVersion  sqlitegen.Column = "links.target_version"
)

// Table objects.
const (
	Objects           sqlitegen.Table  = "objects"
	ObjectsAccountID  sqlitegen.Column = "objects.account_id"
	ObjectsCodec      sqlitegen.Column = "objects.codec"
	ObjectsCreateTime sqlitegen.Column = "objects.create_time"
	ObjectsID         sqlitegen.Column = "objects.id"
	ObjectsMultihash  sqlitegen.Column = "objects.multihash"
)

// Table publications.
const (
	Publications              sqlitegen.Table  = "publications"
	PublicationsCreateTime    sqlitegen.Column = "publications.create_time"
	PublicationsID            sqlitegen.Column = "publications.id"
	PublicationsLatestVersion sqlitegen.Column = "publications.latest_version"
	PublicationsPublishTime   sqlitegen.Column = "publications.publish_time"
	PublicationsSubtitle      sqlitegen.Column = "publications.subtitle"
	PublicationsTitle         sqlitegen.Column = "publications.title"
	PublicationsUpdateTime    sqlitegen.Column = "publications.update_time"
)

// Table wallets.
const (
	Wallets        sqlitegen.Table  = "wallets"
	WalletsAddress sqlitegen.Column = "wallets.address"
	WalletsAuth    sqlitegen.Column = "wallets.auth"
	WalletsBalance sqlitegen.Column = "wallets.balance"
	WalletsID      sqlitegen.Column = "wallets.id"
	WalletsName    sqlitegen.Column = "wallets.name"
	WalletsType    sqlitegen.Column = "wallets.type"
)

// Schema describes SQLite columns.
var Schema = sqlitegen.Schema{
	Columns: map[sqlitegen.Column]sqlitegen.ColumnInfo{
		AccountsAlias:             {Table: Accounts, SQLType: "TEXT"},
		AccountsBio:               {Table: Accounts, SQLType: "TEXT"},
		AccountsCodec:             {Table: Accounts, SQLType: "INTEGER"},
		AccountsEmail:             {Table: Accounts, SQLType: "TEXT"},
		AccountsID:                {Table: Accounts, SQLType: "INTEGER"},
		AccountsMultihash:         {Table: Accounts, SQLType: "BLOB"},
		BacklinksDepth:            {Table: Backlinks, SQLType: "INTEGER"},
		BacklinksID:               {Table: Backlinks, SQLType: "INTEGER"},
		ChangesDeviceID:           {Table: Changes, SQLType: "INTEGER"},
		ChangesID:                 {Table: Changes, SQLType: "INTEGER"},
		ChangesIPFSBlockID:        {Table: Changes, SQLType: "INTEGER"},
		ChangesLamportTime:        {Table: Changes, SQLType: "INTEGER"},
		ChangesObjectID:           {Table: Changes, SQLType: "INTEGER"},
		ChangesSeq:                {Table: Changes, SQLType: "INTEGER"},
		DevicesAccountID:          {Table: Devices, SQLType: "INTEGER"},
		DevicesCodec:              {Table: Devices, SQLType: "INTEGER"},
		DevicesCreateTime:         {Table: Devices, SQLType: "INTEGER"},
		DevicesID:                 {Table: Devices, SQLType: "INTEGER"},
		DevicesMultihash:          {Table: Devices, SQLType: "BLOB"},
		DevicesPublicKey:          {Table: Devices, SQLType: "BLOB"},
		DraftsContent:             {Table: Drafts, SQLType: "BLOB"},
		DraftsCreateTime:          {Table: Drafts, SQLType: "INTEGER"},
		DraftsID:                  {Table: Drafts, SQLType: "INTEGER"},
		DraftsSubtitle:            {Table: Drafts, SQLType: "TEXT"},
		DraftsTitle:               {Table: Drafts, SQLType: "TEXT"},
		DraftsUpdateTime:          {Table: Drafts, SQLType: "INTEGER"},
		GlobalMetaKey:             {Table: GlobalMeta, SQLType: "TEXT"},
		GlobalMetaValue:           {Table: GlobalMeta, SQLType: "TEXT"},
		HeadsDeviceID:             {Table: Heads, SQLType: "INTEGER"},
		HeadsIPFSBlockID:          {Table: Heads, SQLType: "INTEGER"},
		HeadsLamportTime:          {Table: Heads, SQLType: "INTEGER"},
		HeadsObjectID:             {Table: Heads, SQLType: "INTEGER"},
		HeadsSeq:                  {Table: Heads, SQLType: "INTEGER"},
		IPFSBlocksCodec:           {Table: IPFSBlocks, SQLType: "INTEGER"},
		IPFSBlocksCreateTime:      {Table: IPFSBlocks, SQLType: "INTEGER"},
		IPFSBlocksData:            {Table: IPFSBlocks, SQLType: "BLOB"},
		IPFSBlocksID:              {Table: IPFSBlocks, SQLType: "INTEGER"},
		IPFSBlocksMultihash:       {Table: IPFSBlocks, SQLType: "BLOB"},
		LinksDraftID:              {Table: Links, SQLType: "INTEGER"},
		LinksIPFSBlockID:          {Table: Links, SQLType: "INTEGER"},
		LinksSourceBlockID:        {Table: Links, SQLType: "TEXT"},
		LinksSourceObjectID:       {Table: Links, SQLType: "INTEGER"},
		LinksTargetBlockID:        {Table: Links, SQLType: "TEXT"},
		LinksTargetObjectID:       {Table: Links, SQLType: "INTEGER"},
		LinksTargetVersion:        {Table: Links, SQLType: "TEXT"},
		ObjectsAccountID:          {Table: Objects, SQLType: "INTEGER"},
		ObjectsCodec:              {Table: Objects, SQLType: "INTEGER"},
		ObjectsCreateTime:         {Table: Objects, SQLType: "INTEGER"},
		ObjectsID:                 {Table: Objects, SQLType: "INTEGER"},
		ObjectsMultihash:          {Table: Objects, SQLType: "BLOB"},
		PublicationsCreateTime:    {Table: Publications, SQLType: "INTEGER"},
		PublicationsID:            {Table: Publications, SQLType: "INTEGER"},
		PublicationsLatestVersion: {Table: Publications, SQLType: "TEXT"},
		PublicationsPublishTime:   {Table: Publications, SQLType: "INTEGER"},
		PublicationsSubtitle:      {Table: Publications, SQLType: "TEXT"},
		PublicationsTitle:         {Table: Publications, SQLType: "TEXT"},
		PublicationsUpdateTime:    {Table: Publications, SQLType: "INTEGER"},
		WalletsAddress:            {Table: Wallets, SQLType: "TEXT"},
		WalletsAuth:               {Table: Wallets, SQLType: "BLOB"},
		WalletsBalance:            {Table: Wallets, SQLType: "INTEGER"},
		WalletsID:                 {Table: Wallets, SQLType: "TEXT"},
		WalletsName:               {Table: Wallets, SQLType: "TEXT"},
		WalletsType:               {Table: Wallets, SQLType: "TEXT"},
	},
}
