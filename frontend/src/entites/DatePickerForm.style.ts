import { styled } from '@styles/stitches.config';
import { FormControl } from '@mui/material';

export const StyledDatePickerForm = styled(FormControl, {
	'&.date-picker': {
		'&.error': {
			'.MuiPickersSectionList-root': {
				paddingRight: '6px',
			},

			'.MuiPickersOutlinedInput-notchedOutline': {
				borderColor: '$red !important',
				borderWidth: '1px !important',
				// color: #1976d2;
			},

			'.tooltip.icon': {
				marginRight: '22px',
			},

			'.MuiFormLabel-root': {
				color: '$error',
			},
		},

		'.Mui-readOnly, .Mui-disabled': {
			'&.MuiPickersInputBase-root, .MuiPickersInputBase-root': {
				paddingRight: '8px',
			},
			'.MuiInputAdornment-positionEnd': {
				display: 'none',
			},
			'.MuiPickersOutlinedInput-notchedOutline': {
				borderColor: '$gray400 !important',
			},

			'&.Mui-disabled': {
				'.MuiFormLabel-root': {
					opacity: '0.7',
				},

				'.MuiPickersSectionList-root .MuiPickersSectionList-section span': {
					color: '$disable !important',
				},
			},
		},

		'.MuiPickersInputBase-root': {
			lineHeight: '20px',
			height: '36px',
		},

		'&.small': {
			'.MuiPickersInputBase-root': {
				lineHeight: '16px',
				height: '28px',
			},
		},

		'.MuiInputAdornment-positionEnd': {
			marginRight: '-8px',
		},

		'.MuiFormLabel-root': {
			color: '$primary',
		},

		'.MuiPickersOutlinedInput-notchedOutline': {
			borderColor: '$gray800 !important',
			borderWidth: '1px !important',
		},

		// '.MuiInputBase-input': {
		// 	padding: '0 $10',
		// 	lineHeight: '20px',
		// 	height: '36px',
		// },
	},
	variants: {
		align: {
			right: { '.MuiPickersSectionList-root': { justifyContent: 'flex-end' } },
			left: { '.MuiPickersSectionList-root': { justifyContent: 'flex-start' } },
			center: { '.MuiPickersSectionList-root': { justifyContent: 'center' } },
		},
	},
});
