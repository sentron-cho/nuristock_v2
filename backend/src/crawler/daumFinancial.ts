import axios from "axios";
import * as cheerio from "cheerio";
import { REST_API } from "../types/url.js";
import { saveText } from "../lib/writefile.js";

/** Daum에서 year(E) '당기순이익' 추정치 숫자 (실패 시 undefined) */
export const scrapeDaumNetIncomeE = async (code6: string, year: number): Promise<number | undefined> => {
  const url = `${REST_API.DAUM_BASE}/A${code6}#analysis`;
  const html = (
    await axios.get<string>(url, {
      headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "ko-KR,ko;q=0.9" },
      timeout: 15000,
    })
  ).data;

  saveText('daum.html', html);

  const $ = cheerio.load(html);

  // 1) 임베디드 JSON 패턴(__NEXT_DATA__) 시도
  const script = $("script#__NEXT_DATA__").html() || "";
  if (script) {
    try {
      const json = JSON.parse(script);
      // TODO: 실제 경로 확인 후 아래 로직 보완
      // 예: const rows = json?.props?.pageProps?.symbol?.consensus?.annual;
      // rows에서 label='당기순이익'인 데이터의 year(E) 값을 찾기
      // const value = ...
      // if (Number.isFinite(value)) return value;
    } catch {}
  }

  // 2) 표 텍스트 파싱 (클라이언트 렌더 이슈로 실패 가능)
  const headers: string[] = [];
  $("table thead th").each((_, th) => {
    headers.push($(th).text().trim());
  });
  const idx = headers.findIndex((t) => new RegExp(`${year}\\s*(E|F|추정|예상)?`, "i").test(t));

  if (idx >= 0) {
    let cells: string[] = [];
    $("table tbody tr").each((_, tr) => {
      const name = $(tr).find("th,td").first().text().trim();
      if (/당기\s*순이익|당기순이익/i.test(name)) {
        $(tr)
          .find("td")
          .each((__, td) => {
            cells.push($(td).text().trim());
          });
      }
    });
    const raw = cells[idx];
    if (raw) {
      const val = Number(String(raw).replace(/[^\d.-]/g, ""));
      if (Number.isFinite(val)) return val;
    }
  }

  return undefined;
};
