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
    // SISE: `${ROOT_URL}/market/sise`,
  },
};

export default URL;
