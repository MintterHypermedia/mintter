import {render, screen} from 'test/app-test-utils'
import Publications from '../publications'
import * as clientMock from 'shared/mintterClient'
import {Profile} from '@mintter/api/v2/mintter_pb'

jest.mock('shared/mintterClient')

beforeEach(() => {
  clientMock.getProfile.mockResolvedValueOnce({
    toObject: (): Profile.AsObject => ({
      peerId: '1234asdf',
      username: 'test-user',
    }),
  })
  clientMock.listDocuments.mockResolvedValueOnce({
    toObject: () => ({
      documentsList: [],
    }),
  })
})

test('should render ', async () => {
  await render(<Publications />)

  expect(screen.getByText(/Start your first document/i)).toBeInTheDocument()
})
