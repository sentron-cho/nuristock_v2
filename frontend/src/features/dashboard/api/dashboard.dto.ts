import { UseYn } from '@shared/config/common.enum';

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

	// stockid: number;
	// userid: string;
	// code: string;
	// name: string;
	// rprice: number;
	// rtime: string;
	// kcount: number;
	// kprice: number;
	// ecount: number;
	// eprice: number;
	// sprice: number;
	// showyn: UseYn;
	// utime: string;
	// ctime: string;
	// stime?: string;
	// sise?: number;
	// updown?: string;
	// erate?: number;
	// ecost?: string;
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
