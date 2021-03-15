import * as React from 'react';
import { DragDrop } from '../../block-plugin/components/drag-drop';

import { usePublication, useAuthor } from '../../../mintter-hooks';
import { useSidePanel } from '../../../sidepanel';

// TODO: fix types
export const Transclusion = ({ attributes, children, element }: any) => {
  const version = element.id.split('/')[0];
  const { isLoading, isError, error, data } = usePublication(version);
  const { data: author } = useAuthor(data ? data.document?.author : undefined);
  const { dispatch } = useSidePanel();

  // TODO: fix types
  function handlePush(e: any) {
    e.preventDefault();
    dispatch({ type: 'add_object', payload: element.id });
  }

  if (isError) {
    console.error('transclusion error', element.id, error);
    return <div>Error loading transclusion</div>;
  }

  if (isLoading) {
    return <div>...</div>;
  }

  return (
    <DragDrop {...attributes} element={element}>
      {children}
      <div
        contentEditable={false}
        // className={`absolute text-xs text-left text-body-muted px-4 top-0 right-0 group ${css`
        //   transform: translateX(100%);
        //   right: -8px;
        // `}`}
      >
        <button className="text-left" onClick={handlePush}>
          {data?.document ? (
            <>
              <p
              // className={`text-xs font-bold truncate ${css`
              //   max-width: 180px;
              // `}`}
              >
                {data?.document?.title}
              </p>
              <p className="text-xs font-light">
                {author ? author.username : '...'}
              </p>
            </>
          ) : (
            <div className="mx-2">
              <p className="text-xs font-light">...</p>
            </div>
          )}

          <span className="transition duration-100 group-hover:opacity-100 group-hover:visible invisible opacity-0 font-bold text-primary">
            Show in Sidepanel →
          </span>
        </button>
      </div>
    </DragDrop>
  );
};
