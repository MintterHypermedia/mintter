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
} from '@mintter/proto/mintter_pb'
import * as apiClient from './mintterClient'
import {useMintter} from './mintterContext'
import {useAsync} from './useAsync'
import {bootstrapAppData} from './appBootstrap'
import {FullPageSpinner} from 'components/fullPageSpinner'
import {FullPageErrorMessage} from 'components/errorMessage'

interface ProfileContextValue {
  readonly profile: Profile | null
  setProfile?: (data: Partial<Profile.AsObject>) => void
  initProfile?: (data: InitProfileRequest.AsObject) => void
  hasProfile?: () => Promise<boolean>
  getProfile?: () => Promise<Profile>
}

// TODO: (horacio): Fixme types ☝
export const ProfileContext = createContext(null)

// TODO: (horacio)
interface ProfileProviderProps {
  children: React.ReactNode
  value?: ProfileContextValue
  rpc?: apiClient.MintterPromiseClient
}

export default function ProfileProvider(props: ProfileProviderProps) {
  const {
    data,
    status,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync()

  useLayoutEffect(() => {
    run(bootstrapAppData())
  }, [run])

  const createProfile = useCallback(
    form => apiClient.createProfile(form).then(profile => setData(profile)),
    [setData],
  )

  const setProfile = useCallback(
    form => apiClient.setProfile(form).then(profile => setData({profile})),
    [setData],
  )

  const profile = data?.profile

  const value = useMemo(
    () => ({
      profile,
      setProfile,
      createProfile,
    }),
    [profile, setProfile, createProfile],
  )

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorMessage error={error} />
  }

  if (isSuccess) {
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
