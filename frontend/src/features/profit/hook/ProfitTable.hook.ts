import { cloneDeep, reverse, sortBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { ProfitItemType as DataType, ProfitYearsItemType as YearsType } from '../api/profit.dto';
import dayjs from 'dayjs';
import { FieldValues, useForm } from 'react-hook-form';
import { SelectOptionType } from '@entites/SelectForm';
import { SELECT_ALL } from '@shared/config/common.constant';
import { SummaryData } from '../config/Profit.data';

export type FILTER_TYPE = 'codes' | 'months' | 'days' | 'all';

export const useProfitTable = (initialData?: DataType[], initialYears?: YearsType[]) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [data, setData] = useState<DataType[] | undefined>(initialData);
	const [filter, setFilter] = useState<FILTER_TYPE>('codes');
	const [total, setTotal] = useState<number>(0);
	const [selectedRows, setSelectedRows] = useState<string[]>();
	const [filteredData, setFilteredData] = useState<DataType[]>();

	const formMethod = useForm<FieldValues>({
		defaultValues: { year: dayjs().format('YYYY') },
	});

	const selectedYear = formMethod.watch('year');

	const years = useMemo(() => {
		const items = initialYears?.map((a) => ({ value: a?.year, label: a?.year }) as SelectOptionType);
		return reverse(sortBy([...(items || []), SELECT_ALL], 'value'));
	}, [initialYears]);

	useEffect(() => {
		console.log(selectedYear);
	}, [selectedYear]);

	// 메인 데이터 초기화
	useEffect(() => {
		const items = cloneDeep(initialData)?.map((a) => {
			const sprice = (a?.scost || 0) * (a?.count || 0);
			const eprice = (a?.ecost || 0) * (a?.count || 0);
			return {
				...a,
				eprice,
				sprice,
				sonic: (eprice || 0) - (sprice || 0),
			};
		});

		// console.log(items);

		setData(items);
	}, [initialData]);

	const parsedData = useMemo(() => {
		if (!data) return undefined;

		if (selectedYear === SELECT_ALL.value) {
			return cloneDeep(data);
		} else return cloneDeep(data)?.filter((a) => dayjs(a.edate).format('YYYY') === selectedYear);
	}, [data, selectedYear]);

	useEffect(() => {
		if (!parsedData?.length) return undefined;

		let tempData;

		if (filter === 'all') {
			tempData = parsedData?.map(a => ({...a, title: a?.name}));
		} else {
			const filteredKey = 'name';

			tempData = parsedData.reduce(
				(acc, curr) => {
					let key = curr[filteredKey] as string;
					if (filter === 'months') {
						key = dayjs(curr.edate).format('YYYY-MM');
						curr['title'] = key;
					} else if (filter === 'days') {
						key = dayjs(curr.edate).format('YYYY-MM-DD');
						curr['title'] = key;
					} else {
						curr['title'] = curr[filteredKey];
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

					return acc;
				},
				{} as Record<string, DataType>
			);

			tempData = Object.values(tempData).map((item) => {
				if (item?.eprice && item?.sprice) {
					return {
						...item,
						sonic: item.eprice - item.sprice,
					};
				} else {
					return item;
				}
			});
		}

		setFilteredData(tempData);
		setLoading(false);
	}, [filter, parsedData]);

	const summaryData = useMemo(() => {
		const vCodes = (parsedData as DataType[])
			?.map((a) => Number(a.eprice) - Number(a.sprice))
			?.reduce((a, b) => a + b, 0);
		const values: string[] = [
			vCodes?.toString() || '',
			vCodes?.toString() || '',
			vCodes?.toString() || '',
			vCodes?.toString() || '',
		];
		return SummaryData(values);
	}, [parsedData]);

	useEffect(() => {
		const sonic = parsedData?.map((a) => a?.sonic || 0)?.reduce((a, b) => a + b, 0);
		setTotal(Number(sonic));
	}, [parsedData]);

	// 선택된 row 추가
	const setSelectedRow = (row: DataType) => {
		if (row?.title) {
			if (selectedRows?.includes(row.title)) {
				const filtered = selectedRows?.filter((title) => title !== row.title);
				setSelectedRows(filtered?.length ? filtered : undefined);
			} else {
				setSelectedRows((prev) => [...(prev || []), row.title as string]);
			}
		}
	};

	// 선택된 row 클리어
	const clearSelectedRow = () => {
		setSelectedRows(undefined);
	};

	// console.log('[useProfitTable]', { filteredData, data });

	const rowClassName = (row: FieldValues) => {
		// console.log({ filter, row, selectedRows });
		if (filter === 'all') {
			return '';
		} else if (filter === 'codes') {
			return selectedRows?.includes(row.name) ? 'active' : '';
		} else if (filter === 'months') {
			return selectedRows?.includes(dayjs(row.edate).format('YYYY-MM')) ? 'active' : '';
		} else if (filter === 'days') {
			return selectedRows?.includes(dayjs(row.edate).format('YYYY-MM-DD')) ? 'active' : '';
		} else {
			return '';
		}
	};

	const changeFilter = (value: FILTER_TYPE) => {
		if (value === filter) return;

		setLoading(true);
		setFilteredData(undefined);
		setFilter(value);
	};

	return {
		formMethod,
		filteredData,
		summaryData,
		data: parsedData,
		years,
		loading,
		setData,
		filter,
		setFilter: changeFilter,
		total,
		selectedRows,
		rowClassName,
		setSelectedRow,
		clearSelectedRow,
	};
};
