export interface MarketItemType {
	code: string;
	name: string;
	state?: string;
	type?: string;
}

export interface MarketResponse {
	value?: MarketItemType[];
}


// export interface MyStockSiseResponse {
// 	value?: MyStockSiseItemType;
// }
