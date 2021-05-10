import { useMemo } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';

import { Box } from '@mintter/ui/box';
import { Button } from '@mintter/ui/button';
import { TextField } from '@mintter/ui/text-field';
import { usePeerAddrs } from '@mintter/hooks';

export function PeerAddrs() {
  const peerAddrs = usePeerAddrs();
  console.log(
    '🚀 ~ file: peer-addrs.tsx ~ line 12 ~ PeerAddrs ~ peerAddrs',
    peerAddrs,
  );

  const addrs = useMemo(() => peerAddrs.data, [peerAddrs.data]);
  const copyText = useMemo(() => addrs?.join(','), [addrs]);

  if (peerAddrs.isLoading) {
    return <p>Loading...</p>;
  }

  if (peerAddrs.isError) {
    return <p>ERROR</p>;
  }

  return (
    <Box>
      <TextField
        readOnly
        // TODO: Fix types
        // @ts-ignore
        as="textarea"
        id="addresses"
        name="addresses"
        label="Your Mintter address"
        rows={4}
        value={addrs?.join('\n\n')}
      />
      <CopyToClipboard
        text={copyText as string}
        onCopy={(_, result) => {
          if (result) {
            toast.success('Address copied to your clipboard!');
          } else {
            toast.error('Error while copying to clipboard');
          }
        }}
      >
        <Button
          variant="outlined"
          color="success"
          size="1"
          type="button"
          css={{
            marginTop: '$5',
          }}
        >
          Copy Address
        </Button>
      </CopyToClipboard>
    </Box>
  );
}
