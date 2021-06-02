import * as DocumentsClient from '@mintter/api/documents/v1alpha/documents_grpc_web_pb';
// import * as documents from '@mintter/api/documents/v1alpha/documents_pb';
import * as DaemonClient from '@mintter/api/daemon/v1alpha/daemon_grpc_web_pb';
// import * as daemon from '@mintter/api/daemon/v1alpha/daemon_pb';
import * as AccountsClient from '@mintter/api/accounts/v1alpha/accounts_grpc_web_pb';
// import * as accounts from '@mintter/api/accounts/v1alpha/accounts_pb';
import * as NetworkingClient from '@mintter/api/networking/v1alpha/networking_grpc_web_pb';
// import * as networking from '@mintter/api/networking/v1alpha/networking_pb';

import {
  buildAccount,
  buildDevices,
  buildDocument,
  buildProfile,
  buildPublication,
} from '@utils/generate';
import { makeProto } from '@utils/make-proto';
import { createId } from '@utils/create-id';
import type { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import faker from 'faker';

const MINTTER_API_URL =
  import.meta.env.MINTTER_API_URL || 'http://localhost:55001';

/**
 * Detect which API url to use depending on the environment the app is being served from.
 * For production we bundle our app inside our Go binary, and it's being served on the same port
 * as the API. So for production we detect the URL from the browser and use the same URL to access the API.
 */

export function getApiUrl(): string {
  if (import.meta.env.NODE_ENV === 'production') {
    return window.location.origin;
  }

  // return MINTTER_API_URL;
  return 'http://localhost:55001';
}

// This trick is required because we used to use API clients as globals,
// and Webpack would optimize API URL detection and it would hardcode the variable
// with the default URL without allowing it to change dynamically depending on the environment.
// See this for more details: https://www.notion.so/mintter/Global-state-in-code-is-considered-harmful-f75eda6d3f7842308d7745cdfd6c38b9
//
// TODO: avoid using global state.

let draftsClientInstance: DocumentsClient.DraftsPromiseClient;
let publicationsClientInstance: DocumentsClient.PublicationsPromiseClient;

let daemonClientInstance: DaemonClient.DaemonPromiseClient;
let accountsClientInstance: AccountsClient.AccountsPromiseClient;
let networkingClientInstance: NetworkingClient.NetworkingPromiseClient;

export function draftsClient() {
  if (!draftsClientInstance) {
    draftsClientInstance = new DocumentsClient.DraftsPromiseClient(getApiUrl());
  }

  return draftsClientInstance;
}

export function publicationsClient() {
  if (!publicationsClientInstance) {
    publicationsClientInstance = new DocumentsClient.PublicationsPromiseClient(
      getApiUrl(),
    );
  }

  return publicationsClientInstance;
}

export function daemonClient() {
  if (!daemonClientInstance) {
    daemonClientInstance = new DaemonClient.DaemonPromiseClient(getApiUrl());
  }

  return daemonClientInstance;
}

export function accountsClient() {
  if (!accountsClientInstance) {
    accountsClientInstance = new AccountsClient.AccountsPromiseClient(
      getApiUrl(),
    );
  }

  return accountsClientInstance;
}

export function networkingClient() {
  if (!networkingClientInstance) {
    networkingClientInstance = new NetworkingClient.NetworkingPromiseClient(
      getApiUrl(),
    );
  }

  return networkingClientInstance;
}

// =================

/**
 *
 * Drafts
 *
 */

export function createDraft(): Promise<Document> {
  const draft = new documents.Document();
  draft.id = createId()
  // draft.setId(createId());
  return Promise.resolve(draft);
}

export function deleteDraft(documentId: string): Promise<any> {
  // noop
  return Promise.resolve();
}

export function getDraft(draftId: string): Promise<documents.Document> {
  let document = buildDocument({ id: draftId });
  // document.setId(draftId);

  return Promise.resolve(document);
}

export function updateDraft(
  document: documents.Document,
): Promise<documents.Document> {
  // noop
  console.log('updateDraft done for', document.toObject());
  return Promise.resolve(document);
}

export function listDrafts(
  pageSize?: number,
  pageToken?: string,
  view?: documents.DocumentView,
): Promise<documents.ListDraftsResponse> {
  let result = new documents.ListDraftsResponse();

  return Promise.resolve(result);
}

export function publishDraft(
  documentId: string,
): Promise<documents.PublishDraftResponse> {
  let request = new documents.PublishDraftRequest();
  request.setDocumentId(documentId);
  return draftsClient().publishDraft(request);
}

/**
 *
 * Publications
 *
 */

export function getPublication(
  publicationId: string,
  version?: string,
): Promise<documents.Publication> {
  let pub = new documents.Publication();

  return Promise.resolve(pub);
}

export function getDocument(documentId: string) {
  return buildDocument();
}

export function deletePublication(version: string): Promise<Empty> {
  let request = new documents.DeletePublicationRequest();
  request.setVersion(version);
  return publicationsClient().deletePublication(request);
}

export function listPublications(
  pageSize?: number,
  pageToken?: string,
  view?: documents.DocumentView,
): Promise<documents.ListPublicationsResponse> {
  // let request = new documents.ListPublicationsRequest();
  // if (pageSize) request.setPageSize(pageSize);
  // if (pageToken) request.setPageToken(pageToken);
  // if (view) request.setView(view);
  // return publicationsClient().listPublications(request);
  let res = new documents.ListPublicationsResponse();
  res.setPublicationsList([
    buildPublication(),
    buildPublication(),
    buildPublication(),
  ]);
  return Promise.resolve(res);
}

/**
 *
 * Profile
 *
 */

export async function genSeed(
  aezeedPassphrase?: string,
): Promise<daemon.GenSeedResponse> {
  console.log('real genSeed!');

  let request = new daemon.GenSeedRequest();
  // TODO: add aezeedPassphrase?
  return await daemonClient().genSeed(request);
}

export function register(
  mnemonicList: string[],
  aezeedPassphrase?: string,
  walletPassword?: any,
): Promise<daemon.RegisterResponse> {
  let request = new daemon.RegisterRequest();

  request.setMnemonicList(mnemonicList);
  if (aezeedPassphrase) {
    request.setAezeedPassphrase(aezeedPassphrase);
  }

  return daemonClient().register(request);
}

export async function getAccount(id: string = ''): Promise<accounts.Account> {
  const request = new accounts.GetAccountRequest();
  request.setId(id);
  const result = await accountsClient().getAccount(request);

  return result;
}

export async function getInfo() {
  const request = new daemon.GetInfoRequest();
  return await daemonClient().getInfo(request);
}

// export function getAccount(id: string = ''): Promise<accounts.Account> {
//   const profile = makeProto(new accounts.Profile(), buildProfile());

//   const account = new accounts.Account();
//   account.setId(id);
//   account.setProfile(profile);
//   setDeviceMap(account.getDevicesMap(), buildDevices());

//   return account;
// }

// export function setDeviceMap(
//   map: Map<string, accounts.Device>,
//   devices: accounts.Device.AsObject[],
// ): void {
//   devices.forEach((device) => {
//     const n = new accounts.Device();
//     n.setPeerId(device.peerId);
//     map.set(device.peerId, n);
//   });
// }

export function updateAccount(
  entry: accounts.Profile.AsObject,
): Promise<accounts.Account> {
  const { alias, email, bio } = entry;
  const updateProfile: accounts.Profile = new accounts.Profile();
  updateProfile.setAlias(alias);
  updateProfile.setEmail(email);
  updateProfile.setBio(bio);
  return accountsClient().updateProfile(updateProfile);
}

export function listAccounts(
  pageSize?: number,
  pageToken?: string,
): Promise<accounts.ListAccountsResponse> {
  const request = new accounts.ListAccountsRequest();
  if (pageSize) {
    request.setPageSize(pageSize);
  }
  if (pageToken) {
    request.setPageToken(pageToken);
  }
  return accountsClient().listAccounts(request);
}

export async function listPeerAddrs(
  peerId: string,
): Promise<networking.PeerInfo> {
  if (peerId === undefined) {
    return Promise.reject('listPeerAddrs error: `peerId (string)` is required');
  }
  const request = new networking.GetPeerInfoRequest();
  request.setPeerId(peerId);
  return await networkingClient().getPeerInfo(request);
}

/**
 *
 * @deprecated
 */
export function listSuggestedProfiles(pageSize?: number, pageToken?: string) {
  console.log('listSuggestedProfiles: Implement!');
  return {};
}

/**
 *
 * @deprecated
 */
export function getProfileAddress() {
  console.log('getProfileAddress: Implement!');
  return {};
}

/**
 *
 * @deprecated
 */
export function connectToPeer(addresses: string[]) {
  console.log('connectToPeer: Implement!');
  return {};
}
