import {
  DeletePublicationRequest,
  ListPublicationsRequest,
  ListPublicationsResponse,
  PublicationsClientImpl,
} from '../.generated/documents/v1alpha/documents'
import type {Publication, DocumentView} from '../.generated/documents/v1alpha/documents'
import {mockPublication} from '../mocks'
import {createGrpcClient, GrpcClient} from './grpc-client'

/**
 *
 * @param revision
 * @param rpc
 * @returns
 */
export function deletePublication(revision: string, rpc?: GrpcClient) {
  rpc ||= createGrpcClient()
  const request = DeletePublicationRequest.fromPartial({
    version: revision,
  })
  return new PublicationsClientImpl(rpc).DeletePublication(request)
}

/**
 *
 * @param pageSize
 * @param pageToken
 * @param view
 * @param rpc
 * @returns
 */
export async function listPublications(pageSize?: number, pageToken?: string, view?: DocumentView, rpc?: GrpcClient) {
  rpc ||= createGrpcClient()
  const request = ListPublicationsRequest.fromPartial({pageSize, pageToken, view})
  const resp = await new PublicationsClientImpl(rpc).ListPublications(request)
  console.log('🚀 ~ line 37 ~ listPublications ~ ', resp)
  return resp
}

/**
 *
 * @param publicationId
 * @param revision
 * @param rpc
 * @returns
 */
export async function getPublication(publicationId: string, revision?: string, rpc?: GrpcClient): Promise<Publication> {
  console.warn('called mocked function "getPublication"')
  return mockPublication()
}
