// this file exists so you know what may need to be invalidated from the cache when you make changes.

import {abbreviateCid} from '@app/utils/abbreviate'
import {hostnameStripProtocol} from '@app/utils/site-hostname'
import {QueryKey} from '@tanstack/react-query'

export const queryKeys = {
  // Organized by the model file that is responsible for querying + mutating the keys

  // NOTE: Arguments to query keys documented in comments

  // daemon
  GET_DAEMON_INFO: 'GET_DAEMON_INFO',

  // networking
  GET_PEERS: 'GET_PEERS',
  GET_PEER_INFO: 'GET_PEER_INFO', // , deviceId: string

  // accounts
  GET_ALL_ACCOUNTS: 'GET_ALL_ACCOUNTS',
  GET_ACCOUNT: 'GET_ACCOUNT', // , accountId: string

  // sites
  GET_SITES: 'GET_SITES',
  GET_SITE_INFO: 'GET_SITE_INFO', // , hostname: string
  GET_SITE_MEMBERS: 'GET_SITE_MEMBERS', // , hostname: string
  GET_SITE_PUBLICATIONS: 'GET_SITE_PUBLICATIONS', //, hostname: string
  GET_DOC_SITE_PUBLICATIONS: 'GET_DOC_SITE_PUBLICATIONS', // , docId: string

  // documents
  GET_DRAFT_LIST: 'GET_DRAFT_LIST', //
  GET_PUBLICATION_LIST: 'GET_PUBLICATION_LIST', //
  GET_DRAFT: 'GET_DRAFT', // , docId: string
  GET_EDITOR_DRAFT: 'GET_EDITOR_DRAFT', // , docId: string
  GET_PUBLICATION: 'GET_PUBLICATION', //, docId: string, versionId?: string

  // comments
  GET_PUBLICATION_CONVERSATIONS: 'GET_PUBLICATION_CONVERSATIONS', //, docId: string

  // changes
  PUBLICATION_CHANGES: 'PUBLICATION_CHANGES', //, docId: string

  // content-graph
  PUBLICATION_CITATIONS: 'PUBLICATION_CITATIONS', //, docId: string

  // web-links
  GET_URL: 'GET_URL',
} as const

export function labelOfQueryKey(key: QueryKey) {
  const discriminator = key[0]
  const arg1 = key[1] as string | undefined
  switch (discriminator) {
    // daemon
    case queryKeys.GET_DAEMON_INFO:
      return 'Daemon Info'

    // networking
    case queryKeys.GET_PEERS:
      return 'Peers'
    case queryKeys.GET_PEER_INFO:
      return `Peer ${abbreviateCid(arg1)}`

    // accounts
    case queryKeys.GET_ALL_ACCOUNTS:
      return 'All Accounts'
    case queryKeys.GET_ACCOUNT:
      return `Account ${abbreviateCid(arg1)}`

    // sites
    case queryKeys.GET_SITES:
      return 'Sites'
    case queryKeys.GET_SITE_INFO:
      return `Site ${hostnameStripProtocol(arg1)}`
    case queryKeys.GET_SITE_MEMBERS:
      return `Site Members ${hostnameStripProtocol(arg1)}`
    case queryKeys.GET_SITE_PUBLICATIONS:
      return `Site Publications ${hostnameStripProtocol(arg1)}`
    case queryKeys.GET_DOC_SITE_PUBLICATIONS:
      return `Web Publication ${abbreviateCid(arg1)}`

    // documents
    case queryKeys.GET_DRAFT_LIST:
      return 'Drafts'
    case queryKeys.GET_PUBLICATION_LIST:
      return 'Publications'
    case queryKeys.GET_DRAFT:
      return `Draft ${abbreviateCid(arg1)}`
    case queryKeys.GET_EDITOR_DRAFT:
      return `Editor Draft ${abbreviateCid(arg1)}`
    case queryKeys.GET_PUBLICATION:
      return `Publication ${abbreviateCid(arg1)}`

    // comments
    case queryKeys.GET_PUBLICATION_CONVERSATIONS:
      return `Conversations in Doc ${abbreviateCid(arg1)}`

    // changes
    case queryKeys.PUBLICATION_CHANGES:
      return `Changes of Doc ${abbreviateCid(arg1)}`

    // content-graph
    case queryKeys.PUBLICATION_CITATIONS:
      return `Citations of Doc ${abbreviateCid(arg1)}`

    // web-links
    case queryKeys.GET_URL:
      return `URL ${arg1}`

    default:
      return 'unknown'
  }
}
