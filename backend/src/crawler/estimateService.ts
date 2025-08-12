// import dayjs from 'dayjs';
// import { getCorpCodeByStock } from './dartCorpmap.js';
// import { fetchEquity } from './dartFinancial.js';
// import { scrapeDaumNetIncomeE } from './daumFinancial.js';
// import { scrapeFnGuideNetIncomeE } from './fnguideFinancial.js';

/**
 * 2025E 자기자본(Equity) & ROE 추정
 * - 순서: FnGuide → Daum (둘 다 실패 시 undefined)
 * - 자기자본(연말E) = 작년말 자기자본 + NetIncomeE × (1 - payoutRatio)
 * - ROE(2025E) = NetIncomeE / 평균자기자본( (작년말 + 올해말E) / 2 ) × 100
 */
// export const getEquityAndRoeEstimate = async (
//   code6: string,
//   year: number = dayjs().year(), // 예: 2025
//   opts?: { payoutRatioPercent?: number } // 기본: 25%
// ): Promise<{ equity?: number; roe?: number } | undefined> => {
//   try {
//     const payoutRatioPercent = opts?.payoutRatioPercent ?? 25; // 보수적 기본값
//     const retention = Math.max(0, Math.min(1, 1 - payoutRatioPercent / 100)); // 0~1
  
//     // (1) 전년도 말 자기자본(확정치, DART)
//     const corp = await getCorpCodeByStock(code6);
//     if (!corp) return undefined;
  
//     const equityPrev = await fetchEquity(corp, year - 1).catch(() => undefined);
//     if (!equityPrev || equityPrev <= 0) return undefined;
  
//     // (2) 2025E 당기순이익(추정) — FnGuide → Daum 순
//     let netIncomeE: number | undefined;
//     netIncomeE = await scrapeFnGuideNetIncomeE(code6, year).catch(() => undefined);
//     if (netIncomeE == null) {
//       netIncomeE = await scrapeDaumNetIncomeE(code6, year).catch(() => undefined);
//     }
//     if (netIncomeE == null) return undefined;
  
//     // (3) Equity(연말E) & ROE(연간E) 계산
//     const equityEndE = equityPrev + netIncomeE * retention;
//     const equityAvg = (equityPrev + equityEndE) / 2;
//     const roeE = equityAvg > 0 ? (netIncomeE / equityAvg) * 100 : undefined;
  
//     return {
//       equity: Math.round(equityEndE) || undefined, // 자기자본(연말E)
//       roe: roeE != null ? Number(roeE.toFixed(3)) : undefined, // ROE(연간E, %)
//     };
//   } catch (error) {
//     console.error(error);
//     return undefined;
//   }
// };
