import { useMemo } from 'react';
import { StatisticResponse } from '../api/statistic.dto';

export const useResearchHook = (initialData?: StatisticResponse) => {
	// 초기 데이터
	const data = useMemo(() => initialData?.value, [initialData]);

	return {
		data,
	};
};
