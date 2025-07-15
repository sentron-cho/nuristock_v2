import { SelectOptionType } from '@entites/SelectForm';
import { SummaryDataType } from '@features/common/ui/SummaryBar.ui';
import { ST } from '@shared/config/kor.lang';

export const DashboardSummaryData = (): SummaryDataType[] => {
	return [
		{ id: '1', label: ST.CAPITAL, value: '123456789' },
		{ id: '2', label: ST.AT_MARKET_PRICE, value: '123456789' },
		{ id: '3', label: ST.SONIC, value: '123456789' },
	];
};

export const DashboardTitleOptions = (): SelectOptionType[] => {
	return [
		{ label: ST.KEEP_COST, value: 'keepCost' },
		{ label: ST.SONIC, value: 'sonic' },
		{ label: ST.SONIC_COST, value: 'sonicCost' },
		{ label: ST.SONIC_RATE, value: 'sonicRate' },
		{ label: ST.TITLE, value: 'title' },
	];
};
