import Flex from '@entites/Flex';
import { PageContainer } from '@features/common/ui/PageContainer.ui';
import { useSelectDiary } from '@features/diary/api/diary.api';
import { useDiaryData } from '@features/diary/hook/DiaryData.hook';
import { CalendarTypeData } from '@features/diary/ui/CalendarCell.ui';
import { CalendarView } from '@features/diary/ui/CalendarView.ui';
import { ContentsView } from '@features/diary/ui/ContentsView.ui';
import { styled } from '@styles/stitches.config';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useSwipeable } from 'react-swipeable';

const StyledPage = styled(PageContainer, {
	'&.dairy': {
		height: '100vh',

		'.view-box': {
			height: '100%',
		},

		'.weekend': {
			color: '$error',
		},
	},

	'@md': {
		'&.main': {
			height: 'calc(100vh - 80px)',
		},
	},
});

export const DiaryPageMo = () => {
	const { data: diaryData } = useSelectDiary();
	const { summary, countPerDays, keeps, trades, selectedDate, setSelectedDate } = useDiaryData(
		diaryData?.keep,
		diaryData?.trade
	);

	// 캘린더 데이터(1년 매수/매도 카운트)
	const calendarData = useMemo(() => {
		const year = dayjs(selectedDate).format('YYYY');
		const temps: Record<string, CalendarTypeData> = {};

		const arrayBuys = Object.entries(countPerDays?.buys)?.filter((item) => {
			return dayjs(item?.[0]).format('YYYY') === year;
		});

		const arraySells = Object.entries(countPerDays?.sells)?.filter((item) => {
			return dayjs(item?.[0]).format('YYYY') === year;
		});

		arrayBuys?.forEach((a) => {
			!temps[a?.[0]] && (temps[a?.[0]] = { buy: { count: 0, sum: 0, type: '' } });
			temps[a[0]]['buy'] = a?.[1];
		});
		arraySells?.forEach((a) => {
			!temps[a?.[0]] && (temps[a?.[0]] = { sell: { count: 0, sum: 0, type: '' } });
			temps[a[0]]['sell'] = a?.[1];
		});

		return temps;
	}, [countPerDays, selectedDate]);

	// 컨텐츠 데이터(해당날자 매수/매도 정보)
	const contentsData = useMemo(() => {
		if (!selectedDate) return;

		const sell = trades?.filter((a) => dayjs(a.edate).format('YYYYMMDD') === dayjs(selectedDate).format('YYYYMMDD'));
		const buy = keeps?.filter((a) => dayjs(a.sdate).format('YYYYMMDD') === dayjs(selectedDate).format('YYYYMMDD'));
		return { selectedDate, sell, buy };
	}, [selectedDate]);

	// 월 전환 스와이프
	const handlerMonthSwipe = useSwipeable({
		onSwipedLeft: () => {
			setSelectedDate(dayjs(selectedDate).add(1, 'month'));
		},
		onSwipedRight: () => {
			setSelectedDate(dayjs(selectedDate).add(-1, 'month'));
		},
		trackMouse: true,
	});

	// 일 전환 스와이프
	const handlerDateSwipe = useSwipeable({
		onSwipedLeft: () => {
			setSelectedDate(dayjs(selectedDate).add(1, 'day'));
		},
		onSwipedRight: () => {
			setSelectedDate(dayjs(selectedDate).add(-1, 'day'));
		},
		trackMouse: true,
	});

	const onChangeDate = (value?: dayjs.Dayjs) => {
		value && setSelectedDate(value);
	};

	const onChangeMonth = (value?: dayjs.Dayjs) => {
		value && setSelectedDate(value);
	};

	return (
		<StyledPage className={clsx('diary', 'main')} summaryData={summary}>
			<Flex flex={1} className='view-box' direction={'column'} align={'start'}>
				{/* 캘린더 뷰 */}
				<Flex {...handlerMonthSwipe}>
					<CalendarView
						data={calendarData}
						date={selectedDate}
						onChangeMonth={onChangeMonth}
						onChangeDate={onChangeDate}
					/>
				</Flex>

				{/* 컨텐츠 뷰 */}
				<Flex {...handlerDateSwipe} flex={1}>
					<ContentsView data={contentsData} date={selectedDate} onChangeDate={onChangeDate} />
				</Flex>
			</Flex>
		</StyledPage>
	);
};
