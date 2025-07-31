import Flex from '@entites/Flex';
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

export const StyledTradeCard = styled(Flex, {
	'&.trade': {
		backgroundColor: '$gray800',

		'.box': {
			backgroundColor: '$gray100',
		},

		'.trade-sub-title': {
			width: '100%',
			background: '$gray400',
			// color: '$white',
			textAlign: 'center',
			height: '40px',
			lineHeight: '40px',
			position: 'sticky',
			top: '40px',
			zIndex: 10,

			'.sum': {
				'&.plus': {
					color: '$plus',
				},

				'&.minus': {
					color: '$minus',
				},
			},
		},

		'@md': {
			'.trade-sub-title': {
				justifyContent: 'space-between',
				padding: '0 10px',
			}
		},
	},
});