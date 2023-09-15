import React from 'react'
import {SizableText, Tooltip as TTooltop} from 'tamagui'

export function Tooltip({
  children,
  content,
}: {
  children: React.ReactNode
  content: string | React.ReactElement
}) {
  return (
    <TTooltop>
      <TTooltop.Trigger>{children}</TTooltop.Trigger>
      <TTooltop.Content
        enterStyle={{x: 0, y: -5, opacity: 0, scale: 0.9}}
        exitStyle={{x: 0, y: -5, opacity: 0, scale: 0.9}}
        scale={1}
        x={0}
        y={0}
        opacity={1}
        paddingVertical="$1"
        paddingHorizontal="$2"
        animation={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <TTooltop.Arrow />
        <SizableText size="$1" margin={0} padding={0} lineHeight="$1">
          {content}
        </SizableText>
      </TTooltop.Content>
    </TTooltop>
  )
}
