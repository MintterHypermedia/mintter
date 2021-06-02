import { Box } from '@mintter/ui/box';
import type { SPRenderElementProps } from '@udecode/slate-plugins-core';
import { useEffect, useMemo } from 'react';
import { Link } from '@components/link';
import { MINTTER_LINK_PREFIX } from '.';
import { Tooltip } from '@components/tooltip';
import { Icon } from '@mintter/ui/icon';
import type { SlateLink } from '../types';

export function LinkElement(props: SPRenderElementProps<SlateLink>) {
  const isMintterLink = useMemo<boolean>(
    () => props.element.url.startsWith(MINTTER_LINK_PREFIX),
    [props.element.url],
  );

  return isMintterLink ? (
    <MintterLink {...props} />
  ) : (
    <ExternalLink {...props} />
  );
}
// TODO: add tooltip
function MintterLink({
  element,
  attributes,
  children,
  ...props
}: SPRenderElementProps<SlateLink>) {
  return (
    <Tooltip
      content={
        <Box css={{ maxWidth: '400px', wordBreak: 'break-all' }}>
          {element.url}
        </Box>
      }
    >
      <Box
        {...attributes}
        //@ts-ignore
        as={Link}
        to={element.url} // something is adding `type="button"` here and is braking the styles
        css={{
          appearance: 'unset',
          textDecoration: 'underline',
          wordBreak: 'break-all',
          color: '$text-default',
          '&:hover': {
            cursor: 'pointer',
          },
        }}
      >
        {children}
      </Box>
    </Tooltip>
  );
}

// TODO: add tooltip
function ExternalLink({
  element,
  attributes,
  children,
  ...props
}: SPRenderElementProps<SlateLink>) {
  return (
    <Tooltip
      content={
        <Box
          css={{
            display: 'flex',
            alignItems: 'center',
            gap: '$2',
          }}
        >
          <Icon name="ExternalLink" color="opposite" size="1" />
          {element.url}
        </Box>
      }
    >
      <Box
        as="a"
        {...attributes}
        onClick={() => window.open(element.url as string, '_blank')}
        href={element.url as string}
        css={{
          textDecoration: 'underline',
          display: 'inline',
          color: '$text-default',
          width: 'auto',
          wordBreak: 'break-all',
          '&:hover': {
            cursor: 'pointer',
          },
        }}
      >
        {children}
      </Box>
    </Tooltip>
  );
}
