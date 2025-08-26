import { chromium } from "playwright";
import * as cheerio from "cheerio";
import { REST_API } from "../../types/url.js";
import { ConsensusResult } from "../../types/data.type.js";
import { parseNumber } from "../../lib/parser.util.js";
import { TIME_OUT, TIME_OUT_30 } from "../../types/constants.js";
import dayjs from "dayjs";

const EUK = 100000000;

/**
 * FnGuide 하이라이트(Annual/Net Quarter) 테이블 HTML(tableHtml)에서
 * 지배주주지분(Annual, 파란칸)과 ROE(Annual, 파란칸)를 추출
 */
export const parseFnGuideConsensus = (tableHtml: string): ConsensusResult => {
  const $ = cheerio.load(tableHtml);

  // 1) 지배주주지분 행 찾기
  //   - <th><div>지배주주지분</div></th> 형태 (앞에 공백 &nbsp; 있을 수 있음)
  const niRow = $("tbody tr")
    .filter((_, tr) => {
      const label = $(tr).find("th div, th").first().text().replace(/\s+/g, "");
      return /지배주주지분/.test(label);
    })
    .first();

  // 해당 행의 파란 셀(td.r.tdbg_b)
  const niCell = niRow.find("td.r.tdbg_b").first();
  // title이 소수까지, text는 반올림일 수 있어 title 우선
  const niVal = parseNumber(niCell.attr("title") ?? niCell.text());

  // 2) ROE 행 찾기
  //   - <span class="txt_acd">ROE</span>를 포함한 행
  const roeRow = $("tbody tr")
    .filter((_, tr) => {
      const hasSpan =
        $(tr)
          .find("span.txt_acd")
          .filter((_, s) => /ROE/i.test($(s).text())).length > 0;
      const fallback = /ROE/i.test($(tr).find("th div, th").first().text());
      return hasSpan || fallback;
    })
    .first();

  const roeCell = roeRow.find("td.r.tdbg_b").first();
  const roeVal = parseNumber(roeCell.attr("title") ?? roeCell.text());

  return {
    equity: Number(niVal) * EUK, // 예: 111953.39 -> 111953.39 (title 기준)
    roe: roeVal, // 예: 9.94
  };
};

export const parseFnGuideByYear = (tableHtml: string, year: number): ConsensusResult | undefined => {
  const $ = cheerio.load(tableHtml);
  const index = year - dayjs().add(-3, "year").year();
  if (index < 0) return undefined;

  // 1) 지배주주지분 행 찾기
  //   - <th><div>지배주주지분</div></th> 형태 (앞에 공백 &nbsp; 있을 수 있음)
  const niRow = $("tbody tr")
    .filter((_, tr) => {
      const label = $(tr).find("th div, th").first().text().replace(/\s+/g, "");
      return /지배주주지분/.test(label);
    })
    .first();

  // 해당 행의 파란 셀(td.r.tdbg_b)
  const niCell = niRow.find("td.r").eq(index);
  // title이 소수까지, text는 반올림일 수 있어 title 우선
  const niVal = parseNumber(niCell.attr("title") ?? niCell.text());

  // 2) ROE 행 찾기
  //   - <span class="txt_acd">ROE</span>를 포함한 행
  const roeRow = $("tbody tr")
    .filter((_, tr) => {
      const hasSpan =
        $(tr)
          .find("span.txt_acd")
          .filter((_, s) => /ROE/i.test($(s).text())).length > 0;
      const fallback = /ROE/i.test($(tr).find("th div, th").first().text());
      return hasSpan || fallback;
    })
    .first();

  const roeCell = roeRow.find("td.r").eq(index);
  const roeVal = parseNumber(roeCell.attr("title") ?? roeCell.text());

  return {
    equity: Number((Number(niVal) * EUK).toFixed(0)), // 예: 111953.39 -> 111953.39 (title 기준)
    roe: roeVal, // 예: 9.94
  };
};

/**
 * FnGuide 하이라이트(Annual/Net Quarter) 테이블 HTML(tableHtml)에서
 * 발행주식수 가져오기
 */
export const parseFnGuideShares = (tableHtml: string): number | undefined => {
  const $ = cheerio.load(tableHtml);

  // 1) 지배주주지분 행 찾기
  //   - <th><div>지배주주지분</div></th> 형태 (앞에 공백 &nbsp; 있을 수 있음)
  const niRow = $("tbody tr")
    .filter((_, tr) => {
      const label = $(tr).find("th div, th").first().text().replace(/\s+/g, "");
      return /발행주식수/.test(label);
    })
    .first();

  // 해당 행의 파란 셀(td.r.tdbg_b)
  const niCell = niRow.find("td.r").first();

  // 111,355,765/ 1,054,693 보통주/우선주 에서 보통주만...
  return parseNumber(niCell.text()?.split("/")?.[0]);
};

// fnguide 사이트에서 올해 지배주주순이익 및 ROE 스크래핑
export const getFnGuideConsensus = async (code?: string, shares?: number) => {
  if (!code) return undefined;

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage({ userAgent: "Mozilla/5.0", locale: "ko-KR" });

    const rCode = code?.replace("A", "");
    const url = `${REST_API.FNGUIDE_MAIN}?pGB=1&gicode=A${rCode}&cID=&MenuYn=Y&ReportGB=&NewMenuID=101&stkGb=701`;
    await page.goto(url, { waitUntil: "networkidle", timeout: TIME_OUT_30 }); // 30초

    // console.log(url);

    // Annual 하이라이트 테이블 대기 후 outerHTML 추출
    await page.waitForSelector("#highlight_D_A .us_table_ty1.h_fix", { timeout: TIME_OUT });
    const tableHtml = await page.$eval("#highlight_D_A .us_table_ty1.h_fix", (el) => (el as HTMLElement).outerHTML);

    const mainTableHtml = await page.$eval("#svdMainGrid1 .us_table_ty1.h_fix", (el) => (el as HTMLElement).outerHTML);
    const count = parseFnGuideShares(mainTableHtml) || shares;

    let values: Record<string, ConsensusResult> = {};

    // 올해부터 3년 이전까지만 가져올수 있다.
    const start = Number(dayjs().add(-3, "year").format("YYYY"));
    const end = Number(dayjs().format("YYYY"));

    // 이전년도 데이터 가져오기
    for (let year = start; year < end; year++) {
      const data = parseFnGuideByYear(tableHtml, year);
      if (data) {
        values[year.toString()] = { ...data, shares: count };
      }
    }

    // 마지막 올해 예상치 가져오기
    const currentYear = dayjs().format("YYYY");
    const current = parseFnGuideConsensus(tableHtml); // 예상치 가져오기
    values[currentYear] = { ...current, shares: count };

    await browser.close();

    return values as Record<string, ConsensusResult>;
  } catch (e) {
    console.error("[NAVER_CONSENSUS_ERROR]", e);
    return undefined;
  }
};
