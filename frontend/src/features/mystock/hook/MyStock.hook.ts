import { MyStockKeepType, MyStockResponse, MyStockSellType } from './../api/mystock.dto';
import { useMemo } from 'react';
import { reverse, sortBy } from 'lodash';
import { OptionType } from '@shared/config/common.type';
import { MyStockSummaryData as SummaryData } from '../config/MyStock.data';
import { useParams } from 'react-router-dom';

export const useMyStockHook = (initialData?: MyStockResponse, viewType?: 'trade' | 'keep') => {
	const param = useParams();
	const data = useMemo(() => initialData, [initialData]);

	const keepList = useMemo(() => reverse(sortBy(data?.keeps, 'sdate')), [data]);
	const tradeList = useMemo(() => reverse(sortBy(data?.sells, 'edate')), [data]);
	const sise = useMemo(() => data?.sise, [data]);

	const stocks = useMemo(
		() =>
			sortBy(
				data?.stocks?.map((a) => ({ value: a?.code, label: a?.name }) as OptionType),
				'label'
			),
		[data]
	);
	const selected = useMemo(() => stocks?.find((a) => a.value === param?.id)?.value, [stocks, param]);

	const naviOptions = useMemo(() => {
		if (viewType === 'keep') {
			return data?.stocks?.filter((a) => a.kcount)?.map((a) => ({ value: a.code, label: a.name }));
		} else {
			return data?.stocks?.filter((a) => a.ecount)?.map((a) => ({ value: a.code, label: a.name }));
		}
	}, [data?.stocks, viewType]);

	const summaryData = useMemo(() => {
		const buy = (data?.sells as MyStockSellType[])?.map((a) => a.scost * a.count)?.reduce((a, b) => a + b, 0);
		const sell = (data?.sells as MyStockSellType[])?.map((a) => a.ecost * a.count)?.reduce((a, b) => a + b, 0);
		const keep = (data?.keeps as MyStockKeepType[])?.map((a) => a.scost * a.count)?.reduce((a, b) => a + b, 0);
		const sonic = buy && sell && sell - buy;
		const values: string[] = [
			buy?.toString() || '',
			sell?.toString() || '',
			keep?.toString() || '',
			sonic?.toString() || '',
		];
		return SummaryData(values);
	}, [data]);

	return {
		stocks,
		sise,
		naviOptions,
		keepList,
		tradeList,
		selected,
		summaryData,
	};
};
