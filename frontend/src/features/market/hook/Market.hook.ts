import { useEffect, useMemo, useState } from 'react';
import { MarketSearchResponse } from '../api/market.dto';

export const useMarketHook = (initialData?: MarketSearchResponse, viewType: 'kospi' | 'kosdaq' = 'kospi') => {
	const [isShowClose, setShowClose] = useState(false);
	const [perItem] = useState(100);
	const [max, setMax] = useState(perItem);
	const [search, setSearch] = useState<string>();
	const [isErrorList, setErrorList] = useState<boolean>(false);

	useEffect(() => {
		setMax(perItem);
	}, [viewType]);

	const data = useMemo(() => initialData?.value, [initialData]);

	const count = useMemo(() => {
		if (!data) return undefined;
		
		return {
			'2024': data?.filter((a) => a.mtime?.toString() === '2024')?.length,
			'9000': data?.filter((a) => a.mtime?.toString() === '9000')?.length,
			'9001': data?.filter((a) => a.mtime?.toString() === '9001')?.length,
			'9999': data?.filter((a) => a.mtime?.toString() === '9999')?.length,
			'0000': data?.filter((a) => a.mtime?.toString() === '0000')?.length,
		};
	}, [data]);

	const list = useMemo(() => {
		const filtered = data?.filter((a) => a?.type?.toUpperCase() === viewType.toUpperCase());
		let items = filtered;

		if (!isShowClose) {
			items = filtered?.filter((a) => a.state === 'open');
		}

		if (search) {
			items = items?.filter(
				(a) => a.code?.toLocaleLowerCase().includes(search) || a.name.toLocaleLowerCase().includes(search)
			);
		}

		return items;
	}, [data, isShowClose, viewType, search]);

	const totalCount = useMemo(() => list?.length, [list]);

	const moreMax = () => {
		setMax((prev) => prev + perItem);
	};

	const onErrorList = () => {
		setErrorList((prev) => !prev);
	};

	return {
		data,
		count,
		list: isErrorList ? list?.filter((a) => Number(a?.mtime) >= 9000) : list?.slice(0, max),
		totalCount,
		isErrorList,
		max,
		setMax,
		moreMax,
		isShowClose,
		setShowClose,
		setSearch,
		onErrorList,
	};
};
