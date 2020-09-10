import React, {useState, useReducer, useCallback} from 'react'
import {Editor as SlateEditor, Transforms, Node, Range} from 'slate'
import {css} from 'emotion'
import {useMutation, queryCache} from 'react-query'
import {v4 as uuid} from 'uuid'
import {DragDropContext} from 'react-beautiful-dnd'
import {
  Icons,
  nodeTypes,
  Editor as MintterEditor,
  Toolbar,
  useEditor,
  plugins as editorPlugins,
  initialBlocksValue,
  EditorComponent,
  renderEditableBlockElement,
  renderElementBlockList,
  HelperToolbar,
  useHelper,
  ELEMENT_BLOCK,
  ELEMENT_BLOCK_LIST,
  useEditorValue,
  EditorState,
  onDragStart,
  onDragEnd,
  BlockToolsProvider,
  toSlateTree,
  toSlateBlocksDictionary,
} from '@mintter/editor'
import {useEditor as useSlateEditor, ReactEditor} from 'slate-react'
import Tippy from '@tippyjs/react'
import Seo from 'components/seo'
import EditorHeader from 'components/editor-header'
import {DebugValue} from 'components/debug'
import Textarea from 'components/textarea'
import {Section} from '@mintter/proto/documents_pb'
import {Document} from '@mintter/proto/v2/documents_pb'
import {markdownToSlate} from 'shared/markdownToSlate'
import {useDebounce} from 'shared/hooks'
import {useMintter} from 'shared/mintterContext'
import {useParams, useHistory} from 'react-router-dom'
import {FullPageSpinner} from 'components/fullPageSpinner'
import {FullPageErrorMessage} from 'components/errorMessage'
import Layout from 'components/layout'
import Container from 'components/container'
import {useTheme} from 'shared/themeContext'
import {BlockRefList} from '@mintter/proto/v2/documents_pb'

export default function Editor(): JSX.Element {
  const plugins = [...editorPlugins]
  const editor: ReactEditor = useEditor(plugins) as ReactEditor
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const editorContainerRef = React.useRef<HTMLDivElement>(null)
  const titleRef = React.useRef(null)
  const [showDescription, setShowDescription] = React.useState<boolean>(false)
  const descriptionRef = React.useRef(null)
  const [readyToAutosave, setReadyToAutosave] = React.useState<boolean>(false)
  const {state, setTitle, setSubtitle, setBlocks, setValue} = useEditorValue()

  const {push} = useHistory()
  const {version} = useParams()
  const {theme} = useTheme()
  const {getDocument, setDocument, publishDraft, getAuthor} = useMintter()
  const saveDocument = React.useMemo(() => setDocument(editor), [editor])
  const {title, blocks, subtitle} = state
  const {status, error, data} = getDocument(version, {
    onSuccess: () => {
      setReadyToAutosave(true)
    },
  })

  const [autosaveDraft] = useMutation(
    async state => {
      const {document} = data.toObject()
      const {id, version, author} = document
      saveDocument({document: {id, version, author}, state})
    },
    {
      onSuccess: () => {
        queryCache.setQueryData(['Document', version], data)
      },
    },
  )

  const debouncedValue = useDebounce(state, 1000)

  React.useEffect(() => {
    if (readyToAutosave) {
      autosaveDraft(state)
    }
  }, [debouncedValue])

  React.useEffect(() => {
    if (data) {
      const {document, blocksMap} = data.toObject()

      const {title, subtitle, blockRefList} = document
      const blocks = toSlateTree({blockRefList, blocksMap})
      console.log('data effect blocks', blocks)

      setValue({
        title,
        subtitle,
        blocks: blocks ? [blocks] : initialBlocksValue,
      })
    }
  }, [data])

  async function handlePublish() {
    console.log('version to publish => ', version)
    publishDraft(version as string, {
      onSuccess: publication => {
        // const doc = publication.toObject()
        // push(`/p/${doc.version}`)
        console.log('published!! => ', publication.toObject())
      },
    })
  }

  if (status === 'loading') {
    return <FullPageSpinner />
  }

  if (status === 'error') {
    return <FullPageErrorMessage error={error} />
  }

  return (
    <>
      <Seo title="Editor" />
      <DragDropContext
        onDragStart={onDragStart(editor)}
        onDragEnd={onDragEnd(editor)}
      >
        <div
          className={`${css`
            display: grid;

            grid-template: auto 1fr / minmax(250px, 20%) 1fr minmax(250px, 20%);
            grid-gap: 1rem;
          `}`}
        >
          <div
            className={`px-4  -mt-8 flex justify-end ${css`
              grid-column: 1/4;
            `}`}
          >
            <button
              onClick={handlePublish}
              className="bg-primary rounded-full px-12 py-2 text-white font-bold shadow transition duration-200 hover:shadow-lg ml-4"
            >
              Publish
            </button>
          </div>
          <div
            className={`p-4 ${css`
              grid-column: 2/3;
            `}`}
          >
            <div
              className={`my-0 mx-auto ${css`
                max-width: 80ch;
                width: 100%;
              `}`}
            >
              <div
                className={`pb-2 relative ${css`
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
                  minHeight={56}
                  className={`text-4xl text-heading font-bold italic`}
                  onEnterPress={() => {
                    descriptionRef.current.focus()
                  }}
                />
                <Textarea
                  ref={d => {
                    descriptionRef.current = d
                  }}
                  value={subtitle}
                  onChange={setSubtitle}
                  name="subtitle"
                  placeholder="Subtitle"
                  minHeight={28}
                  className={`leading-relaxed text-lg font-light text-heading-muted italic`}
                />
              </div>
              <BlockToolsProvider>
                <EditorComponent
                  editor={editor}
                  plugins={plugins}
                  value={blocks}
                  onChange={blocks => {
                    setBlocks(blocks)
                  }}
                  renderElements={[
                    renderEditableBlockElement(),
                    renderElementBlockList(),
                  ]}
                  theme={theme}
                />
              </BlockToolsProvider>
            </div>
          </div>
          <DebugValue
            value={state}
            className={`${css`
              grid-column: 3/4;
            `}`}
          />
        </div>
      </DragDropContext>
    </>
  )
}
