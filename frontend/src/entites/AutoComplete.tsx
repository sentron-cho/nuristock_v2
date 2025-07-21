import { useMemo, useState } from 'react';
import { Autocomplete, AutocompleteProps, TextField as MuiTextField, SelectProps } from '@mui/material';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import clsx from 'clsx';
import { Tooltip } from '@entites/Tooltip';
import { OptionType } from '@shared/config/common.type';
import { StyledAutoCompleteForm } from './AutoComplete.style';

export type SelectOptionType = OptionType;

type AutoCompleteFormProps<T extends FieldValues = FieldValues> = BaseAutoCompleteProps<SelectOptionType> & {
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
						onChange={(option) => {
							props?.formMethod?.clearErrors(id);
							field.onChange(option);
							props?.onChange?.(option);
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
	extends Omit<AutocompleteProps<SelectOptionType, false, false, false>, 'renderInput' | 'onChange' | 'value' | 'size'> {
	id: string;
	label?: string;
	placeholder?: string;

	value?: SelectOptionType | null;
	onChange?: (value: SelectOptionType | null) => void;

	error?: boolean;
	message?: string;
	disabled?: boolean;
	readOnly?: boolean;
	size?: 'small' | 'medium' | 'large';
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
	size = 'medium',
	...props
}: BaseAutoCompleteProps<SelectOptionType>) => {
	// const [innerError, setInnerError] = useState<string>();

	// const isError = useMemo(() => error || !!innerError, [error, innerError]);

	return (
		<StyledAutoCompleteForm
			className={clsx('autocomplete-form', size, { error: error, readonly: readOnly, disabled })}
			fullWidth
			error={error}
			disabled={disabled}
		>
			<Autocomplete
				{...props}
				id={id}
				value={value}
				onChange={(_e, v) => {
					onChange?.(v);
				}}
				readOnly={readOnly}
				disabled={disabled}
				slotProps={{
					popper: { className: clsx('autocomplete-popper', size) },
				}}
				renderInput={(params) => (
					<MuiTextField
						{...params}
						variant='outlined'
						label={label}
						placeholder={placeholder}
						error={error}
						onFocus={(e) => {
							console.log(e.target.select());

							if (!readOnly) e.target.select();
						}}
					/>
				)}
			/>
			{message && <Tooltip message={message} color={error ? 'error' : 'action'} />}
			{/* {innerError && <Tooltip message={innerError} color='error' />} */}
		</StyledAutoCompleteForm>
	);
};
