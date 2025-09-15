import { useMemo } from 'react';
import { InvestmentItemType, InvestmentResponse } from '../api/investment.dto';
import dayjs from 'dayjs';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { reverse, sortBy } from 'lodash';
import { OptionType } from '@shared/config/common.type';
import { calcExcessProfit, calcValuePerShare } from '@shared/libs/investment.util';
import { toNumeric, valueOfUpDown, withCommas } from '@shared/libs/utils.lib';
import { FieldValues } from 'react-hook-form';

export const useInvestmentHook = (initialData?: InvestmentResponse) => {
	const { param } = useCommonHook();

	const sise = useMemo(() => initialData?.sise, [initialData?.sise]);
	const data = useMemo(() => {
		if (!initialData) return undefined;

		const sise = initialData?.sise;
		const marketinfo = initialData?.marketinfo;

		const items = initialData?.value?.map((item) => {
			const siseValue = sise?.find((a) => a?.code === item.code)?.sise;
			const profit = calcExcessProfit({ ...item });
			const shareValue = calcValuePerShare({ ...item, rateKey: 'rate2' }); // 0.8 기준
			const shareRate = Number((shareValue / Number(siseValue)).toFixed(2));

			const market = marketinfo?.find(a => a.code === item.code && a.cdate === item.sdate);
			const eps = market?.profit ? (Number(market?.profit) / Number(item.count)).toFixed(0) : '';

			return {
				...item,
				profit: profit?.toFixed(0),
				shareValue,
				shareRate,
				sise: siseValue,
				eps: eps,
			};
		}) as InvestmentItemType[];

		return items;
	}, [initialData]);

	const dashboard = useMemo(() => initialData?.dashboard, [initialData]);

	// 종목명별 데이터 추출
	const groupedByName = useMemo(() => {
		return data?.reduce(
			(acc, item) => {
				const name = item?.['name'];
				if (!name) return acc;

				if (!acc[name]) acc[name] = [];
				acc[name].push(item);
				return acc;
			},
			{} as Record<string, typeof data>
		);
	}, [data]);

	const filteredByCode = useMemo(() => {
		if (!data || !param?.id) return undefined;

		return reverse(
			sortBy(
				data?.filter((a) => a.code === param?.id),
				'sdate'
			)
		);
	}, [data, param]);

	// 올해 데이터 가져오기
	const dataByToday = useMemo(() => {
		if (!data) return undefined;
		return data?.filter((a) => a.sdate?.toString() === dayjs().format('YYYY'));
	}, [data]);

	const selected = useMemo(() => data?.find((a) => a.code === param?.id)?.code, [data, param]);

	// 네비게이션 옵션
	const naviOptions = useMemo(() => {
		const items =
			groupedByName &&
			(Object.entries(groupedByName)?.map((a) => ({ value: a?.[1]?.[0]?.code, label: a?.[0] })) as OptionType[]);
		return items as OptionType[];
	}, [data]);

	// 보유 종목
	const keeps = useMemo(() => {
		if (!dashboard || !dataByToday) return undefined;

		const filtered = dashboard?.filter((a) => !!a?.kcount);
		const items = dataByToday?.filter((a) => !!filtered?.find((b) => a.code === b.code));

		return reverse(sortBy(items, ['bookmark', 'shareRate']));
	}, [dataByToday, dashboard]);

	// 거래했던 종목
	const trade = useMemo(() => {
		if (!dashboard || !dataByToday) return undefined;

		const filtered = dashboard?.filter((a) => !a?.kcount);
		const items = dataByToday?.filter((a) => !!filtered?.find((b) => a.code === b.code));

		return reverse(sortBy(items, ['bookmark', 'shareRate']));
	}, [dataByToday, dashboard]);

	// 미보유 종목
	const nokeeps = useMemo(() => {
		if (!dashboard || !dataByToday) return undefined;

		const items = dataByToday?.filter((a) => !dashboard?.find((b) => a.code === b.code));

		return reverse(sortBy(items, ['bookmark', 'shareRate']));
	}, [dataByToday, dashboard]);

	return { data, groupedByName, filteredByCode, dataByToday, sise, selected, naviOptions, keeps, nokeeps, trade };
};

type TargetList = 'rate1' | 'rate2' | 'rate3' | 'rate4';

export const useInvestmentPerValueHook = (
	data?: InvestmentItemType,
	targetList: TargetList[] = ['rate1', 'rate2', 'rate3', 'rate4']
) => {
	const list = useMemo(() => {
		return targetList?.map((target) => {
			let value = calcValuePerShare({ ...data, rateKey: target });
			const nTargetRate = toNumeric((data as FieldValues)?.[target]).toFixed(1);

			return {
				target: target,
				value: withCommas(value),
				rate: nTargetRate,
				updown: valueOfUpDown(Number(value), Number(data?.sise)),
			};
		});
	}, [data]);

	return { list };
};
