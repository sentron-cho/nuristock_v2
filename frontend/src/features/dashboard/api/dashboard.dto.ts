import { MarketSiseDataType } from '@features/market/api/market.dto';

export interface DashboardItemType {
	stockid: number;
	userid: number;
	code: string;
	name: string;
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
	sise?: number;
	siseSonic?: number;
}

export interface DashboardResponse {
	value?: DashboardItemType[];
	sise?: DashboardSiseItemType[];
}

export type DashboardSiseItemType = MarketSiseDataType;

// export interface DashboardSiseResponse {
// 	value?: DashboardSiseItemType[];
// }

export interface StockSiseType {
	kcount: number;
	kprice: number;
	stime?: string;
	sise: number;
}
