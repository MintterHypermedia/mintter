// test page for groupsClient.getSiteInfo({ hostname: process.env.GW_NEXT_HOST }) so we can see if this works in production
import {groupsClient} from 'client'
import {NextApiRequest, NextApiResponse} from 'next'

const gatewayHostWithProtocol = process.env.GW_NEXT_HOST
const gatewayHost = new URL(gatewayHostWithProtocol || '').hostname

console.log('ℹ️ site info! ', {
  gatewayHost,
  gatewayHostWithProtocol,
  port: process.env.PORT,
  grpcHost: process.env.NEXT_PUBLIC_GRPC_HOST,
})

export default async function siteTestHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const info = await groupsClient.getSiteInfo({
    hostname: gatewayHost,
  })

  res
    .status(200)
    .setHeader('Content-Type', 'application/json')
    .send(JSON.stringify(info.toJson(), null, 2))
}
