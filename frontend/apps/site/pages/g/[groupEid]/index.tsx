import {getGroupDocStaticProps, siteGetStaticPaths} from 'server/static-props'
import {GroupPage} from 'src/group-page'

export default GroupPage

export const getStaticPaths = siteGetStaticPaths

export const getStaticProps = getGroupDocStaticProps
