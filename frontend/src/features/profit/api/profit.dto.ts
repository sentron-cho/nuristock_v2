export interface ProfitItemType {
	rowid: number;
	utime: string;
	code: string;
	name: string;
	stockid: number;
	count?: number;
	scost?: number;
	sdate?: string;
	ecost?: number;
	edate?: string;
	sonic?: number;
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
