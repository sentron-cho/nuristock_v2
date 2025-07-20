import React, { useMemo, useState } from 'react';
import { Autocomplete, AutocompleteProps, TextField as MuiTextField } from '@mui/material';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import clsx from 'clsx';
import { Tooltip } from '@entites/Tooltip';
import { StyledTextFieldForm } from './TextFieldForm.style';
import { OptionType } from '@shared/config/common.type';

export type SelectOptionType = OptionType;

type AutoCompleteFormProps<
	T extends FieldValues = FieldValues,
	OptionType = any,
> = BaseAutoCompleteProps<SelectOptionType> & {
	name?: Path<T>;
	formMethod?: UseFormReturn<T>;
};

export const AutoCompleteForm = <T extends FieldValues = FieldValues>(props: AutoCompleteFormProps<T>) => {
	const isHookFormMode = 'formMethod' in props;
	const id = useMemo(() => (props?.name || props.id) as Path<T>, [props?.name, props.id]);

	if (isHookFormMode) {
		return (
			<Controller
				name={id}
				control={props.formMethod?.control}
				render={({ field, formState }) => (
					<AutoComplete
						{...props}
						id={id}
						value={field.value ?? null}
						onChange={(_, newValue) => {
							props?.formMethod?.clearErrors(id);
							field.onChange(newValue);
							props?.onChange?.(_, newValue);
						}}
						error={!!formState.errors[id]}
						message={formState.errors[id]?.message as string}
					/>
				)}
			/>
		);
	} else {
		return <AutoComplete {...props} id={id} />;
	}
};

interface BaseAutoCompleteProps<SelectOptionType>
	extends Omit<AutocompleteProps<SelectOptionType, false, false, false>, 'renderInput' | 'onChange' | 'value'> {
	id: string;
	label?: string;
	placeholder?: string;

	value?: SelectOptionType | null;
	onChange?: (event: React.SyntheticEvent, value: SelectOptionType | null) => void;

	error?: boolean;
	message?: string;
	disabled?: boolean;
	readOnly?: boolean;
}

const AutoComplete = <SelectOptionType,>({
	id,
	label,
	placeholder,
	value,
	onChange,
	error,
	message,
	disabled = false,
	readOnly = false,
	...props
}: BaseAutoCompleteProps<SelectOptionType>) => {
	const [innerError, setInnerError] = useState<string>();

	const isError = useMemo(() => error || !!innerError, [error, innerError]);

	return (
		<StyledTextFieldForm
			className={clsx('autocomplete-form', { error: isError, readonly: readOnly, disabled })}
			fullWidth
			error={isError}
			disabled={disabled}
		>
			<Autocomplete
				{...props}
				id={id}
				value={value}
				onChange={(e, v) => {
					console.log({ v, e });
					onChange?.(e, v);
				}}
				getOptionLabel={(option) => {
					console.log(option);
					return (option as SelectOptionType)?.label as string;
				}}
				readOnly={readOnly}
				disabled={disabled}
				renderInput={(params) => (
					<MuiTextField
						{...params}
						variant='outlined'
						label={label}
						placeholder={placeholder}
						error={isError}
						onFocus={(e) => {
							console.log(e.target.select());

							if (!readOnly) e.target.select();
						}}
					/>
				)}
			/>
			{message && <Tooltip message={message} color={error ? 'error' : 'action'} />}
			{innerError && <Tooltip message={innerError} color='error' />}
		</StyledTextFieldForm>
	);
};
