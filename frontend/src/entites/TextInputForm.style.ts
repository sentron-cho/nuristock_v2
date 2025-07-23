import { FormControl } from '@mui/material';
import { styled } from '@styles/stitches.config';

export const StyledTextInputForm = styled(FormControl, {
  '&.text-input': {
    '&.error': {
      '.MuiOutlinedInput-notchedOutline': {
        borderColor: '$red !important',
        borderWidth: '1px !important',
      },

      input: {
        paddingRight: '24px',
      },

      '.MuiFormLabel-root': {
        color: '$error',
      },
    },

    '.MuiFormLabel-root': {
      color: '$primary',
    },

    '.Mui-readOnly, .Mui-disabled, &.disabled': {
      '.MuiOutlinedInput-notchedOutline': {
        borderColor: '$gray400 !important',
      },

      '&.Mui-disabled, &.disabled': {
        '.MuiFormLabel-root': {
          opacity: '0.7',
        },

        '.MuiInputBase-input': {
          color: '$disable !important',
          '-webkit-text-fill-color': 'unset',
        },
      },
    },

    '.MuiOutlinedInput-notchedOutline': {
      borderColor: 'unset !important',
      borderWidth: '1px !important',
    },

    '.MuiInputBase-input': {
      padding: '0 $10',
      lineHeight: '20px',
      height: '36px',
    },

    '.MuiInputBase-sizeSmall > .MuiSelect-select': {
      padding: '0 $10',
      lineHeight: '16px',
      height: '28px',
    },
  },

  variants: {
    align: {
      right: { '.MuiInputBase-input': { textAlign: 'right' } },
      left: { '.MuiInputBase-input': { textAlign: 'left' } },
      center: { '.MuiInputBase-input': { textAlign: 'center' } },
    },
  },
});
