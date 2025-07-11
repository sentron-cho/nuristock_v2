export enum UseYn {
	Yes = 'Y',
	No = 'N',
}

export interface DashboardItemType {
	stockid: number;
	userid: string;
	code: string;
	name: string;
	rprice: number;
	rtime: string;
	kcount: number;
	kprice: number;
	ecount: number;
	eprice: number;
	sprice: number;
	showyn: UseYn;
	utime: string;
	ctime: string;
	stime?: string;
	sise?: number;
	updown?: string;
	erate?: number;
	ecost?: string;
}

export interface DashboardResponse {
	value?: DashboardItemType[];
}

export interface StockSiseResponse {
	kcount: number;
	kprice: number;
	stime?: string;
	sise: number;
}
