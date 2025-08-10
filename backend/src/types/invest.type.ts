export interface InvestCreateType {
	rowid?: number,
	code: string,
	cost: number,
	count: number,
	sdate: string,
	price: number,
}

export interface InvestSearchParams {
	rowid?: number;
	code: string;
	sdate: string;
	scost: number;
	count: number;
}

export interface InvestRefreshParams {
	code: string,
	targetYear: string | number,
}
