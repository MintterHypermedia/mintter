// Package sitesql implements all the database related functions for sites.
package sitesql

import (
	"fmt"
	site "mintter/backend/genproto/documents/v1alpha"
	"time"

	"crawshaw.io/sqlite"
)

// TokenInfo holds information about the token.
type TokenInfo struct {
	Role           site.Member_Role
	ExpirationTime time.Time
}

// AddToken inserts a token in the database to be redeemed.
func AddToken(conn *sqlite.Conn, token string, expirationTime time.Time, role site.Member_Role) error {
	err := addToken(conn, token, expirationTime.Unix(), int64(role))
	if err != nil {
		return fmt.Errorf("Could not insert token in the db : %w", err)
	}
	return nil
}

// GetToken gets a token from the database.
func GetToken(conn *sqlite.Conn, token string) (TokenInfo, error) {
	tokenInfo, err := getToken(conn, token)
	if err != nil {
		return TokenInfo{}, fmt.Errorf("Could not get token: %w", err)
	}
	return TokenInfo{
		Role:           site.Member_Role(tokenInfo.InviteTokensRole),
		ExpirationTime: time.Unix(tokenInfo.InviteTokensExpirationTime, 0),
	}, nil
}

// ListTokens lists all available tokens.
func ListTokens(conn *sqlite.Conn) (map[string]TokenInfo, error) {
	var ret = map[string]TokenInfo{}
	tokensInfo, err := listTokens(conn)
	if err != nil {
		return ret, fmt.Errorf("Could not get list of tokens: %w", err)
	}
	for _, tokenInfo := range tokensInfo {
		ret[tokenInfo.InviteTokensToken] = TokenInfo{
			Role:           site.Member_Role(tokenInfo.InviteTokensRole),
			ExpirationTime: time.Unix(tokenInfo.InviteTokensExpirationTime, 0),
		}
	}
	return ret, nil
}

// RemoveToken deletes a token in the database to be redeemed.
func RemoveToken(conn *sqlite.Conn, token string) error {
	err := removeToken(conn, token)
	if err != nil {
		return fmt.Errorf("Could not remove token from the db : %w", err)
	}
	return nil
}

// CleanExpiredTokens removes all expired tokens.
func CleanExpiredTokens(conn *sqlite.Conn) error {
	err := removeExpiredTokens(conn)
	if err != nil {
		return fmt.Errorf("Could not clean expired tokens fromm the db : %w", err)
	}
	return nil
}