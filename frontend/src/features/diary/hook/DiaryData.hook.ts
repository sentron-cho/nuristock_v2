import { cloneDeep } from 'lodash';
import { useMemo, useState } from 'react';
import { DiaryItemType as DataType } from '../api/diary.dto';
import { SummaryData } from '../config/Diary.data';
import dayjs from 'dayjs';

export type CountPerDayType = { date: string; count: number };

export const useDiaryData = (initialKeepData?: DataType[], initialTradeData?: DataType[]) => {
	const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());

	// 거래내역 데이터
	const trades = useMemo(() => {
		const items = cloneDeep(initialTradeData)?.map((a) => {
			const sprice = (a?.scost || 0) * (a?.count || 0);
			const eprice = (a?.ecost || 0) * (a?.count || 0);
			const sonic = (eprice || 0) - (sprice || 0);
			const sonicRate = Number(((Number(sonic) / Number(sprice)) * 100)?.toFixed(1));

			return {
				...a,
				eprice,
				sprice,
				sonic,
				sonicRate,
				type: 'trade',
			};
		});

		return items;
	}, [initialTradeData]);

	// 보유내역 데이터
	const keeps = useMemo(() => {
		const items = cloneDeep(initialKeepData)?.map((a) => {
			const sprice = (a?.scost || 0) * (a?.count || 0);
			const eprice = (a?.ecost || 0) * (a?.count || 0);

			return {
				...a,
				eprice,
				sprice,
				edate: undefined,
				sonic: 0,
				sonicRate: 0,
				type: 'keep',
			};
		});

		return items;
	}, [initialKeepData]);

	// 거래 내역 + 보유 내역 데이터
	const data = useMemo(() => {
		return [...(keeps || []), ...(trades || [])];
	}, [keeps, trades]);

	// 날자별 건수 데이터 생성
	const countPerDays = useMemo(() => {
		const buys: Record<string, number> = {};
		const sells: Record<string, number> = {};

		// 매수 종목 일자별 데이터
		keeps?.forEach(
			(item) => {
				const key = dayjs(item.sdate).format('YYYY-MM-DD');
				!buys[key] && (buys[key] = 0);
				buys[key] += 1;
			},
			{} as Record<string, DataType>
		);

		// 매도 종목 일자별 데이터
		trades?.forEach(
			(item) => {
				const key = dayjs(item.edate).format('YYYY-MM-DD');
				!sells[key] && (sells[key] = 0);
				sells[key] += 1;
			},
			{} as Record<string, DataType>
		);

		return { buys, sells };
	}, [keeps, trades]);

	// 년도별 데이터 추출
	const groupedByYear = useMemo(() => {
		return data?.reduce(
			(acc, item) => {
				const year = dayjs(item['edate']).format('YYYY'); // '20241104' → '2024'
				if (!acc[year]) {
					acc[year] = [];
				}
				acc[year].push(item);
				return acc;
			},
			{} as Record<string, typeof data>
		);
	}, [data]);

	// 월별 데이터 추출
	const groupedByMonth = useMemo(() => {
		return data?.reduce(
			(acc, item) => {
				const month = item['edate'] ? dayjs(item['edate']).format('YYYYMM') : dayjs(item['sdate']).format('YYYYMM'); // '20241104' → '2024'
				if (!acc[month]) {
					acc[month] = [];
				}
				acc[month].push(item);
				return acc;
			},
			{} as Record<string, typeof data>
		);
	}, [data]);

	// 종목명별 데이터 추출
	const groupedByName = useMemo(() => {
		return data?.reduce(
			(acc, item) => {
				const name = item['name'];
				if (!acc[name]) acc[name] = [];
				acc[name].push(item);
				return acc;
			},
			{} as Record<string, typeof data>
		);
	}, [data]);

	// 요약 정보
	const summary = useMemo(() => {
		const monthData = groupedByMonth?.[dayjs(selectedDate).format('YYYYMM')];

		console.log({ groupedByMonth, monthData });

		const buys = monthData?.filter((a) => a.type === 'keep');
		const sells = monthData?.filter((a) => a.type === 'trade');

		const buySum = buys?.map((a) => a.sprice)?.reduce((a, b) => a + b, 0);
		const sellSum = sells?.map((a) => a.eprice)?.reduce((a, b) => a + b, 0);
		const sonic = sells?.map((a) => a.eprice - a.sprice)?.reduce((a, b) => a + b, 0);

		return SummaryData([buySum?.toString() || '0', sellSum?.toString() || '0', sonic?.toString() || '0']);
	}, [groupedByMonth, selectedDate]);

	return {
		data,
		trades,
		keeps,
		summary,
		countPerDays,
		groupedByYear,
		groupedByMonth,
		groupedByName,
		selectedDate,
		setSelectedDate,
	};
};
