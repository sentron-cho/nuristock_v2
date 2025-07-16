import { styled } from '@styles/stitches.config';
import type { ComponentProps } from 'react';
import clsx from 'clsx';

// styled 컴포넌트 정의
const StyledFlex = styled('div', {
  display: 'flex',
  variants: {
    direction: {
      row: { flexDirection: 'row' },
      column: { flexDirection: 'column' },
    },
    justify: {
      start: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
      around: { justifyContent: 'space-around' },
      evenly: { justifyContent: 'space-evenly' },
    },
    align: {
      start: { alignItems: 'flex-start' },
      center: { alignItems: 'center' },
      end: { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch' },
    },
    wrap: {
      wrap: { flexWrap: 'wrap' },
      nowrap: { flexWrap: 'nowrap' },
    },
    gap: {
      0: { gap: '0px' },
      2: { gap: '2px' },
      4: { gap: '4px' },
      8: { gap: '8px' },
      10: { gap: '10px' },
      12: { gap: '12px' },
      16: { gap: '16px' },
      20: { gap: '20px' },
      24: { gap: '24px' },
      36: { gap: '36px' },
    },
  },
  defaultVariants: {
    direction: 'row',
    justify: 'start',
    align: 'center',
    wrap: 'nowrap',
    gap: 0,
  },
});

// props 타입 추출
type FlexProps = ComponentProps<typeof StyledFlex> & {
  width?: string | number;
  height?: string | number;
  flex?: string | number;
  fullWidth?: boolean;
};

// React.forwardRef로 래핑
const Flex = ({ width, fullWidth = true, height, flex, ...props }: FlexProps) => {
  let innerWidth = width ? width : fullWidth ? '100%' : width
  return <StyledFlex className={clsx('flex')} {...props} css={{ width: innerWidth, height, flex }} />;
};

Flex.displayName = 'Flex';

export default Flex;
