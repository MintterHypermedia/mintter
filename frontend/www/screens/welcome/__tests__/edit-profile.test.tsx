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
import EditProfile from '../edit-profile'
import {GenSeedResponse, Profile} from '@mintter/api/v2/mintter_pb'
import * as clientMock from 'shared/V1mintterClient'

jest.mock('shared/V1mintterClient')

const currentUser = {
  toObject: (): Profile.AsObject => ({}),
}

const bio = 'test bio'

beforeEach(() => {
  clientMock.setProfile = jest.fn()
  clientMock.getProfile.mockResolvedValueOnce(currentUser)
})

async function renderWelcomeScreen() {
  const route = `/private/welcome/edit-profile`
  const utils = await render(<EditProfile />, {
    route,
  })
  const nextBtn = screen.getByText(/Next →/i)

  return {
    ...utils,
    nextBtn,
    data: {
      username: 'testusername',
      email: 'email@test.com',
      bio,
    },
  }
}

const onSubmit = jest.fn()

test('Welcome - Edit Profile Screen', async () => {
  const {nextBtn, data} = await renderWelcomeScreen()

  const username = screen.getByLabelText(/username/i)
  const email = screen.getByLabelText(/email/i)
  const bio = screen.getByLabelText(/bio/i)

  await waitFor(() => {
    expect(username).toHaveFocus()
  })

  userEvent.type(email, 'e')
  const emailError = await screen.findByTestId('email-error')

  expect(emailError).toBeInTheDocument()
  expect(nextBtn).toBeDisabled()

  await act(() => userEvent.type(email, data.email.substr(1)))
  await act(() => userEvent.type(username, data.username))
  await act(() => userEvent.type(bio, data.bio))
  expect(nextBtn).not.toBeDisabled()

  await act(async () => await userEvent.click(nextBtn))

  await waitFor(() => {
    expect(clientMock.setProfile).toHaveBeenCalledTimes(1)
  })

  await waitFor(() => {
    expect(clientMock.setProfile).toHaveBeenCalledWith(currentUser, data)
  })
})
