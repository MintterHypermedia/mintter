import {css} from '@app/stitches.config'
import * as Collapsible from '@radix-ui/react-collapsible'
import {PropsWithChildren} from 'react'
import {Box} from '../box'
import {Icon, icons} from '../icon'
import {Text} from '../text'

export function Section({
  title,
  icon,
  children,
  open,
  disabled,
  onOpenChange,
}: PropsWithChildren<Collapsible.CollapsibleProps & {title: string; icon?: keyof typeof icons}>) {
  return (
    <Collapsible.Root open={open} onOpenChange={onOpenChange} disabled={disabled}>
      <Collapsible.Trigger asChild>
        <Box
          css={{
            display: 'flex',
            gap: '$3',
            alignItems: 'center',
            paddingHorizontal: '$3',
            paddingVertical: '$2',
            borderRadius: '$2',

            '&:hover': {
              backgroundColor: '$background-neutral-strong',
              cursor: 'pointer',
            },
            [`&[data-state="open"] [data-arrow]`]: {
              transform: 'rotate(90deg)',
            },
          }}
        >
          <Icon
            data-arrow
            name="ArrowChevronRight"
            size="1"
            css={{
              transition: 'all 0.15s ease-in-out',
            }}
          />
          {icon && <Icon color="primary" name={icon} size="1" />}
          <Text size="2" fontWeight="medium">
            {title}
          </Text>
        </Box>
      </Collapsible.Trigger>
      <Collapsible.Content className={sectionContentStyle()}>{children}</Collapsible.Content>
    </Collapsible.Root>
  )
}

var sectionContentStyle = css({
  paddingLeft: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
})

export function EmptyList() {
  return (
    <Box
      css={{
        marginVertical: '$2',
        padding: '$4',
        backgroundColor: '$background-neutral-soft',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text size="1" color="muted">
        Empty List
      </Text>
    </Box>
  )
}
