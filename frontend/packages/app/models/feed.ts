import {Timestamp} from '@bufbuild/protobuf'
import {useInfiniteQuery} from '@tanstack/react-query'
import {unpackHmId} from '../../shared/src'
import {useGRPCClient} from '../app-context'
import {ChangeBlob, GroupSchema, useBlobsData} from './changes'
import {queryKeys} from './query-keys'

export function useFeed(trustedOnly: boolean = false) {
  const grpcClient = useGRPCClient()
  const feedQuery = useInfiniteQuery({
    queryKey: [queryKeys.FEED, trustedOnly],
    queryFn: async (context) => {
      // await delay(2000)
      return await grpcClient.activityFeed.listEvents({
        pageSize: 4,
        pageToken: context.pageParam,
        trustedOnly,
      })
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextPageToken || undefined
    },
  })
  const allEvents = feedQuery.data?.pages.flatMap((page) => page.events) || []
  const groupUpdateCids: string[] = []
  const updateCidTypes = new Map<string, string | undefined>()
  const updateEids = new Map<string, string | undefined>()
  const groupUpdateTimes = new Map<string, Timestamp | undefined>()
  allEvents.forEach((event) => {
    if (
      event.data.case === 'newBlob' &&
      event.data.value.blobType === 'Change'
    ) {
      const {eventTime} = event
      const id = unpackHmId(event.data.value.resource)
      updateCidTypes.set(event.data.value.cid, id?.type)
      updateEids.set(event.data.value.cid, id?.eid)
      if (id?.type === 'g') {
        groupUpdateCids.push(event.data.value.cid)
        groupUpdateTimes.set(event.data.value.cid, eventTime)
      }
    }
  })
  const groupUpdateBlobs = useBlobsData(groupUpdateCids)
  const timeMap = new Map<string, Timestamp>()
  groupUpdateCids.forEach((cid, i) => {
    const blobQuery = groupUpdateBlobs[i]
    const blob = blobQuery.data as ChangeBlob<GroupSchema>
    // see if group update has only one content update
    if (blob?.['@type'] === 'Change' && blob.patch.content) {
      const contentUpdates = Object.entries(blob.patch.content)
      if (contentUpdates.length === 1) {
        const [_key, value] = contentUpdates[0]
        const contentItemId = unpackHmId(value)
        const time = groupUpdateTimes.get(cid)
        if (contentItemId?.type === 'd' && time) {
          timeMap.set(`${contentItemId.eid}-${contentItemId.version}`, time)
        }
      }
    }
  })
  return {
    ...feedQuery,
    data: allEvents.filter((event) => {
      if (event.data.case === 'newBlob') {
        if (event.data.value.blobType === 'KeyDelegation') return false
        if (event.data.value.blobType === 'Change') {
          const type = updateCidTypes.get(event.data.value.cid)
          const eid = updateEids.get(event.data.value.cid)
          if (eid && type === 'd') {
            const groupContentUpdateTime = timeMap.get(
              `${eid}-${event.data.value.cid}`,
            )
            const groupUpdateTimeIsNear =
              !!groupContentUpdateTime &&
              !!event.eventTime &&
              timeStampsWithinSec(
                groupContentUpdateTime,
                event.eventTime,
                60 * 10,
              )
            return !groupUpdateTimeIsNear
          }
        }
        return true
      }
      return true
    }),
  }
}

function timeStampsWithinSec(a: Timestamp, b: Timestamp, sec: number) {
  if (!a) return false
  const aSec = a.seconds
  const bSec = b.seconds
  return Math.abs(Number(aSec - bSec)) < sec
}
