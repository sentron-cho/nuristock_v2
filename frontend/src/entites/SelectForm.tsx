import React, { useMemo } from 'react';
import {
	InputLabel,
	MenuItem,
	Select as MuiSelect,
	FormControl,
	FormHelperText,
	SelectChangeEvent,
	SelectProps as MuiSelectProps,
} from '@mui/material';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { styled } from '@styles/stitches.config';

export type OptionType = { label: string; value: string };

export type SelectOptionType = OptionType;

type SelectFormProps<T extends FieldValues = FieldValues> = SelectProps & {
	name?: keyof T;
	formMethod?: UseFormReturn<FieldValues>;
};

export const SelectForm = <T extends FieldValues = FieldValues>(props: SelectFormProps<T>) => {
	const isHookFormMode = 'control' in props;
	const id = useMemo(() => (props?.name || props.id) as string, [props?.name, props.id]);

	// react-hook-form 방식
	if (isHookFormMode) {
		return (
			<Controller
				name={id as Path<T>}
				control={props?.formMethod?.control}
				// defaultValue={defaultValue}
				render={({ field, fieldState }) => (
					<Select
						{...props}
						value={field.value ?? ''}
						onChange={(value) => {
							props?.formMethod?.clearErrors(id);
							field.onChange(value);
						}}
						error={!!fieldState.error}
						message={fieldState.error?.message}
					/>
				)}
			/>
		);
	} else {
		return <Select {...props} />;
	}
};

const StyledForm = styled(FormControl, {
	'.MuiOutlinedInput-notchedOutline': {
		borderColor: 'unset !important',
		borderWidth: '1px !important',
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
	options: SelectOptionType[];

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

	onClearError?: (id: string) => void;
}

export const Select: React.FC<SelectProps> = ({
	id,
	value,
	options,
	onChange,
	onClearError,
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
	const handleChange = (e: SelectChangeEvent<string | number>) => {
		onChange?.(e?.target?.value?.toString());
		onClearError?.(id);
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
				onChange={handleChange}
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
