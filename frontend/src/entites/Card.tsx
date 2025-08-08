import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import { Card as MuiCard, CardProps as MuiCardProps } from '@mui/material';
import { styled } from '@styles/stitches.config';

export const StyledCard = styled(MuiCard, {
	'&.card': {
		width: '33.33333%',
		// height: '240px',
		height: 'fit-contents',
		boxShadow: 'unset !important',
		padding: '$4',
		backgroundColor: 'transparent',

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

			'.head': {
				height: '40px',
				borderBottom: '1px solid $gray300',

				'.date': {
					color: '$gray700',
				},
			},

			'.body': {
				overflow: 'hidden',
				flex: 1,
				paddingTop: '$4',
				paddingBottom: '$4',
			},

			'.foot': {
				marginTop: '$4',
				borderTop: '1px solid $gray300',
				height: '40px',
			},

			'.plus': {
				color: '$plus',
			},

			'.minus': {
				color: '$minus',
			},

			'&.border': {
				borderColor: '$gray700',
			},
		},

		// '&.active': {
		// 	'.box': {
		// 		borderColor: '$gray700',
		// 	},
		// },

		'@lg': {
			'&.card': {
				width: '50%',
			},
		},

		'@md': {
			'&.card': {
				width: '100%',
				height: 'unset',
			},
		},
	},
});

export interface CardProps extends MuiCardProps {
	className?: string;
}

export const Card = ({ children, className, ...rest }: CardProps & PropsWithChildren) => {
	return (
		<StyledCard {...rest} className={clsx('card', className)}>
			{children}
		</StyledCard>
	);
};
