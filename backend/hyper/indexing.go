package hyper

import (
	"encoding/json"
	"fmt"
	"mintter/backend/core"
	documents "mintter/backend/genproto/documents/v1alpha"
	"mintter/backend/hyper/hypersql"
	"net/url"
	"strings"

	"crawshaw.io/sqlite"
	"github.com/ipfs/go-cid"
	"go.uber.org/zap"
	"google.golang.org/protobuf/encoding/protojson"
)

// indexBlob is an uber-function that knows about all types of blobs we want to index.
// This is probably a bad idea to put here, but for now it's easier to work with that way.
// TODO(burdiyan): eventually we might want to make this package agnostic to blob types.
func (bs *Storage) indexBlob(conn *sqlite.Conn, id int64, blob Blob) error {
	switch v := blob.Decoded.(type) {
	case KeyDelegation:
		iss, err := bs.ensurePublicKey(conn, v.Issuer)
		if err != nil {
			return err
		}

		del, err := bs.ensurePublicKey(conn, v.Delegate)
		if err != nil {
			return err
		}

		if v.Purpose != DelegationPurposeRegistration {
			bs.log.Warn("UnknownKeyDelegationPurpose", zap.String("purpose", v.Purpose))
		} else {
			_, err := hypersql.EntitiesInsertOrIgnore(conn, string(NewEntityID("mintter:account", v.Issuer.String())))
			if err != nil {
				return err
			}
		}

		if _, err := hypersql.KeyDelegationsInsertOrIgnore(conn, id, iss, del, v.IssueTime.Unix()); err != nil {
			return err
		}
	case Change:
		// ensure entity
		eid, err := bs.ensureEntity(conn, v.Entity)
		if err != nil {
			return err
		}

		for _, dep := range v.Deps {
			res, err := hypersql.BlobsGetSize(conn, dep.Hash())
			if err != nil {
				return err
			}
			if res.BlobsSize < 0 {
				return fmt.Errorf("missing causal dependency %s of change %s", dep, blob.CID)
			}

			if err := hypersql.LinksInsert(conn, id, "change:depends", res.BlobsID, 0, nil); err != nil {
				return fmt.Errorf("failed to link dependency %s of change %s", dep, blob.CID)
			}
		}

		if err := hypersql.ChangesInsertOrIgnore(conn, id, eid, v.HLCTime.Pack()); err != nil {
			return err
		}

		if err := bs.indexBacklinks(conn, id, blob.CID, v); err != nil {
			return err
		}
	}

	return nil
}

func (bs *Storage) ensureEntity(conn *sqlite.Conn, eid EntityID) (int64, error) {
	look, err := hypersql.EntitiesLookupID(conn, string(eid))
	if err != nil {
		return 0, err
	}
	if look.HyperEntitiesID != 0 {
		return look.HyperEntitiesID, nil
	}

	ins, err := hypersql.EntitiesInsertOrIgnore(conn, string(eid))
	if err != nil {
		return 0, err
	}
	if ins.HyperEntitiesID == 0 {
		return 0, fmt.Errorf("failed to insert entity for some reason")
	}

	return ins.HyperEntitiesID, nil
}

func (bs *Storage) ensurePublicKey(conn *sqlite.Conn, key core.Principal) (int64, error) {
	res, err := hypersql.PublicKeysLookupID(conn, key)
	if err != nil {
		return 0, err
	}

	if res.PublicKeysID > 0 {
		return res.PublicKeysID, nil
	}

	ins, err := hypersql.PublicKeysInsert(conn, key)
	if err != nil {
		return 0, err
	}

	if ins.PublicKeysID <= 0 {
		panic("BUG: failed to insert key for some reason")
	}

	return ins.PublicKeysID, nil
}

func (bs *Storage) indexBacklinks(conn *sqlite.Conn, blobID int64, c cid.Cid, ch Change) error {
	if !strings.HasPrefix(string(ch.Entity), "mintter:document:") {
		return nil
	}

	blocks, ok := ch.Patch["blocks"].(map[string]any)
	if !ok {
		return nil
	}

	for id, blk := range blocks {
		v, ok := blk.(map[string]any)["#map"]
		if !ok {
			continue
		}
		// This is a very bad way to convert an opaque map into a block struct.
		// TODO(burdiyan): we should do better than this. This is ugly as hell.
		data, err := json.Marshal(v)
		if err != nil {
			return err
		}
		blk := &documents.Block{}
		if err := protojson.Unmarshal(data, blk); err != nil {
			return err
		}
		blk.Id = id
		blk.Revision = c.String()

		for _, ann := range blk.Annotations {
			// We only care about annotations with URL attribute.
			rawURL, ok := ann.Attributes["url"]
			if !ok {
				continue
			}

			u, err := url.Parse(rawURL)
			if err != nil {
				bs.log.Warn("FailedToParseURL", zap.String("url", rawURL), zap.Error(err))
				continue
			}

			switch u.Scheme {
			case "mintter":
				ld := LinkData{
					SourceBlock:    blk.Id,
					TargetFragment: u.Fragment,
					TargetVersion:  u.Query().Get("v"),
				}

				target := NewEntityID("mintter:document", u.Host)
				rel := "href:" + ann.Type

				targetID, err := bs.ensureEntity(conn, target)
				if err != nil {
					return err
				}

				ldjson, err := json.Marshal(ld)
				if err != nil {
					return fmt.Errorf("failed to encode link data: %w", err)
				}

				if err := hypersql.LinksInsert(conn, blobID, rel, 0, targetID, ldjson); err != nil {
					return err
				}
			case "ipfs":
				// TODO: parse ipfs links
			default:
				continue
			}
		}

	}

	return nil
}

type LinkData struct {
	SourceBlock    string `json:"b,omitempty"`
	TargetFragment string `json:"f,omitempty"`
	TargetVersion  string `json:"v,omitempty"`
}
