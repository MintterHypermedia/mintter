import {waitFor, render} from '@testing-library/react'
import WelcomeProvider, {reducer} from '../welcomeProvider'

describe('Welcome Provider', () => {
  test('should the reducer not delete current state when changing other branch', async () => {
    const initialState = {mnemonicList: ['a', 'b', 'c']}
    const expected = {mnemonicList: ['a', 'b', 'c'], aezeedPassphrase: 'abc'}
    await waitFor(() =>
      expect(
        reducer(initialState, {type: 'aezeedPassphrase', payload: 'abc'}),
      ).toStrictEqual(expected),
    )
  })

  xtest('should redirect to the library if profile is available', () => {})
})
