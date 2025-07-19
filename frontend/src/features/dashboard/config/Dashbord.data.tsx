import { SelectOptionType } from '@entites/SelectForm';
import { SummaryDataType } from '@features/common/ui/SummaryBar.ui';
import { ST } from '@shared/config/kor.lang';

export const DashboardSummaryData = (values?: string[]): SummaryDataType[] => {
	return [
		{ id: '1', label: ST.CAPITAL, value: values?.[0] || '' },
		{ id: '2', label: ST.AT_MARKET_PRICE, value: values?.[1] || '' },
		{ id: '3', label: ST.SONIC, value: values?.[2] || '' },
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
