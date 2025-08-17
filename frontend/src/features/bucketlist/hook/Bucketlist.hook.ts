import { useMemo } from 'react';
import { Headers, BucketlistSummaryData as SummaryData } from '../config/Bucketlist.data';
import { BucklistDataType, BucklistParamType } from '../api/bucketlist.dto';
import { ChartLineDataType } from '@entites/ChartLine';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { StorageDataKey, useStorageHook } from '@shared/hooks/useStorage.hook';

export const useBucketlistHook = (refresh?: number) => {
	const initialData: BucklistParamType = {
		page: 1,
		principal: 40_000_000,
		rate: 0.15,
		years: 10,
		annual: 5_000_000,
	};

	const { getLocalStorage } = useStorageHook();
	const { isMobile, param } = useCommonHook();

	const params = useMemo(() => {
		const id = param?.id || 1;
		const item = (getLocalStorage(`${StorageDataKey.BUCKET_PARAMS}-${id}`) || initialData) as BucklistParamType;
		return { ...item, page: Number(id) };
	}, [refresh, param]);

	const data = useMemo(() => {
		if (!params) return undefined;

		const { principal, rate, years, annual } = params;

		const rows: BucklistDataType[] = [];
		let bal = principal; // with contribution case
		let balNo = principal; // without contribution

		for (let y = 1; y <= years; y++) {
			const start = bal;
			const afterGrowth = start * (1 + rate);
			const end = afterGrowth + annual; // 연말 납입

			// no-contribution path
			balNo = balNo * (1 + rate);

			const row: BucklistDataType = {
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

	const chartData = useMemo(() => {
		return data?.map<ChartLineDataType>((r) => ({ year: r.year, withContrib: r.end, withoutContrib: r.end_noContrib }));
	}, [params, data]);

	const summaryData = useMemo(() => {
		if (!data || !params) return undefined;

		const final = data[data.length - 1];
		const totalInvested = params.principal + params.annual * data.length;
		// const gain = final.end - totalInvested;

		const values: string[] = [
			final.end?.toFixed(0) || '',
			totalInvested?.toFixed(0) || '',
			final.end_noContrib?.toFixed(0) || '',
		];
		return SummaryData(values);
	}, [data, params]);

	const headers = useMemo(() => {
		return Headers({ isMobile });
	}, [isMobile]);

	return {
		summaryData,
		chartData,
		data,
		headers,
		params,
	};
};
