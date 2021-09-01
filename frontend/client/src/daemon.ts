import {DaemonClientImpl, GetInfoRequest} from '../.generated/daemon/v1alpha/daemon'
import {createGrpcClient} from './grpc-client'
import type {GrpcClient} from './grpc-client'
/**
 *
 * @param rpc
 * @returns
 */
export async function getInfo(rpc?: GrpcClient) {
  rpc ||= createGrpcClient()

  const request = GetInfoRequest.fromPartial({})
  const response = await new DaemonClientImpl(rpc).getInfo(request)
  return response
}
