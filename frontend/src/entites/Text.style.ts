import { Typography } from '@mui/material';
import { styled } from '@styles/stitches.config';

export const StyledText = styled(Typography, {
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