import { DashboardItemType } from './../../dashboard/api/dashboard.dto';
import { MarketSiseDataType } from "@features/market/api/market.dto";

export interface InvestmentItemType {
	rowid?: number;
	code?: string; // 종목코드
	name?: string; // 종목명
	ctype?: string; // 크롤링 타입(fnguide, manual, naver)
	count?: string; // 상장주식수
	sdate?: string; // 기준년도
	roe?: string; // ROE
	equity?: string; // 자본(지배주주지분)
	profit?: string; // 초과이익
	brate?: string; // 투자기준율
	rate1?: string; // w0.7
	rate2?: string; // w0.8
	rate3?: string; // w0.9
	rate4?: string; // w0.9
	utime?: string;
	ctime?: string;
	sise?: string;
}

export interface InvestmentResponse {
	value?: InvestmentItemType[];
	sise?: MarketSiseDataType[];
	dashboard?: DashboardItemType[];
}

export interface InvestmentSearchParam {
	code: string;
	targetYear?: string;
}

export interface InvestmentRefreshType {
	code: string;
	targetYear?: string;
}