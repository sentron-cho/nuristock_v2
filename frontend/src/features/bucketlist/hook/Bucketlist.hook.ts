import { useMemo } from 'react';
import { Headers, BucketlistSummaryData as SummaryData, TargetHeaders } from '../config/Bucketlist.data';
import { BucklistCreateType, BucklistDataType, BucklistResponse } from '../api/bucketlist.dto';
import { ChartLineDataType } from '@entites/ChartLine';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import dayjs from 'dayjs';
import { valueOfPlusMinus } from '@shared/libs/utils.lib';

export const useBucketlistHook = (initialData?: BucklistResponse, refresh?: number) => {
	const data = useMemo(() => initialData as BucklistResponse, [initialData]);
	const { isMobile, param } = useCommonHook();

	const bucketlist = useMemo(() => {
		return data?.value?.map((a) => ({ ...JSON.parse(a.svalue), rowid: a?.rowid })) as BucklistCreateType[];
	}, [data]);

	const params = useMemo(() => {
		const id = Number(param?.id) || 1;

		const item = bucketlist?.find((a) => Number(a.page) === id);

		return { ...item, page: Number(id) };
	}, [refresh, param, bucketlist]);

	const list = useMemo(() => {
		if (!params) return undefined;

		const { principal, rate, years, annual, startYear } = params;

		if (!years || !annual || !principal || !rate) return undefined;

		const rows: BucklistDataType[] = [];
		let bal = principal;
		let balNo = principal;

		for (let y = 1; y <= years; y++) {
			const start = bal;
			const afterGrowth = start * (1 + rate);
			const end = afterGrowth + annual; // 연말 납입

			// no-contribution path
			balNo = balNo * (1 + rate);

			const row: BucklistDataType = {
				date: (Number(startYear) + y - 1).toString(),
				year: y,
				start,
				afterGrowth,
				contribution: annual,
				end,
				end_noContrib: balNo,
				interestEarned: afterGrowth - start,
			};

			rows.push(row);
			bal = end; // 다음 해로 이월
		}

		return rows;
	}, [params]);

	const targetList = useMemo(() => {
		const { asset } = data;

		const res = list?.map((item) => {
			const result = asset?.find((a) => dayjs(a.sdate).format('YYYY') === item.date)?.price;
			const type = valueOfPlusMinus(Number(result) - Number(item?.end));

			return { ...item, result, type: result ? type : '' };
		});

		return res;
	}, [list, data]);

	const chartData = useMemo(() => {
		return list?.map<ChartLineDataType>((r) => ({ year: r.year, withContrib: r.end, withoutContrib: r.end_noContrib }));
	}, [params, list]);

	const summaryData = useMemo(() => {
		if (!list || !params) return undefined;

		const final = list[list.length - 1];
		const totalInvested = (params?.principal || 0) + (params?.annual || 0) * list.length;
		// const gain = final.end - totalInvested;

		const values: string[] = [
			final.end?.toFixed(0) || '',
			totalInvested?.toFixed(0) || '',
			final.end_noContrib?.toFixed(0) || '',
		];
		return SummaryData(values);
	}, [list, params]);

	const headers = useMemo(() => {
		return Headers({ isMobile });
	}, [isMobile]);

	const targetHeaders = useMemo(() => {
		return TargetHeaders({ isMobile });
	}, [isMobile]);

	const naviOptions = useMemo(
		() => bucketlist?.map((a) => ({ value: a?.page?.toString() || '', label: a?.startYear?.toString() || '' })),
		[data]
	);

	return {
		page: Number(param?.id) || 1,
		summaryData,
		chartData,
		list,
		headers,
		selected: bucketlist?.find((a) => Number(a.page) === Number(param?.id)),
		params: { ...params, rowid: bucketlist?.find((a) => Number(a.page) === Number(param?.id))?.rowid },
		data,
		asset: data?.asset,
		deposit: data?.deposit,
		targetHeaders,
		targetList,
		naviOptions,
	};
};
