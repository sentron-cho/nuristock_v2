import { MyStockKeepType } from '@features/mystock/api/mystock.dto';

export interface ProfitItemType extends MyStockKeepType {
	name: string;
	stockid: number;
	ecost?: number;
	edate?: string;
	sonic?: number;
	title?: string;
	sprice?: number;
	eprice?: number;
	sonicRate?: number;
}

export interface ProfitResponse {
	value?: ProfitItemType[];
}

export interface ProfitYearsItemType {
	year: string;
	sum: number;
}

export interface ProfitYearsResponse {
	value?: ProfitYearsItemType[];
}

export interface StockSiseResponse {
	kcount: number;
	kprice: number;
	stime?: string;
	sise: number;
}
