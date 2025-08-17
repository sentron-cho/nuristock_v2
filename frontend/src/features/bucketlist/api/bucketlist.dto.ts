export interface BucklistParamType {
	page?: number;
	principal: number; // 원금
	rate: number; // 연 이율 (예: 0.15)
	years: number; // 투자 기간 (년)
	annual: number; // 매년 추가 투자액 (연말)
}

export interface BucklistResponse {
	params: BucklistParamType;
	data: BucklistDataType[];
}

export type BucklistDataType = {
	year: number; // 1..N
	start: number; // 연초 금액
	afterGrowth: number; // 이자 적용 후
	contribution: number; // 연말 추가액
	end: number; // 연말 총액
	end_noContrib: number; // 추가 투자 없는 경우의 연말 총액 (비교용)
	interestEarned: number; // 해당 연도에 발생한 이자 (contrib 포함 케이스 기준)
};