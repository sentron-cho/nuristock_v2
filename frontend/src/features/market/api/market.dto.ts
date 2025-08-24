export interface MarketItemType {
	code: string;
	name: string;
	state?: string;
	type?: string;
	stime: string;
	updown: string;
	sise: number;
	erate: number;
	ecost: number;
	utime?: string;
}

export interface MarketResponse {
	value?: MarketItemType[];
}

export interface MarketSiseDataType {
	code: string;
	sise: number;
	stime: string;
	type: string;
	updown: string;
	name: string;
	erate: number;
	ecost: number;
	utime: string;
}

export interface MarketSiseUpdateDataType {
	code: string;
	stime: string;
	updown: string;
	sise: number;
	erate: number;
	ecost: number;
}

export interface MarketSearchDataType {
  code: string;
  name: string;
  type: string;
  state: string;
}

export interface MarketSearchResponse {
	value?: MarketSearchDataType[];
}
