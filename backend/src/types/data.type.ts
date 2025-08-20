export type FieldValues = Record<string, unknown>;

export interface AppConfigDataType {
  rowid?: number;
  sgroup: string;
  skey: string;
  svalue: string;
}

export interface DashboardCreateType {
  code: string;
  sise: number;
  updown: string;
  name?: string;
}

export interface DashboardSearchParams {
  rowid?: number;
  code: string;
  sdate: string;
  scost: number;
  count: number;
}

export type YearRow = {
  year: number;
  shares?: number; // 연말(12/31) 상장주식수 (KRX)
  equity?: number; // 자본총계 (DART)
  roe?: number; // ROE (%)
};

export type FactsResult = {
  code: string; // 6자리 종목코드
  corpCode?: string; // DART 8자리 고유번호
  value: YearRow[];
};

export type ConsensusResult = {
  equity?: number; // 지배주주지분 (또는 자기자본) 총계
  roe?: number; // ROE (%)
};

export interface DiarySearchParams {
  year?: string;
  month?: string;
}

export interface DividendCreateType {
  rowid?: number;
  code?: string;
  cost: number;
  count: number;
  sdate: string;
  price: number;
}

export interface DashboardSearchParams {
  rowid?: number;
  code: string;
  sdate: string;
  scost: number;
  count: number;
}

export interface InvestCreateType {
  rowid?: number;
  code?: string; // 종목코드
  name?: string; // 종목명
  count?: string; // 상장주식수
  sdate?: string; // 기준년도
  roe?: string; // ROE
  equity?: string; // 자본(지배주주지분)
  profit?: string; // 초과이익
  brate?: string; // 투자기준율
  rate1?: string; // w0.7
  rate2?: string; // w0.8
  rate3?: string; // w0.9
  rate4?: string; // w0.9
}

export interface InvestSearchParams {
  rowid?: number;
  code: string;
  sdate: string;
  scost: number;
  count: number;
}

export interface InvestRefreshParams {
  code: string;
  targetYear: string | number;
}

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

export interface ProfitSearchParams {
  year?: string;
}

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

export interface AssetCreateType {
  rowid?: number;
  sdate: string;
  price: number;
}

export interface AssetSearchParams {
  rowid?: number;
  sdate?: string;
  year?: string;
}

export type EvaluationCreateType = AssetCreateType;
export type EvaluationSearchParams = AssetSearchParams;

export interface DepositCreateType {
  rowid?: number;
  stype?: string;
  sdate?: string;
  price: number;
  tax?: number;
}

export interface DepositSearchParams {
  rowid?: number;
  stype?: string;
  sdate: string;
}

export interface BucketSearchParams {
  page?: string;
}
