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
			color: '$black'
		}
	},

	'.autocomplete-popup': {
		'.MuiPaper-root': {
			maxHeight: '400px',
		}
	}
});
