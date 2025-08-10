import { useMemo } from 'react';
import { InvestmentItemType } from '../api/investment.dto';

export const useInvestmentHook = (initialData?: InvestmentItemType[]) => {
	const data = useMemo(() => initialData, [initialData]);

	// 종목명별 데이터 추출
	const groupedByName = useMemo(() => {
		return data?.reduce(
			(acc, item) => {
				const name = item['name'];
				if (!acc[name]) acc[name] = [];
				acc[name].push(item);
				return acc;
			},
			{} as Record<string, typeof data>
		);
	}, [data]);

	return { data, groupedByName };
};
