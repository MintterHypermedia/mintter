package testutil

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"runtime"
	"testing"

	"mintter/backend/identity"

	"github.com/ipfs/go-datastore"
	"github.com/ipfs/go-datastore/sync"
	blockstore "github.com/ipfs/go-ipfs-blockstore"
	"github.com/sanity-io/litter"
	"github.com/stretchr/testify/require"
	"google.golang.org/protobuf/proto"
)

// MakeProfile from available test data.
func MakeProfile(t *testing.T, name string) identity.Profile {
	t.Helper()

	_, file, _, _ := runtime.Caller(0)
	dir := filepath.Dir(file)

	data, err := ioutil.ReadFile(dir + "/testdata/profiles/" + name + ".json")
	require.NoError(t, err)

	var p identity.Profile
	require.NoError(t, json.Unmarshal(data, &p))

	return p
}

// MakeRepoPath for testing..
func MakeRepoPath(t *testing.T) string {
	t.Helper()

	dir, err := ioutil.TempDir("", "mintter-repo")
	require.NoError(t, err)

	t.Cleanup(func() {
		require.NoError(t, os.RemoveAll(dir))
	})

	return dir
}

// MakeBlockStore creates a new in-memory block store for tests.
func MakeBlockStore(t *testing.T) blockstore.Blockstore {
	return blockstore.NewBlockstore(MakeDatastore(t))
}

// MakeDatastore creates a new in-memory datastore
func MakeDatastore(t *testing.T) *FakeTxnDatastore {
	t.Helper()
	return &FakeTxnDatastore{sync.MutexWrap(datastore.NewMapDatastore())}
}

// FakeTxnDatastore implements wraps a datastore with fake transactions.
type FakeTxnDatastore struct {
	datastore.Batching
}

// NewTransaction implements TxnDatastore.
func (ds *FakeTxnDatastore) NewTransaction(readOnly bool) (datastore.Txn, error) {
	return &fakeTxn{ds}, nil
}

type fakeTxn struct {
	datastore.Datastore
}

func (txn *fakeTxn) Commit() error {
	return nil
}

func (txn *fakeTxn) Discard() {
	return
}

// ProtoEqual will check if want and got are equal Protobuf messages.
// For some weird reason they made Messages uncomparable using normal mechanisms.
func ProtoEqual(t *testing.T, want, got proto.Message, msg string, format ...interface{}) {
	t.Helper()
	ok := proto.Equal(want, got)
	if !ok {
		fmt.Println("Want:")
		litter.Dump(want)
		fmt.Println("Got:")
		litter.Dump(got)

		if format != nil {
			t.Fatalf(msg, format...)
		} else {
			t.Fatal(msg)
		}
	}
}
