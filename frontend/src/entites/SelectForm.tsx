import React from 'react';
import {
	InputLabel,
	MenuItem,
	Select as MuiSelect,
	FormControl,
	FormHelperText,
	SelectChangeEvent,
	SelectProps as MuiSelectProps,
} from '@mui/material';
import { Controller, Control, FieldValues } from 'react-hook-form';
import { styled } from '@styles/stitches.config';

export type OptionType = { label: string; value: string };

type SelectFormProps<T extends FieldValues = FieldValues> = SelectProps & {
	// 1. react-hook-form 방식일 경우
	name?: keyof T;
	control?: Control<FieldValues>;
};

export const SelectForm = <T extends FieldValues = FieldValues>(props: SelectFormProps<T>) => {
	const isHookFormMode = 'control' in props && 'name' in props;

	// react-hook-form 방식
	if (isHookFormMode) {
		return (
			<Controller
				name={props.name as string}
				control={props.control}
				// defaultValue={defaultValue}
				render={({ field, fieldState }) => (
					<Select
						{...props}
						value={field.value ?? ''}
						onChange={field.onChange}
						error={!!fieldState.error}
						message={fieldState.error?.message}
					/>
				)}
			/>
		);
	} else {
		return (
			<Select
				{...props}
			/>
		);
	}
};

const StyledForm = styled(FormControl, {
  '.MuiOutlinedInput-notchedOutline': {
    borderColor: 'unset !important',
    borderWidth: '1px !important'
  },
  
  '.MuiSelect-root > .MuiSelect-select': {
		padding: '0 $10',
		lineHeight: '36px',
		height: '36px',
  },
  
	'.MuiInputBase-sizeSmall > .MuiSelect-select': {
		padding: '0 $10',
		lineHeight: '28px',
		height: '28px',
	},
});

interface SelectProps {
	id: string;
	options: OptionType[];

	value?: string;
	onChange?: (value: string) => void;

	width?: string | number;
	label?: string;
	placeholder?: string;
	error?: boolean;
	message?: string;
	defaultValue?: string;
	fullWidth?: boolean;
	disabled?: boolean;
	size?: MuiSelectProps['size'];
}

export const Select: React.FC<SelectProps> = ({
	id,
	value,
	options,
	onChange,
	label,
	placeholder,
	fullWidth = true,
	disabled = false,
	size = 'small',
	error,
	message,
	defaultValue,
	width,
}) => {
	const onChangeSelect = (e: SelectChangeEvent<string | number>) => {
		onChange?.(e?.target?.value?.toString());
	};

	return (
		<StyledForm fullWidth={width ? false : fullWidth} size={size} disabled={disabled} error={error}>
			{label && <InputLabel id={`label-${id}`}>{label}</InputLabel>}

			<MuiSelect
				size={size}
				labelId={`label-${id}`}
				id={id}
				label={label}
				value={value}
				onChange={onChangeSelect}
				displayEmpty={!!placeholder}
				defaultValue={defaultValue}
				style={{ width }}
			>
				{placeholder && (
					<MenuItem value='' disabled>
						{placeholder}
					</MenuItem>
				)}

				{options.map((option) => (
					<MenuItem key={option.value} value={option.value}>
						{option.label}
					</MenuItem>
				))}
			</MuiSelect>

			{message && <FormHelperText>{message}</FormHelperText>}
		</StyledForm>
	);
};
