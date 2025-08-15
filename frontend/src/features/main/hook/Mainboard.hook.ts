import { reverse, sortBy } from 'lodash';
import { useMemo } from 'react';
import { MainboardResponse } from '../api/mainboard.dto';
import { useAppConfigHook } from '@shared/hooks/useAppConfig.hook';
import { APP_GROUP } from '@shared/config/default.config';
import { toSemiCost, valueOfPlusMinus } from '@shared/libs/utils.lib';

export const useMainboardHook = (initialData?: MainboardResponse) => {
	const { data: config, getConfig, createConfig, isPending } = useAppConfigHook({ group: APP_GROUP.DASHBOARD });

	const data = useMemo(() => initialData, [initialData]);

	const totalPrice = useMemo(() => {
		if (!initialData) return '';

		const { deposit, asset } = initialData;
		const total = Number(deposit?.price) + Number(asset?.price);
		return toSemiCost(total);
	}, [initialData]);

	return {
		loaded: !isPending,
		config,
		getConfig,
		createConfig,
		list: data?.value,
		trades: data?.trades,
		keeps: data?.keeps,
		asset: data?.asset,
		deposit: data?.deposit,
		totalPrice,
	};
};

export const useMainboardCardHook = (initialData?: MainboardResponse) => {
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
			const sonicRate = sonic !== 0 ? siseSonic / (row?.kprice || 0) * 100 : 0;

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

	const latestBuy = useMemo(() => {
		const items = data?.buys?.map((row) => {
			const siseValue = data?.sise?.find((a) => a.code === row.code)?.sise;
			const sonic = (row.eprice || 0) - (row.sprice || 0);
			const sonicRate = sonic !== 0 ? ((row.eprice || 0) / (row.sprice || 0)) * 100 - 100 : 0;
			const sprice = Number(row?.count) * Number(row?.scost);

			return {
				...row,
				sprice,
				eprice: 0,
				type: valueOfPlusMinus(siseValue),
				sonic: sonic,
				sonicRate: sonicRate,
				sise: siseValue,
				siseSonic: siseValue ? (row?.kcount || 0) * siseValue - (row?.kprice || 0) : 0,
			};
		});

		return sortBy(items, ['sdate']);
	}, [initialData]);

	const latestSell = useMemo(() => {
		const items = data?.sells?.map((row) => {
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

	return {
		loaded: !isPending,
		config,
		getConfig,
		createConfig,
		list: data?.value,
		trades: data?.trades,
		keeps,
		sonicTop: reverse(sortBy(keeps, ['siseSonic'])).slice(0, 5),
		sonicBottom: sortBy(keeps, ['siseSonic']).slice(0, 5),
		latestBuy: reverse(sortBy(latestBuy, ['sdate'])).slice(0, 5),
		latestSell: reverse(sortBy(latestSell, ['edate'])).slice(0, 5),
		asset: data?.asset,
		deposit: data?.deposit,
		totalPrice,
	};
};
