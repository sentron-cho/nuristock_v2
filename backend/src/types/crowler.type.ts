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
  netProfit?: number; // 지배주주순이익 (또는 당기순이익)
  roe?: number; // ROE (%)
};
