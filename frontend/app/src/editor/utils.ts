import {
  createId,
  FlowContent,
  group,
  GroupingContent,
  image,
  isFlowContent,
  isGroup,
  isGroupContent,
  isHeading,
  isStatement,
  isText,
  ol,
  paragraph,
  Statement,
  statement,
  text,
  ul,
  video,
} from '@mintter/mttast'
import {Mark} from '@mintter/mttast/types'
import {ObjectKeys} from '@app/utils/object-keys'
import {useRoute} from '@components/router'
import videoParser from 'js-video-url-parser'
import {useEffect, useMemo, useState} from 'react'
import type {Ancestor, Descendant, NodeEntry, Point, Span} from 'slate'
import {Editor, Node, Path, Range, Text, Transforms} from 'slate'
import {ReactEditor} from 'slate-react'
import {MintterEditor} from './mintter-changes/plugin'
import {ELEMENT_PARAGRAPH} from './paragraph'

export const isCollapsed = (range: Range | null): boolean =>
  !!range && Range.isCollapsed(range)

export interface UnhangRangeOptions {
  at?: Range | Path | Point | Span
  voids?: boolean
  unhang?: boolean
}
/**
 * unhangRange:
 *
 * sometimes selections starts at the very start or end of other nodes.
 * this causes some troubles when transforming nodes.
 * `unhangRange` removes the remaining selection portion of a node in the selection.
 *
 * "Generally speaking, when the hanging option is false, the range will be trimmed so it doesn’t hang over a node boundary".
 * 
 * so if you have (in slate-hyperscript syntax):
 
* ```
 * <editor>
 *  <block>
 *    <anchor/>
 *    foo
 *  </block>
 *  <block>
 *    <focus/>
 *    bar
 *  </block>
 * </editor>
 * ```
 *
 * and you unhang the selection, you get
 *
 * ```
 * <editor>
 *  <block>
 *    <anchor/>
 *    foo
 *    <focus/>
 *  </block>
 *  <block>
 *    bar
 *  </block>
 * </editor>
 * ```
 *
 * so the selection isn’t hanging into the second block.
 *
 * */
export function unhangRange(editor: Editor, options: UnhangRangeOptions = {}) {
  const {at = editor.selection, voids, unhang = true} = options

  if (Range.isRange(at) && unhang) {
    options.at = Editor.unhangRange(editor, at, {voids})
  }
}

/**
 *
 * @param entry NodeEntry<Ancestor>
 * @returns Path
 *
 * This is important when normalizing groups if they are the last child of a node or not. that way we can do the appropiate transformations
 */
export function getLastChildPath(entry: NodeEntry<Ancestor>): Path {
  const lastChild = getLastChild(entry)
  if (!lastChild) return entry[1].concat([-1])

  return lastChild[1]
}

/**
 *
 * @param entry NodeEntry<Ancestor>
 * @returns NodeEntry<Descendant>
 *
 * we need to check the type of the last child of a statement to know where to move the new statement created.
 */
export function getLastChild(
  entry: NodeEntry<Ancestor>,
): NodeEntry<Descendant> | null {
  const [node, path] = entry

  if (!node.children.length) return null
  return [
    node.children[node.children.length - 1],
    path.concat([node.children.length - 1]),
  ]
}

/**
 *
 * @param parentEntry
 * @param childPath
 * @returns boolean
 *
 * before we check the last child type, we need to make sure the current statement path is not the last child. that way we are certain that the last child should be a group.
 */
export function isLastChild(
  parentEntry: NodeEntry<Ancestor>,
  childPath: Path,
): boolean {
  const lastChildPath = getLastChildPath(parentEntry)

  return Path.equals(lastChildPath, childPath)
}

export function isFirstChild(path: Path): boolean {
  return path[path.length - 1] == 0
}

export function toggleFormat(
  editor: Editor,
  format: Mark,
  data: unknown = true,
) {
  if (editor.readOnly) return
  const isActive = isFormatActive(editor, format)

  Transforms.setNodes(
    editor,
    {[format]: isActive ? null : data},
    {match: Text.isText, split: true, mode: 'highest'},
  )
}

export function isFormatActive(editor: Editor, format: Mark) {
  const [match] = Editor.nodes(editor, {
    match: (n) => isText(n) && !!n[format],
    mode: 'all',
  })

  return !!match
}

export function resetFlowContent(editor: Editor): boolean | undefined {
  const {selection} = editor
  if (selection && isCollapsed(selection)) {
    const block = Editor.above<Statement>(editor, {
      match: (n) => isFlowContent(n) && !isStatement(n),
    })

    if (block) {
      const [node, path] = block

      if (!Node.string(node.children[0])) {
        Editor.withoutNormalizing(editor, () => {
          Transforms.insertNodes(
            editor,
            statement({id: node.id}, node.children),
            {
              at: Path.next(path),
            },
          )
          Transforms.removeNodes(editor, {at: path})
          Transforms.select(editor, path.concat(0))
        })
        return true
      }
    }
    return false
  }
}

export function resetGroupingContent(editor: Editor): boolean {
  // const {selection} = editor
  // if (selection && isCollapsed(selection)) {
  const list = Editor.above<GroupingContent>(editor, {
    match: (n) => isGroupContent(n) && !isGroup(n),
  })

  if (list) {
    const [listNode, listPath] = list
    if (listNode.children.length == 1 && !Node.string(listNode)) {
      if (isGroup(listNode)) {
        // remove the list if the type os the default one (group)
        Editor.withoutNormalizing(editor, () => {
          Transforms.insertNodes(
            editor,
            statement({id: createId()}, [paragraph([text('')])]),
            {
              at: listPath,
            },
          )
          Transforms.removeNodes(editor, {at: Path.next(listPath)})

          Transforms.select(editor, listPath.concat(0))
        })
      } else {
        // reset the group type for the empty list
        Editor.withoutNormalizing(editor, () => {
          Transforms.insertNodes(
            editor,
            group([statement([paragraph([text('')])])]),
            {
              at: listPath,
            },
          )
          Transforms.removeNodes(editor, {at: Path.next(listPath)})
          Transforms.select(editor, [...listPath, 0, 0])
        })
      }

      return true
    }
  }
  // }
  return false
}

export function findPath(node: Node): Path {
  // `ReactEditor.findPath` does not use the editor param for anything. it's there because of API consistency reasons I guess? 🤷🏼‍♂️
  // @ts-ignore
  return ReactEditor.findPath(null, node)
}

type GetBlockOptions = Omit<
  Parameters<typeof Editor.nodes>[1] & {
    id?: string
  },
  'match'
>

// TODO: there's a copy of this function inside the client package (frontend/client/src/v2/change-creators.ts)
export function getEditorBlock(
  editor: Editor,
  options: GetBlockOptions,
): NodeEntry<FlowContent> | undefined {
  let [match] = Editor.nodes<FlowContent>(editor, {
    ...options,
    reverse: true,
    mode: 'lowest',
    match: (n) => matcher(n, options.id),
    at: options.at ?? [],
  })

  return match

  function matcher(n: Node, id?: FlowContent['id']): boolean {
    if (id) {
      return isFlowContent(n) && n.id == id
    } else {
      return isFlowContent(n)
    }
  }
}

export function isValidUrl(url: string): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    try {
      let imageUrl = new URL(url)
      resolve(imageUrl.toString())
    } catch (e) {
      reject(`IMAGE: Error: Invalid Image Url: ${url}`)
    }
  })
}

export type EmbedUrlData = {
  url?: string
  provider?: 'youtube' | 'vimeo'
  id?: string
}

export const parseEmbedUrl = (url: string): EmbedUrlData => {
  // const twitterData = parseTwitterUrl(url)
  // if (twitterData) return twitterData

  const videoData = parseVideoUrl(url)
  if (videoData) return videoData

  return {}
}

const YOUTUBE_PREFIX = 'https://www.youtube.com/embed/'
const VIMEO_PREFIX = 'https://player.vimeo.com/video/'
// const DAILYMOTION_PREFIX = 'https://www.dailymotion.com/embed/video/';
// const YOUKU_PREFIX = 'https://player.youku.com/embed/';
// const COUB_PREFIX = 'https://coub.com/embed/';

export const parseVideoUrl = (url: string) => {
  const videoData = videoParser.parse(url)
  if (videoData?.provider && videoData.id) {
    const {id, provider} = videoData

    const providerUrls: Record<string, string> = {
      youtube: `${YOUTUBE_PREFIX}${id}`,
      vimeo: `${VIMEO_PREFIX}${id}`,
      // dailymotion: `${DAILYMOTION_PREFIX}${id}`,
      // youku: `${YOUKU_PREFIX}${id}`,
      // coub: `${COUB_PREFIX}${id}`,
    }

    return {
      id,
      provider,
      url: providerUrls[provider],
    } as EmbedUrlData
  }
}

export function useParentGroup(editor: Editor, path: Path) {
  return useMemo(() => {
    const entry = Editor.above(editor, {
      at: path,
      match: isGroupContent,
    })

    if (entry) {
      return entry[0].type || 'group'
    }
  }, [path, editor])
}

export function lowerPoint(root: Node, point: Point): Point | null {
  let offset = 0
  for (const [text, path] of Node.texts(root)) {
    if (offset <= point.offset && point.offset <= offset + text.value.length) {
      return {path: [...point.path, ...path], offset: point.offset - offset}
    }

    offset += text.value.length
  }

  return null
}

// eslint-disable-next-line
export function setType(fn: any) {
  return function setToStatementType(
    editor: Editor,
    opts: {
      element: FlowContent
      at: Path
    },
  ) {
    if (editor.readOnly) return
    Editor.withoutNormalizing(editor, function () {
      MintterEditor.addChange(editor, ['replaceBlock', opts.element.id])
      const keys = ObjectKeys(opts.element).filter(
        (key) => !['type', 'id', 'children', 'data'].includes(key as string),
      )

      if (isHeading(opts.element)) {
        Transforms.setNodes(
          editor,
          {type: ELEMENT_PARAGRAPH},
          {at: [...opts.at, 0]},
        )
      }

      if (keys.length) {
        Transforms.unsetNodes(editor, keys, {at: opts.at})
      }

      // IDs are meant to be stable, so we shouldn't obverride it
      // eslint-disable-next-line
      const {id, ...props} = fn()

      Transforms.setNodes(editor, props, {at: opts.at})
    })
  }
}

export function setList(fn: typeof ol | typeof ul | typeof group) {
  return function wrapWithListType(
    editor: Editor,
    opts: {element: FlowContent; at: Path},
  ) {
    if (editor.readOnly) return
    Editor.withoutNormalizing(editor, () => {
      const list = Node.parent(editor, opts.at)

      if (list && isGroupContent(list)) {
        let newList = fn([])
        Transforms.setNodes(
          editor,
          {type: newList.type},
          {at: Path.parent(opts.at)},
        )

        if (opts.at.length > 2) {
          let parentBlockEntry = Editor.above(editor, {
            match: isFlowContent,
            at: opts.at,
          })
          if (parentBlockEntry) {
            let [block] = parentBlockEntry
            MintterEditor.addChange(editor, ['replaceBlock', block.id])
          }
        }
      }
    })
  }
}

export function toggleList(fn: typeof ol | typeof ul) {
  return function wrapWithListType(editor: Editor, at: Path) {
    Editor.withoutNormalizing(editor, () => {
      const list = Node.parent(editor, at)

      const newList = fn([])

      if (isGroupContent(list)) {
        if (list.type === newList.type) {
          // reset type to group
          Transforms.setNodes(editor, {type: 'group'}, {at: Path.parent(at)})
        } else {
          // set type
          Transforms.setNodes(
            editor,
            {type: newList.type},
            {at: Path.parent(at)},
          )
        }

        if (at.length > 2) {
          let parentBlockEntry = Editor.above(editor, {
            match: isFlowContent,
            at,
          })
          if (parentBlockEntry) {
            let [block] = parentBlockEntry
            MintterEditor.addChange(editor, ['replaceBlock', block.id])
          }
        }
      }
    })
  }
}

export function insertInline(fn: typeof image | typeof video) {
  return function insertInlineElement(
    editor: Editor,
    opts: {
      element: FlowContent
      at: Path
    },
  ) {
    let {element, at} = opts
    MintterEditor.addChange(editor, ['replaceBlock', element.id])
    Transforms.insertNodes(editor, fn({url: ''}, [text('')]), {
      // TODO: maybe this needs to insert at selection position? now I guess is creating a new image on top of the current block
      at,
    })
  }
}

// eslint-disable-next-line
export function useBlockFlash(ref: any, id: string) {
  let [active, setActive] = useState(false)
  let [match, params] = useRoute('/p/:id/:version/:block')

  useEffect(() => {
    setTimeout(() => {
      if (ref.current) {
        if (match && params?.block == id) {
          console.log('done')
          setActive(true)
        }
      }
    }, 100)
  }, [id, match, params, ref])

  return active
}
