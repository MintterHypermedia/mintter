import {render, screen} from 'test/app-test-utils'
import AuthorNode from '../author-node'

import * as clientMock from 'shared/mintter-client'
import {Document} from '@mintter/api/v2/documents_pb'

jest.mock('shared/mintter-client')

async function renderAuthorNode({route = '/', ...restConfig} = {}) {
  return await render(<AuthorNode />, {route, ...restConfig})
}

describe('Author Node', () => {
  clientMock.getProfile.mockResolvedValue({
    toObject: (): Partial<Profile.AsObject> => ({
      peerId: '1234asdf',
      username: 'test-user',
      accountId: '123456789098765432',
    }),
  })

  clientMock.listDocuments.mockResolvedValue({
    getDocumentsList: () =>
      [
        {
          version: '123456780987654321',
          title: 'Test Document Title',
          subtitle: 'Test Document Subtitle',
          author: '123456789098765432',
        },
      ].map(
        (doc: Document.AsObject): Document => ({
          getCreateTime: () => ({
            toDate: () => 12345,
          }),
          toObject: () => doc,
        }),
      ),
  })
  test('should render the library when profile is available', async () => {
    await renderAuthorNode()
    expect(screen.getByText(/library/i)).toBeInTheDocument()
  })
})
