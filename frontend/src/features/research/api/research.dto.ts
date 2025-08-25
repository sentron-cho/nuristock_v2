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
	scount?: string;
	eps?: string;
	roe?: string | number;
	debt?: string;
	debtratio?: string;
	profit?: string;
	equity?: string;
	per?: string;
	dividend?: string;
	cprice?: string;
	fprice?: string;
	tprice?: string;
}

export interface ResearchResponse {
	value?: ResearchItemType[];
}
