import {
  createDraft,
  getInfo,
  getPublication,
  Link,
  LinkNode,
  listCitations,
  Publication as PublicationType,
} from '@mintter/client'
import {FlowContent, MttastContent} from '@mintter/mttast'
import {document, group} from '@mintter/mttast-builder'
import {Box} from '@mintter/ui/box'
import {Button} from '@mintter/ui/button'
import {Icon} from '@mintter/ui/icon'
import {Text} from '@mintter/ui/text'
import {TextField} from '@mintter/ui/text-field'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import {useActor, useInterpret, useMachine} from '@xstate/react'
import {useBookmarksService} from 'frontend/app/src/components/bookmarks'
import {MINTTER_LINK_PREFIX} from 'frontend/app/src/constants'
import {ContextMenu} from 'frontend/app/src/editor/context-menu'
import {copyTextToClipboard} from 'frontend/app/src/editor/statement'
import {useEffect} from 'react'
import toast from 'react-hot-toast'
import QRCode from 'react-qr-code'
import {visit} from 'unist-util-visit'
import {useLocation} from 'wouter'
import {StateFrom} from 'xstate'
import {createModel} from 'xstate/lib/model'
import {useEnableSidepanel, useSidepanel} from '../components/sidepanel'
import {Editor} from '../editor'
import {EditorMode} from '../editor/plugin-utils'
import {useAccount} from '../hooks'
import {tippingMachine, tippingModel} from '../tipping-machine'
import {getDateFormat} from '../utils/get-format-date'
import {PageProps} from './types'

export default function Publication({params}: PageProps) {
  const [, setLocation] = useLocation()
  const sidepanelService = useSidepanel()
  // const {status, data, error} = usePublication(params!.docId)
  const [state, send] = usePagePublication(params?.docId)
  const {data: author} = useAccount(state.context.publication?.document?.author, {
    enabled: !!state.context.publication?.document?.author,
  })

  console.log('PUBLICATION STATE', state)

  useEnableSidepanel()

  useEffect(() => {
    if (params?.docId) {
      send(publicationModel.events.FETCH_DATA(params?.docId))
    }
  }, [params?.docId])

  // useEffect(() => {
  //   if (data.document.title) {
  //     getCurrentWindow().setTitle(data.document.title)
  //   }
  // }, [data.document.title])

  useEffect(() => {
    if (state.matches('ready')) {
      sidepanelService.send({type: 'SIDEPANEL_LOAD_ANNOTATIONS', document: state.context.publication?.document})
    }
  }, [state.value])

  async function handleUpdate() {
    try {
      const d = await createDraft(params?.docId)
      if (d?.id) {
        setLocation(`/editor/${d.id}`)
      }
    } catch (err) {
      console.warn(`createDraft Error: "createDraft" does not returned a Document`, err)
    }
  }

  if (state.matches('fetching')) {
    return <Text>loading...</Text>
  }

  // start rendering
  if (state.matches('errored')) {
    return (
      <Box
        css={{
          padding: '$5',
        }}
      >
        <Text>Publication ERROR</Text>
        <Text>{state.context.errorMessage}</Text>
        <Button onClick={() => send(publicationModel.events.FETCH_DATA(state.context.id))} color="muted">
          try again
        </Button>
      </Box>
    )
  }

  return (
    <>
      <Box
        css={{
          background: '$background-alt',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: '$3',
          padding: '$5',
          '@bp2': {
            paddingLeft: 80,
          },
          $$gap: '16px',
          display: 'flex',
          gap: '$$gap',
          alignItems: 'center',
          '& *': {
            position: 'relative',
          },
          '& *:not(:first-child):before': {
            content: `"|"`,
            color: '$text-muted',
            opacity: 0.5,
            position: 'absolute',
            left: '-10px',
            top: '50%',
            transform: 'translateY(-50%)',
          },
        }}
      >
        {author && (
          <>
            <Text size="1" color="muted" css={{paddingRight: '$3'}}>
              <span>Signed by </span>
              <span style={{textDecoration: 'underline'}}>
                {state.context.canUpdate ? 'you' : author.profile?.alias}
              </span>
            </Text>
          </>
        )}
        {state.context.canUpdate && (
          <Button size="1" variant="ghost" onClick={handleUpdate} disabled={state.hasTag('pending')}>
            Update
          </Button>
        )}
        <Button
          size="1"
          variant={state.matches('discussion') ? 'solid' : 'ghost'}
          onClick={() => send(publicationModel.events['TOGGLE.DISCUSSION']())}
          disabled={state.hasTag('pending')}
        >
          Toggle Discussion
        </Button>
        <TippingModal
          publicationId={params?.docId}
          accountId={state.context.publication?.document.author}
          visible={!state.context.canUpdate}
        />
      </Box>
      {state.matches('ready') && (
        <Box
          data-testid="publication-wrapper"
          css={{
            padding: '$5',
            paddingTop: '$8',
            marginHorizontal: '$4',
            paddingBottom: 300,
            height: '100%',
            '@bp2': {
              marginHorizontal: '$9',
            },
          }}
        >
          {/* <PublicationHeader document={state.context.publication?.document} /> */}

          <Box css={{width: '$full', maxWidth: '64ch'}}>
            <Editor
              mode={EditorMode.Publication}
              value={state.context.publication?.document.content as Array<MttastContent>}
            />
          </Box>
        </Box>
      )}
      {state.matches('discussion') && (
        <Box
          data-testid="publication-wrapper"
          css={{
            padding: '$5',
            paddingTop: '$8',
            marginHorizontal: '$4',
            paddingBottom: 300,
            height: '100%',
            '@bp2': {
              marginHorizontal: '$9',
            },
          }}
        >
          <Box css={{width: '$full', maxWidth: '64ch'}}>
            {state.matches('discussion.ready') && state.context.links?.length != 0 ? (
              // <Editor mode={EditorMode.Discussion} value={state.context.discussion.children as Array<MttastContent>} />
              <Discussion links={state.context.links} />
            ) : (
              <>
                <Text>There's no Discussion yet.</Text>
                <Button size="1">Start one</Button>
              </>
            )}
          </Box>
        </Box>
      )}
      <Box
        css={{
          background: '$background-alt',
          width: '$full',
          position: 'absolute',
          bottom: 0,
          zIndex: '$3',
          padding: '$5',

          '@bp2': {
            paddingLeft: 80,
          },
          '&:after': {
            content: '',
            position: 'absolute',
            width: '$full',
            height: 20,
            background: 'linear-gradient(0deg, $colors$background-alt 0%, rgba(255,255,255,0) 100%)',
            top: -20,
            left: 0,
          },
          $$gap: '24px',
          display: 'flex',
          gap: '$$gap',
          alignItems: 'center',
          '& > span': {
            position: 'relative',
          },
          '& *:not(:first-child):before': {
            content: `"|"`,
            color: '$text-muted',
            position: 'absolute',
            left: -14,
            top: 0,
          },
        }}
      >
        <Text size="1" color="muted">
          Created on: {getDateFormat(state.context.publication?.document, 'createTime')}
        </Text>
        <Text size="1" color="muted">
          Last modified: {getDateFormat(state.context.publication?.document, 'updateTime')}
        </Text>
      </Box>
    </>
  )
}

function usePagePublication(docId?: string) {
  // const client = useQueryClient()
  const service = useInterpret(publicationMachine)
  const [state, send] = useActor(service)

  useEffect(() => {
    if (docId) {
      send(publicationModel.events.FETCH_DATA(docId))
    }
  }, [send, docId])

  return [state, send] as const
}

export type ClientPublication = Omit<PublicationType, 'document'> & {document: EditorDocument}

const publicationModel = createModel(
  {
    id: '',
    publication: null as ClientPublication | null,
    errorMessage: '',
    canUpdate: false,
    links: undefined as Array<Link> | undefined,
    discussion: null as any,
  },
  {
    events: {
      'REPORT.DATA.SUCCESS': (props: {publication: ClientPublication; canUpdate: boolean}) => props,
      'REPORT.DATA.ERROR': (errorMessage: string) => ({errorMessage}),
      FETCH_DATA: (id: string) => ({id}),
      'TOGGLE.DISCUSSION': () => ({}),
      'REPORT.DISCUSSION.SUCCESS': (links: Array<Link>, discussion: any) => ({links, discussion}),
      'REPORT.DISCUSSION.ERROR': (errorMessage: string) => ({errorMessage}),
    },
  },
)

const publicationMachine = publicationModel.createMachine({
  id: 'publication-machine',
  context: publicationModel.initialContext,
  initial: 'idle',
  states: {
    idle: {
      on: {
        FETCH_DATA: {
          target: 'fetching',
          actions: [
            publicationModel.assign({
              ...publicationModel.initialContext,
              id: (_, event) => event.id,
            }),
          ],
        },
      },
    },
    fetching: {
      tags: ['pending'],
      invoke: {
        src: (ctx) => (sendBack) => {
          Promise.all([getPublication(ctx.id), getInfo()])
            .then(([publication, info]) => {
              if (publication.document?.content) {
                let content = JSON.parse(publication.document?.content)
                sendBack(
                  publicationModel.events['REPORT.DATA.SUCCESS']({
                    publication: Object.assign(publication, {document: {...publication.document, content}}),
                    canUpdate: info.accountId == publication.document.author,
                  }),
                )
              } else {
                if (publication.document?.content === '') {
                  sendBack(publicationModel.events['REPORT.DATA.ERROR']('Content is Empty'))
                } else {
                  sendBack(publicationModel.events['REPORT.DATA.ERROR']('error parsing content'))
                }
              }
            })
            .catch((err) => {
              console.log('=== CATCH ERROR: publication fetch error', err)
              sendBack(publicationModel.events['REPORT.DATA.ERROR']('error fetching'))
            })
        },
      },
      on: {
        'REPORT.DATA.SUCCESS': {
          target: 'ready',
          actions: publicationModel.assign((_, ev) => ({
            publication: ev.publication,
            canUpdate: ev.canUpdate,
            errorMessage: '',
          })),
        },
        'REPORT.DATA.ERROR': {
          target: 'errored',
          actions: publicationModel.assign({
            errorMessage: (_, ev) => ev.errorMessage,
          }),
        },
      },
    },
    ready: {
      on: {
        FETCH_DATA: {
          target: 'fetching',
          actions: [
            publicationModel.assign({
              id: (_, event) => event.id,
              errorMessage: '',
            }),
          ],
        },
        'TOGGLE.DISCUSSION': {
          target: 'discussion',
        },
      },
    },
    discussion: {
      initial: 'idle',
      onDone: [
        {
          target: 'errored',
          cond: (context) => !!context.errorMessage,
        },
        {
          target: 'ready',
        },
      ],
      states: {
        idle: {
          always: [
            {
              target: 'ready',
              cond: (context) => typeof context.links != 'undefined',
            },
            {
              target: 'fetching',
            },
          ],
        },
        fetching: {
          tags: ['pending'],
          invoke: {
            src: (context) => (sendBack) => {
              listCitations(context.id)
                .then((response) => {
                  Promise.all(response.links.map(({source}) => getBlock(source))).then((result: Array<FlowContent>) => {
                    let discussion = document([group(result)])
                    sendBack(publicationModel.events['REPORT.DISCUSSION.SUCCESS'](response.links, discussion))
                  })
                })
                .catch((error) => {
                  sendBack(publicationModel.events['REPORT.DISCUSSION.ERROR'](error))
                })
            },
          },
          on: {
            'REPORT.DISCUSSION.SUCCESS': {
              target: 'ready',
              actions: [
                publicationModel.assign((_, event) => ({
                  links: event.links,
                  discussion: event.discussion,
                  errorMessage: '',
                })),
              ],
            },
            'REPORT.DISCUSSION.ERROR': {
              target: 'finish',
              actions: [
                publicationModel.assign({
                  errorMessage: (_, event) => JSON.stringify(event.errorMessage),
                }),
              ],
            },
          },
        },
        ready: {
          on: {
            'TOGGLE.DISCUSSION': {
              target: 'finish',
            },
            FETCH_DATA: {
              target: 'finish',
              actions: [
                publicationModel.assign({
                  links: undefined,
                }),
              ],
            },
          },
        },
        finish: {
          type: 'final',
        },
      },
    },
    errored: {
      on: {
        FETCH_DATA: {
          target: 'fetching',
          actions: [
            publicationModel.assign({
              id: (_, event) => event.id,
            }),
          ],
        },
      },
    },
  },
})

function TippingModal({
  visible = false,
  publicationId,
  accountId,
}: {
  visible: boolean
  publicationId?: string
  accountId?: string
}) {
  // if (!visible) return null

  const service = useInterpret(tippingMachine)
  const [state, send] = useActor(service)

  if (typeof publicationId == 'undefined' || typeof accountId == 'undefined') {
    console.error(`Tipping Modal ERROR: invalid publicationId or accountId: ${{publicationId, accountId}}`)

    return null
  }

  useEffect(() => {
    send(tippingModel.events.SET_TIP_DATA(publicationId, accountId))
  }, [publicationId, accountId])

  return (
    <PopoverPrimitive.Root
      open={state.matches('open')}
      onOpenChange={(newVal) => {
        if (newVal) {
          send(tippingModel.events.OPEN())
        } else {
          send(tippingModel.events.CLOSE())
        }
      }}
    >
      <PopoverPrimitive.Trigger asChild>
        <Button
          size="1"
          variant="ghost"
          color="success"
          onClick={() => {
            console.log('open modal')

            send(tippingModel.events.OPEN())
          }}
        >
          Tip Author
        </Button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Content>
        {state.matches('open.setAmount') && <SetAmount state={state} send={send} />}
        {state.matches('open.requestInvoice') ||
          (state.matches('open.paying') && (
            <Box
              css={{
                padding: '$5',
                width: '300px',
                backgroundColor: '$background-muted',
                display: 'flex',
                flexDirection: 'column',
                gap: '$4',
                boxShadow: '$3',
              }}
            >
              <Text>...</Text>
            </Box>
          ))}
        {state.matches('open.errored') && (
          <Box
            css={{
              padding: '$5',
              width: '300px',
              backgroundColor: '$background-muted',
              display: 'flex',
              flexDirection: 'column',
              gap: '$4',
              boxShadow: '$3',
            }}
          >
            <Text>Error:</Text>
            <Text size="1" color="danger">
              {JSON.stringify(state.context.errorMessage)}
            </Text>
            <Button size="1" type="submit" css={{width: '$full'}} onClick={() => send(tippingModel.events.RETRY())}>
              Retry
            </Button>
          </Box>
        )}
        {state.matches('open.readyToPay') && (
          <Box
            css={{
              padding: '$5',
              width: '300px',
              backgroundColor: '$background-muted',
              display: 'flex',
              flexDirection: 'column',
              gap: '$4',
              boxShadow: '$3',
              svg: {
                width: '100%',
              },
            }}
          >
            <QRCode title="demo demo" value={state.context.invoice} size={300 - 32} />
            <Box>
              <Text size="1" fontWeight="bold">
                Invoice:
              </Text>
              <Text size="1" css={{wordBreak: 'break-all', wordWrap: 'break-word'}}>
                {state.context.invoice}
              </Text>
            </Box>
            <Button size="1" css={{width: '$full'}} onClick={() => send(tippingModel.events.PAY_INVOICE())}>
              Pay Directly
            </Button>
          </Box>
        )}
        {state.matches('open.success') && (
          <Box
            css={{
              padding: '$5',
              width: '300px',
              backgroundColor: '$background-muted',
              display: 'flex',
              flexDirection: 'column',
              gap: '$4',
              boxShadow: '$3',
            }}
          >
            <Icon name="Star" />
            <Text>Payment Success!</Text>
          </Box>
        )}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Root>
  )
}

function SetAmount({send, state}: {state: StateFrom<typeof tippingMachine>; send: any}) {
  return (
    <Box
      css={{
        padding: '$5',
        width: '300px',
        backgroundColor: '$background-muted',
        display: 'flex',
        flexDirection: 'column',
        gap: '$4',
        boxShadow: '$3',
      }}
    >
      <Text size="4">Tip this Author</Text>
      {
        <Box css={{display: 'flex', flexDirection: 'column', gap: '$3'}}>
          <TextField
            type="number"
            id="amount"
            name="amount"
            label="Invoice Amount"
            size={1}
            value={state.context.amount}
            onChange={(e) => send(tippingModel.events.UPDATE_AMOUNT(Number(e.target.value)))}
          />
          <Box
            css={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Button
              size="1"
              type="submit"
              disabled={state.hasTag('pending')}
              css={{width: '$full'}}
              onClick={() => send(tippingModel.events.REQUEST_INVOICE())}
            >
              Request Invoice
            </Button>
          </Box>
        </Box>
      }
    </Box>
  )
}

function Discussion({links = []}: {links: Array<Link>}) {
  return (
    <Box
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '$4',
      }}
    >
      {links.map((link) => (
        <DiscussionItem link={link} />
      ))}
    </Box>
  )
}

function DiscussionItem({link}: {link: Link}) {
  const [state, send] = useMachine(discussionItemMachine)
  const {data: author} = useAccount(state?.context?.publication?.document?.author)
  const bookmarkService = useBookmarksService()
  const sidepanelService = useSidepanel()
  const [, setLocation] = useLocation()

  function addBookmark() {
    bookmarkService.send({
      type: 'ADD_BOOKMARK',
      link: `${MINTTER_LINK_PREFIX}${link.source?.documentId}/${link.source?.version}/${link.source?.blockId}`,
    })
  }

  async function onCopy() {
    await copyTextToClipboard(embed.url)
    toast.success('Embed Reference copied successfully', {position: 'top-center'})
  }

  function onGoToPublication() {
    setLocation(`/p/${link.source?.documentId}/${link.source?.version}`)
  }

  function onOpenInSidepanel() {
    sidepanelService.send('SIDEPANEL_OPEN')
  }

  useEffect(() => {
    send(discussionItemModel.events.FETCH(link))
  }, [])

  if (state.hasTag('pending')) {
    return <span>loading...</span>
  }

  const {block, publication} = state.context

  if (state.matches('ready')) {
    return (
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <Box
            css={{
              borderBottom: '1px solid rgba(0,0,0,0.1)',
              '&:hover': {
                cursor: 'pointer',
              },
            }}
          >
            <Editor mode={EditorMode.Embed} value={[block as FlowContent]} />
            <Box
              css={{
                paddingVertical: '$6',
                $$gap: '16px',
                display: 'flex',
                gap: '$$gap',
                alignItems: 'center',
                '& *': {
                  position: 'relative',
                },
                '& *:not(:first-child):before': {
                  content: `"|"`,
                  color: '$text-muted',
                  opacity: 0.5,
                  position: 'absolute',
                  left: '-10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                },
              }}
            >
              <Text size="1" color="muted">
                {publication?.document?.title}
              </Text>
              {author && (
                <Text size="1" color="muted" css={{paddingRight: '$3'}}>
                  <span>Signed by </span>
                  <span style={{textDecoration: 'underline'}}>{author.profile?.alias}</span>
                </Text>
              )}

              <Text size="1" color="muted">
                Created on: {getDateFormat(state.context.publication?.document, 'createTime')}
              </Text>
              {/* <Text size="1" color="muted">
            Last modified: {getDateFormat(state.context.publication?.document, 'updateTime')}
          </Text> */}
            </Box>
          </Box>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item onSelect={onCopy}>
            <Icon name="Copy" size="1" />
            <Text size="2">Copy Embed Reference</Text>
          </ContextMenu.Item>
          <ContextMenu.Item
            onSelect={() => {
              addBookmark()
              sidepanelService.send('SIDEPANEL_OPEN')
            }}
          >
            <Icon name="ArrowChevronDown" size="1" />
            <Text size="2">Add to Bookmarks</Text>
          </ContextMenu.Item>
          <ContextMenu.Item onSelect={() => onGoToPublication()}>
            <Icon name="ArrowTopRight" size="1" />
            <Text size="2">Open Embed in main Panel</Text>
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
    )
  }

  return null
}

async function getBlock(entry?: LinkNode): Promise<FlowContent> {
  if (!entry) return
  let pub = await getPublication(entry.documentId)

  let block: FlowContent
  visit(JSON.parse(pub.document?.content!)[0], {id: entry.blockId}, (node) => {
    block = node
  })

  //@ts-ignore
  return block
}

const discussionItemModel = createModel(
  {
    link: null as Link | null,
    publication: null as PublicationType | null,
    block: null as FlowContent | null,
    errorMessage: '',
  },
  {
    events: {
      FETCH: (link: Link) => ({link}),
      'REPORT.FETCH.SUCCESS': (publication: PublicationType, block: FlowContent) => ({publication, block}),
      'REPORT.FETCH.ERROR': (errorMessage: string) => ({errorMessage}),
    },
  },
)

const discussionItemMachine = discussionItemModel.createMachine({
  initial: 'idle',
  context: discussionItemModel.initialContext,
  states: {
    idle: {
      tags: ['pending'],
      on: {
        FETCH: {
          target: 'fetching',
          actions: discussionItemModel.assign({
            link: (_, event) => event.link,
          }),
        },
      },
    },
    fetching: {
      tags: ['pending'],
      invoke: {
        src: (context) => (sendBack) => {
          ;(async () => {
            if (!context.link?.source) {
              sendBack(discussionItemModel.events['REPORT.FETCH.ERROR']('Error on Discussion Link'))
            } else {
              let publication = await getPublication(context.link!.source!.documentId!)
              let block = await getBlock(context.link!.source!)
              console.log('invoke result: ', {publication, block})
              sendBack(discussionItemModel.events['REPORT.FETCH.SUCCESS'](publication, block))
            }
          })()
        },
      },
      on: {
        'REPORT.FETCH.SUCCESS': {
          target: 'ready',
          actions: [
            discussionItemModel.assign((_, event) => ({
              publication: event.publication,
              block: event.block,
            })),
          ],
        },
        'REPORT.FETCH.ERROR': {
          actions: [
            discussionItemModel.assign({
              errorMessage: (_, event) => event.errorMessage,
            }),
          ],
          target: 'errored',
        },
      },
    },
    errored: {},
    ready: {},
  },
})
