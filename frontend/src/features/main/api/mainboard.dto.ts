import { AssetItemType } from '@features/asset/api/asset.dto';
import { DepositItemType } from '@features/deposit/api/deposit.dto';
import { MarketSiseDataType } from '@features/market/api/market.dto';

export interface MainboardItemType {
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

	sonic?: number;
	sonicRate?: number;
	sise?: number;
	siseSonic?: number;
}

export interface MainboardResponse {
	value?: MainboardItemType[];
	sise?: MainboardSiseItemType[];
	deposit?: DepositItemType;
	asset?: AssetItemType;
}

export type MainboardSiseItemType = MarketSiseDataType;