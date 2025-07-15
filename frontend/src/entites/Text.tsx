import { Typography, TypographyProps } from '@mui/material';
import { styled } from '@stitches/react';
import clsx from 'clsx';

const StyledText = styled(Typography, {
	'&.xxs': {
		fontSize: '$xxs',
		lineHeight:'$xxs',
	},
	'&.xs': {
		fontSize: '$xs',
		lineHeight:'$xs',
	},
	'&.sm': {
		fontSize: '$sm',
		lineHeight:'$sm',
	},
	'&.md': {
		fontSize: '$md',
		lineHeight:'$md',
	},
	'&.lg': {
		fontSize: '$lg',
		lineHeight:'$lg',
	},
	'&.xl': {
		fontSize: '$xl',
		lineHeight:'$xl',
	},
	'&.xxl': {
		fontSize: '$xxl',
		lineHeight:'$xxl',
	},
});

export interface TextProps extends TypographyProps {
	text?: string | number;
	bold?: boolean;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxs' | 'xxl';
}

export const Text: React.FC<TextProps> = ({ text, className, bold, size = 'sm', ...rest }) => {
	return (
		<StyledText
			className={clsx('text', className, size)}
			fontWeight={bold ? 'bold' : rest?.fontWeight}
			// fontSize={size}
			{...rest}
		>
			{text}
		</StyledText>
	);
};
