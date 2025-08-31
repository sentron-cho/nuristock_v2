import { InvestmentItemType } from "@features/investment/api/investment.dto";

export interface ResearchItemType extends InvestmentItemType {
	type?: string;
	erate?: number;
	ecost?: number;
	state?: string;
	stime?: string;
	mtime?: string;
	cdate?: string;
	scount?: string | number;
	eps?: string | number;
	debt?: string | number;
	debtratio?: string | number;
	per?: string | number;
	dividend?: string | number;
	cprice?: string | number;
	fprice?: string | number;
	tprice?: string | number;
	updown?: string;

	rateKey?: string; // 가치 산정 비율 Key (rate1, rate2, rate3, rate4)
}

export interface ResearchResponse {
	value?: ResearchItemType[];
}

export interface ResearchRefreshType {
	code?: string;
	targetYear?: string;
}