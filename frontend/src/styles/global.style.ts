import { globalCss } from '@stitches/react';

export const globalStyles = globalCss({
	'*': {
		boxSizing: 'border-box',
	},
	body: {
		margin: 0,
		padding: 0,
		fontFamily: '$body',
		backgroundColor: '#fff',
		color: '$gray900',
		overflow: 'hidden',
		// overflowY: 'auto',
	},

	'.MuiTooltip-popper': {
		'.MuiTooltip-tooltip': {
			backgroundColor: '$black',
		},

		'.MuiTooltip-arrow': {
			color: '$black',
		},
	},

	'.autocomplete-popper': {
		'&.small': {
			'.MuiAutocomplete-listbox > li': {
				lineHeight: '$formSmall',
				height: '$formSmall',
				fontSize: '$sm',
			},
		},

		'&.medium': {
			'.MuiAutocomplete-listbox > li': {
				lineHeight: '$formMedium',
				height: '$formMedium',
				fontSize: '$md',
			},
		},

		'&.large': {
			'.MuiAutocomplete-listbox > li': {
				lineHeight: '$formLarge',
				height: '$formLarge',
				fontSize: '$lg',
			},
		},
	},
});
