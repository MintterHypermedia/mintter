package backend

import (
	"context"
	"fmt"
	"time"

	"github.com/dgraph-io/badger/v3"
	"github.com/ipfs/go-cid"

	"mintter/backend/badgergraph"
)

type graphdb struct {
	db *badgergraph.DB
}

// StoreDevice stores the binding between account and device.
func (db *graphdb) StoreDevice(ctx context.Context, aid AccountID, did DeviceID) error {
retry:
	err := db.db.Update(func(txn *badgergraph.Txn) error {
		auid, err := txn.UID(typeAccount, aid.Hash())
		if err != nil {
			return err
		}

		puid, err := txn.UID(typePeer, did.Hash())
		if err != nil {
			return err
		}

		if err := txn.WriteTriple(auid, pAccountPeer, puid); err != nil {
			return err
		}

		return nil
	})
	if err == nil {
		return nil
	}

	if err == badger.ErrConflict {
		goto retry
	}

	return fmt.Errorf("failed to store account-device binding %s-%s: %w", aid, did, err)
}

func (db *graphdb) GetDeviceAccount(ctx context.Context, did DeviceID) (aid AccountID, err error) {
	if err := db.db.View(func(txn *badgergraph.Txn) error {
		puid, err := txn.UID(typePeer, did.Hash())
		if err != nil {
			return err
		}

		auids, err := txn.ListReverseRelations(pAccountPeer, puid)
		if err != nil {
			return err
		}

		if len(auids) > 1 {
			return fmt.Errorf("found more than one account for peer %s", did)
		}

		ahash, err := txn.XID(typeAccount, auids[0])
		if err != nil {
			return err
		}

		aid = AccountID(cid.NewCidV1(codecAccountID, ahash))

		return nil
	}); err != nil {
		return AccountID{}, fmt.Errorf("failed to get account for device %s: %w", did, err)
	}

	return aid, nil
}

func (db *graphdb) TouchDocument(ctx context.Context, docID cid.Cid, title, subtitle string, t time.Time) error {
	return db.db.Update(func(txn *badgergraph.Txn) error {
		uid, err := txn.UIDRead(typeDocument, docID.Hash())
		if err != nil {
			return err
		}

		if err := txn.WriteTriple(uid, pDocumentUpdateTime, t); err != nil {
			return err
		}

		// TODO: this implies that the user won't be able to remove title nor subtitle after it's written.
		// Is it worth it?

		if title != "" {
			if err := txn.WriteTriple(uid, pDocumentTitle, title); err != nil {
				return err
			}
		}

		if subtitle != "" {
			if err := txn.WriteTriple(uid, pDocumentSubtitle, subtitle); err != nil {
				return err
			}
		}

		return nil
	})
}

func (db *graphdb) IndexDocument(ctx context.Context,
	docID cid.Cid,
	author AccountID,
	title, subtitle string,
	createTime, updateTime time.Time,
) error {
	dhash := docID.Hash()
	ahash := author.Hash()

retry:

	err := db.db.Update(func(txn *badgergraph.Txn) error {
		duid, err := txn.UID(typeDocument, dhash)
		if err != nil {
			return err
		}

		auid, err := txn.UID(typeAccount, ahash)
		if err != nil {
			return err
		}

		if err := txn.WriteTriple(duid, pDocumentAuthor, auid); err != nil {
			return err
		}

		if err := txn.WriteTriple(duid, pDocumentTitle, title); err != nil {
			return err
		}

		if err := txn.WriteTriple(duid, pDocumentSubtitle, subtitle); err != nil {
			return err
		}

		if err := txn.WriteTriple(duid, pDocumentCreateTime, createTime); err != nil {
			return err
		}

		if err := txn.WriteTriple(duid, pDocumentUpdateTime, updateTime); err != nil {
			return err
		}

		return nil
	})
	if err == nil {
		return nil
	}

	if err == badger.ErrConflict {
		goto retry
	}

	return fmt.Errorf("failed to index document %s: %w", docID, err)
}

func (db *graphdb) ListAccountDevices() (map[AccountID][]DeviceID, error) {
	var out map[AccountID][]DeviceID
	if err := db.db.View(func(txn *badgergraph.Txn) error {
		auids, err := txn.ListNodesOfType(typeAccount)
		if err != nil && err != badger.ErrKeyNotFound {
			return err
		}

		if err == badger.ErrKeyNotFound {
			return nil
		}

		out = make(map[AccountID][]DeviceID, len(auids))
		for _, auid := range auids {
			ahash, err := txn.XID(typeAccount, auid)
			if err != nil {
				return err
			}

			aid := AccountID(cid.NewCidV1(codecAccountID, ahash))

			duids, err := txn.ListRelations(auid, pAccountPeer)
			if err != nil {
				return err
			}

			out[aid] = make([]DeviceID, len(duids))

			for i, duid := range duids {
				dhash, err := txn.XID(typePeer, duid)
				if err != nil {
					return err
				}

				out[aid][i] = DeviceID(cid.NewCidV1(cid.Libp2pKey, dhash))
			}
		}

		return nil
	}); err != nil {
		return nil, err
	}

	return out, nil
}

func (db *graphdb) ListAccounts(ctx context.Context) (objects []cid.Cid, err error) {
	if err := db.db.View(func(txn *badgergraph.Txn) error {
		uids, err := txn.ListNodesOfType(typeAccount)
		if err != nil {
			return err
		}

		objects = make([]cid.Cid, len(uids))

		for i, u := range uids {
			hash, err := txn.XID(typeAccount, u)
			if err != nil {
				return err
			}

			objects[i] = cid.NewCidV1(codecAccountID, hash)
		}

		return nil
	}); err != nil {
		return nil, fmt.Errorf("failed to get account uids: %w", err)
	}

	return objects, nil
}
