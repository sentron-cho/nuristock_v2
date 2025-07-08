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

// // 🎯 1. react-hook-form 방식
// type HookFormProps<T extends FieldValues> = {
// 	control: Control<FieldValues>;
// 	name: keyof T;
// 	value: string;
// 	onChange: (event: SelectChangeEvent<string>) => void;
// };

// // 🎯 2. value/onChange 방식
// type ValueChangedProps = {
// 	value: string;
// 	onChange: (event: SelectChangeEvent<string>) => void;
// 	control?: never;
// 	name?: never;
// };

type SelectFormProps<T extends FieldValues = FieldValues> = SelectProps & {
	// 1. react-hook-form 방식일 경우
	name?: keyof T;
	control?: Control<FieldValues>;

	// 2. value/onChange 방식일 경우
	// value?: string;
	// onChange?: (value: string) => void;

	// 공통
	// defaultValue?: string;
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
						// id={id}
						// label={label}
						// options={options}
						// placeholder={placeholder}
						// disabled={disabled}
						// size={size}
						// defaultValue={defaultValue}
						// fullWidth={fullWidth}
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
				// id={id}
				// value={props.value}
				// onChange={props.onChange}
				// label={label}
				// options={options}
				// placeholder={placeholder}
				// fullWidth={fullWidth}
				// disabled={disabled}
				// size={size}
				// error={error}
				// message={message}
				// defaultValue={defaultValue}
			/>
		);
	}

	// value / onChange 방식
	// if ('value' in props && 'onChange' in props) {
	// 	const { value, onChange } = props;

	// 	return (
	// 		<Select
	// 			id={selectId}
	// 			label={label}
	// 			value={value}
	// 			onChange={onChange}
	// 			options={options}
	// 			placeholder={placeholder}
	// 			fullWidth={fullWidth}
	// 			disabled={disabled}
	// 			size={size}
	// 		/>
	// 	);
	// }

	// console.error('SelectForm: control+name 또는 value+onChange 중 하나는 필수입니다.');
	// return null;
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
