export const ROOT_URL = "/api/v1";

export const URL = {
  MAINBOARD: {
    ROOT: `${ROOT_URL}/main`,
  },
  DASHBOARD: {
    ROOT: `${ROOT_URL}/dashboard`,
    SISE: `${ROOT_URL}/dashboard/sise`,
  },
  MYSTOCK: {
    ROOT: `${ROOT_URL}/mystock`,
    BUY: `${ROOT_URL}/mystock/buy`,
    SELL: `${ROOT_URL}/mystock/sell`,
    SISE: `${ROOT_URL}/mystock/sise`,
  },
  MARKET: {
    ROOT: `${ROOT_URL}/market`,
    SISE: `${ROOT_URL}/market/sise`,
  },
  PROFIT: {
    ROOT: `${ROOT_URL}/profit`,
    YEARS: `${ROOT_URL}/profit/years`,
  },
  DIARY: {
    ROOT: `${ROOT_URL}/diary`,
  },
  DIVIDEND: {
    ROOT: `${ROOT_URL}/dividend`,
  },
  ASSET: {
    ROOT: `${ROOT_URL}/asset`,
  },
  EVALUATION: {
    ROOT: `${ROOT_URL}/evaluation`,
  },
  BUCKET: {
    ROOT: `${ROOT_URL}/bucket`,
  },
  DEPOSIT: {
    ROOT: `${ROOT_URL}/deposit`,
  },
  INVEST: {
    ROOT: `${ROOT_URL}/invest`,
    YEAR: `${ROOT_URL}/invest/year`,
    REPORT: `${ROOT_URL}/invest/report`,
    REFRESH: `${ROOT_URL}/invest/refresh`,
    UPDATE_BY_NAVER: `${ROOT_URL}/invest/naver`,
    CLEAR: `${ROOT_URL}/invest/clear`,
  },
  APP: {
    ROOT: `${ROOT_URL}/app`,
    CONFIG: `${ROOT_URL}/app/config`,
  },
};

export default URL;

const DART_BASE = "https://opendart.fss.or.kr/api";
const FNGUIDE_ROOT = "https://comp.fnguide.com";
const DAUM_ROOT = "https://finance.daum.net";
const NAVER_ROOT = `https://finance.naver.com`;

export const REST_API = {
  NAVER_ROOT: `${NAVER_ROOT}`,
  NAVER_MAIN: `${NAVER_ROOT}/item/main.naver`,

  DART_BASE: `${DART_BASE}`,
  // 자산총계 부채총계 자본총계 매출액 영업이익 당기순이익
  DART_EQUITY: `${DART_BASE}/fnlttMultiAcnt.json`,
  DART_ROE: `${DART_BASE}/fnlttSinglIndx.json`,
  DART_SHARES: `${DART_BASE}/stockTotqySttus.json`,

  FNGUIDE_ROOT: `${FNGUIDE_ROOT}/`,
  FNGUIDE_MAIN: `${FNGUIDE_ROOT}/SVO2/ASP/SVD_Main.asp`,

  DAUM_ROOT: `${DAUM_ROOT}`,
  DAUM_QUOTES: `${DAUM_ROOT}/quotes`,
};
