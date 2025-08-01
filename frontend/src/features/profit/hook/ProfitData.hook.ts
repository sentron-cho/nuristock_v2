import { cloneDeep, reverse, sortBy } from 'lodash';
import { useMemo } from 'react';
import { ProfitItemType as DataType, ProfitYearsItemType as YearDataType } from '../api/profit.dto';
import { SummaryData } from '../config/Profit.data';
import dayjs from 'dayjs';
import { FieldValues } from 'react-hook-form';

export const useProfitData = (initialData?: DataType[], initialYears?: YearDataType[]) => {
	// 년도별 데이터 초기화
	// const years = useMemo(() => {
	// 	const items = initialYears?.map((a) => ({ value: a?.year, label: a?.year }) as SelectOptionType);
	// 	return reverse(sortBy(items, 'value'));
	// }, [initialYears]);
	
	const years = useMemo(() => {
		return reverse(sortBy(initialYears, 'year'));
	}, [initialYears]);

	// 메인 데이터 초기화
	const data = useMemo(() => {
		const items = cloneDeep(initialData)?.map((a) => {
			const sprice = (a?.scost || 0) * (a?.count || 0);
			const eprice = (a?.ecost || 0) * (a?.count || 0);
			const sonic = (eprice || 0) - (sprice || 0);

			// console.log({a, sonic})
			return {
				...a,
				eprice,
				sprice,
				sonic,
			};
		});

		return items;
	}, [initialData]);

	const summary = useMemo(() => {
		const list = (data as DataType[])?.map((a) => Number(a.eprice) - Number(a.sprice));

		const up = list?.filter((a) => a > 0)?.reduce((a, b) => a + b, 0);
		const down = list?.filter((a) => a < 0)?.reduce((a, b) => a + b, 0);
		const total = list?.reduce((a, b) => a + b, 0);

		return SummaryData([up?.toString(), down?.toString(), total?.toString()]);
	}, [data]);

	// 키별 합게 데이터 생성
	const createSumData = (data?: DataType[], columnKey: 'name' | 'month' | 'year' = 'name') => {
		return data?.reduce(
			(acc, curr) => {
				let key = (curr as Record<string, any>)[columnKey] as string;

				if (columnKey === 'month') {
					key = dayjs(curr.edate).format('YYYY-MM');
					curr['title'] = key;
				} else if (columnKey === 'year') {
					key = dayjs(curr.edate).format('YYYY');
					curr['title'] = key;
				} else {
					curr['title'] = key;
				}

				// 초기화
				if (!acc[key]) {
					acc[key] = { ...curr, sonic: 0, scost: 0, ecost: 0, sprice: 0, eprice: 0, count: 0 } as DataType;
				}

				acc[key].scost = (acc[key].scost || 0) + (curr.scost || 0);
				acc[key].ecost = (acc[key].ecost || 0) + (curr.ecost || 0);
				acc[key].count = (acc[key].count || 0) + (curr.count || 0);
				acc[key].sprice = (acc[key].sprice || 0) + (curr.sprice || 0);
				acc[key].eprice = (acc[key].eprice || 0) + (curr.eprice || 0);
				acc[key].edate = curr.edate;
				acc[key].sonic = (acc[key].sonic || 0) + (curr.eprice || 0) - (curr.sprice || 0);
				acc[key].sonicRate = Number(((Number(acc[key].sonic) / Number(acc[key].sprice)) * 100)?.toFixed(2));

				return acc;
			},
			{} as Record<string, DataType>
		);
	};

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

		const total = Object.values(monthPrice).reduce((a, b) => a + b, 0);

		console.log({ data, monthPrice });

		return total;
	};

		// 년도별 누적 투자금액
	const createTotal = (data?: DataType[], columnkey: string = 'sprice') => {
		const total = data?.map(a => (a as FieldValues)?.[columnkey]).reduce((a, b) => a + b, 0);
		console.log({ total });
		return total;
	};

	// const accPrice = useMemo(() => {
	// 	return makeAccPrice(groupedByYear);
	// }, [groupedByYear])

	return {
		years,
		data,
		summary,
		createSumData,
		groupedByYear,
		groupedByName,
		createAccPrice,
		createTotal,
		// accPrice,
	};
};
