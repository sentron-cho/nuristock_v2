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

	'#root .notistack-SnackbarContainer': {
		zIndex: '$toast',
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

	'.MuiDialog-root.MuiModal-root': {
		zIndex: '$dialog',
	},

	'.autocomplete-popper': {
		zIndex: '$popper !important',
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

	'.ellipsis': {
		whiteSpace: 'nowrap' /* 줄바꿈 방지 */,
		overflow: 'hidden' /* 넘치는 내용 숨김 */,
		textOverflow: 'ellipsis' /* 말줄임표(...) 표시 */,
	},

	'.swipe-left': {
		opacity: 0,
		transform: 'translateX(5%)',
		animation: 'swipeLeft 0.2s ease-out forwards',
	},

	'@keyframes swipeLeft': {
		from: {
			opacity: 0,
			transform: 'translateX(5%)',
		},
		to: {
			opacity: 1,
			transform: 'translateX(0)',
		},
	},

	'.swipe-right': {
		opacity: 0,
		transform: 'translateX(-5%)',
		animation: 'swipeRight 0.2s ease-out forwards',
	},

	'@keyframes swipeRight': {
		from: {
			opacity: 0,
			transform: 'translateX(-5%)',
		},
		to: {
			opacity: 1,
			transform: 'translateX(0)',
		},
	},
});
