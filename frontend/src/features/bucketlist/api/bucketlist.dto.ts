import { AssetItemType } from "@features/asset/api/asset.dto";
import { DepositItemType } from "@features/deposit/api/deposit.dto";

export interface BucklistParamType {
	rowid?: number; // 고유번호
	page?: number; // 페이지
	startYear?: number; // 시작년도
	principal?: number; // 원금
	rate?: number; // 연 이율 (예: 0.15)
	years?: number; // 투자 기간 (년)
	annual?: number; // 매년 추가 투자액 (연말)
}

export interface BucketValueType {
	rowid: number;
	sgroup: string;
	skey: string;
	svalue: string;
}

export interface BucklistResponse {
	value: BucketValueType[];
	params: BucklistParamType;
	data: BucklistDataType[];
	asset?: AssetItemType[];
	deposit?: DepositItemType[];
}

export type BucklistDataType = {
	type?: string; // up/down
	date?: string; // 년도
	year: number; // 1..N
	start: number; // 연초 금액
	afterGrowth: number; // 이자 적용 후
	contribution: number; // 연말 추가액
	end: number; // 연말 총액
	end_noContrib: number; // 추가 투자 없는 경우의 연말 총액 (비교용)
	interestEarned: number; // 해당 연도에 발생한 이자 (contrib 포함 케이스 기준)
};

export type BucklistCreateType = BucklistParamType;