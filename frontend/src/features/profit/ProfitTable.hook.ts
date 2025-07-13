import { cloneDeep, sortBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { ProfitItemType as DataType } from './api/profit.dto';
import dayjs from 'dayjs';

// export const useProfitTable = <T = unknown>() => {
//   const [data, setData] = useState<T | undefined>();

//   console.log(data);

//   return {
//     data,
//     setData,
//   }
// };

export const useProfitTable = (initialData?: DataType[]) => {
	const [data, setData] = useState<DataType[] | undefined>(initialData);
	const [filter, setFilter] = useState<string>('codes');

	useEffect(
		() =>
			setData(
				cloneDeep(initialData)?.map((a) => {
					return { ...a, sonic: (a?.ecost || 0) - (a?.scost || 0) };
				})
			),
		[initialData]
	);

	const filteredData = useMemo(() => {
		if (!data?.length) return undefined;

		if (filter === 'all') {
			return data;
		} else {
			const filteredKey = 'name';

			const grouped = cloneDeep(data).reduce(
				(acc, curr) => {
					let key = curr[filteredKey];
					if (filter === 'months') {
						key = dayjs(curr.edate).format('YYYY-MM');
						curr['name'] = key;
					} else if (filter === 'days') {
						key = dayjs(curr.edate).format('YYYY-MM-DD');
						curr['name'] = key;
					} else {
						key = curr[filteredKey];
					}
					console.log({ key, filteredKey });

					// 초기화
					if (!acc[key]) {
						acc[key] = { ...curr, sonic: 0, scost: 0, ecost: 0, count: 0 } as DataType;
					}

					acc[key].scost = (acc[key].scost || 0) + (curr.scost || 0) * (curr.count || 0);
					acc[key].ecost = (acc[key].ecost || 0) + (curr.ecost || 0) * (curr.count || 0);
					acc[key].count = (acc[key].count || 0) + (curr.count || 0);

					return acc;
				},
				{} as Record<string, DataType>
			);

			const result = Object.values(grouped).map((item) => {
				if (item?.scost && item?.ecost && item?.count) {
					return {
						...item,
						sonic: item.ecost - item.scost,
					};
				} else {
					return item;
				}
			});

			return sortBy(result, ['code']);
		}
	}, [data, filter]);

	console.log('[useProfitTable]', { filteredData, data });

	return {
		filteredData,
		data,
		setData,
		filter,
		setFilter,
	};
};
