export interface MyStockItemType {
	code: string;
	name: string;
}

export interface MyStockKeepCreateType {
	rowid?: number;
	code: string;
	sdate: string;
	scost: number;
	count: number;
}

export interface MyStockSellCreateType extends MyStockKeepCreateType {
	edate: string;
	ecost: number;
}

export interface MyStockKeepType {
	rowid: number;
	code: string;
	sdate: string;
	scost: number;
	count: number;
	utime: string;
	ctime: string;
	mode?: string;
}

export interface MyStockTreadType extends MyStockKeepType {
	sise?: number;
}

export interface MyStockSellType extends MyStockKeepType {
	sise?: number;
	edate: string;
	ecost: number;
}

export interface MyStockListType {
	stockid: number;
	code: string;
	name: string;
	sise: number;
	updown: string;
	erate: number;
}

export interface MyStockResponse {
	value?: MyStockItemType;
	keeps?: MyStockKeepType[];
	sells?: MyStockSellType[];
	stocks?: MyStockListType[];
	sise?: MyStockSiseItemType;
}

export interface MyStockSiseItemType {
	code: string;
	time: string;
	sise: number;
	updown: string;
}

// export interface MyStockSiseResponse {
// 	value?: MyStockSiseItemType;
// }
