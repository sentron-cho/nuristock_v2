import { useMemo, useState } from 'react';
import { styled } from '@styles/stitches.config';
import { CalendarCell, CalendarTypeData } from './CalendarCell.ui';
import dayjs from 'dayjs';
import Flex from '@entites/Flex';
import { SubTitle, Title } from '@entites/Title';
import { IconArrowLeft, IconArrowRight } from '@entites/Icons';
import clsx from 'clsx';
import { DatePicker } from '@entites/DatePickerForm';

const StyledFlex = styled(Flex, {
	'&.diary-view': {
		'.cal-title-bar': {
			height: '40px',

			'.icon': {
				width: '80px',
				height: '100%',
				padding: '4px',
			},
		},

		'.cal-view': {
			padding: '10px',
			width: '100%',
			display: 'grid',
			gridTemplateColumns: 'repeat(7, 1fr)',
			gap: 2,
			borderTop: '1px solid $gray400',
			borderBottom: '1px solid $gray700',

			'.head': {
				paddingBottom: '10px',
				textAlign: 'center',
			},
		},
	},
});

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

export const CalendarView = ({
	data,
	date: today = dayjs(),
	onChangeMonth,
	onChangeDate,
}: {
	data?: Record<string, CalendarTypeData>;
	date?: dayjs.Dayjs;
	onChangeMonth?: (value?: dayjs.Dayjs) => void;
	onChangeDate?: (value?: dayjs.Dayjs) => void;
}) => {
	const [open, setOpen] = useState<boolean>(false);
	// const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>();

	const dates = useMemo(() => {
		const start = today.startOf('month').startOf('week');
		const end = today.endOf('month').endOf('week');
		const dateArray: dayjs.Dayjs[] = [];

		for (let d = start; d.isBefore(end) || d.isSame(end); d = d.add(1, 'day')) {
			dateArray.push(d);
		}

		return dateArray;
	}, [today]);

	const onChange = (eid: 'prev' | 'next' | 'now') => {
		let selected: dayjs.Dayjs = dayjs(today);
		switch (eid) {
			case 'prev':
				selected = dayjs(selected).add(-1, 'month');
				break;
			case 'next':
				selected = dayjs(selected).add(1, 'month');
				break;
			case 'now':
				selected = dayjs();
				break;
		}

		onChangeMonth?.(dayjs(selected));
	};

	const onClose = () => {
		setOpen(false);
	};

	const onOpen = () => {
		setOpen(true);
	};

	const onSelect = (value: dayjs.Dayjs | null) => {
		// console.log(dayjs(value).format('YYYY-MM'));
		// value && setSelectedDate(value);
		onChangeMonth?.(dayjs(value));
	};

	return (
		<StyledFlex className='diary-view' direction={'column'} gap={8}>
			<Flex className='cal-title-bar' justify={'center'} align={'center'}>
				<IconArrowLeft className='icon' onClick={() => onChange('prev')} />
				<Title align='center' className='title' title={dayjs(today).format('YYYY년 MM월')} flex={1} onClick={onOpen} />
				<DatePicker
					showInputForm={false}
					id={'date-picker'}
					value={dayjs(today)}
					open={open}
					onClose={onClose}
					closeOnSelect={true}
					onChange={onSelect}
					views={['year', 'month']}
					format='YYYY-MM'
				/>
				<IconArrowRight className='icon' onClick={() => onChange('next')} />
			</Flex>

			<div className={'cal-view'}>
				{/* head */}
				{weekDays.map((v, index) => {
					const weekend = index === 0 || index === 6;
					return <SubTitle className={clsx('head', { weekend })} key={v} title={v} />;
				})}

				{dates.map((date) => {
					const formatDate = date.format('YYYY-MM-DD');
					return (
						<CalendarCell
							key={formatDate}
							date={date?.toDate()}
							isCurrentMonth={date.month() === today.month()}
							today={date.format('YYYY-MM-DD') === formatDate}
							selected={dayjs(today).format('YYYY-MM-DD') === formatDate}
							data={data?.[formatDate]} // 매수/매도 정보
							onClick={() => onChangeDate?.(date)}
						/>
					);
				})}
			</div>
		</StyledFlex>
	);
};
