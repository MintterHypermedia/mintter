import Layout from '../../components/welcome-layout'
import Container from '../../components/welcome-container'
import Heading from '../../components/welcome-heading'
import P from '../../components/welcome-p'
import {NextButton, BackButton} from '../../components/welcome-buttons'
import Footer from '../../components/footer'
import Content from '../../components/content'
import Input from '../../components/input'

export default function EditProfile() {
  return (
    <>
      <Container>
        <Heading>Edit your profile</Heading>
        <P className="text-center">
          Link your personal data with your new identity
        </P>
        <Content className="flex-wrap flex w-full flex-col md:flex-row">
          <div className="pr-8 order-12 md:order-none flex mt-6 md:mt-0 flex-col">
            <label
              className="block text-body-muted text-xs font-semibold mb-1"
              htmlFor="avatar"
            >
              Avatar
            </label>
            <div className="avatar-container overflow-hidden relative bg-background-muted rounded-sm">
              <input
                className="absolute bottom-0 left-0 opacity-0 hover:opacity-100 transition-opacity ease-in-out duration-300 m-4"
                type="file"
              />
            </div>
          </div>
          <div className="flex-col flex flex-1">
            <div className="flex-1 relative">
              <label
                className="block text-body-muted text-xs font-semibold mb-1"
                htmlFor="alias"
              >
                Alias
              </label>
              <Input
                name="alias"
                id="alias"
                type="text"
                placeholder="Your readable username"
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
                name="email"
                id="email"
                type="email"
                placeholder="your@email.com"
              />

              <p className="text-danger text-xs absolute left-0 mt-1">
                Please type a valid email.
              </p>
            </div>
            <div className="flex-1 relative mt-10">
              <label
                className="block text-body-muted text-xs font-semibold mb-1"
                htmlFor="twitter"
              >
                Twitter
              </label>
              <Input
                name="twitter"
                id="twitter"
                type="text"
                placeholder="https://twitter.com/your_username"
              />
            </div>
          </div>
        </Content>
      </Container>
      <Footer className="flex-none">
        <Container>
          <div className="flex w-full justify-between flex-row-reverse">
            <NextButton to="/welcome/complete">Next →</NextButton>
            <BackButton to="/welcome">← start over</BackButton>
          </div>
        </Container>
      </Footer>
      <style jsx>{`
        .avatar-container {
          width: 200px;
          height: 200px;
        }
      `}</style>
    </>
  )
}

EditProfile.Layout = Layout
