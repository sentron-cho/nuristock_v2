import { useEffect, useMemo, useState } from 'react';
import { ResearchResponse } from '../api/research.dto';

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
		const filtered = data?.filter((a) => a?.type?.toUpperCase() === viewType.toUpperCase());
		let items = filtered;

		if (!isShowClose) {
			items = filtered?.filter((a) => a.state === 'open');
		}

		if (search) {
			items = items?.filter(a => a.code?.includes(search) || a.name?.includes(search));
			console.log({ search, items });
		}

		return items;
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
