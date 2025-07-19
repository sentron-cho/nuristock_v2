import Card from '@mui/material/Card';
import { styled } from '@styles/stitches.config';

export const StyledCard = styled(Card, {
	width: '33.33333%',
	height: '240px',
	boxShadow: 'unset !important',
	padding: '$4',

	'&.card': {
		backgroundColor: 'transparent',
		'&.keep': {
			cursor: 'pointer',
			height: '300px',
		},

		'.box': {
			backgroundColor: '$white',
			borderRadius: '$sm',
			border: '1px solid rgba(0,0,0,0.05)',
			boxShadow: 'var(--Paper-shadow);',
			overflow: 'hidden',
			height: '100%',
			padding: '$4',

			'.head, .foot, .body': {
				padding: '0 $4',
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

				'.date': {
					color: '$gray700',
				},
			},

			'.body': {
				borderBottom: '1px solid $gray300',
				overflow: 'hidden',
				flex: 1,
			},

			'.foot': {
				height: '40px',

				'.naver, .daum': {
					'&.naver': {
						backgroundColor: '#00c73c',
					},
					'&.daum': {
						backgroundColor: '#fcce00',
						color: '$black',
					},
				},
			},

			'.plus': {
				color: '$plus',
			},

			'.minus': {
				color: '$minus',
			},
		},

		'&.active': {
			'.box': {
				borderColor: '$gray700',
			},
		},
	},

	'@lg': {
		width: '50%',
	},
	'@md': {
		width: '100%',
	},
});