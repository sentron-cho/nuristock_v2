import { reverse, sortBy } from 'lodash';
import { useMemo } from 'react';
import { AssetItemType as DataType, AssetResponse } from '../api/asset.dto';

export const useAssetData = (initialData?: AssetResponse) => {
	// 메인 데이터 초기화
	const data = useMemo(() => {
		return reverse(sortBy(initialData?.value, 'sdate')) as DataType[];
	}, [initialData]);

	return {
		data,
	};
};
