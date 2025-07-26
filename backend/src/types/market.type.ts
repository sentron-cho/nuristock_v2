export interface MarketSelectDataType {
  code: string;
  name: string;
  type: string;
  state: number;
  stime: string;
  updown: string;
  sise: number;
  erate: number;
  ecost: number;
}

export interface MarketSiseUpdateDataType {
  code: string;
  stime: string;
  updown: string;
  sise: number;
  erate: number;
  ecost: number;
  all?: boolean;
}
