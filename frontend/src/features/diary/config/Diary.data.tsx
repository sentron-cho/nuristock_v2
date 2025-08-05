import { SummaryDataType } from '@features/common/ui/SummaryBar.ui';
import { ST } from '@shared/config/kor.lang';

export const SummaryData = (values?: string[]): SummaryDataType[] => {
	return [
		{ id: 'buy', label: ST.BUY, value: values?.[0] },
		{ id: 'sell', label: ST.SELL, value: values?.[1] },
		{ id: 'sonic', label: ST.SONIC, value: values?.[2] },
	];
};