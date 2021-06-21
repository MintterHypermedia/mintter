import {grpc} from '@improbable-eng/grpc-web'
import {BrowserHeaders} from 'browser-headers'

export interface GrpcClient {
  unary<T extends grpc.UnaryMethodDefinition<any, any>>(
    methodDesc: T,
    _request: any,
    _metadata?: grpc.Metadata,
  ): Promise<unknown>
}

interface createGrpcClientOptions {
  host: string
  transport?: grpc.TransportFactory
  metadata?: grpc.Metadata
  debug?: boolean
}

export function createGrpcClient(options: createGrpcClientOptions): GrpcClient {
  return {
    unary(methodDesc, _request, _metadata) {
      const request = {..._request, ...methodDesc.requestType}
      const metadata = new BrowserHeaders({
        ...(options.metadata?.headersMap || {}),
        ...(_metadata?.headersMap || {}),
      })

      return new Promise((resolve, reject) => {
        grpc.unary(methodDesc, {
          request,
          host: options.host,
          metadata,
          transport: options.transport,
          debug: options.debug,
          onEnd(response) {
            if (response.status === grpc.Code.OK) {
              resolve(response.message)
            } else {
              const err = new Error(response.statusMessage) as any
              err.code = response.status
              err.metadata = response.trailers
              reject(err)
            }
          },
        })
      })
    },
  }
}
