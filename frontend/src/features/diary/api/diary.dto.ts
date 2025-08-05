import { MyStockKeepType } from "@features/mystock/api/mystock.dto";

export interface DiaryItemType extends MyStockKeepType {
	name: string;
	stockid: number;
	ecost?: number;
	edate?: string;
	sonic?: number;
	title?: string;
	sprice?: number;
	eprice?: number;
	sonicRate?: number;
	type?: string;
}

export interface DiaryResponse {
	trade?: DiaryItemType[];
	keep?: DiaryItemType[];
}