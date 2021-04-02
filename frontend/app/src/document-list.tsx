import * as React from 'react';
// import {Icons} from 'components/icons'
import { useLocation, useRouteMatch } from 'react-router-dom';
import { Link } from './link';
import { useAuthor } from '@mintter/hooks';
import { format } from 'date-fns';
import type documents from '@mintter/api/documents/v1alpha/documents_pb';
import { getPath } from '@utils/routes';
import { Box } from '@mintter/ui/box';
import { Text } from '@mintter/ui/text';
import { Button } from '@mintter/ui/button';
// import {TrashIcon} from '@mintter/ui/icons'
import { Avatar } from '@components/avatar';

interface Props {
  // TODO: fix types
  // data: documents.Document.AsObject[];
  data: any;
  isLoading: boolean;
  isError: boolean;
  error: any;
  onDeleteDocument?: (id: string) => Promise<void>;
}

interface ItemProps {
  item: {
    publication: documents.Publication;
    version: string;
    document?: documents.Document.AsObject;
  }; // TODO: fix types (Document.AsObject + Document)
  onDeleteDocument?: (version: string) => void;
}

export function DocumentList({
  data,
  isLoading,
  isError,
  error,
  onDeleteDocument,
}: Props) {
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>ERROR</p>;
  }

  return (
    <div>
      {/* // TODO: fix types */}
      {data.map((item: any) => (
        <ListItem
          key={item.id}
          item={item}
          onDeleteDocument={onDeleteDocument}
        />
      ))}
    </div>
  );
}

function ListItem({ item, onDeleteDocument }: ItemProps) {
  const match = useRouteMatch();
  const location = useLocation();
  // const [prefetched, setPrefetch] = React.useState<boolean>(false)
  const { publication, version, document } = item;

  const {
    id,
    title,
    subtitle,
    author: itemAuthor,
  } = document as documents.Document.AsObject;

  const theTitle = title ? title : 'Untitled Document';

  const { data: author } = useAuthor(itemAuthor);

  const isDraft = React.useMemo(() => location.pathname.includes('drafts'), [
    location.pathname,
  ]);

  const to = React.useMemo(() => {
    const path = `${getPath(match)}${isDraft ? '/editor' : '/p'}/${id}${
      version ? `/${version}` : ''
    }`;
    return path;
  }, [location.pathname]);
  // function handlePrefetch() {
  // if (!prefetched) {
  // TODO: prefetch on hover
  // console.log(`prefetch draft with id ${draft.id}`)
  // setPrefetch(true)
  // }
  // }

  const date = React.useMemo(
    () => publication?.getDocument()?.getCreateTime()?.toDate() || new Date(),
    [publication],
  );

  return (
    <Box
      // TODO: fix types
      // @ts-ignore
      as={Link}
      to={to}
      css={{
        padding: '$5',
        borderRadius: '$2',
        display: 'flex',
        gap: '$5',
        textDecoration: 'none',
        transition: 'background 0.25s ease-in-out',
        '&:hover': {
          backgroundColor: '$background-muted',
        },
      }}
    >
      <Box
        css={{
          flex: 'none',
          background: '$primary-muted',
          width: 220,
          height: 140,
        }}
      />
      <Box
        css={{
          flex: 1,
          display: 'grid',
          gridTemplateAreas: `"avatar author price"
        "content content icon"
        "footer footer footer"`,
          gridTemplateColumns: '24px 1fr auto',
          gridTemplateRows: '24px auto auto',
          gap: '$2',
        }}
      >
        {/* {!isDraft && location.pathname !== '/library/my-publications' && ( */}

        <Avatar css={{ gridArea: 'avatar' }} />
        <Text size="1" css={{ gridArea: 'author', alignSelf: 'center' }}>
          {author?.username}
        </Text>
        <Box css={{ gridArea: 'price' }}>
          <Text
            size="1"
            css={{
              background: '$background-contrast-strong',
              paddingVertical: '$2',
              paddingHorizontal: '$3',
              borderRadius: '$1',
              display: 'inline-block',
            }}
            color="opposite"
          >
            0.09$
          </Text>
        </Box>
        <Box css={{ gridArea: 'content' }}>
          <Text
            size="7"
            // TODO: fix types
            // @ts-ignore
            color="default"
            css={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {theTitle}
          </Text>
          {subtitle && (
            <Text size="5" color="muted">
              {subtitle}
            </Text>
          )}
        </Box>
        <Box css={{ gridArea: 'footer' }}>
          <Text size="1" color="muted">
            {format(new Date(date), 'MMMM d, yyyy')}
          </Text>
        </Box>

        {onDeleteDocument && (
          <Box
            css={{
              gridArea: 'icon',
              display: 'flex',

              alignItems: 'center',
            }}
          >
            <Button
              data-testid="delete-button"
              color="danger"
              size="1"
              onClick={(e) => {
                e.preventDefault();
                const resp = window.confirm(
                  'are you sure you want to delete it?',
                );
                if (resp) {
                  onDeleteDocument(version);
                }
              }}
            >
              {/* //TODO: add Icons
              <TrashIcon />
              */}
              trash
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
