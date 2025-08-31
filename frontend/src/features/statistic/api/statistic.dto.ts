export interface StatisticItemType {
	cagetory: string;
	code: string;
	count: number;
	title?: string;
	date?: string;
}

export interface StatisticResponse {
	value?: StatisticItemType[];
}
