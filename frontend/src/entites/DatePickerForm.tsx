import React, { useMemo } from 'react';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { DatePicker as MuiDatePicker, DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { Tooltip } from '@entites/Tooltip';
import clsx from 'clsx';
import dayjs, { Dayjs } from 'dayjs';
import { StyledDatePickerForm } from './DatePickerForm.style';

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
		<StyledDatePickerForm
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
		</StyledDatePickerForm>
	);
};
