import {
  BlockNoteView,
  FormattingToolbarPositioner,
  HyperlinkToolbarPositioner,
  LinkMenuPositioner,
  SideMenuPositioner,
  SlashMenuPositioner,
} from '@shm/desktop/src/editor/blocknote'
import '@shm/desktop/src/editor/blocknote/core/style.css'
import '@shm/desktop/src/editor/editor.css'
import { HMFormattingToolbar } from '@shm/desktop/src/editor/hm-formatting-toolbar'
import { HypermediaLinkToolbar } from '@shm/desktop/src/editor/hyperlink-toolbar'
import { HyperDocsEditor } from '@shm/desktop/src/models/documents'
import { useOpenUrl } from '@shm/desktop/src/open-url'
import { YStack } from '@shm/ui'

export function HyperMediaEditorView({
  editor,
}: {
  editor: HyperDocsEditor
  editable: boolean
}) {
  const openUrl = useOpenUrl()
  return (
    <BlockNoteView editor={editor}>
      <FormattingToolbarPositioner
        editor={editor}
        formattingToolbar={HMFormattingToolbar}
      />
      <HyperlinkToolbarPositioner
        hyperlinkToolbar={HypermediaLinkToolbar}
        editor={editor}
        openUrl={openUrl}
      />
      <SlashMenuPositioner editor={editor} />
      <SideMenuPositioner editor={editor} placement="left" />
      <LinkMenuPositioner editor={editor} />
    </BlockNoteView>
  )
}

export function HMEditorContainer({ children }: { children: React.ReactNode }) {
  return (
    <YStack
      className="editor"
      onPress={(e) => {
        e.stopPropagation()
      }}
    >
      {children}
    </YStack>
  )
}
