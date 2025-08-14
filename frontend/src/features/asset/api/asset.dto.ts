export interface AssetItemType {
	rowid?: number;
	sdate: string;
	price: number;
}

export interface AssetResponse {
	value?: AssetItemType[];
}

export interface AssetCreateType extends AssetItemType {}
