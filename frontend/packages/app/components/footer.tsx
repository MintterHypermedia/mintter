import {useConnectionSummary} from '@mintter/app/models/contacts'
import {useDaemonReady} from '@mintter/app/node-status-context'
import {useNavRoute} from '@mintter/app/utils/navigation'
import {useNavigate} from '@mintter/app/utils/useNavigate'
import {APP_VERSION} from '@mintter/shared'
import {
  Button,
  ButtonProps,
  Clock,
  FooterWrapper,
  SizableText,
  User,
  XStack,
} from '@mintter/ui'
import {ReactNode} from 'react'
import {OnlineIndicator} from './indicator'

export function FooterButton({
  active,
  label,
  icon,
  onPress,
}: {
  active?: boolean
  label: string
  icon?: ButtonProps['icon']
  onPress: () => void
}) {
  return (
    <Button
      size="$1"
      chromeless={!active}
      onPress={onPress}
      theme={active ? 'blue' : undefined}
      icon={icon}
      paddingHorizontal="$2"
    >
      {label}
    </Button>
  )
}

function FooterContactsButton() {
  const route = useNavRoute()
  const navigate = useNavigate()
  const summary = useConnectionSummary()
  return (
    <XStack alignItems="center" theme="mint" gap="$2">
      <Button
        size="$1"
        chromeless={route.key != 'contacts'}
        color={route.key == 'contacts' ? '$blue10' : undefined}
        onPress={() => {
          navigate({key: 'contacts'})
        }}
        paddingHorizontal="$2"
      >
        <OnlineIndicator online={summary.online} />
        <User size={12} />
        <SizableText size="$1" color="$color">
          {summary.connectedCount}
        </SizableText>
      </Button>
    </XStack>
  )
}

export default function Footer({children}: {children?: ReactNode}) {
  let isDaemonReady = useDaemonReady()

  return (
    <FooterWrapper>
      {!isDaemonReady ? (
        <XStack alignItems="center" gap="$2" paddingHorizontal="$3">
          <Clock size={10} />
          <SizableText size="$1" userSelect="none">
            Initializing node...
          </SizableText>
        </XStack>
      ) : null}
      <FooterContactsButton />
      <XStack alignItems="center" paddingHorizontal="$2">
        <SizableText
          fontSize={10}
          userSelect="none"
          hoverStyle={{
            cursor: 'default',
          }}
          color="$color8"
        >
          {`Mintter Alpha (${APP_VERSION})`}
          {/* To do: include release date of this version. when this is clicked, we should help the user upgrade  */}
        </SizableText>
      </XStack>

      <XStack flex={1} alignItems="center" justifyContent="flex-end" gap="$1">
        {children}
      </XStack>
    </FooterWrapper>
  )
}
