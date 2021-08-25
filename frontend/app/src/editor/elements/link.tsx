import {useEffect, useState} from 'react'
import {isLink} from '@mintter/mttast'
import type {Link as LinkType} from '@mintter/mttast'
import isUrl from 'is-url'
import {styled} from '@mintter/ui/stitches.config'
import {link, text} from '@mintter/mttast-builder'
import {Editor, Element as SlateElement, Transforms} from 'slate'
import type {BaseEditor} from 'slate'
import {ReactEditor, useSlateStatic} from 'slate-react'
import type {EditorPlugin} from '../types'
import {isCollapsed} from '../utils'
import type {MTTEditor} from '../utils'
import {FormEvent, forwardRef} from 'react'
import {Tooltip} from '../../components/tooltip'
import {Box} from '@mintter/ui/box'
import {Text} from '@mintter/ui/text'
import {Icon} from '@mintter/ui/icon'
import {TextField} from '@mintter/ui/text-field'
import * as Popover from '@radix-ui/react-popover'
import {Slot} from '@radix-ui/react-slot'
import {Button} from '@mintter/ui/button'
import {getPreventDefaultHandler, unwrapNodes, upsertLinkAtSelection} from '@udecode/slate-plugins'
import type {Range} from 'slate'
import type {UseLastSelectionResult} from '../hovering-toolbar'
import {MINTTER_LINK_PREFIX} from '../../constants'

export const ELEMENT_LINK = 'link'

const StyledLink = styled('a', {
  textDecoration: 'underline',
  display: 'inline',
  color: '$text-default',
  width: 'auto',
  wordBreak: 'break-all',
  '&:hover': {
    cursor: 'pointer',
  },
})

export const Link = forwardRef((props, ref) => {
  return <StyledLink ref={ref} {...props} />
})

export const createLinkPlugin = (): EditorPlugin => ({
  name: ELEMENT_LINK,
  renderElement({attributes, children, element}) {
    if (element.type === ELEMENT_LINK) {
      return (
        <Tooltip
          content={
            <Box
              css={{
                display: 'flex',
                alignItems: 'center',
                gap: '$2',
              }}
            >
              {element.url}
              <Icon size="1" name="ExternalLink" color="opposite" />
            </Box>
          }
        >
          <Link href={element.url} onClick={() => window.open(element.url as string, '_blank')} {...attributes}>
            {children}
          </Link>
        </Tooltip>
      )
    }
  },
  configureEditor(editor) {
    /**
     * - when should I create a link:
     *   - paste a link text format
     *   - write a link text
     *   - by selecting and interacting with the toolbar (not in here)
     */
    const {isInline, insertText, insertData, normalizeNode} = editor

    editor.isInline = (element) => {
      return isLink(element) ? true : isInline(element)
    }

    editor.insertText = (text: string) => {
      if (text && isUrl(text)) {
        wrapLink(editor, text)
      } else {
        insertText(text)
      }
    }

    editor.insertData = (data) => {
      const text = data.getData('text/plain')
      console.log('🚀 ~ file: link.tsx ~ line 93 ~ configureEditor ~ text', text)

      if (text) {
        if (isMintterLink(text)) {
          wrapMintterLink(editor, text)
        } else if (isUrl(text)) {
          wrapLink(editor, text)
        } else {
          insertData(data)
        }
      }
    }

    return editor
  },
})

export interface InsertLinkOptions {
  url: string
  selection: Range | null
  wrap: boolean
}

export function insertLink(
  editor: MTTEditor,
  {url, selection = editor.selection, wrap = false}: InsertLinkOptions,
): void {
  if (!selection) return

  if (isCollapsed(selection)) {
    if (!wrap) {
      /*
       * @todo explain why we need to do this first here
       */
      Transforms.insertNodes(editor, link({url}, [text(url)]), {
        at: selection,
      })
      return
    } else {
      const linkLeaf = Editor.leaf(editor, selection)
      if (linkLeaf) {
        const [, leafPath] = linkLeaf
        Transforms.select(editor, leafPath)
      }
    }
  }

  unwrapNodes(editor, {at: selection, match: {type: ELEMENT_LINK}})

  wrapLink(editor, url, selection)

  Transforms.collapse(editor, {edge: 'end'})
}

export function isLinkActive(editor: MTTEditor): boolean {
  const [link] = Editor.nodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type == ELEMENT_LINK,
  })

  return !!link
}

export function unwrapLink(editor: MTTEditor): void {
  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type == ELEMENT_LINK,
  })
}

export function wrapLink(editor: MTTEditor, url: string, selection = editor.selection): void {
  if (isLinkActive(editor)) {
    unwrapLink(editor)
  }

  const newLink: LinkType = link({url}, isCollapsed(selection) ? [text(url)] : [])

  if (isCollapsed(selection)) {
    Transforms.insertNodes(editor, newLink, {at: selection})
  } else {
    Transforms.wrapNodes(editor, newLink, {split: true, at: selection})
  }
  // Transforms.collapse(editor, {edge: 'end'})
  Transforms.select(editor, selection)
}

export function isValidUrl(entry: string): boolean {
  const urlRegex = new RegExp(
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/,
  )
  return urlRegex.test(entry)
}

function isMintterLink(text: string) {
  return text.includes(MINTTER_LINK_PREFIX)
}

function wrapMintterLink(editor: MTTEditor, text: string) {
  console.log('add mintter link!!', text)
  wrapLink(editor, text)
}

export interface ToolbarLinkProps extends UseLastSelectionResult {}

export function ToolbarLink({lastSelection, resetSelection}: ToolbarLinkProps) {
  const [open, setOpen] = useState(false)
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger as={Slot}>
        <Button
          variant="ghost"
          size="1"
          color="muted"
          onClick={() => {
            setOpen((v) => !v)
          }}
        >
          <Icon name="Link" />
        </Button>
      </Popover.Trigger>

      <Popover.Content>
        <LinkModal
          lastSelection={lastSelection}
          close={() => {
            setOpen(false)
            resetSelection()
          }}
        />
      </Popover.Content>
    </Popover.Root>
  )
}

export interface LinkModalProps {
  lastSelection: Range | null
  close: () => void
}
export function LinkModal({close, lastSelection}: LinkModalProps) {
  const [link, setLink] = useState('')
  const editor = useSlateStatic()
  const isLink = isLinkActive(editor)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editor) return
    if (link && isValidUrl(link)) {
      insertLink(editor, {url: link, selection: lastSelection, wrap: true})
    }

    close()
  }

  function handleRemove() {
    if (!editor) return
    const linkEntry = Editor.above(editor, {
      match: (n) => n.type == ELEMENT_LINK,
    })
    if (!linkEntry) return

    const [linkNode, linkPath] = linkEntry
    Transforms.unwrapNodes(editor, {
      at: linkPath,
      match: (n) => n.type == ELEMENT_LINK,
    })
    close()
  }

  useEffect(() => {
    if (!editor) return
    const linkEntry = Editor.above(editor, {
      match: (n) => n.type == ELEMENT_LINK,
    })
    if (!linkEntry) return
    let link = linkEntry[0].url as string
    setLink(link)
  }, [editor.selection])

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
      <Box
        as="form"
        onSubmit={handleSubmit}
        css={{
          width: '$full',
          display: 'flex',
          flexDirection: 'column',
          gap: '$5',
        }}
      >
        <Text size="5">Link Information</Text>
        <TextField
          type="url"
          id="address"
          name="address"
          label="Link Address"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          size="1"
        />
        <Box
          css={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button size="1" type="submit">
            save
          </Button>
          <Button
            type="button"
            onClick={getPreventDefaultHandler(handleRemove)}
            disabled={isLink}
            variant="outlined"
            color="danger"
            size="1"
          >
            <span>remove link</span>
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
