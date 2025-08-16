import { AssetItemType } from '@features/asset/api/asset.dto';
import { DepositItemType } from '@features/deposit/api/deposit.dto';
import { MarketSiseDataType } from '@features/market/api/market.dto';

export interface DashboardItemType {
	code: string;
	name: string;
	kcount: number;
	kprice: number;
	ecount: number;
	eprice: number;
	sprice: number;

	sonic?: number;
	sonicRate?: number;
	sise?: number;
	siseSonic?: number;
}

export interface DashboardResponse {
	value?: DashboardItemType[];
	sise?: DashboardSiseItemType[];
	deposit?: DepositItemType;
	asset?: AssetItemType;
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

export interface MyStockUpdateType {
	code: string,
	name: string,
}
