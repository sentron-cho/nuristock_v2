export const URL = {
	ROOT: '/',

	// DASHBOARD: '/dashboard',
	MYSTOCK: '/mystock',
	DIARY: '/diary',
	MARKET: '/market',
	PROFIT: '/profit',
	DAILY: '/daily',
	DIVIDEND: '/dividend',
	INVEST: '/invest',
	BUCKET: '/bucket',
	SELL: '/sell',
	BUY: '/buy',
	STOCKS: '/stocks',

  // WEB: '/api',
	// BANKING: '/banking',
	// CORPINFO: '/corpinfo',

	REST: {
		NAVER: 'https://finance.naver.com/item/main.nhn',
		DAUM: 'https://finance.daum.net/quotes/',
	},
};

const API_ROOT = '/api/v1';

export const API = {
	DASHBOARD: `${API_ROOT}/dashboard`,
	DIARY: `${API_ROOT}/diary`,
	MYSTOCK: `${API_ROOT}/mystock`,
	MYSTOCK_SISE: `${API_ROOT}/mystock/sise`,
	MYSTOCK_BUY: `${API_ROOT}/mystock/buy`,
	MYSTOCK_SELL: `${API_ROOT}/mystock/sell`,
	STOCK: `${API_ROOT}/stock`,
	MARKET: `${API_ROOT}/market`,
	MARKET_SISE: `${API_ROOT}/market/sise`,
	MARKET_COUNT: `${API_ROOT}/market/vcount`,
	INVEST: `${API_ROOT}/invest`,
	PROFIT: `${API_ROOT}/profit`,
	PROFIT_YEARS: `${API_ROOT}/profit/years`,
  
	// APPINFO: `${API_ROOT}/appinfo`,
	// TOKEN: `${API_ROOT}/token`,
	// MENUS: `${API_ROOT}/menus`,
	// FAMOUS: `${API_ROOT}/famous`,
	// BANKING: `${API_ROOT}/banking`,
	// CORPINFO: `${API_ROOT}/corpinfo`,
	// DAILY: `${API_ROOT}/daily`,
	// BUCKET: `${API_ROOT}/bucket`,
	// SET: `${API_ROOT}/user/set`,
};
