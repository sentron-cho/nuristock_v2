const ROOT = {
  PAGE: '/page',
  API: {
    ROOT: '/api',
    PAGE: '/api/page',
  }
}

export const URL = {
  ROOT: '/',
  LOGIN: '/login',
  SIGNIN: '/signin',
  LOGOUT: '/logout',

  MAIN: '/main',
  MEMBERSHIP: '/member',
  DASHBOARD: '/dashboard',
  MYSTOCK: '/dashboard/mystock',
  MARKET: '/market',
  PROFIT: '/profit',
  BANKING: '/banking',
  CORPINFO: '/corpinfo',
  DAILY: '/daily',
  INVEST: '/invest',
  BUCKET: '/bucket',
  SELL: '/sell',
  BUY: '/buy',
  STOCKS: '/stocks',
  WEB: '/api',

  API: {
    LOGIN: '/login.do',
    LOGOUT: '/logout.do',
    MEMBERSHIP: '/membership',
    
    PAGE: {
      TOKEN: `${ROOT.API.ROOT}/token`,
      DASHBOARD: `${ROOT.API.PAGE}/dashboard`,
      DASHBOARD_SISE: `${ROOT.API.PAGE}/dashboard/sise`,
      APPINFO: `${ROOT.API.ROOT}/appinfo`,
      MENUS: `${ROOT.API.PAGE}/menus`,
      FAMOUS: `${ROOT.API.PAGE}/famous`,
      MYSTOCK: `${ROOT.API.PAGE}/mystock`,
      MYSTOCK_SISE: `${ROOT.API.PAGE}/mystock/sise`,
      MYSTOCK_SELL: `${ROOT.API.PAGE}/mystock/sell`,
      STOCK: `${ROOT.API.PAGE}/stock`,
      MARKET: `${ROOT.API.PAGE}/market`,
      MARKET_COUNT: `${ROOT.API.PAGE}/market/vcount`,
      BANKING: `${ROOT.API.PAGE}/banking`,
      CORPINFO: `${ROOT.API.PAGE}/corpinfo`,
      DAILY: `${ROOT.API.PAGE}/daily`,
      INVEST: `${ROOT.API.PAGE}/invest`,
      PROFIT: `${ROOT.API.PAGE}/profit`,
      PROFIT_LIST: `${ROOT.API.PAGE}/profit/list`,
      BUCKET: `${ROOT.API.PAGE}/bucket`,
      SET: `${ROOT.API.PAGE}/user/set`,
    },

    FAMOUS: {
      LIST: '/api/famous-list.json',
    },
  },

  REST: {
    NAVER: 'https://finance.naver.com/item/main.nhn',
    DAUM: 'https://finance.daum.net/quotes/',
  },

  DO: {
    LOGIN: '/login.do',
  },
};