import { useMemo, useState } from 'react';
import { MarketSearchResponse } from '../api/market.dto';

export const useMarketHook = (initialData?: MarketSearchResponse, viewType: 'kospi' | 'kosdaq' = 'kospi') => {
	const [isShowClose, setShowClose] = useState(false);
	const [max, setMax] = useState(200);

	const data = useMemo(() => initialData?.value, [initialData]);

	const list = useMemo(() => {
		const filtered = data?.filter(a => a?.type?.toUpperCase() === viewType.toUpperCase());
		let items = filtered;

		if (!isShowClose) {
			items = filtered?.filter(a => a.state === 'open');
		}

		return items;
	}, [data, isShowClose, viewType]);

	const totalCount = useMemo(() => list?.length, [list]);

	return {
		data,
		list: list?.slice(0, max),
		totalCount,
		max,
		setMax,
		isShowClose,
		setShowClose,
	};
};
