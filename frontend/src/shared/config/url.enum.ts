export const URL = {
	ROOT: '/',

	MAIN: '/main',
	DASHBOARD: '/dashboard',
	MYSTOCK: '/mystock',
	DIARY: '/diary',
	MARKET: '/market',
	ASSET: '/asset',
	DEPOSIT: '/deposit',
	PROFIT: '/profit',
	DAILY: '/daily',
	DIVIDEND: '/dividend',
	INVEST: '/invest',
	BUCKET: '/bucket',
	SELL: '/sell',
	BUY: '/buy',
	STOCKS: '/stocks',
	MEMUS: '/menus',

	// PROFIT_YEAR: '/profit/year',
	// PROFIT_CODE: '/profit/code',

	// WEB: '/api',
	// BANKING: '/banking',
	// CORPINFO: '/corpinfo',

	REST: {
		NAVER: 'https://finance.naver.com/item/main.nhn',
		DAUM: 'https://finance.daum.net/quotes/',
		FNGUIDE: (code: string) =>
			`https://comp.fnguide.com/SVO2/ASP/SVD_Main.asp?pGB=1&gicode=${code}&cID=&MenuYn=Y&ReportGB=&NewMenuID=101&stkGb=701`,
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
	INVEST_CLEAR: `${API_ROOT}/invest/clear`,
	INVEST_REFRESH: `${API_ROOT}/invest/refresh`,
	INVEST_REPORT: `${API_ROOT}/invest/report`,
	INVEST_UPDATE_BY_NAVER: `${API_ROOT}/invest/naver`,
	PROFIT: `${API_ROOT}/profit`,
	PROFIT_YEARS: `${API_ROOT}/profit/years`,
	DIVIDEND: `${API_ROOT}/dividend`,
	ASSET: `${API_ROOT}/asset`,
	DEPOSIT: `${API_ROOT}/deposit`,
	APP: `${API_ROOT}/app`,
	APP_CONFIG: `${API_ROOT}/app/config`,
};
