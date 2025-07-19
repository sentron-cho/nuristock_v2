import React, { useMemo } from 'react';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { DatePicker as MuiDatePicker, DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@styles/stitches.config';
import { FormControl } from '@mui/material';
import { Tooltip } from '@entites/Tooltip';
import clsx from 'clsx';
import dayjs, { Dayjs } from 'dayjs';
import { ST } from '@shared/config/kor.lang';

type DatePickerFormProps<T extends FieldValues = FieldValues> = Omit<CustomDatePickerProps, 'value' | 'onChange'> & {
	name?: Path<T>;
	formMethod?: UseFormReturn<T>;
};

export const DatePickerForm = <T extends FieldValues = FieldValues>(props: DatePickerFormProps<T>) => {
	const isHookFormMode = 'formMethod' in props;
	const id = useMemo(() => (props?.name || props.id) as Path<T>, [props?.name, props.id]);

	if (isHookFormMode) {
		return (
			<Controller
				name={id}
				control={props.formMethod?.control}
				render={({ field, formState }) => (
					<CustomDatePicker
						{...props}
						value={field.value}
						onChange={(value) => {
							props?.formMethod?.clearErrors(id);
							field.onChange(value);
							// field.onChange(dayjs(value).format('YYYY-MM-DD'));
						}}
						error={!!formState.errors?.[id]}
						message={formState.errors?.[id]?.message as string}
					/>
				)}
			/>
		);
	} else {
		return <CustomDatePicker {...props} />;
	}
};

const StyledForm = styled(FormControl, {
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

export interface CustomDatePickerProps extends Omit<MuiDatePickerProps<false>, 'onChange' | 'value' | 'renderInput'> {
	id: string;
	label?: string;
	placeholder?: string;
	value?: Dayjs | null;
	onChange?: (value: Dayjs | null) => void;
	error?: boolean;
	message?: string;
	disabled?: boolean;
	readOnly?: boolean;
	align?: 'left' | 'center' | 'right';
	size?: 'small' | 'medium' | 'large';
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
	id,
	value,
	onChange,
	error,
	message,
	disabled = false,
	readOnly = false,
	align,
	size = 'medium',
	...props
}) => {
	return (
		<StyledForm
			className={clsx('date-picker', { error, readonly: readOnly }, size)}
			fullWidth
			error={error}
			align={align}
			disabled={disabled}
		>
			<MuiDatePicker
				{...props}
				// ref={inputRef}
				format='YYYY-MM-DD'
				value={dayjs(value)}
				onChange={onChange}
				slotProps={{
					textField: {
						size: 'small',
						id,
						fullWidth: true,
						error,
						variant: 'outlined',
						helperText: null,
						disabled: disabled,
						readOnly: readOnly,
					},
				}}
			/>
			{message && <Tooltip message={message} color={error ? 'error' : 'action'} />}
		</StyledForm>
	);
};
