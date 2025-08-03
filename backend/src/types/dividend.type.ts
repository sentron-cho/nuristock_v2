export interface DividendCreateType {
	rowid?: number,
	code: string,
	cost: number,
	count: number,
	sdate: string,
	price: number,
}

export interface DashboardSearchParams {
	rowid?: number;
	code: string;
	sdate: string;
	scost: number;
	count: number;
}
