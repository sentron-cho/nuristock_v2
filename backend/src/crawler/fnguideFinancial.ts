import axios from "axios";
import iconv from "iconv-lite";
import * as cheerio from "cheerio";
import { REST_API } from "../types/url.js";
import { saveText } from "../lib/writefile.js";

export type FnGuideForecast = {
  year: string;
  roe?: number;
  netProfit?: number; // 지배주주순이익 or 당기순이익
};

/** FnGuide 연간 컨센서스에서 year(E) '당기순이익' 추정치 숫자 */
export const getFnGuideNetIncomeE = async (code6: string, year: number): Promise<FnGuideForecast[]> => {
  const url = `${REST_API.FNGUIDE_BASE}?pGB=1&gicode=A${code6}&cID=&MenuYn=Y&ReportGB=&NewMenuID=105&stkGb=701`;
  const res = await axios.get<ArrayBuffer>(url, {
    responseType: "arraybuffer",
    headers: {
      "User-Agent": "Mozilla/5.0",
      Referer: REST_API.FNGUIDE_ROOT,
    },
    timeout: 15000,
  });

  console.log("[URL]", { url });
  // ✅ EUC-KR 디코딩
  const html = iconv.decode(Buffer.from(res.data), "utf-8");
  const $ = cheerio.load(html);

  // saveText("fnguide.html", html);

  const forecasts: FnGuideForecast[] = [];

  // 1️⃣ Header year 컬럼 추출
  const headers: string[] = [];
  $(".us_table_ty1.h_fix .thead th").each((_, th) => {
    const year = $(th).text().trim();
    if (/\d{4}/.test(year)) headers.push(year);
  });

  // 2️⃣ 지배주주순이익 or 당기순이익
  let netProfitRow: string[] = [];
  $(".us_table_ty1.h_fix tbody tr").each((_, tr) => {
    const title = $(tr).find("th").first().text().trim();
    if (/지배.*순이익|당기.*순이익/i.test(title)) {
      $(tr)
        .find("td")
        .each((_, td) => {
          netProfitRow.push($(td).text().trim());
        });
    }
  });

  // 3️⃣ ROE 행
  let roeRow: string[] = [];
  $(".us_table_ty1.h_fix tbody tr").each((_, tr) => {
    const title = $(tr).find("th").first().text().trim();
    if (/ROE/i.test(title)) {
      $(tr)
        .find("td")
        .each((_, td) => {
          roeRow.push($(td).text().trim());
        });
    }
  });

  // 4️⃣ 정리
  headers.forEach((year, i) => {
    const rawNet = netProfitRow[i]?.replace(/[^\d.-]/g, "");
    const rawRoe = roeRow[i]?.replace(/[^\d.-]/g, "");

    forecasts.push({
      year,
      netProfit: rawNet ? Number(rawNet) : undefined,
      roe: rawRoe ? Number(rawRoe) : undefined,
    });
  });

  return forecasts;
};
