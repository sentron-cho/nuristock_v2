import { reverse, sortBy } from 'lodash';
import { useMemo } from 'react';
import { DepositItemType as DataType, DepositResponse } from '../api/deposit.dto';

export const useDepositHook = (initialData?: DepositResponse) => {
	// 메인 데이터 초기화
	const data = useMemo(() => {
		return reverse(sortBy(initialData?.value, 'sdate')) as DataType[];
	}, [initialData]);

	return {
		data
	};
};
