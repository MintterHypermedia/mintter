import {createPromiseClient, PromiseClient} from '@bufbuild/connect'
import {
  Accounts,
  Changes,
  Comments,
  ContentGraph,
  Daemon,
  Drafts,
  Entities,
  Groups,
  Networking,
  Publications,
  Website,
} from './client'

export type GRPCClient = {
  accounts: PromiseClient<typeof Accounts>
  contentGraph: PromiseClient<typeof ContentGraph>
  comments: PromiseClient<typeof Comments>
  changes: PromiseClient<typeof Changes>
  groups: PromiseClient<typeof Groups>
  entities: PromiseClient<typeof Entities>
  drafts: PromiseClient<typeof Drafts>
  publications: PromiseClient<typeof Publications>
  daemon: PromiseClient<typeof Daemon>
  networking: PromiseClient<typeof Networking>
  website: PromiseClient<typeof Website>
}

export function createGRPCClient(transport: any): GRPCClient {
  return {
    accounts: createPromiseClient(Accounts, transport),
    contentGraph: createPromiseClient(ContentGraph, transport),
    comments: createPromiseClient(Comments, transport),
    changes: createPromiseClient(Changes, transport),
    drafts: createPromiseClient(Drafts, transport),
    publications: createPromiseClient(Publications, transport),
    daemon: createPromiseClient(Daemon, transport),
    networking: createPromiseClient(Networking, transport),
    groups: createPromiseClient(Groups, transport),
    entities: createPromiseClient(Entities, transport),
    website: createPromiseClient(Website, transport),
  } as const
}
