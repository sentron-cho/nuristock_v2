import { SummaryDataType } from '@features/common/ui/SummaryBar.ui';
import { ST } from '@shared/config/kor.lang';

export const DividendSummaryData = (values?: string[]): SummaryDataType[] => {
	return [
		{ id: 'sum', label: ST.DIVIDEND_SUM, value: values?.[0] || '' },
		{ id: 'tax', label: ST.TAX, value: values?.[1] || '' },
		{ id: 'total', label: ST.DIVIDEND_TOTAL, value: values?.[2] || '' },
	];
};