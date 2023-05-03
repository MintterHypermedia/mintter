import {Dropdown} from '@app/editor/dropdown'
import {useNavigate, useNavRoute} from '@app/utils/navigation'
import {TitleBarProps} from '@components/titlebar'
import {
  TitlebarWrapper,
  TitlebarRow,
  TitlebarSection,
  Menu,
  XStack,
  Separator,
  SizableText,
  User,
  Draft,
  File,
} from '@mintter/ui'
import {invoke, send} from '@app/ipc'
import {useEffect, useState} from 'react'
import {
  AccountDropdownItem,
  ActionButtons,
  NavigationButtons,
  SitesNavDropdownItems,
} from './common'
import DiscardDraftButton from './discard-draft-button'
import {MintterIcon} from '../mintter-icon'
import {Title} from './title'
import {
  CloseButton,
  MaximizeOrRestoreButton,
  MinimizeButton,
} from './window-controls'

export default function TitleBarLinux(props: TitleBarProps) {
  const [focus, setFocus] = useState(true)

  useEffect(() => {
    const focus = () => setFocus(true)
    const blur = () => setFocus(false)

    window.addEventListener('focus', focus)
    window.addEventListener('blur', blur)

    return () => {
      window.removeEventListener('focus', focus)
      window.removeEventListener('blur', blur)
    }
  }, [])

  // in the clean window we render a stripped down version of the titlebar
  if (props.clean) {
    return (
      <TitlebarWrapper platform="linux" data-tauri-drag-region>
        <TitlebarRow data-tauri-drag-region>
          <TitlebarSection data-tauri-drag-region>
            <MintterIcon />
          </TitlebarSection>
          <TitlebarSection
            flex={1}
            alignItems="flex-end"
            data-tauri-drag-region
          >
            <CloseButton />
          </TitlebarSection>
        </TitlebarRow>
      </TitlebarWrapper>
    )
  }

  return (
    <TitlebarWrapper
      platform="linux"
      data-tauri-drag-region
      data-has-focus={focus}
      paddingLeft={100}
    >
      <TitlebarRow>
        <TitlebarSection data-tauri-drag-region>
          <MintterIcon />
          <NavMenu />
          <NavigationButtons />
          <DiscardDraftButton />
        </TitlebarSection>
        <TitlebarSection flex={1}>
          <Title />
        </TitlebarSection>
        <TitlebarSection data-tauri-drag-region>
          <ActionButtons {...props} />
          <XStack>
            <MinimizeButton />
            <MaximizeOrRestoreButton />
            <CloseButton />
          </XStack>
        </TitlebarSection>
      </TitlebarRow>
    </TitlebarWrapper>
  )
}

function NavMenu() {
  const route = useNavRoute()
  const navigate = useNavigate()
  const editingEnabled = route.key == 'draft'
  const spawn = useNavigate('spawn')
  return (
    <Dropdown.Root>
      <Dropdown.Trigger
        chromeless
        outlineColor="transparent"
        outlineStyle="none"
        icon={Menu}
      />
      <Dropdown.Portal>
        <Dropdown.Content side="bottom" align="start">
          <AccountDropdownItem />
          <Separator />
          <Dropdown.Item
            disabled={route.key == 'home'}
            data-testid="menu-item-inbox"
            onSelect={() => navigate({key: 'home'})}
            icon={File}
            title="All Publications"
            iconAfter={
              <SizableText size="$1" color="$mint5">
                Ctrl+1
              </SizableText>
            }
          />
          <Dropdown.Item
            disabled={route.key == 'drafts'}
            data-testid="menu-item-drafts"
            onSelect={() => navigate({key: 'drafts'})}
            icon={Draft}
            title="Drafts"
            iconAfter={
              <SizableText size="$1" color="$mint5">
                Ctrl+8
              </SizableText>
            }
          />
          <Dropdown.Item
            disabled={route.key == 'connections'}
            onSelect={() => navigate({key: 'connections'})}
            icon={User}
            title="Connections"
            iconAfter={
              <SizableText size="$1" color="$mint5">
                Ctrl+9
              </SizableText>
            }
          />
          <SitesNavDropdownItems />
          <Separator />
          <Dropdown.Item
            onSelect={() => send('open_quick_switcher')}
            title="Quick Switcher"
            iconAfter={
              <SizableText size="$1" color="$mint5">
                Ctrl+K
              </SizableText>
            }
          />

          <Dropdown.Item
            title="New Window"
            iconAfter={
              <SizableText size="$1" color="$mint5">
                Ctrl+N
              </SizableText>
            }
            onSelect={() => spawn({key: 'home'})}
          />

          <MenuItem
            title="Reload"
            accelerator="Ctrl+R"
            onSelect={() => window.location.reload()}
          />

          <Separator />

          {/* <Dropdown.Item
            title="Find..."
            iconAfter={
              <SizableText size="$1" color="$mint5">
                Ctrl+F
              </SizableText>
            }
            onSelect={() => send('open_find')}
          /> */}

          <Dropdown.Sub>
            <Dropdown.SubTrigger disabled={!editingEnabled}>
              Format
            </Dropdown.SubTrigger>
            <Dropdown.SubContent>
              <MenuItem
                title="Strong"
                accelerator="Ctrl+B"
                onSelect={() => send('format_mark', 'strong')}
                disabled={!editingEnabled}
              />
              <MenuItem
                title="Emphasis"
                accelerator="Ctrl+I"
                onSelect={() => send('format_mark', 'emphasis')}
                disabled={!editingEnabled}
              />
              <MenuItem
                title="Code"
                accelerator="Ctrl+E"
                onSelect={() => send('format_mark', 'code')}
                disabled={!editingEnabled}
              />
              <MenuItem
                title="Underline"
                accelerator="Ctrl+U"
                onSelect={() => send('format_mark', 'underline')}
                disabled={!editingEnabled}
              />
              <MenuItem
                title="Strikethrough"
                onSelect={() => send('format_mark', 'strikethrough')}
                disabled={!editingEnabled}
              />
              <MenuItem
                title="Subscript"
                onSelect={() => send('format_mark', 'subscript')}
                disabled={!editingEnabled}
              />
              <MenuItem
                title="Superscript"
                onSelect={() => send('format_mark', 'superscript')}
                disabled={!editingEnabled}
              />

              <Separator />

              <MenuItem
                title="Heading"
                accelerator="Ctrl+Shift+H"
                onSelect={() => send('format_block', 'heading')}
                disabled={!editingEnabled}
              />
              <MenuItem
                title="Statement"
                accelerator="Ctrl+Shif+S"
                onSelect={() => send('format_block', 'statement')}
                disabled={!editingEnabled}
              />
              <MenuItem
                title="Blockquote"
                accelerator="Ctrl+Shift+Q"
                onSelect={() => send('format_block', 'blockquote')}
                disabled={!editingEnabled}
              />
              <MenuItem
                title="Code Block"
                accelerator="Ctrl+Shift+E"
                onSelect={() => send('format_block', 'codeblock')}
                disabled={!editingEnabled}
              />

              <Separator />

              <MenuItem
                title="Bullet List"
                accelerator="Ctrl+Shift+7"
                onSelect={() => send('format_list', 'unordered_list')}
                disabled={!editingEnabled}
              />
              <MenuItem
                title="Numbered List"
                accelerator="Ctrl+Shift+8"
                onSelect={() => send('format_list', 'ordered_list')}
                disabled={!editingEnabled}
              />
              <MenuItem
                title="Plain List"
                accelerator="Ctrl+Shift+9"
                onSelect={() => send('format_list', 'group')}
                disabled={!editingEnabled}
              />
            </Dropdown.SubContent>
          </Dropdown.Sub>

          <Separator />

          <MenuItem
            title="Preferences"
            accelerator="Ctrl+,"
            onSelect={() => invoke('open_preferences')}
          />

          <MenuItem
            title="Documentation"
            onSelect={() => invoke('open_documentation')}
          />
          <MenuItem
            title="Release Notes"
            onSelect={() => invoke('open_release_notes')}
          />
          <MenuItem
            title="Acknowledgements"
            onSelect={() => invoke('open_acknowledgements')}
          />
          <MenuItem
            title="About Mintter"
            onSelect={() => invoke('open_about')}
          />
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  )
}

export interface MenuItemProps {
  title: string
  accelerator?: string
  disabled?: boolean
  onSelect: () => void
  icon?: any
}

function MenuItem({accelerator, ...props}: MenuItemProps) {
  useEffect(() => {
    if (accelerator) {
      const keys = accelerator.split('+')

      window.addEventListener('keyup', (e) => {
        if (
          keys.every((k) => {
            if (k == 'Alt') return e.altKey
            if (k == 'Shift') return e.shiftKey
            if (k == 'Ctrl') return e.ctrlKey
            k == e.key
          })
        ) {
          console.log(`triggered acc ${accelerator}!`)
        }
      })
    }
  }, [accelerator])

  return (
    <Dropdown.Item
      iconAfter={
        accelerator ? (
          <SizableText size="$1" color="$mint5">
            {accelerator}
          </SizableText>
        ) : undefined
      }
      {...props}
    />
  )
}
