import {
  render,
  screen,
  userEvent,
  waitForLoadingToFinish,
  fireEvent,
  waitFor,
  act,
  waitForElement,
} from 'test/app-test-utils'
import {BrowserRouter as Router} from 'react-router-dom'
import {ThemeProvider} from 'shared/themeContext'
import {ProfileProvider} from 'shared/profileContext'
import {MintterProvider} from 'shared/mintterContext'
import WelcomeProvider from 'shared/welcomeProvider'
import RetypeSeed from '../retype-seed'
import {GenSeedResponse, Profile} from '@mintter/proto/mintter_pb'
import * as clientMock from 'shared/V1mintterClient'
import {getRandomElements as mockRandom} from 'shared/utils'

jest.mock('shared/V1mintterClient')
jest.mock('shared/utils')

async function renderWelcomeScreen() {
  const route = `/private/welcome/retype-seed`

  const mnemonicList = ['word-1', 'word-2', 'word-3']

  clientMock.getProfile.mockResolvedValueOnce({
    toObject: (): Profile.AsObject => ({}),
  })

  clientMock.createProfile = jest.fn()

  mockRandom.mockReturnValueOnce([0, 1, 2])

  const utils = await render(<RetypeSeed />, {
    route,
    wrapper: ({children}) => (
      <Router>
        <ProfileProvider>
          <WelcomeProvider
            value={{
              state: {mnemonicList, progress: 1, aezeedPassphrase: ''},
              dispatch: jest.fn(),
            }}
          >
            {children}
          </WelcomeProvider>
        </ProfileProvider>
      </Router>
    ),
  })

  const nextBtn = screen.getByText(/Next →/i)

  return {
    ...utils,
    nextBtn,
    mnemonicList,
  }
}

const onSubmit = jest.fn()

test('Welcome - Retype Seed Screen', async () => {
  const {nextBtn, mnemonicList} = await renderWelcomeScreen()

  const input1 = screen.getByLabelText(/1/i)
  const input2 = screen.getByLabelText(/2/i)
  const input3 = screen.getByLabelText(/3/i)

  await waitFor(() => {
    expect(input1).toHaveFocus()
  })

  await act(() => userEvent.type(input1, 'w'))
  const error1 = await screen.findByTestId('tid-error-word-0')

  expect(error1).toBeInTheDocument()
  expect(nextBtn).toBeDisabled()

  await act(() => userEvent.type(input1, 'ord-1'))
  await act(() => userEvent.type(input2, 'word-2'))
  await act(() => userEvent.type(input3, 'word-3'))

  expect(nextBtn).not.toBeDisabled()

  await act(async () => await userEvent.click(nextBtn))

  await waitFor(() => {
    expect(clientMock.createProfile).toHaveBeenCalledTimes(1)
  })

  await waitFor(() => {
    expect(clientMock.createProfile).toHaveBeenCalledWith({
      walletPassword: '',
      aezeedPassphrase: '',
      mnemonicList,
    })
  })
})
