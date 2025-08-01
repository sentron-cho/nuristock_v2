import { styled } from '@styles/stitches.config';

export const StyledFlex = styled('div', {
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
