// Package sitesql implements all the database related functions.
package sitesql

import (
	"mintter/backend/db/sqlitegen"
	"mintter/backend/db/sqlitegen/qb"
	"mintter/backend/db/sqliteschema"
	"os"
)

var _ = generateQueries

const (
	// SiteTitleKey is the column name of the meta table where the site title (in case this node is a site) is stored.
	SiteTitleKey = "site_title"
	// SiteDescriptionKey is the column name of the meta table where the site description (in case this node is a site) is stored.
	SiteDescriptionKey = "site_description"
)

//go:generate gorun -tags codegen generateQueries
func generateQueries() error {
	code, err := sqlitegen.CodegenQueries("sitesql",

		qb.MakeQuery(sqliteschema.Schema, "addSite", sqlitegen.QueryKindExec,
			"INSERT OR REPLACE INTO", sqliteschema.Sites, qb.ListColShort(
				sqliteschema.SitesAccountID,
				sqliteschema.SitesAddresses,
				sqliteschema.SitesHostname,
				sqliteschema.SitesRole,
			), qb.Line,
			"VALUES", qb.List(
				qb.SubQuery(
					"SELECT "+sqliteschema.AccountsID.ShortName()+" FROM "+string(sqliteschema.Accounts)+" WHERE "+sqliteschema.AccountsMultihash.ShortName()+" =", qb.Var("accID", sqlitegen.TypeBytes),
				),
				qb.VarCol(sqliteschema.SitesAddresses),
				qb.VarCol(sqliteschema.SitesHostname),
				qb.VarCol(sqliteschema.SitesRole),
			),
		),
		qb.MakeQuery(sqliteschema.Schema, "removeSite", sqlitegen.QueryKindExec,
			"DELETE FROM", sqliteschema.Sites,
			"WHERE", sqliteschema.SitesHostname, "=", qb.VarCol(sqliteschema.SitesHostname),
		),

		qb.MakeQuery(sqliteschema.Schema, "getSite", sqlitegen.QueryKindSingle,
			"SELECT",
			qb.Results(
				qb.ResultCol(sqliteschema.SitesAddresses),
				qb.ResultCol(sqliteschema.SitesHostname),
				qb.ResultCol(sqliteschema.SitesRole),
				qb.ResultCol(sqliteschema.AccountsMultihash),
			), qb.Line,
			"FROM", sqliteschema.Sites, qb.Line,
			"JOIN", sqliteschema.Accounts, "ON", sqliteschema.AccountsID, "=", sqliteschema.SitesAccountID, qb.Line,
			"WHERE", sqliteschema.SitesHostname, "=", qb.VarCol(sqliteschema.SitesHostname),
		),

		qb.MakeQuery(sqliteschema.Schema, "listSites", sqlitegen.QueryKindMany,
			"SELECT",
			qb.Results(
				qb.ResultCol(sqliteschema.SitesAddresses),
				qb.ResultCol(sqliteschema.SitesHostname),
				qb.ResultCol(sqliteschema.SitesRole),
				qb.ResultCol(sqliteschema.AccountsMultihash),
			), qb.Line,
			"FROM", sqliteschema.Sites, qb.Line,
			"JOIN", sqliteschema.Accounts, "ON", sqliteschema.AccountsID, "=", sqliteschema.SitesAccountID,
		),

		qb.MakeQuery(sqliteschema.Schema, "setSiteTitle", sqlitegen.QueryKindExec,
			"INSERT OR REPLACE INTO", sqliteschema.GlobalMeta, qb.ListColShort(
				sqliteschema.GlobalMetaKey,
				sqliteschema.GlobalMetaValue,
			), qb.Line,
			"VALUES", qb.List(
				"'"+SiteTitleKey+"'",
				qb.Var("title", sqlitegen.TypeText),
			),
		),

		qb.MakeQuery(sqliteschema.Schema, "getSiteTitle", sqlitegen.QueryKindSingle,
			"SELECT", qb.Results(
				qb.ResultCol(sqliteschema.GlobalMetaValue),
			),
			"FROM", sqliteschema.GlobalMeta,
			"WHERE", sqliteschema.GlobalMetaKey, "='"+SiteTitleKey+"'",
		),

		qb.MakeQuery(sqliteschema.Schema, "setSiteDescription", sqlitegen.QueryKindExec,
			"INSERT OR REPLACE INTO", sqliteschema.GlobalMeta, qb.ListColShort(
				sqliteschema.GlobalMetaKey,
				sqliteschema.GlobalMetaValue,
			), qb.Line,
			"VALUES", qb.List(
				"'"+SiteDescriptionKey+"'",
				qb.Var("description", sqlitegen.TypeText),
			),
		),

		qb.MakeQuery(sqliteschema.Schema, "getSiteDescription", sqlitegen.QueryKindSingle,
			"SELECT", qb.Results(
				qb.ResultCol(sqliteschema.GlobalMetaValue),
			),
			"FROM", sqliteschema.GlobalMeta,
			"WHERE", sqliteschema.GlobalMetaKey, "='"+SiteDescriptionKey+"'",
		),

		qb.MakeQuery(sqliteschema.Schema, "addToken", sqlitegen.QueryKindExec,
			qb.Insert(sqliteschema.InviteTokensToken, sqliteschema.InviteTokensExpirationTime,
				sqliteschema.InviteTokensRole),
		),

		qb.MakeQuery(sqliteschema.Schema, "getToken", sqlitegen.QueryKindSingle,
			"SELECT", qb.Results(
				qb.ResultCol(sqliteschema.InviteTokensRole),
				qb.ResultCol(sqliteschema.InviteTokensExpirationTime),
			), qb.Line,
			"FROM", sqliteschema.InviteTokens,
			"WHERE", sqliteschema.InviteTokensToken, "=", qb.VarCol(sqliteschema.InviteTokensToken),
		),

		qb.MakeQuery(sqliteschema.Schema, "listTokens", sqlitegen.QueryKindMany,
			"SELECT", qb.Results(
				qb.ResultCol(sqliteschema.InviteTokensRole),
				qb.ResultCol(sqliteschema.InviteTokensExpirationTime),
				qb.ResultCol(sqliteschema.InviteTokensToken),
			), qb.Line,
			"FROM", sqliteschema.InviteTokens,
		),

		qb.MakeQuery(sqliteschema.Schema, "removeToken", sqlitegen.QueryKindExec,
			"DELETE FROM", sqliteschema.InviteTokens,
			"WHERE", sqliteschema.InviteTokensToken, "=", qb.VarCol(sqliteschema.InviteTokensToken),
		),

		qb.MakeQuery(sqliteschema.Schema, "removeExpiredTokens", sqlitegen.QueryKindExec,
			"DELETE FROM", sqliteschema.InviteTokens,
			"WHERE", sqliteschema.InviteTokensExpirationTime, "<", qb.SQLFunc("strftime", "'%s'", "'now'"),
		),

		qb.MakeQuery(sqliteschema.Schema, "addMember", sqlitegen.QueryKindSingle,
			"INSERT OR REPLACE INTO", sqliteschema.SiteMembers, qb.ListColShort(
				sqliteschema.SiteMembersAccountID,
				sqliteschema.SiteMembersRole,
			), qb.Line,
			"VALUES", qb.List(
				qb.SubQuery(
					"SELECT "+sqliteschema.AccountsID.ShortName()+" FROM "+string(sqliteschema.Accounts)+" WHERE "+sqliteschema.AccountsMultihash.ShortName()+" =", qb.Var("accID", sqlitegen.TypeBytes),
				),
				qb.VarCol(sqliteschema.SiteMembersRole),
			), qb.Line,
			"RETURNING", qb.Results(sqliteschema.SiteMembersRole),
		),

		qb.MakeQuery(sqliteschema.Schema, "removeMember", sqlitegen.QueryKindExec,
			"DELETE FROM", sqliteschema.SiteMembers,
			"WHERE", sqliteschema.SiteMembersAccountID, "="+
				"(SELECT "+sqliteschema.AccountsID.ShortName()+" FROM "+string(sqliteschema.Accounts)+" WHERE "+sqliteschema.AccountsMultihash.ShortName()+" =", qb.Var("accID", sqlitegen.TypeBytes), ")",
		),

		qb.MakeQuery(sqliteschema.Schema, "getMember", sqlitegen.QueryKindSingle,
			"SELECT",
			qb.Results(
				qb.ResultCol(sqliteschema.SiteMembersRole),
			), qb.Line,
			"FROM", sqliteschema.SiteMembers,
			"WHERE", sqliteschema.SiteMembersAccountID, "="+
				"(SELECT "+sqliteschema.AccountsID.ShortName()+" FROM "+string(sqliteschema.Accounts)+" WHERE "+sqliteschema.AccountsMultihash.ShortName()+" =", qb.Var("accID", sqlitegen.TypeBytes), ")",
		),

		qb.MakeQuery(sqliteschema.Schema, "listMembers", sqlitegen.QueryKindMany,
			"SELECT",
			qb.Results(
				qb.ResultCol(sqliteschema.SiteMembersRole),
				qb.ResultCol(sqliteschema.AccountsMultihash),
			), qb.Line,
			"FROM", sqliteschema.SiteMembers, qb.Line,
			"JOIN", sqliteschema.Accounts, "ON", sqliteschema.AccountsID, "=", sqliteschema.SiteMembersAccountID,
		),

		qb.MakeQuery(sqliteschema.Schema, "addWebPublicationRecord", sqlitegen.QueryKindExec,
			"INSERT OR REPLACE INTO", sqliteschema.WebPublicationRecords, qb.ListColShort(
				sqliteschema.WebPublicationRecordsBlockID,
				sqliteschema.WebPublicationRecordsDocumentVersion,
				sqliteschema.WebPublicationRecordsPath,
			), qb.Line,
			"VALUES", qb.List(
				qb.SubQuery(
					"SELECT "+sqliteschema.IPFSBlocksID.ShortName()+" FROM "+string(sqliteschema.IPFSBlocks)+" WHERE "+sqliteschema.IPFSBlocksMultihash.ShortName()+" =", qb.Var("doc_multihash", sqlitegen.TypeBytes),
				),
				qb.VarCol(sqliteschema.WebPublicationRecordsDocumentVersion),
				qb.VarCol(sqliteschema.WebPublicationRecordsPath),
			),
		),

		qb.MakeQuery(sqliteschema.Schema, "removeWebPublicationRecord", sqlitegen.QueryKindExec,
			"DELETE FROM", sqliteschema.WebPublicationRecords,
			"WHERE", sqliteschema.WebPublicationRecordsBlockID, "="+
				"(SELECT "+sqliteschema.IPFSBlocksID.ShortName()+" FROM "+string(sqliteschema.IPFSBlocks)+" WHERE "+sqliteschema.IPFSBlocksMultihash.ShortName()+" =", qb.Var("doc_multihash", sqlitegen.TypeBytes), ")",
		),

		qb.MakeQuery(sqliteschema.Schema, "listWebPublicationRecords", sqlitegen.QueryKindMany,
			"SELECT",
			qb.Results(
				qb.ResultCol(sqliteschema.IPFSBlocksCodec),
				qb.ResultCol(sqliteschema.IPFSBlocksMultihash),
				qb.ResultCol(sqliteschema.WebPublicationRecordsDocumentVersion),
				qb.ResultCol(sqliteschema.WebPublicationRecordsPath),
			), qb.Line,
			"FROM", sqliteschema.WebPublicationRecords, qb.Line,
			"JOIN", sqliteschema.IPFSBlocks, "ON", sqliteschema.WebPublicationRecordsBlockID, "=", sqliteschema.IPFSBlocksID,
		),

		qb.MakeQuery(sqliteschema.Schema, "getWebPublicationRecord", sqlitegen.QueryKindSingle,
			"SELECT",
			qb.Results(
				qb.ResultCol(sqliteschema.IPFSBlocksCodec),
				qb.ResultCol(sqliteschema.IPFSBlocksMultihash),
				qb.ResultCol(sqliteschema.WebPublicationRecordsDocumentVersion),
				qb.ResultCol(sqliteschema.WebPublicationRecordsPath),
			), qb.Line,
			"FROM", sqliteschema.WebPublicationRecords, qb.Line,
			"JOIN", sqliteschema.IPFSBlocks, "ON", sqliteschema.WebPublicationRecordsBlockID, "=", sqliteschema.IPFSBlocksID,
			"WHERE", sqliteschema.WebPublicationRecordsBlockID, "="+
				"(SELECT "+sqliteschema.IPFSBlocksID.ShortName()+" FROM "+string(sqliteschema.IPFSBlocks)+" WHERE "+sqliteschema.IPFSBlocksMultihash.ShortName()+" =", qb.Var("doc_multihash", sqlitegen.TypeBytes), ")",
		),

		qb.MakeQuery(sqliteschema.Schema, "listWebPublicationReferencesByIDOnly", sqlitegen.QueryKindMany,
			"SELECT", qb.Results(
				qb.ResultCol(sqliteschema.IPFSBlocksCodec),
				qb.ResultCol(sqliteschema.IPFSBlocksMultihash),
				qb.ResultCol(sqliteschema.ContentLinksTargetVersion),
			), qb.Line,
			"FROM", sqliteschema.ContentLinks, qb.Line,
			"JOIN", sqliteschema.IPFSBlocks, "ON", sqliteschema.ContentLinksTargetDocumentID, "=", sqliteschema.IPFSBlocksID,
			"WHERE", sqliteschema.ContentLinksSourceDocumentID, "="+
				"(SELECT "+sqliteschema.IPFSBlocksID.ShortName()+" FROM "+string(sqliteschema.IPFSBlocks)+" WHERE "+sqliteschema.IPFSBlocksMultihash.ShortName()+" =", qb.Var("doc_multihash", sqlitegen.TypeBytes), ")",
		),

		qb.MakeQuery(sqliteschema.Schema, "listWebPublicationReferencesWithVersion", sqlitegen.QueryKindMany,
			"SELECT", qb.Results(
				qb.ResultCol(sqliteschema.IPFSBlocksCodec),
				qb.ResultCol(sqliteschema.IPFSBlocksMultihash),
				qb.ResultCol(sqliteschema.ContentLinksTargetVersion),
			), qb.Line,
			"FROM", sqliteschema.ContentLinks, qb.Line,
			"JOIN", sqliteschema.IPFSBlocks, "ON", sqliteschema.ContentLinksTargetDocumentID, "=", sqliteschema.IPFSBlocksID,
			"WHERE", sqliteschema.ContentLinksSourceDocumentID, "="+
				"(SELECT "+sqliteschema.IPFSBlocksID.ShortName()+" FROM "+string(sqliteschema.IPFSBlocks)+" WHERE "+sqliteschema.IPFSBlocksMultihash.ShortName()+" =", qb.Var("doc_multihash", sqlitegen.TypeBytes), ")",
			"AND", sqliteschema.ContentLinksSourceVersion, "=", qb.Var("doc_version", sqlitegen.TypeText),
		),
	)
	if err != nil {
		return err
	}
	if err := os.WriteFile("queries.gen.go", code, 0600); err != nil {
		return err
	}

	return nil
}
