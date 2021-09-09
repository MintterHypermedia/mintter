import {useEffect, useMemo} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import type {Document} from '@mintter/client'
import {createDraft} from '@mintter/client'
import {useAccount, useInfo, usePublication} from '@mintter/client/hooks'
import {Text, Box, Button} from '@mintter/ui'
import {Container} from '../components/container'
import {AppSpinner} from '../components/app-spinner'
import {Separator} from '../components/separator'
import {getDateFormat} from '../utils/get-format-date'
import {useSidepanel, Sidepanel, useEnableSidepanel} from '../components/sidepanel'
import {Editor} from '../editor'

export default function Publication(): JSX.Element {
  const {docId} = useParams<{docId: string}>()
  const history = useHistory()
  const {send: sidepanelSend, isOpen: isSidepanelOpen, annotations} = useSidepanel()
  const {status, data, error} = usePublication(docId)
  const {data: author} = useAccount(data.document.author, {
    enabled: !!data?.document?.author,
  })
  const {data: myInfo} = useInfo()

  useEnableSidepanel()

  useEffect(() => {
    if (Array.from(annotations).length) {
      console.log('ENABLE!!')
      sidepanelSend('SIDEPANEL_OPEN')
    }
  }, [annotations])

  useEffect(() => {
    if (status == 'success') {
      sidepanelSend({type: 'SIDEPANEL_LOAD_ANNOTATIONS', content: data.document.content})
    }
  }, [status])

  async function handleUpdate() {
    try {
      const d = await createDraft(docId)
      if (d?.id) {
        history.push({
          pathname: `/editor/${d.id}`,
        })
      }
    } catch (err) {
      console.warn(`createDraft Error: "createDraft" does not returned a Document`, err)
    }
  }

  if (status == 'loading') {
    return <AppSpinner />
  }

  // start rendering
  if (status == 'error') {
    console.error('usePublication error: ', error)
    return <Text>Publication ERROR</Text>
  }

  let canUpdate = author?.id == myInfo?.accountId

  return (
    <Box
      css={{
        display: 'grid',
        minHeight: '$full',
        gridTemplateAreas: isSidepanelOpen
          ? `"controls controls controls"
        "maincontent maincontent rightside"`
          : `"controls controls controls"
        "maincontent maincontent maincontent"`,
        // gridTemplateAreas: `"controls controls controls"
        // "maincontent maincontent maincontent"`,
        gridTemplateColumns: 'minmax(350px, 15%) 1fr minmax(350px, 40%)',
        gridTemplateRows: '64px 1fr',
      }}
      data-testid="publication-wrapper"
    >
      <Box
        css={{
          display: 'flex',
          gridArea: 'controls',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '$2',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          paddingHorizontal: '$5',
        }}
      >
        {canUpdate && (
          <Button color="success" shape="pill" size="2" onClick={handleUpdate}>
            UPDATE
          </Button>
        )}
        <Button
          size="1"
          color="muted"
          variant="outlined"
          onClick={() => {
            sidepanelSend('SIDEPANEL_TOGGLE')
          }}
        >
          {`${isSidepanelOpen ? 'Close' : 'Open'} sidepanel`}
        </Button>
      </Box>
      <Container css={{gridArea: 'maincontent', marginBottom: 300, padding: '$5', paddingTop: '$7'}}>
        <PublicationHeader document={data?.document} />
        <Separator />
        <Editor onChange={() => {}} readOnly value={data?.document?.content} />
      </Container>
      {isSidepanelOpen && <Sidepanel gridArea={'rightside'} />}
    </Box>
  )
}

function PublicationHeader({document}: {document?: Document}) {
  const {data: author} = useAccount(document?.author, {
    enabled: !!document?.author,
  })

  return document ? (
    <Box
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '$3',
        position: 'relative',
      }}
    >
      {author && (
        <Box css={{display: 'flex', gap: '$4', alignItems: 'center'}}>
          <Box
            css={{
              background: '$background-neutral',
              width: 24,
              height: 24,
              borderRadius: '$round',
            }}
          />
          <Text size="2">{author.profile?.alias}</Text>
        </Box>
      )}
      <Text size="9" css={{fontWeight: '$bold'}}>
        {document.title}
      </Text>
      {document.subtitle && (
        <Text color="muted" size="7">
          {document.subtitle}
        </Text>
      )}
      <Text size="2" color="alt" css={{marginTop: '$5'}}>
        Published on: {getDateFormat(document, 'publishTime')}
      </Text>
    </Box>
  ) : null
}
