import React, { useMemo } from 'react';
import { Controller, FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { DatePicker as MuiDatePicker, DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { Tooltip } from '@entites/Tooltip';
import clsx from 'clsx';
import dayjs, { Dayjs } from 'dayjs';
import { StyledDatePickerForm } from './DatePickerForm.style';
import { ST } from '@shared/config/kor.lang';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ko';
import updateLocale from 'dayjs/plugin/updateLocale';

type DatePickerFormProps<T extends FieldValues = FieldValues> = DatePickerProps & {
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
					<DatePicker
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
		return <DatePicker {...props} />;
	}
};

export interface DatePickerProps extends Omit<MuiDatePickerProps<false>, 'onChange' | 'value' | 'renderInput'> {
	id: string;
	label?: string;
	placeholder?: string;
	value?: Dayjs | null;
	onChange?: (value: Dayjs | null) => void;
	error?: boolean;
	message?: string;
	disabled?: boolean;
	readOnly?: boolean;
	align?: 'left' | 'center' | 'right';
	size?: 'small' | 'medium' | 'large';
	showInputForm?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
	id,
	value,
	onChange,
	error,
	message,
	disabled = false,
	readOnly = false,
	align,
	size = 'medium',
	showInputForm = true,
	...props
}) => {
	dayjs.extend(updateLocale);

	// ✅ ko 로케일의 month/shortMonth를 '1월' ~ '12월'로 재정의
	dayjs.updateLocale('ko', {
		months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
		monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
	});

	return (
		<StyledDatePickerForm
			className={clsx('date-picker', { error, readonly: readOnly }, size)}
			fullWidth
			error={error}
			align={align}
			disabled={disabled}
			style={!showInputForm ? { display: 'none' } : {}}
		>
			<LocalizationProvider
				dateAdapter={AdapterDayjs}
				adapterLocale='ko'
				localeText={{
					todayButtonLabel: ST.TODAY,
					datePickerToolbarTitle: '', // 툴바 툴팁 제거
					okButtonLabel: ST.OK,
					cancelButtonLabel: ST.CANCEL,
				}}
			>
				<MuiDatePicker
					format='YYYY-MM-DD'
					slotProps={{
						textField: {
							size: 'small',
							id,
							fullWidth: true,
							error,
							variant: 'outlined',
							helperText: null,
							disabled: disabled,
							readOnly: readOnly,
						},
						actionBar: {
							actions: ['today', 'accept', 'cancel'], // ✅ 오늘 버튼 추가
						},
					}}
					slots={
						{
							// actionBar: ActionBar,
							// toolbar: () => <PickersToolbar {...props} toolbarTitle="" />, // ✅ 툴바 전체 제거
						}
					}
					value={dayjs(value)}
					onChange={onChange}
					{...props}
				/>
			</LocalizationProvider>
			{message && <Tooltip message={message} color={error ? 'error' : 'action'} />}
		</StyledDatePickerForm>
	);
};

// type ActionBarProps = React.ComponentProps<typeof PickersActionBar>; // ✅ 안전한 타입 추론

// const ActionBar = (props: ActionBarProps) => {
// 	const {
// 		onAccept,
// 		onCancel,
// 		actions, // 기본 액션들
// 		setValue,
// 	} = props as ActionBarProps & FieldValues;

// 	const handleToday = () => {
// 		setValue?.(dayjs());
// 		onAccept?.();
// 	};

// 	return (
// 		<Flex style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 8 }}>
// 			<Button onClick={handleToday} title={ST.TODAY} />
// 			{actions?.includes('cancel') && <Button onClick={onCancel}>취소</Button>}
// 			{actions?.includes('accept') && (
// 				<Button variant='contained' onClick={onAccept}>
// 					확인
// 				</Button>
// 			)}
// 		</Flex>
// 	);
// };
