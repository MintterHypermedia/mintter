import {createGrpcWebTransport, Interceptor} from '@bufbuild/connect-web'

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

let host =
  process.env.GW_GRPC_ENDPOINT || process.env.VERCEL_ENV == 'development'
    ? 'http://localhost:56001'
    : 'https://gateway.mintter.com'

function getHost() {
  if (process.env.GW_GRPC_ENDPOINT) {
    return process.env.GW_GRPC_ENDPOINT
  } else if (process.env.VERCEL_ENV == 'development') {
    return 'http://localhost:56001'
  }
  return 'https://gateway.mintter.com'
}

const prodInter: Interceptor = (next) => async (req) => {
  // @ts-ignore
  const result = await next({...req, redirect: 'manual'})
  console.log('result of grpc:', req, result)
  return result
}

export const transport = createGrpcWebTransport({
  // baseUrl: host,
  baseUrl: 'https://gateway.mintter.com',
  // @ts-ignore
  interceptors: import.meta.env?.DEV ? [loggingInterceptor] : [prodInter],
})
