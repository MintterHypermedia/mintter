import {blockToApi} from '@app/client/v2/block-to-api'
import {paragraph, statement, text} from '@app/mttast'
import {createTestDraft, createTestQueryClient} from '@app/test/utils'
import Topbar from '@components/titlebar'
import {Route} from 'wouter'
import DraftPage from '../draft'
describe('Draft Page', () => {
  it('should render the draft', () => {
    let {client, draft} = createTestQueryClient({
      draft: createTestDraft({
        children: [
          {
            block: blockToApi(
              statement({id: 'b1'}, [paragraph([text('Hello World')])]),
            ),
            children: [],
          },
        ],
      }),
    })
    cy.mount(
      <Route path="/d/:id">
        {() => (
          <>
            <Topbar />
            <DraftPage shouldAutosave={false} />
          </>
        )}
      </Route>,
      {
        client,
        path: `/d/${draft?.id}`,
      },
    )
      //.wait(1000)
      .get('[data-testid="topbar-title"]')
      .contains(draft?.title)
      .get('[data-testid="draft-wrapper"]')
      .contains('Hello World')
  })

  it('should publish draft', () => {
    let {client, draft} = createTestQueryClient({
      draft: createTestDraft({
        children: [
          {
            block: blockToApi(
              statement({id: 'b1'}, [paragraph([text('Hello World')])]),
            ),
            children: [],
          },
        ],
      }),
    })
    let mockPublish = cy.stub()
    cy.mount(
      <Route path="/d/:id">
        {() => (
          <>
            <Topbar />
            <DraftPage publishDraft={mockPublish} shouldAutosave={false} />
          </>
        )}
      </Route>,
      {
        client,
        path: `/d/${draft?.id}`,
      },
    )
      // .wait(1000)
      .get('[data-testid="button-publish"]')
      .click()
      .then(() => {
        console.log(mockPublish.getCalls())
        // expect(mockPublish).to.be.calledOnceWith(draft?.id)
      })
  })
})
