import {isHyperdocsScheme} from '@mintter/shared'
import {Mark, mergeAttributes} from '@tiptap/core'
import {Plugin} from '@tiptap/pm/state'
import {registerCustomProtocol, reset} from 'linkifyjs'

import {autolink} from './helpers/autolink'
import {clickHandler} from './helpers/clickHandler'
import {pasteHandler} from './helpers/pasteHandler'
import {AppQueryClient} from '@mintter/app/src/query-client'

export interface LinkProtocolOptions {
  scheme: string
  optionalSlashes?: boolean
}

export interface LinkOptions {
  /**
   * If enabled, it adds links as you type.
   */
  autolink: boolean
  /**
   * An array of custom protocols to be registered with linkifyjs.
   */
  protocols: Array<LinkProtocolOptions | string>
  /**
   * If enabled, links will be opened on click.
   */
  openOnClick: boolean
  /**
   * Adds a link to the current selection if the pasted content only contains an url.
   */
  linkOnPaste: boolean
  /**
   * A list of HTML attributes to be rendered.
   */
  HTMLAttributes: Record<string, any>
  /**
   * A validation function that modifies link verification for the auto linker.
   * @param url - The url to be validated.
   * @returns - True if the url is valid, false otherwise.
   */
  validate?: (url: string) => boolean
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    link: {
      /**
       * Set a link mark
       */
      setLink: (attributes: {
        href: string
        target?: string | null
      }) => ReturnType
      /**
       * Toggle a link mark
       */
      toggleLink: (attributes: {
        href: string
        target?: string | null
      }) => ReturnType
      /**
       * Unset a link mark
       */
      unsetLink: () => ReturnType
    }
  }
}

export const Link = Mark.create<LinkOptions>({
  name: 'link',

  priority: 1000,

  keepOnSplit: false,

  onCreate() {
    this.options.protocols.forEach((protocol) => {
      if (typeof protocol === 'string') {
        registerCustomProtocol(protocol)
        return
      }
      registerCustomProtocol(protocol.scheme, protocol.optionalSlashes)
    })
  },

  onDestroy() {
    reset()
  },

  // inclusive() {
  //   return this.options.autolink
  // },

  inclusive: false,

  addOptions() {
    return {
      openOnClick: true,
      linkOnPaste: true,
      autolink: true,
      protocols: [],
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer nofollow',
        class: 'link',
      },
      validate: undefined,
    }
  },

  addAttributes() {
    return {
      href: {
        default: null,
      },
      target: {
        default: this.options.HTMLAttributes.target,
      },
      class: {
        default: this.options.HTMLAttributes.class,
      },
      id: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [{tag: 'a[href]:not([href *= "javascript:" i])'}]
  },

  renderHTML({HTMLAttributes, mark}) {
    const attrs = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)
    const isHD = isHyperdocsScheme(HTMLAttributes.href)
    return [
      'span',
      {
        ...attrs,
        class: `${attrs.class} ${isHD ? 'hd-link' : ''}`,
      },
      0,
    ]
  },

  addCommands() {
    return {
      setLink:
        (attributes) =>
        ({chain}) => {
          return chain()
            .setMark(this.name, attributes)
            .setMeta('preventAutolink', true)
            .run()
        },

      toggleLink:
        (attributes) =>
        ({chain}) => {
          return chain()
            .toggleMark(this.name, attributes, {extendEmptyMarkRange: true})
            .setMeta('preventAutolink', true)
            .run()
        },

      unsetLink:
        () =>
        ({chain}) => {
          return chain()
            .unsetMark(this.name, {extendEmptyMarkRange: true})
            .setMeta('preventAutolink', true)
            .run()
        },
    }
  },

  addProseMirrorPlugins() {
    const plugins: Plugin[] = []

    if (this.options.autolink) {
      plugins.push(
        autolink({
          type: this.type,
          validate: this.options.validate,
        }),
      )
    }

    if (this.options.openOnClick) {
      plugins.push(
        clickHandler({
          openUrl: (this.options as any).openUrl,
          type: this.type,
        }),
      )
    }
    plugins.push(
      pasteHandler({
        client: (this.options as any).queryClient,
        editor: this.editor,
        type: this.type,
        linkOnPaste: this.options.linkOnPaste,
      }),
    )

    return plugins
  },
})
