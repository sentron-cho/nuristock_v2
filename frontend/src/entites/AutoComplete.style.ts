import { FormControl } from '@mui/material';
import { styled } from '@styles/stitches.config';

export const StyledAutoCompleteForm = styled(FormControl, {
	'&.autocomplete-form': {
		'&.error': {
			'.MuiOutlinedInput-notchedOutline': {
				borderColor: '$red !important',
				borderWidth: '1px !important',
      },
      '.tooltip.icon': {
        marginRight: '26px',
      }
		},

		// borderRadius: '$xs',
		// boxSizing: 'border-box',

		// '&.border': {
		//   border: '1px solid $gray800',
		// },

		'.MuiInputBase-root': {
			padding: '0 $10',
			paddingRight: '40px',
		},

		'&.small': {
			'.MuiInputBase-root': {
				lineHeight: '$formSmall',
				height: '$formSmall',

				'.MuiInputBase-input': {
					padding: 0,
					fontSize: '$sm',
				},
			},

			'.MuiFormLabel-root': {
				top: -14,
				fontSize: '$sm',

				'&.MuiInputLabel-shrink': {
					top: -2,
					fontSize: '$sm',
				},
			},
		},

		'&.medium': {
			'.MuiInputBase-root': {
				lineHeight: '$formMedium',
				height: '$formMedium',

				'.MuiInputBase-input': {
					padding: 0,
					fontSize: '$md',
				},
			},

			'.MuiFormLabel-root': {
				top: -11,
				fontSize: '$md',

				'&.MuiInputLabel-shrink': {
					top: -2,
					fontSize: '$sm',
				},
			},
		},

		'&.large': {
			'.MuiInputBase-root': {
				lineHeight: '$formLarge',
				height: '$formLarge',

				'.MuiInputBase-input': {
					padding: 0,
					fontSize: '$md',
				},
			},

			'.MuiFormLabel-root': {
				top: -7,
				fontSize: '$md',

				'&.MuiInputLabel-shrink': {
					top: 0,
					fontSize: '$sm',
				},
			},
		},

		'.MuiOutlinedInput-notchedOutline': {
			border: '1px solid $gray800 !important',
			borderWidth: '1px !important',
		},

		// '.MuiSelect-root > .MuiSelect-select': {
		// 	padding: '0 $10',
		// 	lineHeight: '$formMedium',
		// 	height: '$formMedium',
		// },

		// '.MuiInputBase-sizeSmall > .MuiSelect-select': {
		// 	padding: '0 $10',
		// 	lineHeight: '$formSmall',
		// 	height: '$formSmall',
		// },

		// '.MuiInputBase-sizeLarge > .MuiSelect-select': {
		// 	padding: '0 $10',
		// 	lineHeight: '$formLarge',
		// 	height: '$formLarge',
		// },
	},
});
