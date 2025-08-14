import { DashboardItemType as DataType } from './../api/dashboard.dto';
import { useEffect, useMemo, useState } from 'react';
import { DashboardSummaryData as SummaryData, DashboardTitleOptions as SelectOptions } from '../config/Dashbord.data';
import { DashboardResponse } from '../api/dashboard.dto';
import { reverse, sortBy } from 'lodash';
import { useAppConfigHook } from '@shared/hooks/useAppConfig.hook';
import { APP_GROUP } from '@shared/config/default.config';
import { StorageDataKey, useStorageHook } from '@shared/hooks/useStorage.hook';

export const useDashboardHook = (initialData?: DashboardResponse) => {
	const { data: config, getConfig, createConfig, isPending } = useAppConfigHook({ group: APP_GROUP.DASHBOARD });
	const { setLocalStorage } = useStorageHook();

	const [sort, setSort] = useState<string>('');

	const titleOptions = useMemo(() => {
		return SelectOptions();
	}, []);

	const sortOption = getConfig('sort');
	useEffect(() => titleOptions && setSort(sortOption || titleOptions?.[0]?.value), [titleOptions, sortOption]);

	const data = useMemo(() => initialData, [initialData]);

	const list = useMemo(
		() =>
			data?.value?.map((row) => {
				const siseValue = data?.sise?.find((a) => a.code === row.code)?.sise;

				const sonic = row.eprice - row.sprice;
				const sonicRate = sonic !== 0 ? (row.eprice / row.sprice) * 100 - 100 : 0;

				return {
					...row,
					sonic: sonic,
					sonicRate: sonicRate,
					sise: siseValue,
					siseSonic: siseValue ? row?.kcount * siseValue - row?.kprice : 0,
				};
			}),
		[data]
	);

	const summaryData = useMemo(() => {
		const captal = (list as DataType[])?.map((a) => a.kprice)?.reduce((a, b) => a + b, 0);
		const sell = data?.sise
			? (list as DataType[])
					?.map((a) => {
						const v = data?.sise?.find((b) => b.code === a.code)?.sise as number;
						return a.kcount * v;
					})
					?.reduce((a, b) => a + b, 0)
			: '';
		const sonic = sell && captal && sell - captal;

		const values: string[] = [captal?.toString() || '', sell?.toString() || '', sonic?.toString() || ''];
		return SummaryData(values);
	}, [list, data]);

	const makeCardList = (type?: string, arrays?: DataType[]) => {
		let sorted: DataType[] | undefined;
		if (type === 'keepCost') {
			sorted = reverse(sortBy(arrays, 'kprice'));
		} else if (type === 'title') {
			sorted = sortBy(arrays, 'name');
		} else if (type === 'siseSonic') {
			// 예상손익
			sorted = reverse(sortBy(arrays, 'siseSonic'));
		} else if (type === 'sonicRate') {
			// 손익율
			sorted = reverse(sortBy(arrays, 'sonicRate'));
		} else if (type === 'sonicCost') {
			// 손익금액
			sorted = reverse(sortBy(arrays, 'sonic'));
		} else {
			sorted = arrays;
		}

		return sorted;
	};

	// 보유 종목 리스트
	const sortedKeeps = useMemo(() => {
		const sorted = makeCardList(
			sort,
			list?.filter((a) => a.kcount)
		);

		// 스토리지에 저장(마이스톡 화면에서 네비게이션용으로 사용)
		const options = sorted?.map((a) => ({ value: a.code, label: a.name }));
		options && options?.length > 0 && setLocalStorage(StorageDataKey.DASHBOARD_SORTED_KEEP, options);

		console.log('[보유종목 리스트]', { sorted });
		return sorted;
	}, [list, sort]);

	// 거래내역 리스트(보유 + 미보유)
	const sortedTrades = useMemo(() => {
		const sorted = makeCardList(
			sort === 'siseSonic' ? 'sonicRate' : sort,
			list?.filter((a) => a.ecount)
		);

		// 스토리지에 저장(마이스톡 화면에서 네비게이션용으로 사용)
		const options = sorted?.map((a) => ({ value: a.code, label: a.name }));
		options && options?.length > 0 && setLocalStorage(StorageDataKey.DASHBOARD_SORTED_TRADE, options);

		console.log('[거래내역 리스트]', { sorted });
		return sorted;
	}, [list, sort]);

	const onChangeSort = (value: string) => {
		setSort(value);
		createConfig({ skey: 'sort', svalue: value });
	};

	return {
		loaded: !isPending,
		config,
		getConfig,
		summaryData,
		sortedKeeps,
		sortedTrades,
		titleOptions,
		sort,
		onChangeSort,
	};
};
