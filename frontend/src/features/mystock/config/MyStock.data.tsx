import { SelectOptionType } from '@entites/SelectForm';
import { SummaryDataType } from '@features/common/ui/SummaryBar.ui';
import { ST } from '@shared/config/kor.lang';

export const MyStockSummaryDataTrade = (values?: string[]): SummaryDataType[] => {
	return [
		{ id: 'buy', label: ST.BUY, value: values?.[0] || '' },
		{ id: 'sell', label: ST.SELL, value: values?.[1] || '' },
		{ id: 'keep', label: ST.KEEP_COST, value: values?.[2] || '' },
		{ id: 'sonic', label: ST.SONIC, value: values?.[3] || '' },
	];
};

export const MyStockSummaryDataKeep = (values?: string[]): SummaryDataType[] => {
	return [
		{ id: 'buy', label: ST.BUY, value: values?.[0] || '' },
		{ id: 'valuation', label: ST.VALUATION, value: values?.[1] || '' },
		{ id: 'sonic', label: ST.SISE_SONIC, value: values?.[2] || '' },
	];
};

export const MyStockTitleOptions = (): SelectOptionType[] => {
	return [
		{ label: ST.KEEP_LIST, value: 'keep' },
		{ label: ST.TRADE_LIST, value: 'trade' },
	];
};
