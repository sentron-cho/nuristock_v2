import React, { useMemo } from 'react';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { DatePicker as MuiDatePicker, DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@styles/stitches.config';
import { FormControl } from '@mui/material';
import { Tooltip } from '@entites/Tooltip';
import clsx from 'clsx';
import dayjs, { Dayjs } from 'dayjs';

type DatePickerFormProps<T extends FieldValues = FieldValues> = Omit<CustomDatePickerProps, 'value' | 'onChange'> & {
	name?: Path<T>;
	formMethod?: UseFormReturn<T>;
};

export const DatePickerForm = <T extends FieldValues = FieldValues>(props: DatePickerFormProps<T>) => {
	const isHookFormMode = 'formMethod' in props;
	const id = useMemo(() => (props?.name || props.id) as Path<T>, [props?.name, props.id]);

	if (isHookFormMode) {
		return (
			<Controller
				name={id}
				control={props.formMethod?.control}
				render={({ field, formState }) => (
					<CustomDatePicker
						{...props}
						value={field.value}
            onChange={(value) => {
							props?.formMethod?.clearErrors(id);
							field.onChange(value);
							// field.onChange(dayjs(value).format('YYYY-MM-DD'));
            }}
						error={!!formState.errors?.[id]}
						message={formState.errors?.[id]?.message as string}
					/>
				)}
			/>
		);
	} else {
		return <CustomDatePicker {...props} />;
	}
};

const StyledForm = styled(FormControl, {
	'&.date-picker': {
		'.MuiInputAdornment-positionEnd': {
			marginRight: '-8px',
		},
		'&.error': {
			'.MuiPickersSectionList-root': {
				paddingRight: '6px',
			},
			'.MuiPickersOutlinedInput-notchedOutline': {
				borderColor: '$red !important',
				borderWidth: '1px !important',
			},

			'.tooltip.icon': {
				marginRight: '22px',
			},
		},

		'.MuiPickersOutlinedInput-notchedOutline': {
			borderColor: '$gray800 !important',
			borderWidth: '1px !important',
		},

		// '.MuiInputBase-input': {
		// 	padding: '0 $10',
		// 	lineHeight: '20px',
		// 	height: '36px',
		// },
	},
	variants: {
		align: {
			right: { '.MuiPickersSectionList-root': { justifyContent: 'flex-end' } },
			left: { '.MuiPickersSectionList-root': { justifyContent: 'flex-start' } },
			center: { '.MuiPickersSectionList-root': { justifyContent: 'center' } },
		},
	},
});

export interface CustomDatePickerProps extends Omit<MuiDatePickerProps<false>, 'onChange' | 'value' | 'renderInput'> {
	id: string;
	label?: string;
	placeholder?: string;
	value?: Dayjs | null;
	onChange?: (value: Dayjs | null) => void;
	error?: boolean;
	message?: string;
	disabled?: boolean;
	align?: 'left' | 'center' | 'right';
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
	id,
	value,
	onChange,
	error,
	message,
	disabled = false,
  align,
  // inputRef,
	...props
}) => {
	// console.log({ value: value || new Date() });
	// const inputRef = useRef<HTMLInputElement>(null);

	// // 오류 발생 시 자동 포커스
	// useEffect(() => {
  //   if (error) {
  //     const el = inputRef.current?.getElementsByClassName('MuiPickersSectionList-section');
	// 		el?.[0] && (el?.[0]?.getElementsByClassName('MuiPickersSectionList-sectionContent')?.[0] as HTMLDivElement)?.focus();
	// 	}
  // }, [error]);
  
  // const [open, setOpen] = useState<boolean>();

  // useEffect(() => setOpen(!!error), [error])

	return (
		<StyledForm className={clsx('date-picker', { error })} fullWidth error={error} align={align} disabled={disabled}>
			<MuiDatePicker
        {...props}
        // ref={inputRef}
				format='YYYY-MM-DD'
				value={dayjs(value)}
				onChange={onChange}
				slotProps={{
					textField: {
						size: 'small',
						id,
						fullWidth: true,
						error,
						variant: 'outlined',
						helperText: null,
					},
        }}
        // open={open}
			/>
			{message && <Tooltip message={message} color={error ? 'error' : 'action'} />}
		</StyledForm>
	);
};
