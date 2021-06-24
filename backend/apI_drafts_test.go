package backend

import (
	"context"
	"testing"

	"github.com/ipfs/go-cid"
	"github.com/stretchr/testify/require"
	"golang.org/x/sync/errgroup"

	documents "mintter/api/go/documents/v1alpha"
	"mintter/backend/testutil"
)

func TestAPICreateDraft(t *testing.T) {
	back := makeTestBackend(t, "alice", true)
	api := newDraftsAPI(back)
	ctx := context.Background()

	doc, err := api.CreateDraft(ctx, &documents.CreateDraftRequest{})
	require.NoError(t, err)
	require.NotEqual(t, "", doc.Id)
	require.Equal(t, back.repo.acc.id.String(), doc.Author)
	require.False(t, doc.UpdateTime.AsTime().IsZero())
	require.False(t, doc.CreateTime.AsTime().IsZero())
	require.Nil(t, doc.PublishTime)
}

func TestAPIListDrafts(t *testing.T) {
	back := makeTestBackend(t, "alice", true)
	api := newDraftsAPI(back)
	ctx := context.Background()

	var docs [5]*documents.Document

	g, ctx := errgroup.WithContext(ctx)
	for i := range docs {
		i := i
		g.Go(func() error {
			doc, err := api.CreateDraft(ctx, &documents.CreateDraftRequest{})
			if err != nil {
				return err
			}
			docs[i] = doc
			return nil
		})
	}
	require.NoError(t, g.Wait())

	list, err := api.ListDrafts(ctx, &documents.ListDraftsRequest{})
	require.NoError(t, err)

	for _, doc := range list.Documents {
		var ok bool
		for _, d := range docs {
			if d.Id == doc.Id {
				ok = true
				testutil.ProtoEqual(t, d, doc, "documents don't match")
				break
			}
		}
		require.True(t, ok, "document was not found "+doc.Id)
	}
}

func TestAPIGetDraft(t *testing.T) {
	back := makeTestBackend(t, "alice", true)
	api := newDraftsAPI(back)
	ctx := context.Background()

	doc, err := api.CreateDraft(ctx, &documents.CreateDraftRequest{})
	require.NoError(t, err)

	got, err := api.GetDraft(ctx, &documents.GetDraftRequest{DocumentId: doc.Id})
	require.NoError(t, err)

	testutil.ProtoEqual(t, doc, got, "must get draft that was created")
}

func TestAPIUpdateDraft_BugDuplicatedBlocks(t *testing.T) {
	// See: https://www.notion.so/mintter/updateDraft-duplicating-blocks-e5611c8112a4487cac199ffd612244ee
	// for some history.

	back := makeTestBackend(t, "alice", true)
	api := newDraftsAPI(back)
	ctx := context.Background()

	doc, err := api.CreateDraft(ctx, &documents.CreateDraftRequest{})
	require.NoError(t, err)

	doc.Children = []string{"block-1"}
	doc.Blocks = map[string]*documents.Block{
		"block-1": {
			Id: "block-1",
			Elements: []*documents.InlineElement{
				{
					Content: &documents.InlineElement_TextRun{
						TextRun: &documents.TextRun{
							Text: "Hello World",
						},
					},
				},
			},
		},
	}

	updated, err := api.UpdateDraft(ctx, &documents.UpdateDraftRequest{Document: doc})
	require.NoError(t, err)
	doc.UpdateTime = updated.UpdateTime
	testutil.ProtoEqual(t, doc, updated, "updated doc don't match")

	got, err := api.GetDraft(ctx, &documents.GetDraftRequest{DocumentId: doc.Id})
	require.NoError(t, err)
	testutil.ProtoEqual(t, updated, got, "got must be as updated")

	got.Children = []string{"block-1", "block-2"}
	got.Blocks["block-2"] = &documents.Block{
		Id: "block-2",
		Elements: []*documents.InlineElement{
			{
				Content: &documents.InlineElement_TextRun{
					TextRun: &documents.TextRun{
						Text: "Another Hello World",
					},
				},
			},
		},
	}

	updated, err = api.UpdateDraft(ctx, &documents.UpdateDraftRequest{Document: got})
	require.NoError(t, err)
	got.UpdateTime = updated.UpdateTime
	testutil.ProtoEqual(t, got, updated, "updated must match got")

	got, err = api.GetDraft(ctx, &documents.GetDraftRequest{DocumentId: updated.Id})
	require.NoError(t, err)
	testutil.ProtoEqual(t, updated, got, "got after update")
}

func TestAPIUpdateDraft(t *testing.T) {
	back := makeTestBackend(t, "alice", true)
	api := newDraftsAPI(back)
	ctx := context.Background()

	doc, err := api.CreateDraft(ctx, &documents.CreateDraftRequest{})
	require.NoError(t, err)

	doc.Title = "My new document title"
	doc.Subtitle = "This is my document's abstract"
	doc.Children = []string{"block-1"}
	doc.Blocks = map[string]*documents.Block{
		"block-1": {
			Id: "block-1",
			Elements: []*documents.InlineElement{
				{
					Content: &documents.InlineElement_TextRun{
						TextRun: &documents.TextRun{
							Text: "Hello world!",
						},
					},
				},
			},
		},
	}

	updated, err := api.UpdateDraft(ctx, &documents.UpdateDraftRequest{Document: doc})
	require.NoError(t, err)

	doc.UpdateTime = updated.UpdateTime // This is the only field that should differ.
	testutil.ProtoEqual(t, doc, updated, "UpdateDraft should return the updated document")

	list, err := api.ListDrafts(ctx, &documents.ListDraftsRequest{})
	require.NoError(t, err)
	require.Len(t, list.Documents, 1)
	require.Equal(t, updated.Id, list.Documents[0].Id)
	require.Equal(t, updated.Author, list.Documents[0].Author)
	require.Equal(t, updated.Title, list.Documents[0].Title)

	got, err := api.GetDraft(ctx, &documents.GetDraftRequest{DocumentId: doc.Id})
	require.NoError(t, err)

	testutil.ProtoEqual(t, doc, got, "must get draft that was updated")
}

func TestAPIDeleteDraft(t *testing.T) {
	back := makeTestBackend(t, "alice", true)
	api := newDraftsAPI(back)
	ctx := context.Background()

	doc, err := api.CreateDraft(ctx, &documents.CreateDraftRequest{})
	require.NoError(t, err)
	doc.Title = "My updated title"

	// Create another doc just to ensure list returns at least something after delete.
	_, err = api.CreateDraft(ctx, &documents.CreateDraftRequest{})
	require.NoError(t, err)

	doc, err = api.UpdateDraft(ctx, &documents.UpdateDraftRequest{Document: doc})
	require.NoError(t, err)

	deleted, err := api.DeleteDraft(ctx, &documents.DeleteDraftRequest{DocumentId: doc.Id})
	require.NoError(t, err)
	require.NotNil(t, deleted)

	list, err := api.ListDrafts(ctx, &documents.ListDraftsRequest{})
	require.NoError(t, err)
	require.Len(t, list.Documents, 1) // Must be 1 because we've created another document apart from the deleted one.
}

func TestAPIPublishDraft(t *testing.T) {
	back := makeTestBackend(t, "alice", true)
	api := newDraftsAPI(back)
	ctx := context.Background()

	doc, err := api.CreateDraft(ctx, &documents.CreateDraftRequest{})
	require.NoError(t, err)
	doc.Title = "My updated title"

	doc, err = api.UpdateDraft(ctx, &documents.UpdateDraftRequest{Document: doc})
	require.NoError(t, err)

	published, err := api.PublishDraft(ctx, &documents.PublishDraftRequest{DocumentId: doc.Id})
	require.NoError(t, err)

	docid, err := cid.Decode(doc.Id)
	require.NoError(t, err)

	version, err := back.patches.GetObjectVersion(ctx, docid)
	require.NoError(t, err)

	require.Equal(t, doc.Id, version.ObjectId)
	require.Len(t, version.VersionVector, 1)
	require.Equal(t, published.Version, version.VersionVector[0].Head)

	list, err := api.ListDrafts(ctx, &documents.ListDraftsRequest{})
	require.NoError(t, err)
	require.Len(t, list.Documents, 0, "published draft must be removed from drafts")
}
