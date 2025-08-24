import { FieldValues, StockDartBasicType, YearRow } from "../../types/data.type.js";
import { getCorpCodeByStock } from "../dartCorpmap.js";
import { fetchDartBasicSnapshot } from "../dartStockInfo.js";

export const getMystockInfo = async (opts: {
  code6: string;
  from: number;
  to?: number;
  useConsolidated?: boolean;
}): Promise<FieldValues | undefined> => {
  const { code6, from } = opts;
  const to = opts.to ?? from;

  try {
    const corpCode = await getCorpCodeByStock(code6);
    const years = Array.from({ length: to - from + 1 }, (_, i) => from + i);

    const rows: StockDartBasicType[] = [];

    for (const y of years) {
      if (corpCode) {
        const info = await fetchDartBasicSnapshot(corpCode, y);
        rows.push({ ...info });
      }
    }

    // 시가총액 (주가 필요)
    // PER (주가 필요)
    // 목표가 (증권사 컨센서스 필요)
    // 배당액 (일부 공시 텍스트에서 추출 필요)

    return { code: code6, corpCode, value: rows };
  } catch (error) {
    console.log("************ financial clawler error *********");
    console.log(error);
    console.log("**********************************************");
    return undefined;
  }
};
