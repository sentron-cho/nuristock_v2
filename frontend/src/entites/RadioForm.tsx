import React, { useMemo } from 'react';
import { FormLabel, RadioGroup, FormControlLabel, Radio, FormHelperText } from '@mui/material';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import clsx from 'clsx';
import { OptionType } from '@shared/config/common.type';
import { StyledRadioForm } from './RadioForm.style';

export type RadioOptionType = OptionType;

type RadioFormProps<T extends FieldValues = FieldValues> = RadioProps & {
	name?: keyof T;
	formMethod?: UseFormReturn<T>;
};

export const RadioForm = <T extends FieldValues = FieldValues>(props: RadioFormProps<T>) => {
	const isHookFormMode = 'formMethod' in props;
	const id = useMemo(() => (props?.name || props.id) as Path<T>, [props?.name, props.id]);

	if (isHookFormMode) {
		return (
			<Controller
				name={id}
				control={props?.formMethod?.control}
				render={({ field, fieldState }) => (
					<RadioBase
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
		return <RadioBase {...props} />;
	}
};
interface RadioProps {
	id: string;
	options: RadioOptionType[];

	value?: string;
	onChange?: (value: string) => void;

	label?: string;
	error?: boolean;
	message?: string;
	row?: boolean;
	disabled?: boolean;

	onClearError?: (id: string) => void;
}

const RadioBase: React.FC<RadioProps> = ({
	id,
	value,
	options,
	onChange,
	onClearError,
	label,
	error,
	message,
	row = false,
	disabled = false,
}) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e.target.value.toString());
		onClearError?.(id);
	};

	return (
		<StyledRadioForm
			className={clsx('radio-form', { error })}
			// component='fieldset'
			error={error}
			disabled={disabled}
		>
			{label && <FormLabel component='legend'>{label}</FormLabel>}

			<RadioGroup id={id} value={value} onChange={handleChange} row={row} name={id}>
				{options.map((option) => (
					<FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
				))}
			</RadioGroup>

			{message && <FormHelperText>{message}</FormHelperText>}
		</StyledRadioForm>
	);
};
