import { SelectOptionType } from '@entites/SelectForm';
import { SummaryDataType } from '@features/common/ui/SummaryBar.ui';
import { ST } from '@shared/config/kor.lang';

export const MyStockSummaryData = (): SummaryDataType[] => {
	return [
		{ id: '1', label: ST.CAPITAL, value: '123456789' },
		{ id: '2', label: ST.AT_MARKET_PRICE, value: '123456789' },
		{ id: '3', label: ST.SONIC, value: '123456789' },
	];
};

export const MyStockTitleOptions = (): SelectOptionType[] => {
	return [
		{ label: ST.KEEP_LIST, value: 'keep' },
		{ label: ST.TRADE_LIST, value: 'trade' },
	];
};
