import { globalCss } from '@stitches/react';

export const globalStyles = globalCss({
	'*': {
		boxSizing: 'border-box',
	},

	'html, body': {
		margin: 0,
		padding: 0,
		fontFamily: '$body !important',
		backgroundColor: '#fff',
		color: '$gray900',
		overflow: 'hidden',
		WebkitFontSmoothing: 'antialiased',
		// overflowY: 'auto',
	},

	'.contents-wrap, .MuiTypography-root': {
		fontFamily: '$body !important',
	},

	'.number': {
		fontFamily: '$number !important',
		fontWeight: 'bold !important',
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
