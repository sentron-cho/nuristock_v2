import { cloneDeep } from 'lodash';
import { useMemo } from 'react';
import { DiaryItemType as DataType } from '../api/diary.dto';
import { SummaryData } from '../config/Diary.data';
import dayjs from 'dayjs';
import { FieldValues } from 'react-hook-form';

export type CountPerDayType = { date: string; count: number };

export const useDiaryData = (initialKeepData?: DataType[], initialTradeData?: DataType[]) => {
	// 메인 데이터 초기화
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
			};
		});

		return items;
	}, [initialTradeData]);

	const keeps = useMemo(() => {
		const items = cloneDeep(initialKeepData)?.map((a) => {
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
			};
		});

		return items;
	}, [initialKeepData]);

	const data = useMemo(() => {
		return [...(keeps || []), ...(trades || [])];
	}, [keeps, trades]);

	const summary = useMemo(() => {
		const list = (keeps as DataType[])?.map((a) => Number(a.eprice) - Number(a.sprice));

		const up = list?.filter((a) => a > 0)?.reduce((a, b) => a + b, 0);
		const down = list?.filter((a) => a < 0)?.reduce((a, b) => a + b, 0);
		const total = list?.reduce((a, b) => a + b, 0);

		return SummaryData([up?.toString(), down?.toString(), total?.toString()]);
	}, [keeps]);

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

	// const getCountPerDays = (year?: string) => {
	// 	const arrayBuys = Object.entries(countPerDays?.buys)?.filter((item) => {
	// 		return dayjs(item?.[0]).format('YYYY') === year;
	// 	});

	// 	const arraySells = Object.entries(countPerDays?.buys)?.filter((item) => {
	// 		return dayjs(item?.[0]).format('YYYY') === year;
	// 	});
	// };

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

	// 년도별 누적 투자금액
	const createAccPrice = (data?: DataType[]) => {
		const columnkey = 'YYYY';
		const monthPrice: Record<string, number> = {};

		data?.forEach((item) => {
			const start = dayjs(item.sdate, columnkey);
			const end = dayjs(item.edate, columnkey);

			for (let d = start; d.isBefore(end) || d.isSame(end); d = d.add(1, 'month')) {
				const key = d.format(columnkey);
				// const prev = monthPrice[key] || 0;
				// if (!monthPrice[key]) monthPrice[key] = {};
				monthPrice[key] = (monthPrice[key] || 0) + (item?.sprice || 0);
			}
		});

		return Object.values(monthPrice).reduce((a, b) => a + b, 0);
	};

	// 년도별 누적 투자금액
	const createTotal = (data?: DataType[], columnkey: string = 'sprice') => {
		return data?.map((a) => (a as FieldValues)?.[columnkey]).reduce((a, b) => a + b, 0);
	};

	return {
		data,
		trades,
		keeps,
		summary,
		countPerDays,
		// getCountPerDays,
		groupedByYear,
		groupedByName,
		createAccPrice,
		createTotal,
	};
};
