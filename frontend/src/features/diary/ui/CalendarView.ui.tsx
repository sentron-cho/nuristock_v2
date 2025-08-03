import { useEffect, useMemo, useState } from 'react';
import { styled } from '@styles/stitches.config';
import { CalendarCell, CalendarTypeData } from './CalendarCell.ui';
import dayjs from 'dayjs';
import { useFormContext } from 'react-hook-form';
import Flex from '@entites/Flex';
import { SubTitle, Title } from '@entites/Title';
import { IconArrowLeft, IconArrowRight } from '@entites/Icons';
import clsx from 'clsx';

const StyledFlex = styled(Flex, {
	'&.diary-view': {
		paddingTop: '$20',

		'.cal-title-bar': {
			'.icon': {
				width: '80px',
			},
		},

		'.cal-view': {
			padding: '10px',
			width: '100%',
			display: 'grid',
			gridTemplateColumns: 'repeat(7, 1fr)',
			gap: 2,
			borderTop: '1px solid $gray400',
			borderBottom: '1px solid $gray400',

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
	date = dayjs(),
}: {
	data?: Record<string, CalendarTypeData>;
	date?: string | dayjs.Dayjs;
}) => {
	const [selectedDate, setSelectedDate] = useState<string>(dayjs(date).format('YYYY-MM-DD'));
  const [today, setToday] = useState<dayjs.Dayjs>(dayjs(date));
  
  useEffect(() => { 
    const value = dayjs(date);
    setToday(value);
    setSelectedDate(value.format('YYYY-MM-DD'));
  }, [date]);

	const forms = useFormContext();

	const dates = useMemo(() => {
		const start = today.startOf('month').startOf('week');
		const end = today.endOf('month').endOf('week');
		const dateArray: dayjs.Dayjs[] = [];

		for (let d = start; d.isBefore(end) || d.isSame(end); d = d.add(1, 'day')) {
			dateArray.push(d);
		}

		return dateArray;
	}, [today]);

	console.log({ selectedDate });

	// const parsedData = useMemo(() => {
	//   if (!data) return undefined;

	//   const items = Object.entries(data)?.filter((a) => dayjs(a?.[0]).format('YYYYMM') === dayjs(today).format('YYYYMM'));
	//   console.log({ today: dayjs(today).format('YYYYMM'), items });
	//   return items;
	// }, [data, today]);

	const onChangeMonth = (eid: 'prev' | 'next' | 'now') => {
		let selected: dayjs.Dayjs = dayjs(selectedDate);
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

		setToday(selected);
		forms?.setValue('month', selected);
		// setSelectedDate(dayjs(selected).format('YYYY-MM-DD'));

		onSelect(dayjs(selected).format('YYYY-MM-DD'));
	};

	const onSelect = (date: string) => {
		setSelectedDate(date);
		forms?.setValue('date', date);
	};

	return (
		<StyledFlex className='diary-view' direction={'column'} gap={8}>
			<Flex className='cal-title-bar' justify={'center'} align={'center'}>
				<IconArrowLeft className='icon' onClick={() => onChangeMonth('prev')} />
				<Title
					align='center'
					className='title'
					title={dayjs(today).format('YYYY년 MM월')}
					flex={1}
					onClick={() => onChangeMonth('now')}
				/>
				<IconArrowRight className='icon' onClick={() => onChangeMonth('next')} />
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
							selected={selectedDate === formatDate}
							data={data?.[formatDate]} // 매수/매도 정보
							onClick={() => onSelect(formatDate)}
						/>
					);
				})}
			</div>
		</StyledFlex>
	);
};
