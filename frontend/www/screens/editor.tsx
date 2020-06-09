import React, {useReducer, useCallback} from 'react'
import {Editor as SlateEditor, Transforms, Node, Range} from 'slate'
import {Slate, ReactEditor} from 'slate-react'
import {css} from 'emotion'
import {EditablePlugins, SoftBreakPlugin} from 'slate-plugins-next'
import {useMutation, queryCache} from 'react-query'
import {
  Icons,
  nodeTypes,
  renderElements,
  Editor as MintterEditor,
  Toolbar,
  useEditor,
  plugins as editorPlugins,
  initialSectionsValue,
  // SectionToolbar,
  renderLeafs,
  renderEditableSectionElement,
} from '@mintter/editor'
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
import {Container} from '@material-ui/core'

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
  const plugins = [...editorPlugins, SoftBreakPlugin()]
  const editor: ReactEditor = useEditor(plugins) as ReactEditor
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const editorContainerRef = React.useRef<HTMLDivElement>(null)
  const titleRef = React.useRef(null)
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
      setValue({
        title: obj.title,
        description: obj.description,
        sections:
          obj.sectionsList.length > 0
            ? obj.sectionsList.map((s: Section.AsObject) => {
                return {
                  type: nodeTypes.typeSection,
                  title: s.title,
                  description: s.description,
                  author: s.author,
                  children: markdownToSlate(s.body),
                }
              })
            : initialSectionsValue,
      })
    }
  }, [data])

  // React.useEffect(() => {
  //   function handler(e) {
  //     if (
  //       // TODO: (horacio) if there's an error on this page and the editor has not being loaded properly, this will fail
  //       !ReactEditor.isFocused(editor) &&
  //       typeof e.target.value !== 'string'
  //     ) {
  //       ReactEditor.focus(editor)
  //       Transforms.select(editor, Editor.end(editor, []))
  //     }
  //   }

  //   wrapperRef.current.addEventListener('click', handler)

  //   return () => {
  //     wrapperRef.current.removeEventListener('click', handler)
  //   }
  // }, [])

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
    <Layout>
      <Seo title="Editor" />
      <div
        className="flex-1 overflow-y-auto pt-4 overflow-y-scroll"
        ref={wrapperRef}
      >
        <div className="flex-1 overflow-y-auto">
          <EditorHeader onPublish={handlePublish} />
          <div className="flex pt-8 pb-32 relative">
            <DebugValue
              value={state}
              className="absolute z-10 right-0 top-0 w-full max-w-xs"
            />
            <div
              className={`w-full pr-4 absolute xl:sticky left-0 top-0 self-start mx-4 opacity-0 pointer-events-none xl:opacity-100 xl:pointer-events-auto transition duration-200 ${css`
                max-width: 300px;
              `}`}
            >
              {/* <div className="">
                  <p className="font-semibold text-heading text-xl">
                    {title || 'Untitled document'}
                  </p>
                </div> */}
            </div>
            <div
              className={`flex-1 ${css`
                @media (min-width: 1280px) {
                  transform: translateX(-150px);
                }
              `}`}
            >
              <div
                className={`mx-auto ${css`
                  max-width: 80ch;
                `} `}
              >
                <Slate
                  editor={editor}
                  value={sections}
                  onChange={sections => {
                    setSections(sections)
                  }}
                >
                  <div
                    className={`${css`
                      word-break: break-word;
                    `}`}
                  >
                    <div
                      className={`mx-8 pb-2 relative ${css`
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
                        placeholder="Untitled document"
                        minHeight={56}
                        className={`text-4xl text-heading font-bold`}
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
                        placeholder="+ Add a subtitle"
                        minHeight={28}
                        className={`leading-relaxed text-lg font-light text-heading-muted italic`}
                        onEnterPress={() => {
                          ReactEditor.focus(editor)
                        }}
                      />
                    </div>
                    <div className="relative" ref={editorContainerRef}>
                      <Toolbar />
                      {/* {!isEmpty() && <SectionToolbar />} */}
                      <EditablePlugins
                        plugins={plugins}
                        renderElement={[
                          ...renderElements,
                          renderEditableSectionElement(),
                        ]}
                        renderLeaf={[...renderLeafs]}
                        placeholder="Start writing your masterpiece..."
                        spellCheck
                        autoFocus
                      />
                    </div>
                  </div>
                </Slate>
                <div className="py-16 px-8 flex flex-col items-start">
                  <button
                    className="flex items-center bg-transparent text-body-muted transition duration-200 hover:text-body hover:border-body border border-body-muted rounded-md px-2 pl-2 py-2"
                    onClick={() => MintterEditor.addSection(editor)}
                  >
                    <Icons.Plus color="currentColor" />
                    <span className="px-2 text-sm">add Block</span>
                  </button>
                  <a className="text-primary hover:text-primary-hover cursor-pointer text-sm mt-4 underline">
                    what are Blocks and how to use them
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
