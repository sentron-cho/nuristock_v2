export interface ResearchItemType {
	code?: string;
	name?: string;
	type?: string;
	sise?: number;
	erate?: number;
	ecost?: number;
	state?: string;
	stime?: string;
	mtime?: string;
	cdate?: string;
	scount?: string | number;
	eps?: string | number;
	roe?: string | number;
	debt?: string | number;
	debtratio?: string | number;
	profit?: string | number;
	equity?: string | number;
	per?: string | number;
	dividend?: string | number;
	cprice?: string | number;
	fprice?: string | number;
	tprice?: string | number;
	updown?: string;

	shareValue?: string | number; // 가치 산정 값
	shareRate?: string | number; // 가치 산정 비율
}

export interface ResearchResponse {
	value?: ResearchItemType[];
}
