import { FormControl } from '@mui/material';
import { styled } from '@styles/stitches.config';

export const StyledAutoCompleteForm = styled(FormControl, {
  '&.autocomplete-form': {
    '&.error': {
      '.MuiOutlinedInput-notchedOutline': {
        borderColor: '$red !important',
        borderWidth: '1px !important',
      },
    },

    // borderRadius: '$xs',
    // boxSizing: 'border-box',

    // '&.border': {
    //   border: '1px solid $gray800',
    // },

    // '&.small': {
    //   lineHeight: '$formSmall',
    //   height: '$formSmall',
    // },

    // '&.medium': {
    //   lineHeight: '$formMedium',
    //   height: '$formMedium',
    // },

    // '&.large': {
    //   lineHeight: '$formLarge',
    //   height: '$formLarge',
    // },

    // '.MuiOutlinedInput-notchedOutline': {
    //   borderColor: 'transparent !important',
    //   borderWidth: '1px !important',
    // },

    // '.MuiSelect-root > .MuiSelect-select': {
    //   padding: '0 $10',
    //   lineHeight: '$formMedium',
    //   height: '$formMedium',
    // },

    // '.MuiInputBase-sizeSmall > .MuiSelect-select': {
    //   padding: '0 $10',
    //   lineHeight: '$formSmall',
    //   height: '$formSmall',
    // },

    // '.MuiInputBase-sizeLarge > .MuiSelect-select': {
    //   padding: '0 $10',
    //   lineHeight: '$formLarge',
    //   height: '$formLarge',
    // },
  },
});