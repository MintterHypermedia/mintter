import {Timestamp} from '@bufbuild/protobuf'
import {formattedDate, formattedDateLong} from '@mintter/shared'
import {Button, ButtonProps, ButtonText, Link, Tooltip} from '@mintter/ui'
import {ReactElement} from 'react'
import {copyUrlToClipboardWithFeedback} from '../copy-to-clipboard'
import {MenuItemType, OptionsDropdown} from './options-dropdown'
import {GestureResponderEvent} from 'react-native'

export function ListItem({
  accessory,
  title,
  onPress,
  onPointerEnter,
  menuItems = [],
}: {
  accessory: ReactElement
  title: string
  onPress: ButtonProps['onPress']
  onPointerEnter?: () => void
  menuItems?: (MenuItemType | null)[]
}) {
  // const [isHovering, setIsHovering] = useState(false)

  return (
    <>
      <Button
        onPointerEnter={onPointerEnter}
        // onPointerLeave={() => setIsHovering(false)}
        chromeless
        onPress={onPress}
        group="item"
      >
        <ButtonText
          onPress={onPress}
          fontWeight="700"
          flex={1}
          textAlign="left"
        >
          {title}
        </ButtonText>
        {accessory}
        <OptionsDropdown hiddenUntilItemHover menuItems={menuItems} />
      </Button>
    </>
  )
}

export function copyLinkMenuItem(
  url: string | undefined | null,
  label: string,
): MenuItemType | null {
  if (!url) return null
  return {
    onPress: () => url && copyUrlToClipboardWithFeedback(url, label),
    key: 'copy-link',
    label: `Copy Link to ${label}`,
    icon: Link,
  }
}

export function TimeAccessory({
  time,
  onPress,
}: {
  time: Timestamp | undefined
  onPress: (e: GestureResponderEvent) => void
}) {
  return (
    <Tooltip content={formattedDateLong(time)}>
      <ButtonText
        fontFamily="$body"
        fontSize="$2"
        data-testid="list-item-date"
        minWidth="10ch"
        textAlign="right"
        onPress={onPress}
      >
        {time ? formattedDate(time) : '...'}
      </ButtonText>
    </Tooltip>
  )
}
