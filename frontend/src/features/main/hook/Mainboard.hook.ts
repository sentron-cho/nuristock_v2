import { cloneDeep, reverse, sortBy } from 'lodash';
import { useMemo, useState } from 'react';
import { MainboardItemType as DataType, MainboardResponse } from '../api/mainboard.dto';
import { useAppConfigHook } from '@shared/hooks/useAppConfig.hook';
import { APP_GROUP } from '@shared/config/default.config';
import { toSemiCost, valueOfPlusMinus } from '@shared/libs/utils.lib';
import { MainboardSummaryData as SummaryData } from '../config/Mainboard.data';
import { StorageDataKey, useStorageHook } from '@shared/hooks/useStorage.hook';

export const useMainboardHook = (initialData?: MainboardResponse) => {
	const { data: config, getConfig, createConfig, isPending } = useAppConfigHook({ group: APP_GROUP.DASHBOARD });
	const { setLocalStorage, getLocalStorage } = useStorageHook();

	const initConfig = getLocalStorage(StorageDataKey.MAINBOARD_CONFIG_MORE) as boolean[];
	const DEFAULT_MORE = [false, false, false, false, false, false];
	const [isMoreList, setMoreList] = useState<boolean[]>(initConfig || DEFAULT_MORE);

	const data = useMemo(() => initialData, [initialData]);

	const list = useMemo(
		() =>
			data?.value?.map((row) => {
				const siseValue = data?.sise?.find((a) => a.code === row.code)?.sise;

				const sonic = (row.eprice || 0) - (row.sprice || 0);
				const sonicRate = sonic !== 0 ? ((row?.eprice || 0) / (row?.sprice || 0)) * 100 - 100 : 0;

				return {
					...row,
					sonic: sonic,
					sonicRate: sonicRate,
					sise: siseValue,
					siseSonic: siseValue ? (row?.kcount || 0) * siseValue - (row?.kprice || 0) : 0,
				};
			}),
		[data]
	);

	const totalPrice = useMemo(() => {
		if (!initialData) return '';

		const { deposit, asset } = initialData;
		const total = Number(deposit?.price) + Number(asset?.price);
		return toSemiCost(total);
	}, [initialData]);

	const summaryData = useMemo(() => {
		if (!data) return undefined;

		const { deposit } = data;

		const captal =
			(list as DataType[])?.map((a) => a?.kprice || 0)?.reduce((a, b) => a + b, 0) + Number(deposit?.price);
		const sell = data?.sise
			? (list as DataType[])
					?.map((a) => {
						const v = data?.sise?.find((b) => b.code === a.code)?.sise as number;
						return (a?.kcount || 0) * v;
					})
					?.reduce((a, b) => a + b, 0) + Number(deposit?.price)
			: '';
		const sonic = sell && captal && sell - captal;

		const values: string[] = [
			captal?.toString() || '',
			sell?.toString() || '',
			sonic?.toString() || '',
			deposit?.price?.toString() || '',
		];
		return SummaryData(values);
	}, [list, data]);

	const onClickMore = (index: number = 0, value: boolean = true) => {
		const more = cloneDeep(isMoreList);
		more?.[index] !== undefined && (more[index] = value);

		setMoreList(more);
		setLocalStorage(StorageDataKey.MAINBOARD_CONFIG_MORE, more);
	};

	return {
		loaded: !isPending,
		config,
		getConfig,
		createConfig,
		summaryData,
		list: data?.value,
		trades: data?.trades,
		keeps: data?.keeps,
		asset: data?.asset,
		deposit: data?.deposit,
		buys: data?.buys,
		totalPrice,
		isMoreList,
		onClickMore,
	};
};

export const useMainboardCardHook = (initialData?: MainboardResponse, isMore: boolean = false) => {
	const { data: config, getConfig, createConfig, isPending } = useAppConfigHook({ group: APP_GROUP.DASHBOARD });

	const data = useMemo(() => initialData, [initialData]);

	const totalPrice = useMemo(() => {
		if (!initialData) return '';

		const { deposit, asset } = initialData;
		const total = Number(deposit?.price) + Number(asset?.price);
		return toSemiCost(total);
	}, [initialData]);

	const keeps = useMemo(() => {
		const items = data?.keeps?.map((row) => {
			const siseValue = data?.sise?.find((a) => a.code === row.code)?.sise;
			const sonic = (row.eprice || 0) - (row.sprice || 0);
			// const sonicRate = sonic !== 0 ? ((row.eprice || 0) / (row.sprice || 0)) * 100 - 100 : 0;
			const siseSonic = siseValue ? (row?.kcount || 0) * siseValue - (row?.kprice || 0) : 0;
			const sonicRate = sonic !== 0 ? (siseSonic / (row?.kprice || 0)) * 100 : 0;

			return {
				...row,
				type: valueOfPlusMinus(siseSonic),
				sonic: sonic,
				sonicRate: sonicRate,
				sise: siseValue,
				siseSonic,
			};
		});

		return items; // 최대 5개
	}, [initialData]);

	// 최근매수
	const latestBuy = useMemo(() => {
		const items = data?.latestBuys?.map((row) => {
			const siseValue = data?.sise?.find((a) => a.code === row.code)?.sise;

			const sisePrice = (siseValue || 0) * (row?.count || 0);
			const sprice = Number(row?.count) * Number(row?.scost);
			const sonic = (sisePrice || 0) - (sprice || 0);
			const sonicRate = sonic !== 0 ? (sisePrice / sprice) * 100 - 100 : 0;

			return {
				...row,
				sprice,
				eprice: 0,
				type: valueOfPlusMinus(sonic),
				sonic: sonic,
				sonicRate: sonicRate,
				sise: siseValue,
				siseSonic: siseValue ? (row?.kcount || 0) * siseValue - (row?.kprice || 0) : 0,
			};
		});

		return sortBy(items, ['sdate']);
	}, [initialData]);

	// 최근매도
	const latestSell = useMemo(() => {
		const items = data?.latestSells?.map((row) => {
			const sprice = Number(row?.count) * Number(row?.scost);
			const eprice = Number(row?.count) * Number(row?.ecost);
			const siseValue = data?.sise?.find((a) => a.code === row.code)?.sise;
			const sonic = eprice - sprice;
			const sonicRate = sonic !== 0 ? (eprice / sprice) * 100 - 100 : 0;

			return {
				...row,
				sprice,
				eprice,
				type: valueOfPlusMinus(sonic),
				sonic: sonic,
				sonicRate: sonicRate,
				sise: siseValue,
				siseSonic: siseValue ? (row?.kcount || 0) * siseValue - (row?.kprice || 0) : 0,
			};
		});

		return items;
	}, [initialData]);

	// 매수 손익율 상위
	const sonicBuy = useMemo(() => {
		const items = data?.buys?.map((row) => {
			const siseValue = data?.sise?.find((a) => a.code === row.code)?.sise;

			const sisePrice = (siseValue || 0) * (row?.count || 0);
			const sprice = Number(row?.count) * Number(row?.scost);
			const sonic = (sisePrice || 0) - (sprice || 0);
			const sonicRate = sonic !== 0 ? (sisePrice / sprice) * 100 - 100 : 0;

			return {
				...row,
				sprice,
				eprice: 0,
				type: valueOfPlusMinus(sonic),
				sonic: sonic,
				sonicRate: sonicRate,
				sise: siseValue,
				siseSonic: siseValue ? (row?.kcount || 0) * siseValue - (row?.kprice || 0) : 0,
			};
		});

		return items;
	}, [initialData]);

	const max = isMore ? 10 : 3;

	return {
		loaded: !isPending,
		config,
		getConfig,
		createConfig,
		list: data?.value,
		trades: data?.trades,
		keeps,
		sonicTop: reverse(sortBy(keeps, ['siseSonic'])).slice(0, max),
		sonicBottom: sortBy(keeps, ['siseSonic']).slice(0, max),
		latestBuy: reverse(sortBy(latestBuy, ['sdate'])).slice(0, max),
		latestSell: reverse(sortBy(latestSell, ['edate'])).slice(0, max),
		sonicBuyTop: reverse(sortBy(sonicBuy, ['sonicRate'])).slice(0, max),
		sonicBuyBottom: sortBy(sonicBuy, ['sonicRate']).slice(0, max),
		asset: data?.asset,
		deposit: data?.deposit,
		buys: data?.buys,
		totalPrice,
	};
};
