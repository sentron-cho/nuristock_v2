import React, { useMemo } from 'react';
import {
	InputLabel,
	MenuItem,
	Select as MuiSelect,
	FormControl,
	SelectChangeEvent,
	SelectProps as MuiSelectProps,
} from '@mui/material';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
import { OptionType } from '@shared/config/common.type';

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
	'&.select-form': {
		'&.error': {
			'.MuiOutlinedInput-notchedOutline': {
				borderColor: '$red !important',
				borderWidth: '1px !important',
			},
		},

		border: '1px solid $gray800',
		borderRadius: '$xs',

		'&.small': {
			lineHeight: '$formSmall',
			height: '$formSmall',
		},

		'&.medium': {
			lineHeight: '$formMedium',
			height: '$formMedium',
		},

		'&.large': {
			lineHeight: '$formLarge',
			height: '$formLarge',
		},

		'.MuiOutlinedInput-notchedOutline': {
			borderColor: 'transparent !important',
			borderWidth: '1px !important',
		},

		'.MuiSelect-root > .MuiSelect-select': {
			padding: '0 $10',
			lineHeight: '$formMedium',
			height: '$formMedium',
		},

		'.MuiInputBase-sizeSmall > .MuiSelect-select': {
			padding: '0 $10',
			lineHeight: '$formSmall',
			height: '$formSmall',
		},

		'.MuiInputBase-sizeLarge > .MuiSelect-select': {
			padding: '0 $10',
			lineHeight: '$formLarge',
			height: '$formLarge',
		},
	},
});

interface SelectProps {
	id: string;
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

	console.log({ defaultValue, options, message });

	return (
		<StyledForm
			className={clsx('select-form', size, { error })}
			fullWidth={width ? false : fullWidth}
			size={size}
			disabled={disabled}
			error={error}
		>
			{label && <InputLabel id={`label-${id}`}>{label}</InputLabel>}

			{options && <MuiSelect
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

				{options?.map((option) => (
					<MenuItem key={option.value} value={option.value}>
						{option.label}
					</MenuItem>
				))}
			</MuiSelect>}

			{/* {message && <FormHelperText>{message}</FormHelperText>} */}
		</StyledForm>
	);
};
