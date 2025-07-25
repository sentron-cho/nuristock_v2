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