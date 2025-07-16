export interface MyStockItemType {
	stockid: number;
	name: string;
}

export interface MyStockKeepType {
	rowid: number;
	stockid: number;
	sdate: string;
	scost: number;
	count: number;
	utime: string;
	ctime: string;
}

export interface MyStockSellType extends MyStockKeepType {
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
	value?: MyStockItemType[];
	keeps?: MyStockKeepType[];
	sells?: MyStockSellType[];
	stocks?: MyStockListType[];
}

export interface MyStockSiseItemType {
	code: string;
	time: string;
	sise: number;
	updown: string;
}

export interface MyStockSiseResponse {
	value?: MyStockSiseItemType;
}
