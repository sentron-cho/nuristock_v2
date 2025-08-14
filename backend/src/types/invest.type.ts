export interface InvestCreateType {
	rowid?: number,
	code?: string; // 종목코드
	name?: string; // 종목명
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
