import { styled } from '@styles/stitches.config';

export const StyledHeader = styled('div', {
	'.header-bar': {
		userSelect: 'none',
		position: 'sticky',
		top: 0,
		left: 0,
		height: '40px',
		backgroundColor: '$gray900',
		color: '$white',
		zIndex: 1200,

		'.nav': {
			display: 'flex',
			gap: '$20',

			'@sm': {
				display: 'none',
			},
		},

		'.mobile': {
			display: 'none',
			height: '100%',
			width: '100%',

			'@sm': {
				display: 'flex',
			},

			'.title-bar': {
				'.box': {
					cursor: 'pointer',

					'.title': {
						padding: '$4',
						fontSize: '$lg',
					},
				},
			},

			'.menu-button': {
				position: 'absolute',
				right: 0,
				background: 'none',
				border: 'none',
				color: 'white',
				cursor: 'pointer',
			},
		},
	},

	'.link': {
		fontSize: '1rem',
		color: 'white',
		textDecoration: 'none',
		transition: 'color 0.2s',

		'&:hover, &.active': {
			color: '$warning',
		},
	},

	'.mobile-menu': {
		position: 'fixed',
		top: '40px',
		left: 0,
		width: '100vw',
		height: 'calc(100% - 40px)',
		flexDirection: 'column',
		zIndex: 1200,

		'.menu-li': {
			paddingBottom: '$8',
			backgroundColor: '$gray900',
			width: '100%',

			'.link': {
				padding: '$8',
				width: '100%',
			},
		},

		'.menu-bg': {
			flex: 1,
			backgroundColor: '$black',
			opacity: '0.1',
			width: '100%',
		},

		'@sm': {
			display: 'flex',
		},
	},
});
