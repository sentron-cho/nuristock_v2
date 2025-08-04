import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import { Card as MuiCard } from '@mui/material';
import { styled } from '@styles/stitches.config';

export const StyledCard = styled(MuiCard, {
	'&.card': {
		width: '33.33333%',
		height: '240px',
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
				borderBottom: '1px solid $gray300',
				overflow: 'hidden',
				flex: 1,
			},

			'.foot': {
				height: '40px',
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

export interface CardProps {
	className?: string;
}

export const Card = ({ children, className }: CardProps & PropsWithChildren) => {
	return <StyledCard className={clsx('card', className)}>{children}</StyledCard>;
};
