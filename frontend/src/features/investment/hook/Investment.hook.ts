import { useMemo } from 'react';
import { InvestmentItemType, InvestmentResponse } from '../api/investment.dto';
import dayjs from 'dayjs';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { reverse, sortBy } from 'lodash';
import { OptionType } from '@shared/config/common.type';
import { calcValuePerShare } from '@shared/libs/investment.util';
import { valueOfUpDown, withCommas } from '@shared/libs/utils.lib';

export const useInvestmentHook = (initialData?: InvestmentResponse) => {
	const { param } = useCommonHook();

	const sise = useMemo(() => initialData?.sise, [initialData?.sise]);
	const data = useMemo(() => {
		if (!initialData) return undefined;

		const sise = initialData?.sise;
		const items = initialData?.value?.map((item) => ({
			...item,
			sise: sise?.find((a) => a?.code === item.code)?.sise,
		})) as InvestmentItemType[];

		return items;
	}, [initialData]);

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

	const naviOptions = useMemo(() => {
		const items = groupedByName && Object.entries(groupedByName)?.map((a) => ({ value: a?.[1]?.[0]?.code, label: a?.[0] })) as OptionType[];
		return items as OptionType[];
	}, [data]);

	return { data, groupedByName, filteredByCode, dataByToday, sise, selected, naviOptions };
};

type TargetList = 'rate1' | 'rate2' | 'rate3' | 'rate4';

export const useInvestmentPerValueHook = (
	data?: InvestmentItemType,
	targetList: TargetList[] = ['rate1', 'rate2', 'rate3', 'rate4']
) => {
	const list = useMemo(() => {
		return targetList?.map((target) => {
			const value = calcValuePerShare({ ...data, rateKey: target });
			return {
				target: target,
				value: withCommas(value),
				updown: valueOfUpDown(Number(value), Number(data?.sise)),
			};
		});
	}, [data]);

	return { list };
};
