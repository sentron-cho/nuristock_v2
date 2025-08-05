import { MyStockKeepType, MyStockResponse, MyStockSellType } from './../api/mystock.dto';
import { useMemo, useState } from 'react';
import { reverse, sortBy } from 'lodash';
import { OptionType } from '@shared/config/common.type';
import { MyStockSummaryData as SummaryData } from '../config/MyStock.data';
import { useParams } from 'react-router-dom';

export const useMyStockHook = (initialData?: MyStockResponse) => {
  const param = useParams();
	const [activePage, setActivePage] = useState(0);

	const data = useMemo(() => initialData, [initialData]);

	const keepList = useMemo(() => reverse(sortBy(data?.keeps, 'sdate')), [data]);
	const tradeList = useMemo(() => reverse(sortBy(data?.sells, 'edate')), [data]);

	const stocks = useMemo(
		() =>
			sortBy(
				data?.stocks?.map((a) => ({ value: a?.code, label: a?.name }) as OptionType),
				'label'
			),
		[data]
	);
	const selected = useMemo(() => stocks?.find((a) => a.value === param?.id)?.value, [stocks, param]);

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
		activePage,
    setActivePage,
    stocks,
		keepList,
		tradeList,
		selected,
		summaryData,
	};
};
