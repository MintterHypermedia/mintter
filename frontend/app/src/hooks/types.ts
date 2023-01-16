import type {GrpcClient} from '@mintter/client'
import type {UseQueryOptions} from '@tanstack/react-query'

export interface HookOptions<T>
  extends UseQueryOptions<T, unknown, T, string[]> {
  rpc?: GrpcClient
}
