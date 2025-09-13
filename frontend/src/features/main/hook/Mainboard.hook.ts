import { cloneDeep, reverse, sortBy } from 'lodash';
import { useMemo, useState } from 'react';
import { MainboardItemType as DataType, MainboardResponse } from '../api/mainboard.dto';
import { useAppConfigHook } from '@shared/hooks/useAppConfig.hook';
import { APP_GROUP } from '@shared/config/default.config';
import { toSemiCost, valueOfDateDiff, valueOfPlusMinus } from '@shared/libs/utils.lib';
import { MainboardSummaryData as SummaryData } from '../config/Mainboard.data';
import { StorageDataKey, useStorageHook } from '@shared/hooks/useStorage.hook';
import dayjs from 'dayjs';

export const useMainboardHook = (initialData?: MainboardResponse) => {
	const { data: config, getConfig, createConfig, isPending } = useAppConfigHook({ group: APP_GROUP.DASHBOARD });
	const { setLocalStorage, getLocalStorage } = useStorageHook();

	const initConfig = getLocalStorage(StorageDataKey.MAINBOARD_CONFIG_MORE) as boolean[];
	const DEFAULT_MORE = [false, false, false];
	const [isMoreList, setMoreList] = useState<boolean[]>(initConfig || DEFAULT_MORE);

	const initConfigSort = getLocalStorage(StorageDataKey.MAINBOARD_CONFIG_SORT) as ('asc' | 'desc')[];
	const DEFAULT_SORT = ['asc', 'asc', 'asc'];
	const [sortList, setSortList] = useState<('asc' | 'desc')[]>(initConfigSort || DEFAULT_SORT);

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

		const { asset } = initialData;
		const total = Number(asset?.price);
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
		// const valuation = Number(captal) - Number(sonic) - Number(deposit?.price); // (자본 - 손익 - 예수금)

		const values: string[] = [
			captal?.toString() || '', // 자본
			sell?.toString() || '', // 평가금액
			sonic?.toString() || '', // 손익
			deposit?.price?.toString() || '', // 예수금
		];
		return SummaryData(values);
	}, [list, data]);

	const onClickMore = (index: number = 0, value: boolean = true) => {
		const more = cloneDeep(isMoreList);
		more?.[index] !== undefined && (more[index] = value);

		setMoreList(more);
		setLocalStorage(StorageDataKey.MAINBOARD_CONFIG_MORE, more);
	};

	const onClickSort = (index: number = 0, value: 'asc' | 'desc' = 'asc') => {
		const sort = cloneDeep(sortList);
		sort?.[index] !== undefined && (sort[index] = value);

		setSortList(sort);
		setLocalStorage(StorageDataKey.MAINBOARD_CONFIG_SORT, sort);
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
		sortList,
		onClickSort,
	};
};

export const useMainboardCardHook = (
	initialData?: MainboardResponse,
	isMore: boolean = false,
	sortType: 'asc' | 'desc' = 'asc'
) => {
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

	// 목표가 도래
	const target = useMemo(() => {
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
				diffDate: valueOfDateDiff(row.sdate, new Date()),
			};
		});

		const array: DataType[] = [];

		// 매수일로부터 1개월이하 손익율 5% 이상
		let filtered = items?.filter((a) => dayjs().add(-1, 'month').isBefore(dayjs(a.sdate)) && a?.sonicRate >= 5);
		filtered && array.push(...filtered);

		// 매수일로부터 3개월이하 손익율 10% 이상
		filtered = items?.filter((a) => dayjs().add(-3, 'month').isBefore(dayjs(a.sdate)) && a?.sonicRate >= 10);
		filtered && array.push(...filtered);

		// 매수일로부터 6개월이하 손익율 15% 이상
		filtered = items?.filter((a) => dayjs().add(-6, 'month').isBefore(dayjs(a.sdate)) && a?.sonicRate >= 15);
		filtered && array.push(...filtered);

		// 매수일로부터 1년이하 손익율 20% 이상
		filtered = items?.filter((a) => dayjs().add(-12, 'month').isBefore(dayjs(a.sdate)) && a?.sonicRate >= 20);
		filtered && array.push(...filtered);

		return array;
	}, [initialData]);

	const max = isMore ? 10 : 3;

	const sonic = useMemo(() => {
		return sortType === 'asc'
			? reverse(sortBy(keeps, ['siseSonic'])).slice(0, max)
			: sortBy(keeps, ['siseSonic']).slice(0, max);
	}, [sortType, max, keeps]);

	const latest = useMemo(() => {
		if (sortType === 'asc') return reverse(sortBy(latestBuy, ['sdate'])).slice(0, max);
		else return reverse(sortBy(latestSell, ['edate'])).slice(0, max);
	}, [latestBuy, latestSell, sortType, max]);

	const sonicBuyList = useMemo(() => {
		if (sortType === 'asc') return reverse(sortBy(sonicBuy, ['sonicRate'])).slice(0, max);
		else return sortBy(sonicBuy, ['sonicRate']).slice(0, max);
	}, [sonicBuy, max, sortType]);

	return {
		loaded: !isPending,
		config,
		getConfig,
		createConfig,
		list: data?.value,
		trades: data?.trades,
		keeps,
		sonic,
		latest,
		sonicBuy: sonicBuyList,
		asset: data?.asset,
		deposit: data?.deposit,
		buys: data?.buys,
		totalPrice,
		target,
		latestBuy: reverse(sortBy(latestBuy, ['sdate'])),
		sonicBuyTop: reverse(sortBy(sonicBuy, ['sonicRate'])),
	};
};
