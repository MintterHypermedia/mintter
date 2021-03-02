import React from 'react'
import {Container} from 'components/container'
import {Heading} from 'components/heading'
import P from 'components/welcome-p'
import {NextButton, BackButton} from 'components/button'
import Footer from 'components/footer'
import Content from 'components/content'
import Input from 'components/input'
import Textarea from 'components/textarea'
import {useForm} from 'react-hook-form'
import {css} from 'emotion'
import {useRouter} from 'shared/use-router'
import {getPath} from 'components/routes'
import {useMutation} from 'react-query'
import * as apiClient from 'shared/mintter-client'

export default function EditProfile() {
  const {register, handleSubmit, errors, formState} = useForm({
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      bio: '',
      accountId: '',
    },
  })

  const {history, match} = useRouter()

  const [setProfile] = useMutation(apiClient.setProfile)

  async function onSubmit(data) {
    try {
      await setProfile(data)
      history.replace(`${getPath(match)}/welcome/complete`)
    } catch (err) {
      console.error('Error ==> ', err)
    }
  }

  return (
    <form className="lg:flex-1 flex flex-col">
      <Container className="mx-auto">
        <Heading>Edit your profile</Heading>
        <P className="text-center">
          Link your personal data with your new account
        </P>
        <Content className="flex-wrap flex w-full flex-col md:flex-row">
          <div className="flex-col flex flex-1">
            <div className="flex-1 relative">
              <label
                className="block text-body-muted text-xs font-semibold mb-1"
                htmlFor="username"
              >
                Username
              </label>
              <Input
                id="username"
                name="username"
                ref={register}
                type="text"
                placeholder="Readable username or alias. Doesn't have to be unique."
              />
            </div>
            <div className="flex-1 relative mt-10">
              <label
                className="block text-body-muted text-xs font-semibold mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                ref={register({
                  pattern: {
                    // eslint-disable-next-line no-control-regex
                    value: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                    message: 'Please type a valid email.',
                  },
                })}
                error={!!errors.email}
                type="email"
                placeholder="Real email that could be publically shared"
              />

              {errors.email && (
                <p
                  role="alert"
                  data-testid="email-error"
                  className="text-danger text-xs absolute left-0 mt-1"
                >
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="flex-1 relative mt-10">
              <label
                className="block text-body-muted text-xs font-semibold mb-1"
                htmlFor="bio"
              >
                Bio
              </label>
              <Textarea
                id="bio"
                name="bio"
                ref={register}
                rows={4}
                placeholder="A little bit about yourself..."
                className={`block w-full border bg-background-muted border-muted rounded px-3 py-2 focus:outline-none focus:border-muted-hover transition duration-200 text-body-muted focus:text-body text-base ${
                  errors.bio && 'border-danger'
                } ${css`
                  min-height: 100px;
                `}`}
              />
            </div>
          </div>
        </Content>
      </Container>
      <Footer className="flex-none">
        <Container className="mx-auto">
          <div className="flex w-full justify-between flex-row-reverse">
            <NextButton
              onClick={handleSubmit(onSubmit)}
              disabled={!formState.isValid || formState.isSubmitting}
              data-testid="next-btn"
            >
              Next →
            </NextButton>
            <BackButton to={`${getPath(match)}/welcome`}>
              ← start over
            </BackButton>
          </div>
        </Container>
      </Footer>
      <style jsx>{`
        .avatar-container {
          width: 200px;
          height: 200px;
        }
      `}</style>
    </form>
  )
}
