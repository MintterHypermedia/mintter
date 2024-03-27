import {getLinkMenuItems} from '@/blocknote/core'
import {linkMenuPluginKey} from '@/blocknote/core/extensions/LinkMenu/LinkMenuPlugin'
import {fetchWebLink} from '@mintter/app/models/web-links'
import {AppQueryClient} from '@mintter/app/query-client'
import {client} from '@mintter/desktop/src/trpc'
import {
  GRPCClient,
  StateStream,
  UnpackedHypermediaId,
  createHmId,
  extractBlockRefOfUrl,
  hmIdWithVersion,
  isHypermediaScheme,
  isPublicGatewayLink,
  normlizeHmId,
  unpackHmId,
} from '@mintter/shared'
import {Editor} from '@tiptap/core'
import {Mark, MarkType} from '@tiptap/pm/model'
import {Plugin, PluginKey} from '@tiptap/pm/state'
import {Decoration, DecorationSet} from '@tiptap/pm/view'
import {find} from 'linkifyjs'
import {nanoid} from 'nanoid'

type PasteHandlerOptions = {
  client: AppQueryClient
  grpcClient: GRPCClient
  editor: Editor
  type: MarkType
  linkOnPaste?: boolean
  gwUrl: StateStream<string>
}

export function pasteHandler(options: PasteHandlerOptions): Plugin {
  let pastePlugin = new Plugin({
    key: new PluginKey('handlePasteLink'),
    state: {
      init() {
        return DecorationSet.empty
      },
      apply(tr, set) {
        // Adjust decoration positions to changes made by the transaction
        set = set.map(tr.mapping, tr.doc)
        // See if the transaction adds or removes any placeholders
        let action = tr.getMeta('link-placeholder')
        if (action && action.add) {
          let widget = document.createElement('span')
          widget.contentEditable = 'false'
          widget.classList.add('link-placeholder')
          let deco = Decoration.widget(action.add.pos, widget, {
            link: action.add.link,
          })
          set = set.add(tr.doc, [deco])
        } else if (action && action.remove) {
          set = set.remove(
            set.find(
              // @ts-expect-error
              null,
              null,
              (spec) => spec.link.href == action.remove.link.href,
            ),
          )
        }
        return set
      },
    },
    props: {
      decorations(state) {
        return this.getState(state)
      },
      handlePaste: (view, event, slice) => {
        const {state} = view
        const {selection} = state

        // Do not proceed if in code block.
        if (state.doc.resolve(selection.from).parent.type.spec.code) {
          return false
        }

        const pastedLinkMarks: Mark[] = []
        let textContent = ''

        slice.content.forEach((node) => {
          textContent += node.textContent

          node.marks.forEach((mark) => {
            if (mark.type.name === options.type.name) {
              pastedLinkMarks.push(mark)
            }
          })
        })

        textContent = textContent.trim()

        const hasPastedLink = pastedLinkMarks.length > 0
        const link = find(textContent).find(
          (item) => item.isLink && item.value === textContent,
        )

        const nativeHyperLink =
          isHypermediaScheme(textContent) ||
          isPublicGatewayLink(textContent, options.gwUrl)
            ? normlizeHmId(textContent, options.gwUrl)
            : null

        const unpackedHmId =
          isHypermediaScheme(textContent) ||
          isPublicGatewayLink(textContent, options.gwUrl)
            ? unpackHmId(textContent)
            : null

        if (!selection.empty && options.linkOnPaste) {
          const pastedLink =
            nativeHyperLink ||
            (hasPastedLink ? pastedLinkMarks[0].attrs.href : link?.href || null)
          if (pastedLink) {
            if (nativeHyperLink) {
              options.editor
                .chain()
                .setMark(options.type, {
                  href: pastedLink,
                })
                .run()
            } else {
              let id = nanoid(8)
              options.editor
                .chain()
                .command(({tr}) => {
                  tr.setMeta('hmPlugin:uncheckedLink', id)
                  return true
                })
                .setMark(options.type, {
                  href: pastedLink,
                  id,
                })
                .run()
            }

            return true
          }
        }

        const firstChildIsText = slice.content.firstChild?.type.name === 'text'
        const firstChildContainsLinkMark = slice.content.firstChild?.marks.some(
          (mark) => mark.type.name === options.type.name,
        )

        if (firstChildIsText && firstChildContainsLinkMark) {
          return false
        }

        if (selection.empty && unpackedHmId?.eid && unpackedHmId.type) {
          let tr = view.state.tr
          let pos = tr.selection.from
          const normalizedHmUrl = createHmId(
            unpackedHmId.type,
            unpackedHmId.eid,
            unpackedHmId,
          )
          fetchEntityTitle(unpackedHmId, options.grpcClient)
            .then((title) => {
              if (title) {
                view.dispatch(
                  tr.insertText(title, pos).addMark(
                    pos,
                    pos + title.length,
                    options.editor.schema.mark('link', {
                      href: normalizedHmUrl,
                    }),
                  ),
                )

                view.dispatch(
                  view.state.tr.scrollIntoView().setMeta(linkMenuPluginKey, {
                    activate: true,
                    ref: normalizedHmUrl,
                    items: getLinkMenuItems({
                      isLoading: false,
                      hmId: unpackHmId(normalizedHmUrl),
                      sourceUrl: normalizedHmUrl,
                      docTitle: title,
                      gwUrl: options.gwUrl,
                    }),
                  }),
                )
              } else {
                view.dispatch(
                  tr.insertText(normalizedHmUrl, pos).addMark(
                    pos,
                    pos + normalizedHmUrl.length,
                    options.editor.schema.mark('link', {
                      href: normalizedHmUrl,
                    }),
                  ),
                )

                view.dispatch(
                  view.state.tr.scrollIntoView().setMeta(linkMenuPluginKey, {
                    activate: true,
                    ref: normalizedHmUrl,
                    items: getLinkMenuItems({
                      isLoading: false,
                      sourceUrl: normalizedHmUrl,
                      hmId: unpackHmId(normalizedHmUrl),
                      gwUrl: options.gwUrl,
                    }),
                  }),
                )
              }
            })
            .catch((err) => {
              view.dispatch(
                tr.insertText(normalizedHmUrl, pos).addMark(
                  pos,
                  pos + normalizedHmUrl.length,
                  options.editor.schema.mark('link', {
                    href: normalizedHmUrl,
                  }),
                ),
              )

              view.dispatch(
                view.state.tr.scrollIntoView().setMeta(linkMenuPluginKey, {
                  activate: true,
                  ref: normalizedHmUrl,
                  items: getLinkMenuItems({
                    isLoading: false,
                    sourceUrl: normalizedHmUrl,
                    hmId: unpackHmId(normalizedHmUrl),
                    gwUrl: options.gwUrl,
                  }),
                }),
              )
            })

          return true
        }

        if (link && selection.empty) {
          let tr = view.state.tr
          if (!tr.selection.empty) tr.deleteSelection()

          const [mediaCase, fileName] = checkMediaUrl(link.href)

          const pos = selection.$from.pos

          view.dispatch(
            tr.insertText(link.href, pos).addMark(
              pos,
              pos + link.href.length,
              options.editor.schema.mark('link', {
                href: link.href,
              }),
            ),
          )

          view.dispatch(
            view.state.tr.scrollIntoView().setMeta(linkMenuPluginKey, {
              activate: true,
              ref: link.href,
              items: getLinkMenuItems({
                isLoading: true,
                gwUrl: options.gwUrl,
              }),
            }),
          )

          switch (mediaCase) {
            case 1:
              view.dispatch(
                view.state.tr.setMeta(linkMenuPluginKey, {
                  ref: link.href,
                  items: getLinkMenuItems({
                    isLoading: false,
                    media: 'image',
                    sourceUrl: link.href,
                    fileName: fileName,
                    gwUrl: options.gwUrl,
                  }),
                }),
              )
              break
            case 2:
              view.dispatch(
                view.state.tr.setMeta(linkMenuPluginKey, {
                  ref: link.href,
                  items: getLinkMenuItems({
                    isLoading: false,
                    media: 'file',
                    sourceUrl: link.href,
                    fileName: fileName,
                    gwUrl: options.gwUrl,
                  }),
                }),
              )
              break
            case 3:
              view.dispatch(
                view.state.tr.setMeta(linkMenuPluginKey, {
                  ref: link.href,
                  items: getLinkMenuItems({
                    isLoading: false,
                    media: 'video',
                    sourceUrl: link.href,
                    fileName: fileName,
                    gwUrl: options.gwUrl,
                  }),
                }),
              )
              break
            case 4:
              view.dispatch(
                view.state.tr.setMeta(linkMenuPluginKey, {
                  ref: link.href,
                  items: getLinkMenuItems({
                    isLoading: false,
                    media: 'twitter',
                    sourceUrl: link.href,
                    fileName: fileName,
                    gwUrl: options.gwUrl,
                  }),
                }),
              )
              break
            case 0:
              const embedPromise = fetchWebLink(options.client, link.href)
                .then((res) => {
                  if (res) {
                    const title = res.hmTitle
                    // todo: use res?.hmUrl which may have format of hm://g/ID/PATH?v=G_VERSION.
                    // the embed component does not load this group doc URL correctly
                    const fullHmUrl = hmIdWithVersion(
                      res?.hmId,
                      res?.hmVersion,
                      extractBlockRefOfUrl(link.href),
                    )
                    if (title && fullHmUrl) {
                      view.dispatch(
                        view.state.tr
                          .deleteRange(pos, pos + link.href.length)
                          .insertText(title, pos)
                          .addMark(
                            pos,
                            pos + title.length,
                            options.editor.schema.mark('link', {
                              href: fullHmUrl,
                            }),
                          ),
                      )
                    }
                    if (fullHmUrl) {
                      view.dispatch(
                        view.state.tr.setMeta(linkMenuPluginKey, {
                          ref: fullHmUrl,
                          items: getLinkMenuItems({
                            hmId: unpackHmId(fullHmUrl),
                            isLoading: false,
                            sourceUrl: fullHmUrl,
                            docTitle: res.hmTitle,
                            gwUrl: options.gwUrl,
                          }),
                        }),
                      )
                      return true
                    }
                  }
                })
                .catch((err) => {
                  console.log(err)
                })
              const mediaPromise = client.webImporting.checkWebUrl
                .mutate(link.href)
                .then((response) => {
                  if (response && response.contentType) {
                    let type = response.contentType.split('/')[0]
                    if (type === 'application') type = 'file'
                    if (['image', 'video', 'file'].includes(type)) {
                      view.dispatch(
                        view.state.tr.setMeta(linkMenuPluginKey, {
                          ref: link.href,
                          items: getLinkMenuItems({
                            isLoading: false,
                            media: type,
                            sourceUrl: link.href,
                            gwUrl: options.gwUrl,
                          }),
                        }),
                      )
                      return true
                    }
                  }
                })
                .catch((err) => {
                  console.log(err)
                })
              Promise.all([embedPromise, mediaPromise])
                .then((results) => {
                  const [embedResult, mediaResult] = results
                  if (!embedResult && !mediaResult) {
                    view.dispatch(
                      view.state.tr.setMeta(linkMenuPluginKey, {
                        items: getLinkMenuItems({
                          isLoading: false,
                          sourceUrl: link.href,
                          gwUrl: options.gwUrl,
                        }),
                      }),
                    )
                  }
                })
                .catch((err) => {
                  console.log(err)
                })
            default:
              break
          }

          return true
        }

        const {tr} = state
        let deleteOnly = false

        if (!selection.empty) {
          deleteOnly = true

          tr.delete(selection.from, selection.to)
        }

        let currentPos = selection.from
        let fragmentLinks = []

        slice.content.forEach((node) => {
          fragmentLinks = find(node.textContent)

          tr.insert(currentPos - 1, node)

          if (fragmentLinks.length > 0) {
            deleteOnly = false

            fragmentLinks.forEach((fragmentLink) => {
              const linkStart = currentPos + fragmentLink.start
              const linkEnd = currentPos + fragmentLink.end
              const hasMark = tr.doc.rangeHasMark(
                linkStart,
                linkEnd,
                options.type,
              )

              if (!hasMark) {
                let id = nanoid(8)
                tr.addMark(
                  linkStart,
                  linkEnd,
                  options.type.create({href: fragmentLink.href, id}),
                ).setMeta('hmPlugin:uncheckedLink', id)
              }
            })
          }
          currentPos += node.nodeSize
        })

        const hasFragmentLinks = fragmentLinks.length > 0

        if (tr.docChanged && !deleteOnly && hasFragmentLinks) {
          options.editor.view.dispatch(tr)

          return true
        }

        return false
      },
    },
  })

  function checkMediaUrl(url: string): [number, string] {
    const matchResult = url.match(/[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/)
    if (matchResult) {
      const extensionArray = matchResult[0].split('.')
      const extension = extensionArray[extensionArray.length - 1]
      if (['png', 'jpg', 'jpeg'].includes(extension)) return [1, matchResult[0]]
      else if (['pdf', 'xml', 'csv'].includes(extension))
        return [2, matchResult[0]]
      else if (['mp4', 'webm', 'ogg'].includes(extension))
        return [3, matchResult[0]]
    } else if (
      ['youtu.be', 'youtube', 'vimeo'].some((value) => url.includes(value))
    ) {
      return [3, '']
    } else if (['twitter', 'x.com'].some((value) => url.includes(value))) {
      return [4, '']
    }
    return [0, '']
  }

  return pastePlugin
}

async function fetchEntityTitle(
  hmId: UnpackedHypermediaId,
  grpcClient: GRPCClient,
) {
  if (hmId.type == 'd') {
    const pub = await grpcClient.publications.getPublication({
      documentId: hmId.qid,
      version: hmId.version ? hmId.version : undefined,
    })
    return pub?.document?.title || null
  } else if (hmId.type == 'a') {
    const account = await grpcClient.accounts.getAccount({
      id: hmId.eid,
    })
    return account?.profile?.alias || null
  } else if (hmId.type == 'g') {
    const group = await grpcClient.groups.getGroup({
      id: hmId.qid,
      version: hmId.version ? hmId.version : undefined,
    })
    return group?.title || null
  } else if (hmId.type == 'c') {
    try {
      const comment = await grpcClient.comments.getComment({
        id: hmId.qid,
      })

      if (comment) {
        const account = await grpcClient.accounts.getAccount({
          id: comment.author,
        })

        return `Comment from ${
          account?.profile?.alias ||
          `${account.id.slice(0, 5)}...${account.id.slice(-5)}`
        }`
      } else {
        return null
      }
    } catch (error) {
      console.error(`fetchEntityTitle error: ${JSON.stringify(error)}`)
      return null
    }
  }
  return null
}
