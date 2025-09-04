import { StorageDataKey, useStorageHook } from '@shared/hooks/useStorage.hook';
import { useEffect, useMemo, useState } from 'react';
import { ResearchItemType, ResearchResponse } from '../api/research.dto';
import { EID } from '@shared/config/default.config';
import { reverse, sortBy } from 'lodash';
import { toNumeric, valueOfPlusMinus, valueOfUpDown, withCommas } from '@shared/libs/utils.lib';
import dayjs from 'dayjs';
import { calcValuePerShare } from '@shared/libs/investment.util';
import { ST } from '@shared/config/kor.lang';
import { FieldValues } from 'react-hook-form';
import { useCommonHook } from '@shared/hooks/useCommon.hook';
import { OptionType } from '@shared/config/common.type';

export const useResearchHook = (initialData?: ResearchResponse, viewType: 'kospi' | 'kosdaq' | 'none' = 'kospi') => {
	const { setSessionStorage, getSessionStorage } = useStorageHook();

	const [isShowClose, setShowClose] = useState(false);
	const [perItem] = useState(Number(getSessionStorage(StorageDataKey.RESEARCH_MAX) || 100));
	const [max, setMax] = useState(perItem);
	const [search, setSearch] = useState<string>();
	const [sort, setSort] = useState<string>(getSessionStorage(StorageDataKey.RESEARCH_SORT) || 'roe');

	useEffect(() => {
		setMax(perItem);
	}, [viewType]);

	const naviOptions = useMemo(
		() => [
			{ label: ST.KOSPI, value: 'kospi' },
			{ label: ST.KOSDAQ, value: 'kosdaq' },
			{ label: ST.ERROR_SEARCH, value: 'none' },
		],
		[]
	);

	// 초기 데이터
	const data = useMemo(() => initialData?.value, [initialData]);

	// 계산된 데이터
	const list = useMemo(() => {
		if (!data?.length) return undefined;

		// roe 숫자로 변환
		const parsed = data?.map((a) => {
			const scount = !isNaN(Number(a.scount)) ? Number(a.scount) : 0;
			const roe = !isNaN(Number(a.roe)) ? Number(a.roe) : 0;
			const equity = !isNaN(Number(a.equity)) ? Number(a.equity) : 0;
			const profit = !isNaN(Number(a.profit)) ? Number(a.profit) : 0;
			const isWeek = dayjs(a?.stime).format('YYYYMMDD') >= dayjs().add(-7, 'day').format('YYYYMMDD'); // 일주일
			const sise = isWeek ? Number(a?.sise) : 0;

			if (scount && roe && equity && profit && sise) {
				const shareValue = calcValuePerShare({
					count: scount.toString(),
					roe: roe.toString(),
					equity: equity.toString(),
					profit: profit.toString(),
					brate: '8.0',
					targetRate: '0.9',
				}); // 0.8 기준
				const shareRate = sise ? Number((shareValue / Number(sise)).toFixed(2)) : 0;

				return {
					...a,
					count: scount.toString(),
					roe: roe.toString(),
					equity: equity.toString(),
					profit: profit.toString(),
					shareValue: sise ? shareValue : 0,
					shareRate,
				} as ResearchItemType;
			} else {
				return {
					...a,
					count: scount.toString(),
					roe: roe.toString(),
					equity: equity.toString(),
					profit: profit.toString(),
					sise: '0',
					shareValue: 0,
					shareRate: 0,
				} as ResearchItemType;
			}
		});

		// 코스피/코스닥 타입 필터링
		const filtered = parsed?.filter((a) => {
			if (viewType === 'kospi') return a?.type?.toUpperCase() === 'KOSPI';
			else if (viewType === 'kosdaq') return a?.type?.toUpperCase() === 'KOSDAQ';
			else {
				const isNone = !(a?.type?.toUpperCase() === 'KOSPI' || a?.type?.toUpperCase() === 'KOSDAQ');
				if (isNone || !a.roe || !a.sise || !a.equity) return true;
			}
		});
		let items = filtered;

		// 상폐종목 표시 여부
		if (!isShowClose) {
			items = filtered?.filter((a) => a.state === 'open');
		}

		// 우선주
		const preferred = items?.filter((a) => Number(a.roe) > 0 && Number(a.equity) > 0 && Number(a.profit) > 0);

		// 나머지
		const rest = items?.filter((a) => Number(a.roe) <= 0 || Number(a.equity) <= 0 || Number(a.profit) <= 0);

		// 정렬
		if (viewType === 'none') {
			items = sortBy(items, ['name']);
		} else {
			if (sort === 'roe') {
				items = [...reverse(sortBy(preferred, ['shareRate', 'roe'])), ...rest];
			} else {
				items = sortBy(items, [sort === 'name' ? 'name' : 'sise']);
			}
		}

		if (search) {
			items = items?.filter((a) => a.code?.toLocaleLowerCase()?.includes(search) || a.name?.toLocaleLowerCase()?.includes(search));
		}

		return items?.map((a) => {
			const nRoe = Number(a.roe);
			const roeType = nRoe >= 10 ? EID.PLUS : nRoe < 0 ? EID.MINUS : EID.NONE;

			const nCount = Number(a.scount);
			const countType = nCount >= 10000000 ? EID.MINUS : nCount < 10000000 ? EID.PLUS : EID.NONE;

			const nEnquity = Number(a.equity);
			const enquityType = valueOfPlusMinus(nEnquity);

			const nProfit = Number(a.profit);
			const profitType = valueOfPlusMinus(nProfit);

			const nShareValue = Number(a.shareValue);
			const shareValueType = valueOfPlusMinus(nShareValue, Number(a.sise));

			const nShareRate = Number(a.shareRate);
			const shareRateType = valueOfPlusMinus(nShareRate, 1);

			return {
				...a,
				roeType,
				countType,
				profitType,
				enquityType,
				shareValueType,
				shareRateType,
				siseType: a?.updown === 'up' ? 'plus' : a?.updown === 'down' ? 'minus' : '',
			};
		});
	}, [data, isShowClose, viewType, search, sort]);

	const totalCount = useMemo(() => list?.length, [list]);

	const moreMax = () => {
		setMax((prev) => prev + perItem);
		setSessionStorage(StorageDataKey.RESEARCH_MAX, max + perItem);
	};

	const onSort = (value: string) => {
		setSort(value);
		setSessionStorage(StorageDataKey.RESEARCH_SORT, value);
	};

	return {
		naviOptions,
		data,
		list: list?.slice(0, max),
		allList: list,
		totalCount,
		max,
		sort,
		setMax,
		moreMax,
		isShowClose,
		setShowClose,
		setSearch,
		setSort: onSort,
	};
};

export const useResearchDetailHook = (initialData?: ResearchResponse, allData?: ResearchItemType[]) => {
	const { param } = useCommonHook();

	// 초기 데이터
	const data = useMemo(() => initialData?.value, [initialData]);
	// const allData = useMemo(() => allList?.value, [allList]);

	// 계산된 데이터
	const list = useMemo(() => {
		if (!data?.length) return undefined;

		const items = data?.map((a) => ({ ...a, brate: '8.0', rate1: '0.7', rate2: '0.8', rate3: '0.9', rate4: '1.0' }));

		// roe 숫자로 변환
		const parsed = items?.map((a) => {
			const scount = !isNaN(Number(a.scount)) ? Number(a.scount) : 0;
			const roe = !isNaN(Number(a.roe)) ? Number(a.roe) : 0;
			const equity = !isNaN(Number(a.equity)) ? Number(a.equity) : 0;
			const profit = !isNaN(Number(a.profit)) ? Number(a.profit) : 0;
			const isWeek = dayjs(a?.stime).format('YYYYMMDD') >= dayjs().add(-7, 'day').format('YYYYMMDD'); // 일주일
			const sise = isWeek ? Number(a?.sise) : 0;

			if (scount && roe && equity && profit && sise) {
				const shareValue = calcValuePerShare({
					...a,
					count: scount.toString(),
					roe: roe.toString(),
					equity: equity.toString(),
					profit: profit.toString(),
					brate: a?.brate,
					rateKey: 'rate3',
				}); // 0.8 기준

				const shareRate = sise ? Number((shareValue / Number(sise)).toFixed(2)) : 0;

				return {
					...a,
					count: scount.toString(),
					roe: roe.toString(),
					equity: equity.toString(),
					profit: profit.toString(),
					shareValue: sise ? shareValue : 0,
					shareRate,
				} as ResearchItemType;
			} else {
				return {
					...a,
					count: scount.toString(),
					roe: 'N/A',
					equity: equity.toString(),
					profit: profit.toString(),
					sise: sise.toString(),
					shareValue: 0,
					shareRate: 0,
				} as ResearchItemType;
			}
		});

		return reverse(sortBy(parsed, 'cdate'))?.map((a) => {
			const nRoe = Number(a.roe);
			const roeType = !isNaN(Number(a.roe)) ? nRoe >= 10 ? EID.PLUS : nRoe < 0 ? EID.MINUS : EID.NONE : '';

			const nCount = Number(a.scount);
			const countType = nCount >= 10000000 ? EID.MINUS : nCount < 10000000 ? EID.PLUS : EID.NONE;

			const nEnquity = Number(a.equity);
			const enquityType = valueOfPlusMinus(nEnquity);

			const nProfit = Number(a.profit);
			const profitType = valueOfPlusMinus(nProfit);

			const nShareValue = Number(a.shareValue);
			const shareValueType = valueOfPlusMinus(nShareValue, Number(a.sise));

			const nShareRate = Number(a.shareRate);
			const shareRateType = valueOfPlusMinus(nShareRate, 1);

			return {
				...a,
				roeType,
				countType,
				profitType,
				enquityType,
				shareValueType,
				shareRateType,
				siseType: a?.updown === 'up' ? 'plus' : a?.updown === 'down' ? 'minus' : '',
			};
		});
	}, [data]);

	const totalCount = useMemo(() => list?.length, [list]);

	// 네비게이션 옵션
	const naviOptions = useMemo(() => {
		return allData?.map((a) => ({ value: a.code, label: a.name })) as OptionType[];
	}, [allData]);

	const selected = useMemo(() => allData?.find((a) => a.code === param?.id)?.code, [allData, param]);

	return {
		naviOptions,
		selected,
		data,
		list,
		totalCount,
	};
};

type TargetList = 'rate1' | 'rate2' | 'rate3' | 'rate4';

export const useResearchPerValueHook = (
	data?: ResearchItemType,
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
				updown: !isNaN(Number(value)) ? valueOfUpDown(Number(value), Number(data?.sise)) : '',
			};
		});
	}, [data]);

	return { list };
};
