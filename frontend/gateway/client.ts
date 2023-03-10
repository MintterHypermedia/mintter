import {
  createGrpcWebTransport,
  createPromiseClient,
  Interceptor,
} from '@bufbuild/connect-web'
import {
  Accounts,
  Publications,
  WebSite,
  Daemon,
  Networking,
} from '@mintter/shared'

const loggingInterceptor: Interceptor = (next) => async (req) => {
  try {
    const result = await next(req)
    // @ts-ignore
    console.log(`🔃 to ${req.method.name} `, req.message, result.message)
    return result
  } catch (e) {
    console.error(`🚨 to ${req.method.name} `, e)
    throw e
  }
}

function getGRPCHost() {
  if (process.env.GW_GRPC_ENDPOINT) {
    return process.env.GW_GRPC_ENDPOINT
  }

  if (process.env.NODE_ENV == 'development') {
    return 'http://127.0.0.1:56001'
  }

  return 'https://gateway.mintter.com'
}

const IS_DEV = process.env.NODE_ENV == 'development'
const IS_CLIENT = !!global.window
const DEV_INTERCEPTORS = IS_CLIENT ? [loggingInterceptor] : []

let grpcBaseURL = getGRPCHost()

console.log('🚀 client.ts ', {
  grpcBaseURL,
  // GW_GRPC_ENDPOINT: process.env.GW_GRPC_ENDPOINT,
  // VERCEL_ENV: process.env.VERCEL_ENV,
  // NODE_ENV: process.env.NODE_ENV,
  IS_DEV,
  IS_CLIENT,
})

const prodInter: Interceptor = (next) => async (req) => {
  const result = await next({...req, init: {...req.init, redirect: 'follow'}})
  return result
}

export const transport = createGrpcWebTransport({
  baseUrl: grpcBaseURL,
  // @ts-ignore
  interceptors: IS_DEV ? DEV_INTERCEPTORS : [prodInter],
})

export const publicationsClient = createPromiseClient(Publications, transport)
export const localWebsiteClient = createPromiseClient(WebSite, transport)
export const accountsClient = createPromiseClient(Accounts, transport)
export const daemonClient = createPromiseClient(Daemon, transport)
export const networkingClient = createPromiseClient(Networking, transport)
