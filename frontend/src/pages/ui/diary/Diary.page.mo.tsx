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
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSwipeable } from 'react-swipeable';

const StyledPage = styled(PageContainer, {
	height: '100vh',

	'.weekend': {
		color: '$error',
	},
});

export const DiaryPageMo = () => {
	const [search, setSearch] = useState<string>(dayjs().format('YYYY'));
	const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());

	const forms = useForm();

	const { data: diaryData } = useSelectDiary(search);
	const { summary, countPerDays, keeps, trades } = useDiaryData(diaryData?.keep, diaryData?.trade);

	const formSelectedDate = forms.watch('date');
	const selectedMonth = forms.watch('month');

	useEffect(() => {
		setSelectedDate(formSelectedDate);
	}, [formSelectedDate]);

	useEffect(() => {
		const now = dayjs(selectedMonth).format('YYYY');
		search != now && setSearch(now);
	}, [selectedMonth]);

	// useEffect(() => {
	// 	console.log('[Search]', { search, selectedDate: dayjs(selectedDate).format('YYYY-MM-DD') });
	// }, [search, selectedDate]);

	const selected = useMemo(() => {
		if (!selectedDate) return;

		const sell = trades?.filter((a) => dayjs(a.edate).format('YYYYMMDD') === dayjs(selectedDate).format('YYYYMMDD'));
		const buy = keeps?.filter((a) => dayjs(a.sdate).format('YYYYMMDD') === dayjs(selectedDate).format('YYYYMMDD'));
		// console.log({ sell, buy });
		return { selectedDate, sell, buy };
	}, [selectedDate]);

	const calendarData = useMemo(() => {
		const temps: Record<string, CalendarTypeData> = {};

		const arrayBuys = Object.entries(countPerDays?.buys)?.filter((item) => {
			return dayjs(item?.[0]).format('YYYY') === search;
		});

		const arraySells = Object.entries(countPerDays?.sells)?.filter((item) => {
			return dayjs(item?.[0]).format('YYYY') === search;
		});

		arrayBuys?.forEach((a) => {
			!temps[a?.[0]] && (temps[a?.[0]] = { buy: 0 });
			temps[a[0]]['buy'] = a?.[1];
		});
		arraySells?.forEach((a) => {
			!temps[a?.[0]] && (temps[a?.[0]] = { sell: 0 });
			temps[a[0]]['sell'] = a?.[1];
		});

		return temps;
	}, [countPerDays, search]);

	const handlerSwipe = useSwipeable({
		onSwipedLeft: () => {
			setSelectedDate(dayjs(selectedDate).add(1, 'month'));
		},
		onSwipedRight: () => {
			setSelectedDate(dayjs(selectedDate).add(-1, 'month'));
		},
		trackMouse: true,
	});

	return (
		<StyledPage className={clsx('diary', 'main')} summaryData={summary}>
			<Flex className='view-box' direction={'column'} gap={2} {...handlerSwipe}>
				<FormProvider {...forms}>
					<Flex direction={'column'}>
						<CalendarView data={calendarData} date={selectedDate} />
						<ContentsView data={selected} date={selectedDate} />
					</Flex>
				</FormProvider>
			</Flex>
		</StyledPage>
	);
};
