import { FormControl } from '@mui/material';
import { styled } from '@styles/stitches.config';

export const StyledRadioForm = styled(FormControl, {
  '&.radio-form': {
    '&.error': {
      '.MuiOutlinedInput-notchedOutline': {
        borderColor: '$red !important',
        borderWidth: '1px !important',
      },
    },

    '.MuiOutlinedInput-notchedOutline': {
      borderColor: 'unset !important',
      borderWidth: '1px !important',
    },

    '.MuiSelect-root > .MuiSelect-select': {
      padding: '0 $10',
      lineHeight: '36px',
      height: '36px',
    },

    '.MuiInputBase-sizeSmall > .MuiSelect-select': {
      padding: '0 $10',
      lineHeight: '28px',
      height: '28px',
    },
  },
});
