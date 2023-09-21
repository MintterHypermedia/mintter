import {GetServerSideProps} from 'next'
import {PubSlugPageProps} from 'publication-slug-page'
import {EveryPageProps} from './_app'
import {getGroupPageProps, getGroupView} from 'server/group'
import {getSiteGroup} from 'server/site-info'
import GroupPage, {GroupPageProps} from './g/[groupEid]'

export default function HomePage(props: GroupPageProps) {
  return <GroupPage {...props} />
}

export const getServerSideProps: GetServerSideProps<
  EveryPageProps & PubSlugPageProps
> = async (context) => {
  const {groupEid, version} = await getSiteGroup()
  if (!groupEid) return {notFound: true}
  const view = getGroupView(context.query.view)
  return await getGroupPageProps({groupEid, version, context, view})
}
