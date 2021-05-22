import type * as account from '@mintter/api/accounts/v1alpha/accounts_pb';
import { useAccount } from '@mintter/hooks';
import { Box } from '@mintter/ui/box';
import { Text } from '@mintter/ui/text';

export function PeerList() {
  const query = useAccount();

  if (query.isLoading) {
    return <Text>loading...</Text>;
  }

  if (query.isError) {
    console.error('PeerList error: ', query.error);
    return <Text>Error :(</Text>;
  }

  if (query.isSuccess && query.data) {
    const { devicesMap } = query.data;
    return (
      <Box>
        {devicesMap.map(
          ([id, device]: [string, account.Device.AsObject], index: number) => (
            <Text>
              <Text
                as="span"
                color="muted"
                css={{ display: 'inline-block', marginRight: '$4' }}
              >
                {index + 1}.
              </Text>{' '}
              {device.peerId}
            </Text>
          ),
        )}
      </Box>
    );
  }

  return null;
}
