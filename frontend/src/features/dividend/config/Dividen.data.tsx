import { SummaryDataType } from '@features/common/ui/SummaryBar.ui';
import { ST } from '@shared/config/kor.lang';

export const DividenSummaryData = (values?: string[]): SummaryDataType[] => {
	return [
		{ id: 'total', label: ST.SUM, value: values?.[0] || '' },
	];
};