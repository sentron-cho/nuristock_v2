import { AssetItemType } from '@features/asset/api/asset.dto';
import { DepositItemType } from '@features/deposit/api/deposit.dto';
import { MarketSiseDataType } from '@features/market/api/market.dto';

export interface MainboardItemType {
	code: string;
	name: string;
	kcount?: number;
	kprice?: number;
	ecount?: number;
	eprice?: number;
	sprice?: number;

	count?: number;
	ecost?: number;
	scost?: number;
	sdate?: string;
	edate?: string;
	type?: string;

	sonic?: number;
	sonicRate?: number;
	sise?: number;
	siseSonic?: number;
}

export interface MainboardResponse {
	value?: MainboardItemType[];
	buys?: MainboardItemType[];
	keeps?: MainboardItemType[];
	latestSells?: MainboardItemType[];
	latestBuys?: MainboardItemType[];
	trades?: MainboardItemType[];
	sise?: MainboardSiseItemType[];
	deposit?: DepositItemType;
	asset?: AssetItemType;
}

export type MainboardSiseItemType = MarketSiseDataType;