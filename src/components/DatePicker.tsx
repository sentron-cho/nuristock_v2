import { styled } from '@stitches/react';
import DatePicker, { registerLocale } from 'react-datepicker';
import ko from 'date-fns/locale/ko';
import '@/assets/scss/react-datepicker.scss';
import { LegacyRef, forwardRef, useEffect, useState } from 'react';

const StyledComponent = styled('div', {
	position: 'relative',
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	zIndex: '99',

	input: {
		height: '35px',
		border: '1px solid $border',
		borderRadius: '4px',
		minWidth: '100px',
		width: '100%',
		paddingLeft: '10px !important',
	},

	'.icon': {
		position: 'absolute',
		right: '0px',
		width: '20px',
		height: '20px',
		stroke: '$secondary',
		fill: '$secondary',
		zIndex: '0',
	},
});

const DateTime = forwardRef(
	(
		{
			placeholder,
			defaultValue,
			onChange,
		}: {
			placeholder?: string;
			defaultValue?: Date | null;
			onChange?: (value: Date) => void;
		},
		ref?: LegacyRef<any>
	) => {
		const [value, setValue] = useState<Date | null>(null);

		const onChangeValue = (value: Date) => {
			setValue(value);
			onChange && onChange(value);
		};

		useEffect(() => {
			defaultValue && setValue(defaultValue);
		}, [defaultValue]);

		registerLocale('ko', ko);

		return (
			<StyledComponent>
				<DatePicker
					dateFormat='yyyy-MM-dd'
					className='date-form'
					selected={value}
					ref={ref}
					// value={moment(date).format('YYYY-MM-DD')}
					calendarIconClassname={'icon'}
					showIcon={true}
					locale='ko'
					placeholderText={placeholder}
					onChange={onChangeValue}
				/>
			</StyledComponent>
		);
	}
);

export default DateTime;
