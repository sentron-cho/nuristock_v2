import { MyStockKeepType, MyStockResponse, MyStockSellType } from './../api/mystock.dto';
import { useMemo } from 'react';
import { reverse, sortBy } from 'lodash';
import { OptionType } from '@shared/config/common.type';
import { MyStockSummaryDataTrade as SummaryTrade, MyStockSummaryDataKeep as SummaryKeep } from '../config/MyStock.data';
import { useParams } from 'react-router-dom';
import { StorageDataKey, useStorageHook } from '@shared/hooks/useStorage.hook';
import { KEEP } from '@shared/config/common.constant';

export const useMyStockHook = (initialData?: MyStockResponse, viewType?: 'trade' | 'keep') => {
	const { getLocalStorage } = useStorageHook();

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
		// 대시보드에서 정렬된 순서로 네비게이션 데이터 설정하기...
		const sortedTrade = getLocalStorage(StorageDataKey.DASHBOARD_SORTED_TRADE) as OptionType[];
		const sortedKeep = getLocalStorage(StorageDataKey.DASHBOARD_SORTED_KEEP) as OptionType[];

		if (viewType === KEEP) {
			return sortedKeep || data?.stocks?.filter((a) => a.kcount)?.map((a) => ({ value: a.code, label: a.name }));
		} else {
			return sortedTrade || data?.stocks?.filter((a) => a.ecount)?.map((a) => ({ value: a.code, label: a.name }));
		}
	}, [data?.stocks, viewType]);

	const summaryData = useMemo(() => {
		if (viewType === KEEP) {
			const buy = (data?.keeps as MyStockSellType[])?.map((a) => a.scost * a.count)?.reduce((a, b) => a + b, 0);
			const valuation = (data?.keeps as MyStockSellType[])?.map((a) => (sise?.sise || 0) * a.count)?.reduce((a, b) => a + b, 0);
			const siseSonic = valuation - buy;

			const values: string[] = [
				buy?.toString() || '',
				valuation?.toString() || '',
				siseSonic?.toString() || '',
			];

			return SummaryKeep(values);
		} else {
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
			return SummaryTrade(values);
		}
	}, [data, viewType, sise]);

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
