import { SelectOptionType } from '@entites/SelectForm';
import { SummaryDataType } from '@features/common/ui/SummaryBar.ui';
import { ST } from '@shared/config/kor.lang';

export const DashboardSummaryData = (values?: string[]): SummaryDataType[] => {
	return [
		{ id: 'capital', label: ST.CAPITAL, value: values?.[0] || '' },
		{ id: 'valuation', label: ST.VALUATION, value: values?.[1] || '' },
		{ id: 'sonic', label: ST.SONIC, value: values?.[2] || '' },
		{ id: 'deposit', label: ST.DEPOSIT, value: values?.[3] || '' },
	];
};

export const DashboardTitleOptions = (): SelectOptionType[] => {
	return [
		{ label: ST.KEEP_COST, value: 'keepCost' }, // 보유 금액
		{ label: ST.SISE_SONIC, value: 'siseSonic' }, // 현재 시세 손익 금액
		{ label: ST.SONIC_COST, value: 'sonicCost' }, // 매수/매도 손익 금액
		{ label: ST.SONIC_RATE, value: 'sonicRate' }, // 매수/매도 손익율
		{ label: ST.TITLE, value: 'title' }, // 제목
	];
};
