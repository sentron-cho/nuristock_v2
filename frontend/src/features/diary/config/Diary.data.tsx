import { SummaryDataType } from '@features/common/ui/SummaryBar.ui';
import { ST } from '@shared/config/kor.lang';

export const SummaryData = (values?: string[]): SummaryDataType[] => {
	return [
		{ id: 'up', label: ST.SONIC_UP, value: values?.[0] },
		{ id: 'down', label: ST.SONIC_DN, value: values?.[1] },
		{ id: 'sum', label: ST.SUM, value: values?.[2] },
	];
};