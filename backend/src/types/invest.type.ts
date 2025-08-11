export interface InvestCreateType {
	rowid?: number,
	code?: string;
	name?: string;
	count?: string;
	sdate?: string;
	roe?: string;
	bs?: string;
	profit?: string;
	brate?: string;
	rate1?: string;
	rate2?: string;
	rate3?: string;
	rate4?: string;
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
