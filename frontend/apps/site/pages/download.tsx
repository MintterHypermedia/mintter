export const config = {
  runtime: 'nodejs',
}

if (typeof globalThis.EdgeRuntime !== 'string') {
  console.log('I"M IN THE EDGE!', globalThis.setImmediate, global.setImmediate)
}
if (!global.setImmediate || !globalThis['setImmediate']) {
  //@ts-ignore
  global.setImmediate = setTimeout
  //@ts-ignore
  globalThis['setImmediate'] = setTimeout
}

import {Container, XStack, H1, Button} from '@mintter/ui'
import Footer from '../footer'
import {GatewayHead} from '../gateway-head'

export default function DownloadPage({
  manifest = null,
}: {
  manifest: {platforms: Array<{url: string; platform: string}>} | null
}) {
  return (
    <>
      <GatewayHead title="Download" />
      <Container>
        <H1>Download Mintter</H1>
        <XStack space my="$7">
          {manifest?.platforms.map((item) => (
            <Button key={item.url} href={item.url} download size="$6">
              {item.platform}
            </Button>
          ))}
        </XStack>
      </Container>
      <Footer />
    </>
  )
}

export async function getStaticProps(context) {
  let req = await fetch(
    `https://mintternightlies.s3.amazonaws.com/manifest.json`,
  )
  let manifest = await req.json()

  let platforms = {
    'darwin-aarch64': 'Apple (M1)',
    'darwin-x86_64': 'Apple (Intel)',
    'linux-x86_64': 'Linux (AppImage)',
    'windows-x86_64': 'Windows',
  }

  return {
    props: {
      manifest: {
        ...manifest,
        platforms: Object.entries(manifest.platforms).map(([key, value]) => ({
          platform: platforms[key],
          url: value.url,
        })),
      },
    },
  }
}
