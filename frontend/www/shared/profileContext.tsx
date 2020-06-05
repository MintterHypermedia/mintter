import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
} from 'react'
import {
  UpdateProfileRequest,
  GetProfileRequest,
  InitProfileRequest,
  Profile,
  GetProfileAddrsResponse,
} from '@mintter/proto/mintter_pb'
import * as apiClient from './mintterClient'
import {bootstrapAppData} from './appBootstrap'
import {FullPageSpinner} from 'components/fullPageSpinner'
import {FullPageErrorMessage} from 'components/errorMessage'
import {useQuery, useMutation, queryCache, QueryResult} from 'react-query'

interface ProfileContextValue {
  readonly profile: Profile | null
  setProfile: (data: Partial<Profile.AsObject>) => void
  createProfile: (form: InitProfileRequest.AsObject) => void
  getAuthor: (author: string) => string
  getProfileAddrs: () => QueryResult<GetProfileAddrsResponse>
}

// TODO: (horacio): Fixme types ☝
export const ProfileContext = createContext<ProfileContextValue>(null)

export function ProfileProvider(props) {
  const {status, error, data} = useQuery(
    'Profile',
    async () => {
      const req = new GetProfileRequest()
      try {
        return await (await apiClient.usersClient.getProfile(req)).getProfile()
      } catch (err) {
        console.error('err ==> ', err)
      }
    },
    {
      retry: false,
    },
  )

  function handleOnSuccess(params) {
    console.log('handleOnSuccess -> params', params)
    queryCache.setQueryData('Profile', params)
  }

  const profile = data

  const [createProfile] = useMutation(apiClient.createProfile, {
    onSuccess: handleOnSuccess,
  })

  const [setProfile] = useMutation(
    formData => apiClient.setProfile(profile, formData),
    {
      onSuccess: handleOnSuccess,
    },
  )

  const getAuthor = useCallback(authorId => apiClient.getAuthor(authorId), [])

  function getProfileAddrs() {
    return useQuery(['ProfileAddrs'], apiClient.getProfileAddrs)
  }

  const value = useMemo(
    () => ({
      profile,
      createProfile,
      setProfile,
      getAuthor,
      getProfileAddrs,
    }),
    [profile, createProfile, setProfile, getAuthor, getProfileAddrs],
  )

  if (status === 'loading') {
    return <FullPageSpinner />
  }

  if (status === 'error') {
    return <FullPageErrorMessage error={error} />
  }

  if (status === 'success') {
    return <ProfileContext.Provider value={value} {...props} />
  }

  throw new Error(`Unhandled status: ${status}`)
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error(`useProfile must be used within a ProfileProvider`)
  }

  return context
}
