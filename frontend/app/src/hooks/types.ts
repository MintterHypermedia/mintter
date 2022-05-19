import type {GrpcClient} from '@app/client'
import type {UseQueryOptions} from 'react-query'

export interface HookOptions<T>
  extends UseQueryOptions<T, unknown, T, string[]> {
  rpc?: GrpcClient
}
