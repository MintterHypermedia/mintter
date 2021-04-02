import * as React from 'react';
// import Seo from 'components/seo'
import { useHistory, useRouteMatch } from 'react-router';
import { DocumentList } from '../document-list';
import { useMyPublicationsList } from '@mintter/hooks';
import { createDraft, deletePublication } from '@mintter/client';
// import {ErrorMessage} from 'components/error-message'
// import {Icons} from 'components/icons'
import { Button } from '@mintter/ui/button';
import { Separator } from '@components/separator';
import { Box } from '@mintter/ui/box';
import { Text } from '@mintter/ui/text';
import type { WithCreateDraft } from './library';
import * as MessageBox from '@components/message-box';

type MyPublicationProps = {
  noSeo?: boolean;
  isPublic?: boolean;
};

export const MyPublications: React.FC<MyPublicationProps & WithCreateDraft> = ({
  noSeo = false,
  isPublic = false,
  onCreateDraft,
}) => {
  const history = useHistory();
  const match = useRouteMatch();
  const {
    isError,
    isLoading,
    isSuccess,
    error,
    data = [],
  } = useMyPublicationsList();

  async function handleDeleteDocument(version: string) {
    await deletePublication(version);
  }

  if (isLoading) {
    return <p>loading my publications...</p>;
  }

  if (isError) {
    return <p>ERROR</p>;
  }

  return (
    <>
      {/* {!noSeo && <Seo title="My Publications" />} */}
      {isSuccess && data?.length === 0 && (
        <MessageBox.Root>
          <MessageBox.Title>No Publications (yet)</MessageBox.Title>
          {!isPublic && (
            <MessageBox.Button onClick={onCreateDraft}>
              {/* <Icons.FilePlus color="currentColor" /> */}
              <Text size="3">Start your first document</Text>
            </MessageBox.Button>
          )}
        </MessageBox.Root>
      )}
      <DocumentList
        isLoading={isLoading}
        isError={isError}
        error={error}
        data={data}
        onDeleteDocument={!isPublic ? handleDeleteDocument : undefined}
      />
    </>
  );
};
