import React, { useMemo, useState } from 'react';
import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { Tooltip } from '@entites/Tooltip';
import clsx from 'clsx';
import { withCommas } from '@shared/libs/utils.lib';
import { StyledTextInputForm } from './TextInputForm.style';
import { ST } from '@shared/config/kor.lang';

export type TextInputFormProps<T extends FieldValues = FieldValues> = TextInputProps & {
	name?: keyof T;
	formMethod?: UseFormReturn<T>;
};

export const TextInputForm = <T extends FieldValues = FieldValues>(props: TextInputFormProps<T>) => {
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
								props?.onChange?.(value);
							}}
							inputRef={field.ref}
							error={!!formState?.errors[id]}
							message={formState?.errors[id]?.message as string}
						/>
					);
				}}
			/>
		);
	} else {
		return <TextField {...props} />;
	}
};

export interface TextInputProps extends Omit<MuiTextFieldProps, 'onChange'> {
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
	align?: 'left' | 'center' | 'right';
	withComma?: boolean;
	readOnly?: boolean;

	onClearError?: (id: string) => void;
}

const TextField: React.FC<TextInputProps> = ({
	id,
	value,
	onChange,
	onClearError,
	error,
	message,
	disabled = false,
	maxLength,
	align,
	withComma,
	readOnly,
	...props
}) => {
	const [innerError, setInnerError] = useState<string>();
	const [isComposing, setIsComposing] = useState(false);

	const isError = useMemo(() => error || !!innerError, [error, innerError]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e?.target?.value?.toString();
		if (withComma) {
			value = withCommas(withCommas(value, true))?.toString() || value;
		}

		onChange?.(value);
		onClearError?.(id);
	};

	return (
		<StyledTextInputForm
			className={clsx('text-input', { error: isError, readonly: readOnly, disabled })}
			fullWidth
			error={isError}
			disabled={disabled}
			align={align}
		>
			<MuiTextField
				{...props}
				id={id}
				onChange={handleChange}
				value={value}
				variant='outlined'
				slotProps={{
					input: {
						readOnly: readOnly,
						disabled: disabled,
						...(props?.slotProps?.input || {}),
					},
				}}
				onFocus={(e) => {
					if (!readOnly && !isComposing) {
						setTimeout(() => e.target.select(), 0); // IME 처리 후 실행
					}
				}}
				onCompositionStart={() => setIsComposing(true)}
				onCompositionEnd={() => setIsComposing(false)}
				fullWidth
				onBeforeInput={(e) => {
					const target = e.target as HTMLInputElement;

					if (maxLength && target?.value?.length >= maxLength) {
						if (target.selectionStart !== target.selectionEnd) return;

						setInnerError(`최대 ${maxLength}자 입력`);
						setTimeout(() => setInnerError(undefined), 3000);
						e.preventDefault();
					}

					props?.onBeforeInput?.(e);
				}}
			/>
			{message && <Tooltip message={message} color={error ? 'error' : 'action'} />}
			{innerError && <Tooltip message={innerError} color={'error'} />}
		</StyledTextInputForm>
	);
};

export const NumberInputForm = <T extends FieldValues = FieldValues>(props: TextInputFormProps<T>) => {
	return (
		<TextInputForm
			placeholder={ST.IN_NUMBER}
			withComma
			size='small'
			align='right'
			inputMode='numeric'
			slotProps={{
				input: {
					inputProps: {
						inputMode: 'numeric',
						pattern: '[0-9]*',
					},
				},
			}}
			{...props}
		/>
	);
};
