export interface InvestmentItemType {
	rowid: number;
	code: string;
	name: string;
	count: string;
	sdate: string;
	roe: string;
	bs: string;
	profit: string;
	brate: string;
	rate1: string;
	rate2: string;
	rate3: string;
	rate4: string;
}

export interface InvestmentResponse {
	value?: InvestmentItemType[];
}

export interface InvestmentRefreshType {
	code: string;
	targetYear?: string;
}