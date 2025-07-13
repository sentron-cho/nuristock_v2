import React, { useMemo, useState } from 'react';
import { TextField as MuiTextField, FormControl, TextFieldProps as MuiTextFieldProps } from '@mui/material';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Tooltip } from '@entites/Tooltip';
import clsx from 'clsx';
import { styled } from '@styles/stitches.config';

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
					return (
						<TextField
							{...props}
							value={field.value ?? ''}
							onChange={(value) => {
								props?.formMethod?.clearErrors(id);
								field.onChange(value);
							}}
							error={!!formState?.errors[props?.name || props.id]}
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

const StyledForm = styled(FormControl, {
	'&.text-field': {
		'&.error': {
			'.MuiOutlinedInput-notchedOutline': {
				borderColor: '$red !important',
				borderWidth: '1px !important',
			},
		},

		'.MuiOutlinedInput-notchedOutline': {
			borderColor: 'unset !important',
			borderWidth: '1px !important',
		},

		'.MuiInputBase-input': {
			padding: '0 $10',
			lineHeight: '36px',
			height: '36px',
		},

		'.MuiInputBase-sizeSmall > .MuiSelect-select': {
			padding: '0 $10',
			lineHeight: '28px',
			height: '28px',
		},
	},
});

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
	maxLength?: number;

	onClearError?: (id: string) => void;
}

const TextField: React.FC<TextFieldProps> = ({
	id,
	value,
	onChange,
	onClearError,
	error,
	message,
	disabled = false,
	maxLength,
	...props
}) => {
	const [innerError, setInnerError] = useState<string>();

	const isError = useMemo(() => error || !!innerError, [error, innerError]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e.target.value?.toString());
		onClearError?.(id);
	};

	return (
		<StyledForm className={clsx('text-field', { error: isError })} fullWidth error={isError} disabled={disabled}>
			<MuiTextField
				{...props}
				id={id}
				onChange={handleChange}
				value={value}
				variant='outlined'
				fullWidth
				onBeforeInput={(e) => {
					const target = e.target as HTMLInputElement;

					if (maxLength && target?.value?.length >= maxLength) {
						if (target.selectionStart !== target.selectionEnd) return;

						setInnerError(`최대 ${maxLength}자 입력`);
						setTimeout(() => setInnerError(undefined), 3000);
						e.preventDefault();
					}
				}}
			/>
			{message && <Tooltip message={message} color={error ? 'error' : 'action'} />}
			{innerError && <Tooltip message={innerError} color={'error'} />}
		</StyledForm>
	);
};
