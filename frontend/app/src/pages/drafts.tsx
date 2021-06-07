import { DocumentList } from '../document-list';
import { deleteDraft } from '@mintter/client'
import { useDraftsList } from '@mintter/client/hooks'
import { useHistory, useRouteMatch } from 'react-router';
import type { WithCreateDraft } from './library';
import * as MessageBox from '../components/message-box';

export const Drafts = ({ onCreateDraft }: WithCreateDraft): JSX.Element => {
  const history = useHistory();
  const match = useRouteMatch();
  const { isLoading, isError, isSuccess, error, data } = useDraftsList();

  async function handleDeleteDocument(version: string) {
    await deleteDraft(version);
  }

  if (isError) {
    return <p>Drafts ERROR</p>;
  }

  if (isLoading) {
    return <p>loading drafts...</p>;
  }

  return (
    <>
      {/* <Seo title="Drafts" /> */}
      {isSuccess && data?.length === 0 && (
        <MessageBox.Root>
          <MessageBox.Title>No Drafts available</MessageBox.Title>
          <MessageBox.Button onClick={onCreateDraft}>
            <span>Start your first document</span>
          </MessageBox.Button>
        </MessageBox.Root>
      )}

      <DocumentList
        isLoading={isLoading}
        isError={isError}
        error={error}
        data={data}
        onDeleteDocument={handleDeleteDocument}
      />
    </>
  );
};
