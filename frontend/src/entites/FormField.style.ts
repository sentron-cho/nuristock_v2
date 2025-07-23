import { styled } from "@styles/stitches.config";
import Flex from "./Flex";

export const StyledFormField = styled(Flex, {
	'.MuiFormLabel-root': {
		width: 120,
		textOverflow: 'ellipsis',
	},

	'.close': {
		color: '$error'
	},

	'&.xxs > *': {
		fontSize: '$xxs',
		lineHeight: 20,
		heigh: 20,
		'.MuiFormLabel-root': {
			width: 100,
		},
	},
	'&.xs > *': {
		fontSize: '$xs',
		lineHeight: '$formSmall',
		heigh: '$formSmall',
	},
	'&.sm > *': {
		fontSize: '$sm',
		lineHeight: '$formSmall',
		heigh: '$formSmall',
		'.MuiFormLabel-root': {
			width: 120,
		},
	},
	'&.md > *': {
		fontSize: '$md',
		lineHeight: '$formMedium',
		heigh: '$formMedium',

		'.MuiFormLabel-root': {
			width: 140,
		},
	},
	'&.lg > *': {
		fontSize: '$lg',
		lineHeight: '$formMedium',
		heigh: '$formMedium',

		'.MuiFormLabel-root': {
			width: 140,
		},
	},
	'&.xl > *': {
		fontSize: '$xl',
		lineHeight: '$formLarge',
		heigh: '$formLarge',
		'.MuiFormLabel-root': {
			width: 160,
		},
	},
	'&.xxl > *': {
		fontSize: '$xxl',
		lineHeight: '$formLarge',
		heigh: '$formLarge',
		'.MuiFormLabel-root': {
			width: 180,
		},
	},
});
