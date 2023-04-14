package ipfs

import (
	"bytes"
	"context"
	"io/ioutil"
	"mime/multipart"
	"mintter/backend/logging"
	"net"
	"net/http"
	"net/http/httptest"
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/gorilla/mux"
	"github.com/ipfs/boxo/blockstore"
	"github.com/ipfs/boxo/provider"
	"github.com/ipfs/boxo/provider/queue"
	"github.com/ipfs/boxo/provider/simple"
	"github.com/ipfs/go-datastore"
	"github.com/ipfs/go-datastore/sync"
	crypto "github.com/libp2p/go-libp2p/core/crypto"
	"github.com/multiformats/go-multiaddr"
	"github.com/stretchr/testify/require"
)

const (
	fileBoundary = 100000
	fileCID      = "bafybeiecq2irw4fl5vunnxo6cegoutv4de63h7n27tekkjtak3jrvrzzhe"
)

func TestAddFile(t *testing.T) {
	server := makeManager(t, akey)
	fileBytes, err := createFile0toBound(fileBoundary)
	require.NoError(t, err)
	fileReader := bytes.NewReader(fileBytes)
	node, err := server.addFile(fileReader)
	require.NoError(t, err)
	size, err := node.Size()
	require.NoError(t, err)
	require.Greater(t, int(size), len(fileBytes))
	cid := node.Cid().String()
	require.Equal(t, fileCID, cid)
}
func TestPostGet(t *testing.T) {
	server := makeManager(t, akey)
	fileBytes, err := createFile0toBound(fileBoundary)
	require.NoError(t, err)
	router := mux.NewRouter()
	router.HandleFunc(IPFSRootRoute+UploadRoute, server.UploadFile)
	router.HandleFunc(IPFSRootRoute+GetRoute, server.GetFile)
	const port = 8085
	srv := &http.Server{
		Addr:         ":" + strconv.Itoa(port),
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		Handler:      router,
	}

	lis, err := net.Listen("tcp", srv.Addr)
	require.NoError(t, err)

	go func() {
		err := srv.Serve(lis)
		require.ErrorAs(t, err, http.ErrServerClosed)
	}()

	res := makeRequest(t, "POST", IPFSRootRoute+UploadRoute, fileBytes, router)
	require.Equal(t, http.StatusCreated, res.Code)
	responseData, err := ioutil.ReadAll(res.Body)
	require.NoError(t, err)
	require.Equal(t, fileCID, string(responseData))
	res = makeRequest(t, "GET", IPFSRootRoute+"/"+string(responseData), nil, router)
	require.Equal(t, http.StatusOK, res.Code)
	require.Equal(t, fileBytes, res.Body.Bytes())
}

func makeRequest(t *testing.T, method, url string, body []byte, router *mux.Router) *httptest.ResponseRecorder {
	var request *http.Request
	var err error
	if strings.ToUpper(method) == "POST" {
		var b bytes.Buffer
		w := multipart.NewWriter(&b)
		// h := make(textproto.MIMEHeader)
		// h.Set("Content-Type", "application/octet-stream")
		// ioWriter, err := w.CreatePart(h)
		ioWriter, err := w.CreateFormFile("file", "myFile.csv")
		require.NoError(t, err)
		size, err := ioWriter.Write(body)
		require.NoError(t, err)
		require.Equal(t, len(body), int(size))
		// Don't forget to close the multipart writer.
		// If you don't close it, your request will be missing the terminating boundary.
		w.Close()
		// Now that you have a form, you can submit it to your handler.
		request, err = http.NewRequest(method, url, &b)
		require.NoError(t, err)
		// Don't forget to set the content type, this will contain the boundary.
		request.Header.Set("Content-Type", w.FormDataContentType())
	} else {
		request, err = http.NewRequest(method, url, bytes.NewBuffer(body))
		require.NoError(t, err)
	}
	writer := httptest.NewRecorder()
	router.ServeHTTP(writer, request)
	return writer
}

func makeManager(t *testing.T, k crypto.PrivKey) *FileManager {
	fileManager := NewManager(context.Background(), logging.New("mintter/ipfs", "debug"))
	ds := sync.MutexWrap(datastore.NewMapDatastore())
	t.Cleanup(func() { require.NoError(t, ds.Close()) })

	n, err := NewLibp2pNode(k, ds, nil)
	require.NoError(t, err)

	ma, err := multiaddr.NewMultiaddr("/ip4/0.0.0.0/tcp/0")
	require.NoError(t, err)

	bs := blockstore.NewBlockstore(ds)

	bitswap, err := NewBitswap(n, n.Routing, bs)
	require.NoError(t, err)

	t.Cleanup(func() { require.NoError(t, bitswap.Close()) })

	require.NoError(t, n.Network().Listen(ma))

	t.Cleanup(func() { require.NoError(t, n.Close()) })

	queue, err := queue.NewQueue(context.Background(), "repro", n.Datastore())
	require.NoError(t, err)

	prov := simple.NewProvider(context.Background(), queue, n.Routing)

	reprov := simple.NewReprovider(
		context.Background(),
		defaultReprovideInterval,
		n.Routing,
		simple.NewBlockstoreProvider(blockstore.NewBlockstore(n.Datastore())),
	)

	providing := provider.NewSystem(prov, reprov)
	providing.Run()

	require.NoError(t, fileManager.Start(bs, bitswap, providing))
	return fileManager
}

// createFile0toBound creates a file with the number 0 to bound.
func createFile0toBound(bound uint) ([]byte, error) {
	b := strings.Builder{}
	for i := uint(0); i <= bound; i++ {
		s := strconv.Itoa(int(i))
		_, err := b.WriteString(s)
		if err != nil {
			return nil, err
		}
	}
	return []byte(b.String()), nil
}
