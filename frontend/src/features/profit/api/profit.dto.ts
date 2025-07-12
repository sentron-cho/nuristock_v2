import { UseYn } from '@shared/config/common.enum';

export interface ProfitItemType {
	stockid: number;
	userid: string;
	code: string;
	name: string;
	rprice: number;
	rtime: string;
	kcount: number;
	kprice: number;
	ecount: number;
	eprice: number;
	sprice: number;
	showyn: UseYn;
	utime: string;
	ctime: string;
	stime?: string;
	sise?: number;
	updown?: string;
	erate?: number;
	ecost?: string;
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
