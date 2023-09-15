import {
  Annotation,
  Block as ServerBlock,
  ColorAnnotation,
  InlineEmbedAnnotation,
} from '@mintter/shared'
import {
  Block as EditorBlock,
  InlineContent,
  Styles,
  hmBlockSchema,
} from '@mintter/editor'

import {TextAnnotation} from '@mintter/shared'

function styleMarkToAnnotationType(
  style: keyof Styles,
): Exclude<TextAnnotation, InlineEmbedAnnotation | ColorAnnotation>['type'] {
  if (style === 'bold') return 'strong'
  if (style === 'italic') return 'emphasis'
  if (style === 'underline') return 'underline'
  if (style === 'strike') return 'strike'
  if (style === 'code') return 'code'
  throw new Error('Cannot handle this style yet')
}

export function extractContent(content: InlineContent[]): {
  annotations: TextAnnotation[]
  text: string
} {
  let text = ''
  const annotations: TextAnnotation[] = []
  const styleStarts: Record<string, number> = {}
  let charIndex = 0

  content.forEach((inline) => {
    if (inline.type === 'link') {
      const linkContent = extractContent(inline.content)
      const linkLength = linkContent.text.length
      text += linkContent.text
      linkContent.annotations.forEach((annotation) => {
        annotations.push({
          ...annotation,
          starts: annotation.starts.map((start) => start + charIndex),
          ends: annotation.ends.map((end) => end + charIndex),
        })
      })
      annotations.push({
        type: 'link',
        starts: [charIndex],
        ends: [charIndex + linkLength],
        ref: inline.href,
      })
      charIndex += linkLength
    } else {
      // if (inline.type == 'embed') {
      //   const inlineLength = 1
      //   annotations.push({
      //     type: 'embed',
      //     ref: inline.ref,
      //     starts: [charIndex],
      //     ends: [charIndex + inlineLength],
      //     attributes: {},
      //   })

      //   text += ' '
      //   charIndex++
      // } else {
      const {styles} = inline
      const inlineLength = inline.text.length

      // Check for style starts
      for (const style in styles) {
        if (styles[style as keyof Styles] && styleStarts[style] === undefined) {
          styleStarts[style] = charIndex
        }
      }

      // Check for style ends
      for (const style in styleStarts) {
        if (
          !styles[style as keyof Styles] &&
          styleStarts[style] !== undefined
        ) {
          // @ts-expect-error
          annotations.push({
            type: styleMarkToAnnotationType(style as keyof Styles),
            starts: [styleStarts[style]],
            ends: [charIndex],
          })
          delete styleStarts[style]
        }
      }

      text += inline.text
      charIndex += inlineLength
      // }
    }
  })

  // Check for any styles that didn't end
  for (const style in styleStarts) {
    if (styleStarts[style] !== undefined) {
      // @ts-expect-error
      annotations.push({
        type: styleMarkToAnnotationType(style as keyof Styles),
        starts: [styleStarts[style]],
        ends: [charIndex],
      })
    }
  }

  return {text, annotations}
}

export function editorBlockToServerBlock(
  editorBlock: EditorBlock<typeof hmBlockSchema>,
): ServerBlock {
  if (!editorBlock.id) throw new Error('this block has no id')

  let res: ServerBlock | null = null

  if (editorBlock.type === 'paragraph') {
    res = new ServerBlock({
      id: editorBlock.id,
      type: 'paragraph',
      attributes: {
        type: editorBlock.props.type,
      },
      ...extractContent(editorBlock.content),
    })
  }

  if (editorBlock.type === 'heading') {
    res = new ServerBlock({
      id: editorBlock.id,
      type: 'heading',
      attributes: {},
      ...extractContent(editorBlock.content),
    })
  }

  if (editorBlock.type === 'image') {
    res = new ServerBlock({
      id: editorBlock.id,
      type: 'image',
      attributes: {
        name: editorBlock.props.name,
      },
      ref: `ipfs://${editorBlock.props.url}`, // currently the url is always an ipfs url
      ...extractContent(editorBlock.content),
    })
  }

  if (editorBlock.type === 'file') {
    res = new ServerBlock({
      id: editorBlock.id,
      type: 'file',
      attributes: {
        name: editorBlock.props.name,
        size: editorBlock.props.size,
      },
      ref: `ipfs://${editorBlock.props.url}`,
    })
  }

  if (editorBlock.type == 'video') {
    res = new ServerBlock({
      id: editorBlock.id,
      type: 'video',
      attributes: {
        name: editorBlock.props.name,
      },
      ref: `ipfs://${editorBlock.props.url}`,
    })
  }

  if (editorBlock.type == 'embed') {
    res = new ServerBlock({
      id: editorBlock.id,
      type: 'embed',
      ref: editorBlock.props.ref,
      text: '',
      annotations: [],
      attributes: {},
    })
  }

  if (res) {
    res = extractChildrenType(res, editorBlock)
    return res
  }

  throw new Error('not implemented')
}

function extractChildrenType(
  block: ServerBlock,
  editorBlock: EditorBlock<typeof hmBlockSchema>,
): ServerBlock {
  if (editorBlock.props.childrenType) {
    block.attributes.childrenType = editorBlock.props.childrenType
  }

  if (editorBlock.props.start) {
    block.attributes.start = editorBlock.props.start
  }

  return block
}
