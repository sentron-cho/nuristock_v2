import { FieldValues } from "react-hook-form";

export const StatisticTitle = {
  // 거래소 종목
  market: '거래소',
  market_all: '거래소 전체종목',
  market_kospi: '코스피',
  market_kosdaq: '코스닥',
  market_etc: '기타(상장폐지 등)',
  // 재무정보 수집
  marketinfo: '재무정보',
  marketinfo_total: '총계',
  marketinfo_success: '수집 성공(2024)',
  marketinfo_failure: '수집 실패(9999)',
  marketinfo_warning: '수집 오류(9000)',
  marketinfo_9001: '수집 오류(9001)',
  marketinfo_error: '수집 오류(0000)',
  marketinfo_rest: '기타(수집전)',
  
  marketdata: '재무 데이터',
  marketdata_total: '총계',
  marketdata_success: '수집 성공(2020~)',
  marketdata_failure: '수집 오류',

  // 시세 수집
  sise: '실시간 시세',
  sise_success: '수집 성공(최근 1주일 이내)',
  sise_failure: '수집 실패(최근 1주일 이내)',
  // 내정보
  dashboard: '내정보',
  my_keeps: '보유종목 총계',
} as FieldValues;