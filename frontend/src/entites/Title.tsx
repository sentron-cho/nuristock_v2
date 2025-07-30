import { Typography, TypographyProps } from '@mui/material';
import { styled } from '@stitches/react';
import clsx from 'clsx';

const StyledTitle = styled(Typography, {
	'.minus': {
		color: '$minus',
	},
	'.plus': {
		color: '$plus',
	},
});

export interface TitleProps extends TypographyProps {}

export const Title = ({ title, className, ...props }: TitleProps) => {
	return (
		<StyledTitle {...props} fontWeight={'bold'} fontSize={'large'} className={clsx('title', className)}>
			{title}
		</StyledTitle>
	);
};

export const SubTitle = ({ title, className, ...props }: TitleProps) => {
	return (
		<StyledTitle {...props} fontWeight={'bold'} fontSize={'medium'} className={clsx('sut-title', className)}>
			{title}
		</StyledTitle>
	);
};
