import { styled } from '@styles/stitches.config';

export const StyledFooter = styled('div', {
	'&.footer-bar': {
		userSelect: 'none',
		position: 'fixed',
		bottom: 0,
		left: 0,
		height: '48px',
		backgroundColor: '$gray900',
		color: '$white',
		zIndex: '$footer',
		width: '100vw',
		paddingTop: 6,

		'.nav': {
			'.link': {
				'&.active': {
					color: '$warning',
				},

				'.MuiSvgIcon-root': {
					cursor: 'pointer',
				},

				'.text': {
					fontSize: '8px',
					padding: 0,
					margin: 0,
				},
			},
		},
	},
});
