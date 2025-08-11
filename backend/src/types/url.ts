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
    REFRESH: `${ROOT_URL}/invest/refresh`,
    CLEAR: `${ROOT_URL}/invest/clear`,
  },
  APP: {
    ROOT: `${ROOT_URL}/app`,
    CONFIG: `${ROOT_URL}/app/config`,
  },
};

export default URL;
