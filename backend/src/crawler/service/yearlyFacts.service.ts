import { FactsResult, YearRow } from "../../types/data.type.js";
import { getCorpCodeByStock } from "../dartCorpmap.js";
import {
  fetchEquity,
  fetchNetIncome,
  fetchROEIndicator,
  fetchLatestIssuedSharesByStock,
  LatestIssuedShares,
} from "../dartFinancial.js";

export const getYearlyStockInfoFromDart = async (opts: {
  code6: string;
  from: number;
  to?: number;
  useConsolidated?: boolean;
}): Promise<FactsResult | undefined> => {
  const { code6, from } = opts;
  const to = opts.to ?? from;

  try {
    const corpCode = await getCorpCodeByStock(code6);
    const years = Array.from({ length: to - from + 1 }, (_, i) => from + i);

    const rows: YearRow[] = [];
    let prevEquity: number | undefined;

    for (const y of years) {
      // const date = dayjs(`${y}-12-31`).format('YYYYMMDD');
      // const shares = await fetchListedSharesAtDate(code6, date).catch(() => undefined);
      const shares = (await fetchLatestIssuedSharesByStock(code6, y).catch((err) =>
        console.error(err)
      )) as LatestIssuedShares;

      const equity = corpCode ? await fetchEquity(corpCode, y).catch(() => undefined) : undefined;

      let roe: number | undefined;
      let ni: number | undefined;

      if (corpCode) {
        // 당기순이익
        ni = await fetchNetIncome(corpCode, y).catch(() => undefined);

        if (y >= 2023) {
          roe = await fetchROEIndicator(corpCode, y).catch(() => undefined);
        }

        if (roe == null) {
          const avgEq =
            prevEquity != null && equity != null ? (prevEquity + equity) / 2 : equity ?? prevEquity ?? undefined;
          if (ni != null && avgEq) {
            roe = (ni / avgEq) * 100;
          }
        }
      }

      rows.push({
        year: y, // 대상년도
        shares: shares.shares, // 주식수
        equity, // 자본(지배주주지분)
        roe, // ROE
        netIncome: ni, // 당기순이익
        eps: ni ? (ni / shares.shares) * 100 : 0,
      });

      if (equity != null) prevEquity = equity;
    }

    return { code: code6, corpCode, value: rows };
  } catch (error) {
    console.log("************ financial clawler error *********");
    console.log(error);
    console.log("**********************************************");
    return undefined;
  }
};
