export interface AssetItemType {
	rowid?: number;
	sdate: string;
	price: number;
}

export interface AssetResponse {
	value?: AssetItemType[];
	evaluation?: EvaluationItemType[];
}

export type AssetCreateType = AssetItemType;

export type EvaluationItemType = AssetItemType;
export type EvaluationResponse = AssetResponse;
export type EvaluationCreateType = AssetItemType;
