import React, {useState, useReducer, useCallback} from 'react'
import {Editor as SlateEditor, Transforms, Node, Range} from 'slate'
import {css} from 'emotion'
import {EditablePlugins, SoftBreakPlugin} from 'slate-plugins-next'
import {useMutation, queryCache} from 'react-query'
import {v4 as uuid} from 'uuid'
import {
  Icons,
  nodeTypes,
  Editor as MintterEditor,
  Toolbar,
  useEditor,
  plugins as editorPlugins,
  initialSectionsValue,
  EditorComponent,
  renderEditableBlockElement,
  slate,
  HelperToolbar,
  useHelper,
  ELEMENT_BLOCK,
} from '@mintter/editor'
import {useEditor as useSlateEditor, ReactEditor} from 'slate-react'
import Tippy from '@tippyjs/react'
import Seo from 'components/seo'
import EditorHeader from 'components/editor-header'
import {DebugValue} from 'components/debug'
import Textarea from 'components/textarea'
import {Section, Publication} from '@mintter/proto/documents_pb'
import {markdownToSlate} from 'shared/markdownToSlate'
import {useDebounce} from 'shared/hooks'
import {useMintter} from 'shared/mintterContext'
import {useParams, useHistory} from 'react-router-dom'
import {FullPageSpinner} from 'components/fullPageSpinner'
import {FullPageErrorMessage} from 'components/errorMessage'
import Layout from 'components/layout'
import Container from 'components/container'
import {useTheme} from 'shared/themeContext'

interface EditorState {
  title: string
  description: string
  sections: Node[]
}

function draftReducer(state: EditorState, action) {
  const {type, payload} = action

  switch (type) {
    case 'TITLE':
      return {
        ...state,
        title: payload,
      }
    case 'DESCRIPTION': {
      return {
        ...state,
        description: payload,
      }
    }
    case 'SECTIONS': {
      return {
        ...state,
        sections: payload,
      }
    }

    case 'VALUE': {
      return {
        ...state,
        ...payload,
      }
    }

    default: {
      return state
    }
  }
}

function useEditorValue() {
  const [state, dispatch] = useReducer(
    draftReducer,
    initialValue,
    initializeEditorValue,
  )

  const setTitle = useCallback(payload => {
    dispatch({type: 'TITLE', payload})
  }, [])

  const setDescription = useCallback(payload => {
    dispatch({type: 'DESCRIPTION', payload})
  }, [])

  const setSections = useCallback(payload => {
    dispatch({type: 'SECTIONS', payload})
  }, [])

  const setValue = useCallback(payload => {
    dispatch({type: 'VALUE', payload})
  }, [])

  return {
    state,
    setTitle,
    setDescription,
    setSections,
    setValue,
  }
}

const initialValue: EditorState = {
  title: '',
  description: '',
  sections: initialSectionsValue,
}

function initializeEditorValue() {
  // TODO: change this to a lazy initialization function later
  return initialValue
}

export default function Editor(): JSX.Element {
  const plugins = [...editorPlugins]
  const editor: slate.ReactEditor = useEditor(plugins) as slate.ReactEditor
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const editorContainerRef = React.useRef<HTMLDivElement>(null)
  const titleRef = React.useRef(null)
  const [showDescription, setShowDescription] = React.useState<boolean>(false)
  const descriptionRef = React.useRef(null)
  const [readyToAutosave, setReadyToAutosave] = React.useState<boolean>(false)
  const {
    state,
    setTitle,
    setDescription,
    setSections,
    setValue,
  } = useEditorValue()

  const {push} = useHistory()
  const {documentId} = useParams()
  const {getDraft, setDraft, publishDraft} = useMintter()
  const {theme} = useTheme()

  const {title, sections, description} = state

  function isEmpty(): boolean {
    return sections
      ? sections.length === 1 && Node.string(sections[0]) === ''
      : false
  }

  const {status, error, data} = getDraft(documentId, {
    onSuccess: () => {
      setReadyToAutosave(true)
    },
  })

  const [autosaveDraft] = useMutation(
    async ({state}: {state: EditorState}) => {
      const {title, description, sections} = state
      setDraft({documentId, title, description, sections})
    },
    {
      onSuccess: () => {
        queryCache.setQueryData(['Draft', documentId], data)
      },
    },
  )

  const debouncedValue = useDebounce(state, 1000)

  React.useEffect(() => {
    if (readyToAutosave) {
      autosaveDraft({state})
    }
  }, [debouncedValue])

  React.useEffect(() => {
    if (data) {
      const obj = data.toObject()
      console.log('BLOCK: obj', obj)
      setValue({
        title: obj.title,
        description: obj.description,
        sections:
          obj.sectionsList.length > 0
            ? obj.sectionsList.map((s: Section.AsObject) => {
                return {
                  type: ELEMENT_BLOCK,
                  id: uuid(),
                  author: s.author,
                  children: markdownToSlate(s.body),
                }
              })
            : initialSectionsValue,
      })
    }
  }, [data])

  async function handlePublish() {
    publishDraft(documentId as string, {
      onSuccess: (publication: Publication) => {
        const doc = publication.toObject()
        push(`/p/${doc.id}`)
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
      <div className="flex mx-4">
        <span className="flex-1"></span>
        <button
          onClick={handlePublish}
          className="bg-primary rounded-full px-12 py-2 text-white font-bold shadow transition duration-200 hover:shadow-lg ml-4"
        >
          Publish
        </button>
      </div>
      <div>
        <DebugValue
          value={state}
          className="absolute z-10 right-0 top-0 w-full max-w-xs"
        />
        <Container>
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
              value={description}
              onChange={setDescription}
              name="description"
              placeholder="Subtitle"
              minHeight={28}
              className={`leading-relaxed text-lg font-light text-heading-muted italic`}
              onEnterPress={() => {
                // TODO: Horacio: focus Editor here..!
              }}
            />
          </div>
          <EditorComponent
            editor={editor}
            plugins={plugins}
            value={sections}
            onChange={sections => {
              setSections(sections)
            }}
            renderElements={[renderEditableBlockElement()]}
            theme={theme}
          />
          {/* <div className="py-16 flex flex-col items-start">
            <AddBlockButton editor={editor} />
          </div> */}
        </Container>
      </div>
    </>
  )
}

function AddBlockButton({editor}) {
  const [visible, setVisible] = useState(false)
  const show = () => setVisible(true)
  const hide = () => setVisible(false)

  function toggle() {
    if (visible) {
      hide()
    } else {
      show()
    }
  }

  function handleAddTextBlock() {
    // ReactEditor.addSection(editor)
  }

  return (
    <Tippy
      visible={visible}
      placement="top-start"
      interactive
      onClickOutside={hide}
      content={
        <div
          className={`transition duration-200 rounded-lg shadow-lg overflow-hidden bg-background w-full border px-2 border-background-emphasize ${css`
            min-width: 402px;
          `}`}
        >
          <p className="font-bold uppercase text-body px-4 pt-4 pb-2 text-xs">
            Section Types
          </p>
          <div
            className={`flex flex-wrap ${css`
              min-width: 402px;
            `}`}
          >
            <button
              className="block p-4 hover:bg-background-muted bg-background text-left rounded-lg"
              onClick={handleAddTextBlock}
            >
              <div
                className={`bg-blue-200 flex items-center justify-center text-blue-500 ${css`
                  width: 160px;
                  height: 80px;
                `}`}
              >
                <Icons.AlignLeft size={40} color="currentColor" />
              </div>
              <div className="mt-2">
                <p className="font-bold text-body text-sm">Text block</p>
              </div>
            </button>
            <button
              className="block p-4 hover:bg-background-muted bg-background text-left rounded-lg"
              onClick={handleAddTextBlock}
            >
              <div
                className={`bg-blue-200 flex items-center justify-center text-blue-500 ${css`
                  width: 160px;
                  height: 80px;
                `}`}
              >
                <Icons.Image size={40} color="currentColor" />
              </div>
              <div className="mt-2">
                <p className="font-bold text-body text-sm">Image block</p>
              </div>
            </button>
          </div>
          <Tippy
            content={
              <div className="rounded bg-gray-900 text-gray-200 px-4 py-2">
                Select one type to playyy!!
              </div>
            }
            placement="auto-start"
          >
            <p className="text-primary hover:text-primary-hover cursor-pointer text-sm mt-4 underline px-4 pb-4 pt-2">
              what are Blocks and how to use them?
            </p>
          </Tippy>
        </div>
      }
    >
      <button
        className="flex items-center bg-transparent text-body-muted transition duration-200 hover:text-body hover:border-body border border-body-muted rounded-md px-2 pl-2 py-2"
        onClick={toggle}
      >
        <Icons.Plus color="currentColor" />
        <span className="px-2 text-sm">add Block</span>
      </button>
    </Tippy>
  )
}
