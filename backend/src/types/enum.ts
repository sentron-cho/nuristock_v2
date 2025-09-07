export enum INVEST_CRALER_TYPE {
  NONE = 'none',
  DART = 'dart',
  NAVER = 'naver',
  MANUAL = 'manual',
  FNGUIDE = 'fnguide',
}

export enum DEPOSIT_TYPE {
	NONE = 'none',
	MANUAL = 'manual',
	SELL = 'sell',
	BUY = 'buy',
	DIVIDEND = 'dividend', // 배당
	DEPOSIT = 'deposit', // 입금
	WITHDRAW = 'withdraw', // 출금
}

export const ERROR = {
	ER_DUP_ENTRY : 'ER_DUP_ENTRY',
	ER_NOT_ROWID : 'ER_NOT_ROWID',
	ER_NOT_UNKNOW : 'ER_NOT_UNKNOW',
	ER_NOT_UPDATED : 'ER_NOT_UPDATED',
}