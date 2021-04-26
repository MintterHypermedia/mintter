// import type * as Polymorphic from '@radix-ui/react-polymorphic';
import React from 'react';

import {
  styled,
  // StitchesCss,
  // StitchesVariants,
} from '@mintter/ui/stitches.config';

const DEFAULT_TAG = 'div';

// type ContainerCSSProp = Pick<StitchesCss<typeof StyledContainer>, 'css'>;
// type ContainerVariants = StitchesVariants<typeof StyledContainer>;
// type ContainerOwnProps = ContainerCSSProp & ContainerVariants;

const StyledContainer: any = styled(DEFAULT_TAG, {
  // Reset
  boxSizing: 'border-box',
  flexShrink: 0,

  // Custom
  width: '90%',
  marginHorizontal: 'auto',
  paddingHorizontal: '$5',

  variants: {
    size: {
      1: {
        maxWidth: '430px',
      },
      2: {
        maxWidth: '715px',
      },
      3: {
        maxWidth: '1145px',
      },
      4: {
        maxWidth: 'none',
      },
    },
  },
  defaultVariants: {
    size: '2',
  },
});

// type ContainerComponent = Polymorphic.ForwardRefComponent<
//   typeof DEFAULT_TAG,
//   ContainerOwnProps
// >;

// TODO: fix types
export const Container: any = React.forwardRef((props, forwardedRef) => (
  <StyledContainer {...props} ref={forwardedRef} />
)) as any;
// }) as ContainerComponent;
