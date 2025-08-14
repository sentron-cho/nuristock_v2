import { InvestmentItemType } from '@features/investment/api/investment.dto';
import { percentToDecimal, toNumeric, withCommas } from './utils.lib';
import { FieldValues } from 'react-hook-form';

/*
  초과이익계산 => 자본총계 * (ROE - 성장율추정치)
    => equity * (roe - brate)
  예)
      82,300,000,000,000 * (9.4% - 8.0%)
    = 82,300,000,000,000 ... * (0.094 - 0.08);
    = 1,152,200,000,000 
*/
export const calcExcessProfit = ({
	equity, // 자본총계
	roe, // ROE
	brate, // 기준평가율(성장율추정치)
}: InvestmentItemType) => {
	if (!equity || !roe || !brate) return 0;

	const nEquity = Number(withCommas(equity, true)); // 콤마가 있을경우 제거하여 숫자로
	const nRoe = percentToDecimal(roe); // 9.4% -> 0.094 치환
	const nRate = percentToDecimal(brate); // 8.0% -> 0.08 치환

	return nEquity * (nRoe - nRate);
};

/*
  주주가치 => 자본총계 + (자본총계 * (ROE - 성장율추정치) / 성장율추정치 )
    => equity + (equity * (roe - brate) / brate)
  예)
      82.3조 + (82.3조 * (9.4 - 8.0) / 8.0)
    = 96.7조
*/
export const calcShareholderValue = ({
	equity, // 자본총계
	roe, // ROE
	brate, // 기준평가율(성장율추정치)
}: InvestmentItemType) => {
	if (!equity || !roe || !brate) return 0;

	const nEquity = Number(withCommas(equity, true));
	const nRoe = toNumeric(roe); // 9.4
	const nRate = toNumeric(brate); // 8.0

	return nEquity + (nEquity * (nRoe - nRate)) / nRate;
};

// =(G7+H7*(0.7/(1+I7-0.7)))/C7
/*
  주당가치 => (자본총계 + 초과이익 * (주당가치예상율 / (1 + 성장율추정치 - 주당가치예상율))) / 상장주식수
  예)
      82.3조 + (82.3조 * (0.7 / (1 + 8.0 - 0.7)) / 204,757,766
    = 590,017원
*/
export const calcValuePerShare = ({
	equity, // 자본총계
	roe, // ROE
	brate, // 기준평가율(성장율추정치)
	count, // 상장주식수
	rateKey = 'rate1',
	// profit, // 초과이익
	...rest
}: InvestmentItemType & { rateKey?: 'rate1' | 'rate2' | 'rate3' | 'rate4' }) => {
	if (!equity || !roe || !brate || !count) return 0;

	const nCount = Number(withCommas(count, true));
	const nEquity = Number(withCommas(equity, true));
	const nRate = percentToDecimal(brate); // 8.0% -> 0.08 치환
	const nProfit = calcExcessProfit({ equity, roe, brate } as InvestmentItemType);
  const nTargetRate = toNumeric((rest as FieldValues)?.[rateKey]); // 8.0
  
  const value = (nEquity + nProfit * (nTargetRate / (1 + nRate - nTargetRate)));
	return Math.round(value / nCount);
};
