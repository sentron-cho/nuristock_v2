import { cloneDeep, reverse, sortBy } from 'lodash';
import { useMemo } from 'react';
import { DividendItemType as DataType, DividendResponse } from '../api/dividend.dto';
import { DividendSummaryData as SummaryData } from '../config/Dividend.data';
import dayjs from 'dayjs';
import { FieldValues } from 'react-hook-form';

export const useDividendData = (initialData?: DividendResponse) => {
	const stocks = useMemo(() => initialData?.stock, [initialData]);

	// 메인 데이터 초기화
	const data = useMemo(() => {
		const items = cloneDeep(initialData?.value)?.map((a) => {
			const tax = Number(a.cost) * Number(a.count) - Number(a.price);

			return {
				...a,
				tax,
			};
		});

		return reverse(sortBy(items, 'sdate')) as DataType[];
	}, [initialData]);

	const summary = useMemo(() => {
		const total = data?.map((a) => Number(a.cost) * Number(a.count))?.reduce((a, b) => a + b, 0) || 0; // 세전
		const tax = data?.map((a) => Number(a.cost) * Number(a.count) - Number(a.price))?.reduce((a, b) => a + b, 0) || 0; // 세금
		const dividend = data?.map((a) => a.price)?.reduce((a, b) => a + b, 0) || 0; // 세후
		return SummaryData([total?.toString(), tax?.toString(), dividend?.toString()]);
	}, [data]);

	const createSumData = (data?: DataType[], columnKey: 'name' | 'year' = 'name') => {
		return data?.reduce(
			(acc, curr) => {
				let key = (curr as Record<string, any>)[columnKey] as string;

				if (columnKey === 'year') {
					key = dayjs(curr.sdate).format('YYYY');
					curr['title'] = key;
				} else {
					curr['title'] = key;
				}

				// 초기화
				if (!acc[key]) {
					acc[key] = { ...curr, sonic: 0, scost: 0, ecost: 0, sprice: 0, eprice: 0, count: 0 } as DataType;
				}

				acc[key].cost = (acc[key].cost || 0) + (curr.cost || 0);
				acc[key].count = (acc[key].count || 0) + (curr.count || 0);
				acc[key].price = (acc[key].price || 0) + (curr.price || 0);

				return acc;
			},
			{} as Record<string, DataType>
		);
	};

	// 년도별 데이터 추출
	const groupedByYear = useMemo(() => {
		console.log({ data });
		return data?.reduce(
			(acc, item) => {
				const year = dayjs(item['sdate']).format('YYYY'); // '20241104' → '2024'
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
				const name = item['name'] as string;
				if (!acc[name]) acc[name] = [];
				acc[name].push(item);
				return acc;
			},
			{} as Record<string, typeof data>
		);
	}, [data]);

	// 년도별 누적 투자금액
	const createTotal = (data?: DataType[], columnkey: string = 'sprice') => {
		return data?.map((a) => (a as FieldValues)?.[columnkey]).reduce((a, b) => a + b, 0);
	};

	return {
		stocks,
		data,
		summary,
		groupedByYear,
		groupedByName,
		createTotal,
		createSumData,
	};
};
