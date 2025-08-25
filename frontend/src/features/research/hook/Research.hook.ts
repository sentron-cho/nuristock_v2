import { useEffect, useMemo, useState } from 'react';
import { ResearchResponse } from '../api/research.dto';
import { EID } from '@shared/config/default.config';
import { reverse, sortBy } from 'lodash';
import { valueOfPlusMinus } from '@shared/libs/utils.lib';

export const useResearchHook = (initialData?: ResearchResponse, viewType: 'kospi' | 'kosdaq' = 'kospi') => {
	const [isShowClose, setShowClose] = useState(false);
	const [perItem] = useState(100);
	const [max, setMax] = useState(perItem);
	const [search, setSearch] = useState<string>();

	useEffect(() => {
		setMax(perItem);
	}, [viewType]);

	const data = useMemo(() => initialData?.value, [initialData]);

	const list = useMemo(() => {
		if (!data?.length) return undefined;

		const filtered = data?.filter((a) => a?.type?.toUpperCase() === viewType.toUpperCase());
		let items = filtered;

		if (!isShowClose) {
			items = filtered?.filter((a) => a.state === 'open');
		}

		items = items?.map((a) => ({ ...a, roe: !isNaN(Number(a.roe)) ? Number(a.roe) : 0 }));

		// 우선주
		const preferred = items?.filter((a) => Number(a.roe) > 0 && Number(a.equity) > 0 && Number(a.profit) > 0);
		// 나머지
		const rest = items?.filter((a) => Number(a.roe) <= 0 || Number(a.equity) <= 0 || Number(a.profit) <= 0);

		console.log({ count: items?.length, preferred: preferred?.length, rest: rest?.length });

		// 정렬
		items = [...reverse(sortBy(preferred, ['roe'])), ...rest];

		if (search) {
			items = items?.filter((a) => a.code?.includes(search) || a.name?.includes(search));
			console.log({ search, items });
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

			return {
				...a,
				roeType,
				countType,
				profitType,
				enquityType,
			};
		});
	}, [data, isShowClose, viewType, search]);

	const totalCount = useMemo(() => list?.length, [list]);

	const moreMax = () => {
		setMax((prev) => prev + perItem);
	};

	return {
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
