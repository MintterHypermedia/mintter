import {screen, waitFor, userEvent, render} from 'test/app-test-utils'
import EditProfile from '../edit-profile'
import * as clientMock from 'shared/mintter-client'
import {BrowserRouter as Router} from 'react-router-dom'
import {ProfileProvider} from 'shared/profile-context'
import {buildEditProfile} from 'test/generate'
import {Profile} from '@mintter/api/v2/mintter_pb'

jest.mock('shared/mintter-client')

const currentUser = {
  toObject: () => ({}),
}

beforeEach(() => {
  clientMock.setProfile = jest.fn()
  clientMock.getProfile.mockResolvedValueOnce(currentUser)
})

async function renderWelcomeScreen({
  profile,
}: {profile: Pick<Profile.AsObject, 'bio' | 'email' | 'username'>} = {}) {
  if (profile === undefined) {
    profile = buildEditProfile()
  }

  const utils = await render(<EditProfile />, {
    wrapper: ({children}) => (
      <Router>
        <ProfileProvider>{children}</ProfileProvider>
      </Router>
    ),
    wait: false,
  })

  return {
    ...utils,
    profile,
  }
}

test.only('Welcome - Edit Profile Screen', async () => {
  // const {nextBtn, data} = await renderWelcomeScreen()
  const {profile} = await renderWelcomeScreen()
  // const bio = screen.getByLabelText(/bio/i)

  expect(screen.getByText(/Edit your profile/i)).toBeInTheDocument()

  userEvent.type(screen.getByLabelText(/email/i), profile.email[0])
  await waitFor(async () =>
    expect(await screen.getByTestId('email-error')).toBeInTheDocument(),
  )
  expect(
    screen.getByRole('button', {name: /next/i, exact: false}),
  ).toBeDisabled()

  userEvent.type(screen.getByLabelText(/email/i), profile.email.substr(1))
  userEvent.type(screen.getByLabelText(/username/i), profile.username)
  userEvent.type(screen.getByLabelText(/bio/i), profile.bio)
  await waitFor(() => {
    expect(
      screen.getByRole('button', {name: /next/i, exact: false}),
    ).not.toBeDisabled()
  })

  userEvent.click(screen.getByRole('button', {name: /next/i, exact: false}))
  await waitFor(() => {
    expect(clientMock.setProfile).toHaveBeenCalledTimes(1)
  })

  expect(clientMock.setProfile).toHaveBeenCalledWith(profile)
})
