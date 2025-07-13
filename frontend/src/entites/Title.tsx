import { Typography } from '@mui/material';
import { styled } from '@stitches/react';
import clsx from 'clsx';

const StyledTitle = styled(Typography, {
	'.minus': {
		color: '$minus',
	},
	'.plus': {
		color: '$plus',
	}
})

export const Title = ({ title, className }: { title: string, className?: string }) => {
	return (
		<StyledTitle fontWeight={'bold'} fontSize={'large'} className={clsx('title', className)}>
			{title}
		</StyledTitle>
	);
};

export const SubTitle = ({ title, className }: { title: string, className: string }) => {
	return (
		<StyledTitle fontWeight={'bold'} fontSize={'medium'} className={clsx('sut-title', className)}>
			{title}
		</StyledTitle>
	);
};
