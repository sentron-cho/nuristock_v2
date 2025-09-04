import { InvestmentItemType } from '@features/investment/api/investment.dto';

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
	name?: string;
	targetYear?: string;
}

export type ResearchInfoDataType = {
	year?: number; // 대상년도
	equity?: number; // 지배주주지분 (또는 자기자본) 총계
	roe?: number; // ROE (%)
	shares?: number; // 발행주식수
	per?: number; // PER
	pbr?: number; // PBR
	eps?: number; // EPS
	debt?: number; // 부채총계
	debtratio?: number; // 부채비율
	profit?: number; // 당기순이익
	dividend?: number; // 배당금
};

export type ResearchInfoReportData = {
	type?: string;
	code?: string;
	sise?: number; // 현재가
	shares?: number; // 발행주식수
	updown?: string; // 전일비 등락
	ecost?: number; // 전일비
	report?: ResearchInfoDataType[];
};

export type ResearchInfoResponse = {
	value: ResearchInfoReportData;
};
