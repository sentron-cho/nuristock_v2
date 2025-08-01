import Card from '@mui/material/Card';
import { styled } from '@styles/stitches.config';

export const StyledCard = styled(Card, {
	width: '100%',
	boxShadow: 'unset !important',
	padding: '$4',

	'&.card': {
		backgroundColor: 'transparent',

		'.plus': {
			color: '$plus',
		},

		'.minus': {
			color: '$minus',
		},

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


			'.names': {

			},

			'.years': {
			},

			'.head, .body': {
				padding: '0 $4',

				'&.bar': {
					borderTop: '1px solid $gray300',
				}
			},

			'.trade-info, .keep-info, .cast-info': {
				'&.keep-info, &.cast-info': {
					borderTop: '1px solid $gray300',
				},

				padding: '8px',
			},

			'.head': {
				height: '40px',
				borderBottom: '1px solid $gray300',
				// backgroundColor: '$gray300',
				// color: '$primaryhover',

				'.date': {
					color: '$gray700',
				},
			},

			'.body': {
				flex: 1,
			},
		},

		'&.active': {
			'.box': {
				borderColor: '$gray700',
			},
		},
	},
});
