export interface DashboardItemType {
	stockid: number;
	userid: number;
	code: string;
	name: string;
	rprice: number
	rtime: string;
	kcount: number;
	kprice: number;
	ecount: number;
	eprice: number;
	sprice: number;
	showyn: string;
	utime: string;
	ctime: string;

	sonic?: number;
	sonicRate?: number;

	// ktotal?: number;
	// etotal?: number;
	// stotal?: number;
}

export interface DashboardResponse {
	value?: DashboardItemType[];
}

export interface DashboardSiseItemType {
	code: string;
	sise: number;
	time: string;
	name: string;
	type: string;
	updown: string;
	erate: number;
	ecost: number;
	utime: string;
}

export interface DashboardSiseResponse {
	value?: DashboardSiseItemType[];
}

export interface StockSiseType {
	kcount: number;
	kprice: number;
	stime?: string;
	sise: number;
}
