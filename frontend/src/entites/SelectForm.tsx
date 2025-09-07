import React, { useMemo } from 'react';
import {
	InputLabel,
	MenuItem,
	Select as MuiSelect,
	SelectChangeEvent,
	SelectProps as MuiSelectProps,
} from '@mui/material';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import clsx from 'clsx';
import { OptionType } from '@shared/config/common.type';
import { Tooltip } from './Tooltip';
import { StyledSelectForm } from './SelectForm.style';

export type SelectOptionType = OptionType;

export type SelectFormProps<T extends FieldValues = FieldValues> = SelectProps & {
	name?: keyof T;
	formMethod?: UseFormReturn<T>;
};

export const SelectForm = <T extends FieldValues = FieldValues>(props: SelectFormProps<T>) => {
	const isHookFormMode = 'formMethod' in props;
	const id = useMemo(() => (props?.name || props.id) as Path<T>, [props?.name, props.id]);

	// react-hook-form 방식
	if (isHookFormMode) {
		return (
			<Controller
				name={id}
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

export interface SelectProps {
	id?: string;
	options?: SelectOptionType[];

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
	readonly?: boolean;
	size?: MuiSelectProps['size'];
	className?: string;
	border?: boolean;
	popperProps?: {
		className?: string;
	}

	onClearError?: (id: string) => void;
}

export const Select: React.FC<SelectProps> = ({
	id = 'select',
	value,
	options,
	onChange,
	onClearError,
	label,
	placeholder,
	fullWidth = true,
	disabled = false,
	readonly = false,
	size = 'small',
	error,
	message,
	defaultValue,
	width,
	className,
	border = true,
	popperProps,
}) => {
	const handleChange = (e: SelectChangeEvent<string | number>) => {
		onChange?.(e?.target?.value?.toString());
		onClearError?.(id);
	};

	return (
		<StyledSelectForm
			className={clsx('select-form', size, { error, border, disabled, readonly }, className)}
			fullWidth={width ? false : fullWidth}
			size={size}
			disabled={disabled || readonly}
			error={error}
			style={{ width }}
		>
			{options && (
				<>
					{label && <InputLabel id={`label-${id}`}>{label}</InputLabel>}

					<MuiSelect
						size={size}
						labelId={`label-${id}`}
						id={id}
						label={label}
						// value={innerValue}
						value={value || defaultValue || ''}
						onChange={handleChange}
						displayEmpty={!!placeholder}
						MenuProps={{
							className: clsx('select-popper', popperProps?.className),
						}}
						// defaultValue={defaultValue}
						// style={{ width }}
					>
						{placeholder && (
							<MenuItem value='' disabled>
								{placeholder}
							</MenuItem>
						)}

						{options?.map((option) => (
							<MenuItem key={option.value} value={option.value}>
								{option.label}
							</MenuItem>
						))}
					</MuiSelect>

					{message && <Tooltip message={message} color={error ? 'error' : 'action'} />}
					{/* {innerError && <Tooltip message={innerError} color={'error'} />} */}
				</>
			)}
		</StyledSelectForm>
	);
};
