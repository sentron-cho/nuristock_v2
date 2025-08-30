export interface StatisticItemType {
	title?: string;
	value?: string;
	date?: string;
	code?: string;
	count?: number;
}

export interface StatisticResponse {
	value?: StatisticItemType[];
}
