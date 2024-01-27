import { globalCss, createStitches } from '@stitches/react';

createStitches({
	theme: {
		colors: {
			border: '#bbbdc0',
			borderHover: '#baadf9',
			line: '#bbbdc0',
			primary: '#745af2',
			primaryHover: '#634dce',
			info: '#398bf7',
			danger: '#ef5350',
			success: '#06d79c',
			warning: '#ffb22b',
			dark: '#242a33',
			black: '#181818',
			light: '#eaf2fb',
			secondary: '#545b62',
		},
	},
});

export const globalStyles = globalCss({
	body: {
		minHeight: '760px',
	},

	'.boxContainer': {
		margin: '0 !important',
		marginLeft: '40px !important',
		minHeight: 'calc(100vh - 100px)',
		minWidth: '1400px',
		maxWidth: '1400px',
	},

	'.h-full': {
		height: '100%',
	},

	'.flex-col': {
		display: 'flex',
		flexFlow: 'column',
	},

	'.v-bar, .h-var': {
		color: '$line',
	},

	'.text-danger': {
		color: '$danger',
	},

	'.text-success': {
		color: '$success',
	},

	'.text-primary': {
		color: '$primary',
	},

	'.btn-new': {
		background: '$primary',
		color: 'white',
		borderRadius: '4px',
		width: '30px !important',
		cursor: 'pointer',

		'&:hover': {
			background: '$primaryHover',
		},
	},

	'.cursor-pointer': {
		cursor: 'pointer',
	},

	'*': {
		'&::-webkit-scrollbar': {
			width: '10px',
			height: '10px',
		},
		'&::-webkit-scrollbar-thumb': {
			backgroundColor: '#2f3542',
		},
		'&::-webkit-scrollbar-track': {
			backgroundColor: 'grey',
		},
	},

	'.logo-space > svg': {
		height: '60px',
	},

	'input.form-control, select.form-select, textarea.form-control': {
		borderColor: '$border',
	},

	'.input-form': {
		position: 'relative',
		'input.form-control.is-invalid': {
			backgroundImage: 'none',
		},
		'svg.eye': {
			position: 'absolute',
			top: '8px',
			right: '10px',
			zIndex: '1',
			cursor: 'pointer',
		},
	},

	'.side-bar': {
		'.nav-item': {
			'.nav-link': {
				color: '#495057',
				opacity: '1',
				'&:hover, &.active': {
					color: '$primary',
				},
			},
		},

		'.nav-line': {
			display: 'block',
			height: '1px',
			backgroundColor: '$border',
			width: 'calc(100% - 20px)',
			margin: '0 10px',
		},
	},

	'#alert-root': {
		padding: '0',
		height: '0',
		margin: '0',
	},

	'.icon-favorite': {
		fill: 'transparent',
		stroke: '$secondary',

		'&.active': {
			fill: '$warning',
			stroke: '$warning',
		},
	},

	'.icon-premium': {
		fill: '#555',
	},
});
