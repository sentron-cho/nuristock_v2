export interface DividendItemType {
	rowid?: number;
	code?: string;
	name?: string;
	sdate: string;
	cost: number;
	count: number;
	price: number;
}

export interface DividendStockType {
	code: string;
	name: string;
	kcount?: number;
}

export interface DividendResponse {
	value?: DividendItemType[];
	stock?: DividendStockType[];
}

export interface DividendCreateType extends DividendItemType {}
