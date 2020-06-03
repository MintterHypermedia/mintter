import React, {useMemo, useEffect, useState} from 'react'
import AppsOutlinedIcon from '@material-ui/icons/AppsOutlined'
import FormatListBulletedOutlinedIcon from '@material-ui/icons/FormatListBulletedOutlined'
import Link from './link'
import {useRouter} from 'next/router'
import {NavItem} from 'components/nav'
import {getProfile} from 'shared/mintterClient'
import {useMintter} from 'shared/mintterContext'
import {useProfile} from 'shared/profileContext'
import useLocalStorage from 'shared/localstorage'

export default function DocumentList({data, status, error}) {
  const [view, setView] = useLocalStorage<'grid' | 'list'>({
    key: 'MINTTER_GRID_VIEW',
    initialValue: 'list',
  })

  const {getAuthor} = useProfile()

  const isGrid = useMemo(() => view === 'grid', [view])
  const router = useRouter()
  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (status === 'error') {
    return <p>ERROR! == {error}</p>
  }

  return (
    <>
      <div className="flex items-center -mx-4">
        <NavItem
          href="/library/publications"
          active={router.pathname === '/library/publications'}
        >
          Publications
        </NavItem>
        <NavItem
          href="/library/my-publications"
          active={router.pathname === '/library/my-publications'}
        >
          My Publications
        </NavItem>
        <NavItem
          href="/library/drafts"
          active={router.pathname === '/library/drafts'}
        >
          Drafts
        </NavItem>
        <div className="flex-1" />
        <div className="ml-4 mr-6">
          <button
            className={`m-2 p-1 rounded transition duration-100 ${
              isGrid ? 'bg-primary' : 'bg-transparent hover:bg-background-muted'
            }`}
            onClick={() => setView('grid')}
          >
            <AppsOutlinedIcon
              className={isGrid ? 'text-white' : 'text-body-muted'}
            />
          </button>
          <button
            className={`m-2 p-1 rounded transition duration-100 ${
              isGrid ? 'bg-transparent hover:bg-background-muted' : 'bg-primary'
            }`}
            onClick={() => setView('list')}
          >
            <FormatListBulletedOutlinedIcon
              className={isGrid ? 'text-body-muted' : 'text-white'}
            />
          </button>
        </div>
      </div>
      <div
        className={
          isGrid ? 'grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : ''
        }
      >
        {data.map(item => (
          <ListItem key={item.documentId} item={item} />
        ))}
      </div>
    </>
  )
}

function ListItem({item}) {
  const router = useRouter()
  const [prefetched, setPrefetch] = React.useState<boolean>(false)
  const {title, description, author: itemAuthor} = item
  const theTitle = title ? title : 'Untitled Document'
  const theDescription = description
    ? description
    : 'Document with no description'

  const {getAuthor} = useProfile()

  const author = getAuthor(itemAuthor)
  console.log('ListItem -> author', author)

  const isDraft = useMemo(() => router.pathname === '/library/drafts', [
    router.pathname,
  ])

  const href = useMemo(
    () => (isDraft ? `/editor/${item.documentId}` : `/p/${item.id}`),
    [router.pathname],
  )
  function handlePrefetch() {
    if (!prefetched) {
      // TODO: prefetch on hover
      // console.log(`prefetch draft with id ${draft.documentId}`)
      setPrefetch(true)
    }
  }

  return (
    <Link href={href} className="block w-full -m-2 mt-4">
      <div
        className="bg-background-muted p-6 rounded-lg transition duration-200 hover:shadow-lg"
        onMouseEnter={handlePrefetch}
      >
        <h3 className="text-heading text-2xl font-bold truncate">{theTitle}</h3>
        <p className="text-body mt-4 truncate">{theDescription}</p>
        {!isDraft && (
          <p className="text-sm mt-4 text-heading truncate overflow-hidden inline-block">
            <span>by </span>
            <span className="text-primary hover:text-primary-hover hover:underline hover:cursor-not-allowed truncate">
              {author}
            </span>
          </p>
        )}
      </div>
    </Link>
  )
}
