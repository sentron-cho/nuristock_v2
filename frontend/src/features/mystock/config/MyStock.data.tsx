import { SelectOptionType } from '@entites/SelectForm';
import { SummaryDataType } from '@features/common/ui/SummaryBar.ui';
import { ST } from '@shared/config/kor.lang';

export const MyStockSummaryData = (values?: string[]): SummaryDataType[] => {
	return [
		{ id: '1', label: ST.BUY, value: values?.[0] || '' },
		{ id: '2', label: ST.SELL, value: values?.[1] || '' },
		{ id: '3', label: ST.KEEP_COST, value: values?.[2] || '' },
		{ id: '4', label: ST.SONIC, value: values?.[3] || '' },
	];
};

export const MyStockTitleOptions = (): SelectOptionType[] => {
	return [
		{ label: ST.KEEP_LIST, value: 'keep' },
		{ label: ST.TRADE_LIST, value: 'trade' },
	];
};
