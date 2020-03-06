import {useState} from 'react'
import Layout from '../../components/welcome-layout'
import Container from '../../components/welcome-container'
import Heading from '../../components/welcome-heading'
import {NextButton, BackButton} from '../../components/welcome-buttons'
import Footer from '../../components/footer'
import Content from '../../components/content'
import P from '../../components/welcome-p'
import {css} from 'emotion'

const words = [
  ['able', 'glove', 'pattern', 'solar', 'magic', 'knock'],
  ['game', 'orange', 'problem', 'guide', 'verb', 'bird'],
  ['shrug', 'write', 'enjoy', 'cool', 'kitten', 'rebuild'],
  ['excuse', 'shine', 'code', 'zero', 'mean', 'anual'],
]

export default function SecurityPack() {
  const [disabled, setDisabled] = useState(false)
  return (
    <Layout>
      <Container>
        <Heading>Security Pack</Heading>
        <P className="text-center">
          Please save these 24 words securely! This will allow you to recreate
          your identity ID
        </P>
        <Content className="flex-wrap flex w-full">
          {words.map((list, list_idx) => (
            <div key={list_idx} className="flex-1 flex items-center flex-col">
              <ol>
                {list.map((word, word_idx) => (
                  <li key={word_idx} className="my-3 flex items-baseline">
                    <span
                      className={`text-bold text-gray-500 text-xs ${css`
                        width: 24px;
                        display: inline-block;
                      `}`}
                    >
                      {list_idx * 6 + word_idx + 1}.
                    </span>
                    {word}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </Content>
      </Container>
      <Footer className="flex-none">
        <Container>
          <div className="flex w-full justify-between">
            <BackButton
              to="/welcome"
              onClick={() => console.log('starting over!')}
            >
              ← start over
            </BackButton>
            <NextButton to="/welcome/retype-seed" disabled={disabled}>
              Next →
            </NextButton>
          </div>
        </Container>
      </Footer>
    </Layout>
  )
}
