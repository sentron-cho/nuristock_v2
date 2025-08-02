import Card from '@mui/material/Card';
import { styled } from '@styles/stitches.config';

export const StyledCard = styled(Card, {
	width: '100%',
	boxShadow: 'unset !important',
	padding: '$4',

	'&.card': {
		backgroundColor: 'transparent',

		// '.plus': {
		// 	color: '$plus',
		// },

		// '.minus': {
		// 	color: '$minus',
		// },

		'.box': {
			backgroundColor: '$white',
			borderRadius: '$sm',
			border: '1px solid rgba(0,0,0,0.05)',
			boxShadow: 'var(--Paper-shadow);',
			overflow: 'hidden',
			height: '100%',
			padding: '$4',
			paddingBottom: '$10',
			minHeight: '120px',
		},

		'&.active': {
			'.box': {
				borderColor: '$gray700',
			},
		},
	},
});
