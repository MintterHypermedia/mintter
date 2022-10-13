import {
  Account,
  ConnectionStatus,
  ListAccountsResponse,
  PeerInfo,
} from '@app/client'
import {queryKeys} from '@app/hooks'
import {createTestQueryClient} from '@app/test/utils'
import {
  ContactsPrompt,
  ContactsSection,
} from '@components/library/section-contacts'

describe('Contacts Section', () => {
  it('should render an empty list', () => {
    let {client} = createTestQueryClient()

    client.setQueryData<ListAccountsResponse>([queryKeys.GET_CONTACTS_LIST], {
      accounts: [],
      nextPageToken: '',
    })
    cy.mount(<ContactsSection />, {
      client,
    })
      .get('[data-testid="section-title"]')
      .contains('Contacts (0/0)')
  })

  it('should render the list with two accounts', () => {
    let {client, authors} = createTestQueryClient({
      authors: [
        {
          id: 'foo',
          profile: {
            alias: 'foo',
            bio: '',
          },
        },
        {
          id: 'bar',
          profile: {
            alias: 'bar',
            bio: '',
          },
        },
      ],
    })

    client.setQueryData<ListAccountsResponse>([queryKeys.GET_CONTACTS_LIST], {
      accounts: (authors as Array<Account>) || [],
      nextPageToken: '',
    })

    authors?.forEach((author) => {
      if (author.devices) {
        Object.entries(author.devices).forEach(([key, value]) => {
          client.setQueryData<PeerInfo>(
            [queryKeys.GET_PEER_INFO, value.peerId],
            {
              addrs: ['foo'],
              connectionStatus: ConnectionStatus.CONNECTED,
              accountId: author.id,
            },
          )
        })
      }
    })

    cy.mount(<ContactsSection />, {
      client,
    })
      .get('[data-testid="section-title"]')
      .contains('Contacts (2/2)')
      .get('[data-testid="section-list"]')
      .children()
      .should('have.length', 2)
      .get('[data-testid="contact-item-foo"]')
      .contains('(foo) foo')
      .get('[data-testid="contact-item-bar"]')
      .contains('(bar) bar')
  })

  describe('ContactsPrompt', () => {
    it('should open connect modal', () => {
      let {client} = createTestQueryClient()

      client.setQueryData<ListAccountsResponse>([queryKeys.GET_CONTACTS_LIST], {
        accounts: [],
        nextPageToken: '',
      })

      var refetch = cy.stub()
      var connect = cy.stub().resolves()
      var address = ['foo', 'bar']
      cy.mount(<ContactsPrompt refetch={refetch} connect={connect} />, {
        client,
      })
        .get('[data-testid="add-contact-button"]')
        .click()
        .get('[data-testid="add-contact-submit"]')
        .should('be.disabled')
        .get('[data-testid="add-contact-input"]')
        .should('have.focus')
        .type(address.join(','))
        .get('[data-testid="add-contact-submit"]')
        .should('not.be.disabled')
        .click()
        .then(() => {
          expect(refetch).to.be.calledOnce
          expect(connect).to.be.calledOnceWith(address)
        })
        .get('[data-testid="add-contact-submit"]')
        .should('not.exist')
    })
  })

  it.skip('should render the hover card', () => {
    let {client, authors} = createTestQueryClient({
      authors: [
        {
          id: 'foo',
          profile: {
            alias: 'foo',
            bio: '',
          },
        },
      ],
    })

    client.setQueryData<ListAccountsResponse>([queryKeys.GET_CONTACTS_LIST], {
      accounts: (authors as Array<Account>) || [],
      nextPageToken: '',
    })
    cy.mount(<ContactsSection />, {
      client,
    })
      .get('[data-testid="contact-item-foo"]')
      .trigger('mouseenter')
  })
})
