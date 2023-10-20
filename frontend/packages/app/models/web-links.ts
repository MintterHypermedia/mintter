import {AppQueryClient} from '@mintter/app/query-client'
import {useQuery} from '@tanstack/react-query'
import {queryKeys} from './query-keys'
import {extractBlockRefOfUrl} from '@mintter/shared'
import {useEffect, useRef, useState} from 'react'

function parseHTML(html: string): Document {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  return doc
}
function extractMetaTagValue(doc: Document, name: string): string | null {
  const metaTag = doc.querySelector(`meta[name="${name}"]`)
  return metaTag ? metaTag.getAttribute('content') : null
}

type WebLinkMeta = {
  hmId: string | null
  hmVersion: string | null
  hmTitle: string | null
  blockRef: string | null
}

export function useWaitForPublication(url: string, secondsUntilTimeout = 120) {
  const [resultMeta, setResultMeta] = useState<null | WebLinkMeta>(null)
  const [timedOut, setTimedOut] = useState(false)
  const isTimedOutRef = useRef(false)
  useEffect(() => {
    isTimedOutRef.current = false
    async function doQuery() {
      if (isTimedOutRef.current) return
      const meta = await fetchWebLinkMeta(url)
      if (meta?.hmId) {
        setResultMeta(meta)
      } else {
        if (isTimedOutRef.current) setTimedOut(true)
        else doQuery()
      }
    }
    doQuery()
    const timeoutId = setTimeout(() => {
      isTimedOutRef.current = true
    }, secondsUntilTimeout * 1000)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [url, secondsUntilTimeout])
  return {resultMeta, timedOut}
}

export async function fetchWebLinkMeta(
  url: string,
): Promise<WebLinkMeta | null> {
  if (!url) return null
  try {
    if (!url.startsWith('http')) return null
    const webResponse = await fetch(url, {
      method: 'GET',
    })
    const htmlData = await webResponse.text()
    const doc = parseHTML(htmlData)
    const hmId = extractMetaTagValue(doc, 'hypermedia-entity-id')
    const hmVersion = extractMetaTagValue(doc, 'hypermedia-entity-version')
    const hmTitle = extractMetaTagValue(doc, 'hypermedia-entity-title')
    return {
      hmId,
      hmVersion,
      hmTitle,
      blockRef: extractBlockRefOfUrl(url),
    }
  } catch (e) {
    return null
  }
}

function queryWebLink(url: string, enabled: boolean) {
  return {
    queryKey: [queryKeys.GET_URL, url],
    enabled,
    queryFn: async () => {
      return await fetchWebLinkMeta(url)
    },
  }
}

export function useWebLink(url: string, enabled: boolean) {
  return useQuery(queryWebLink(url, enabled))
}
export function fetchWebLink(appClient: AppQueryClient, url: string) {
  return appClient.client.fetchQuery(queryWebLink(url, true))
}
