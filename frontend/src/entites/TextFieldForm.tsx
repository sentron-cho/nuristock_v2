import React, { useMemo } from 'react';
import { TextField as MuiTextField, FormControl, FormHelperText, TextFieldProps as MuiTextFieldProps } from '@mui/material';
import {
	Controller,
	FieldValues,
	Path,
	UseFormReturn,
} from 'react-hook-form';

export interface TextFieldProps extends Omit<MuiTextFieldProps, 'onChange'> {
	id: string;
	label?: string;
	placeholder?: string;

	value?: string;
	onChange?: (value: string) => void;

	error?: boolean;
	message?: string;
	disabled?: boolean;
	multiline?: boolean;
	rows?: number;

	onClearError?: (id: string) => void;
};

type TextFieldFormProps<T extends FieldValues = FieldValues> = TextFieldProps & {
	name?: keyof T;
	formMethod?: UseFormReturn<T>;
};

export const TextFieldForm = <T extends FieldValues = FieldValues>(props: TextFieldFormProps<T>) => {
	const isHookFormMode = 'formMethod' in props;
	const id = useMemo(() => (props?.name || props.id) as Path<T>, [props?.name, props.id]);

	if (isHookFormMode) {
		return (
			<Controller
				name={id}
				control={props.formMethod?.control}
				render={({ field, formState }) => {
					console.log({ formState });
					return (
						<TextField
							{...props}
							value={field.value ?? ''}
							onChange={(value) => {
								props?.formMethod?.clearErrors(id);
								field.onChange(value);
							}}
							error={!!formState?.errors}
							message={formState?.errors[props?.name || props.id]?.message as string}
						/>
					);
				}}
			/>
		);
	} else {
		return <TextField {...props} />;
	}
};

const TextField: React.FC<TextFieldProps> = ({
	id,
	value,
	onChange,
	onClearError,
	error,
	message,
	disabled = false,
	...props
}) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e.target.value?.toString());
		onClearError?.(id);
	};

	return (
		<FormControl fullWidth error={error} disabled={disabled}>
			<MuiTextField
				id={id}
				onChange={handleChange}
				value={value}
				variant='outlined'
				fullWidth
				{...props}
			/>
			{message && <FormHelperText>{message}</FormHelperText>}
		</FormControl>
	);
};
