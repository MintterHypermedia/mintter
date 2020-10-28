import React, {useState, useReducer, useCallback} from 'react'
import {Editor as SlateEditor, Transforms, Node, Range} from 'slate'
import {css} from 'emotion'
import {useMutation, queryCache} from 'react-query'
import {v4 as uuid} from 'uuid'
import {
  Icons,
  nodeTypes,
  Editor as MintterEditor,
  Toolbar,
  useEditor,
  plugins as editorPlugins,
  initialBlocksValue,
  EditorComponent,
  HelperToolbar,
  useHelper,
  ELEMENT_BLOCK,
  ELEMENT_BLOCK_LIST,
  useEditorValue,
  EditorState,
  BlockToolsProvider,
  toSlateTree,
  toSlateBlocksDictionary,
  TransclusionHelperProvider,
  options,
  createPlugins,
} from '@mintter/editor'
import ResizerStyle from '../components/resizer-style'
import {useEditor as useSlateEditor, ReactEditor} from 'slate-react'
import Tippy from '@tippyjs/react'
import SplitPane from 'react-split-pane'
import Seo from 'components/seo'
import EditorHeader from 'components/editor-header'
import {DebugValue} from 'components/debug'
import Textarea from 'components/textarea'
import {Document} from '@mintter/api/v2/documents_pb'
import {useDebounce} from 'shared/hooks'
import {useDocument, useMintter} from 'shared/mintterContext'
import {publishDraft} from 'shared/mintterClient'
import {useParams, useHistory, useLocation} from 'react-router-dom'
import {FullPageSpinner} from 'components/fullPageSpinner'
import {FullPageErrorMessage} from 'components/errorMessage'
import Layout from 'components/layout'
import Container from 'components/container'
import {useTheme} from 'shared/themeContext'
import {BlockRefList} from '@mintter/api/v2/documents_pb'
import {Page} from 'components/page'
import {MainColumn} from 'components/main-column'
import {InteractionPanelObject} from 'components/interactionPanelObject'
import {useTransclusion} from 'shared/useTransclusion'
import {useInteractionPanel} from 'components/interactionPanel'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function Editor(): JSX.Element {
  const {push} = useHistory()
  const {version} = useParams()
  const {theme} = useTheme()
  const query = useQuery()
  const {
    state: interactionPanel,
    dispatch: interactionPanelDispatch,
  } = useInteractionPanel()

  const editorOptions = {
    ...options,
    transclusion: {
      ...options.transclusion,
      customProps: {
        dispatch: interactionPanelDispatch,
      },
    },
    block: {
      ...options.block,
      customProps: {
        dispatch: interactionPanelDispatch,
      },
    },
  }
  const plugins = createPlugins(editorOptions)
  const editor: ReactEditor = useEditor(plugins, editorOptions) as ReactEditor
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const editorContainerRef = React.useRef<HTMLDivElement>(null)
  const titleRef = React.useRef(null)
  const subtitleRef = React.useRef(null)
  const [readyToAutosave, setReadyToAutosave] = React.useState<boolean>(false)

  const {setDocument} = useMintter()
  const saveDocument = React.useMemo(() => setDocument(editor), [editor])
  const {isSuccess, isLoading, isError, error, data} = useDocument(version, {
    onSuccess: () => {
      setReadyToAutosave(true)
    },
  })
  // TODO: add autosave again

  const [publish] = useMutation(publishDraft, {
    onSuccess: publication => {
      const {version} = publication.toObject()

      push(`/p/${version}`)
    },
  })

  const {createTransclusion} = useTransclusion({editor})

  const {state, setTitle, setSubtitle, setBlocks, setValue} = useEditorValue({
    document: data,
  })
  const {title, blocks, subtitle, mentions} = state

  React.useEffect(() => {
    if (mentions.length) {
      interactionPanelDispatch({type: 'add_object', payload: mentions})
    }

    let object = query.get('object')
    if (object) {
      interactionPanelDispatch({type: 'add_object', payload: object})
    }
  }, [])

  const [autosaveDraft] = useMutation(async state => {
    if (data.document) {
      console.log('autosafe called!')

      saveDocument({document: data.document, state})
    } else {
      console.error('no document???')
    }
  })

  const debouncedValue = useDebounce(state, 1000)

  React.useEffect(() => {
    if (readyToAutosave) {
      autosaveDraft(state)
    }
  }, [debouncedValue])

  async function handlePublish() {
    await saveDocument({document: data.document, state})
    publish(version as string)
  }

  if (isLoading) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorMessage error={error} />
  }

  return (
    <>
      <Seo title="Compose" />
      <DebugValue value={state} />
      <ResizerStyle />
      <Page>
        <SplitPane
          style={{
            height: '100%',
            width: '100%',
          }}
          split="vertical"
          maxSize={-100}
          defaultSize="66%"
          minSize={300}
          pane1Style={
            interactionPanel.visible
              ? {
                  minWidth: 600,
                  overflow: 'auto',
                }
              : {
                  width: '100%',
                  minWidth: '100%',
                  height: '100%',
                  minHeight: '100%',
                  overflow: 'auto',
                }
          }
          pane2Style={{
            overflow: 'auto',
          }}
        >
          <div className="overflow-auto">
            <div className="px-4 flex justify-end pt-4">
              <button
                onClick={handlePublish}
                className="bg-primary rounded-full px-12 py-2 text-white font-bold shadow transition duration-200 hover:shadow-lg ml-4"
              >
                Publish
              </button>
              <Tippy
                content={
                  <span
                    className={`px-2 py-1 text-xs font-light transition duration-200 rounded bg-muted-hover ${css`
                      background-color: #333;
                      color: #ccc;
                    `}`}
                  >
                    Interact with this document
                  </span>
                }
              >
                <button
                  onClick={() =>
                    interactionPanelDispatch({type: 'toggle_panel'})
                  }
                  className="ml-4 text-sm text-muted-hover hover:text-toolbar transform -rotate-180 transition duration-200 outline-none"
                >
                  <Icons.Sidebar color="currentColor" />
                </button>
              </Tippy>
            </div>

            <MainColumn>
              <div
                className={`pb-2 mb-4 relative ${css`
                  &:after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 50%;
                    max-width: 360px;
                    height: 1px;
                    z-index: 20;
                    background-color: var(--color-muted-hover);
                  }
                `}`}
              >
                <Textarea
                  ref={t => {
                    titleRef.current = t
                  }}
                  value={title}
                  data-test-id="editor_title"
                  onChange={setTitle}
                  name="title"
                  placeholder="Document title"
                  className={`text-4xl text-heading font-bold italic`}
                  onEnterPress={() => {
                    subtitleRef.current.focus()
                  }}
                />
                <Textarea
                  ref={d => {
                    subtitleRef.current = d
                  }}
                  value={subtitle}
                  onChange={setSubtitle}
                  name="subtitle"
                  placeholder="Subtitle"
                  className={`leading-relaxed text-lg font-light text-heading-muted italic`}
                  onEnterPress={() => {
                    ReactEditor.focus(editor)
                  }}
                />
              </div>
              <div className="prose xs:prose-xl md:prose-xl lg:prose-2xl 2xl:prose-3xl">
                <EditorComponent
                  editor={editor}
                  plugins={plugins}
                  value={blocks}
                  onChange={blocks => {
                    setBlocks(blocks)
                  }}
                  theme={theme}
                />
              </div>
            </MainColumn>
          </div>
          {interactionPanel.visible ? (
            <div
              className="bg-background-muted"
              style={{
                visibility: interactionPanel.visible ? 'visible' : 'hidden',
                maxWidth: interactionPanel.visible ? '100%' : 0,
                width: interactionPanel.visible ? '100%' : 0,
                height: '100%',
                minHeight: '100%',
                overflow: 'auto',
                zIndex: 0,
              }}
            >
              {interactionPanel.objects.map(object => (
                <InteractionPanelObject
                  isEditor
                  id={object}
                  createTransclusion={createTransclusion}
                />
              ))}
            </div>
          ) : (
            <div />
          )}
        </SplitPane>
      </Page>
    </>
  )
}
