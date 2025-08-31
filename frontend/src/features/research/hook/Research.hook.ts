import { useEffect, useMemo, useState } from 'react';
import { ResearchResponse } from '../api/research.dto';
import { EID } from '@shared/config/default.config';
import { reverse, sortBy } from 'lodash';
import { valueOfPlusMinus } from '@shared/libs/utils.lib';
import dayjs from 'dayjs';
import { calcValuePerShare } from '@shared/libs/investment.util';
import { ST } from '@shared/config/kor.lang';

export const useResearchHook = (initialData?: ResearchResponse, viewType: 'kospi' | 'kosdaq' | 'none' = 'kospi') => {
	const [isShowClose, setShowClose] = useState(false);
	const [perItem] = useState(100);
	const [max, setMax] = useState(perItem);
	const [search, setSearch] = useState<string>();

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
					scount,
					roe,
					equity,
					profit,
					shareValue: sise ? shareValue : 0,
					shareRate,
				};
			} else {
				return {
					...a,
					scount,
					roe,
					equity,
					profit,
					sise: 0,
					shareValue: 0,
					shareRate: 0,
				};
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
		if(viewType === 'none') items = sortBy(items, ['name']);
		else items = [...reverse(sortBy(preferred, ['shareRate', 'roe'])), ...rest];

		if (search) {
			items = items?.filter((a) => a.code?.includes(search) || a.name?.includes(search));
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
			const shareValueType = valueOfPlusMinus(nShareValue, a.sise);

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
	}, [data, isShowClose, viewType, search]);

	const totalCount = useMemo(() => list?.length, [list]);

	const moreMax = () => {
		setMax((prev) => prev + perItem);
	};

	return {
		naviOptions,
		data,
		list: list?.slice(0, max),
		totalCount,
		max,
		setMax,
		moreMax,
		isShowClose,
		setShowClose,
		setSearch,
	};
};
