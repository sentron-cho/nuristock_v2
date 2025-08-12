export const ROOT_URL = "/api/v1";

export const URL = {
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
  INVEST: {
    ROOT: `${ROOT_URL}/invest`,
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

export const REST_API = {
  NAVER_ROOT: `https://finance.naver.com/item/main.naver`,
  NAVER_COINFO: `https://finance.naver.com/item/coinfo.naver`,

  DART_BASE: `${DART_BASE}`,
  DART_EQUITY: `${DART_BASE}/fnlttMultiAcnt.json`,
  DART_ROE: `${DART_BASE}/fnlttSinglIndx.json`,
  DART_SHARES: `${DART_BASE}/stockTotqySttus.json`,

  FNGUIDE_ROOT: `${FNGUIDE_ROOT}/`,
  FNGUIDE_BASE: `${FNGUIDE_ROOT}/SVO2/ASP/SVD_Consensus.asp`,

  DAUM_ROOT: `${DAUM_ROOT}`,
  DAUM_BASE: `${DAUM_ROOT}/quotes`,
};
