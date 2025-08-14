import * as cheerio from "cheerio";
import { REST_API } from "../../types/url.js";
import { ConsensusResult } from "../../types/crowler.type.js";
import { parseNumber } from "../../lib/parser.util.js";
import { chromium } from "playwright";
import { TIME_OUT, TIME_OUT_30 } from "../../types/constants.js";

export const parseNaverConsensus = (tableHtml: string): ConsensusResult => {
  const $ = cheerio.load(tableHtml);

  // 1) 당기순이익 행 찾기
  // - <th scope="row" class="h_th2 th_cop_anal10"><strong>당기순이익</strong></th> 형태 (앞에 공백 &nbsp; 있을 수 있음)
  const niRow = $("tbody tr")
    .filter((_, tr) => {
      const label = $(tr).find("th strong, th").first().text().replace(/\s+/g, "");
      return /당기순이익/.test(label);
    })
    .first();

  // 해당 행의 파란 셀(td.r.tdbg_b)
  const niCell = niRow.find("td.t_line.cell_strong").first();
  // title이 소수까지, text는 반올림일 수 있어 title 우선
  const niVal = parseNumber(niCell.attr("title") ?? niCell.text());

  // 2) ROE 행 찾기
  //   - <th scope="row" class="h_th2 th_cop_anal13"><strong>ROE(지배주주)</strong></th>를 포함한 행
  const roeRow = $("tbody tr")
    .filter((_, tr) => {
      const label = $(tr).find("th strong, th").first().text().replace(/\s+/g, "");
      return /ROE/.test(label);
    })
    .first();

  const roeCell = roeRow.find("td.t_line.cell_strong").first();
  const roeVal = parseNumber(roeCell.attr("title") ?? roeCell.text());

  return {
    equity: niVal, // 예: 111953.39 -> 111953.39 (title 기준)
    roe: roeVal, // 예: 9.94
  };
};

/**
 * 네이버 금융 종목 컨센서스 페이지에서 지배주주순이익 및 ROE 추출
 * @param code6 종목코드 (6자리)
 */
export const getNaverConsensus = async (code: string): Promise<ConsensusResult | undefined> => {
  if (!code) return;

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage({ userAgent: "Mozilla/5.0", locale: "ko-KR" });

    const url = `${REST_API.NAVER_MAIN}?code=${code?.replace("A", "")}`;
    console.log("[URL]", { url });
    await page.goto(url, { waitUntil: "networkidle", timeout: TIME_OUT_30 }); // 30초

    await page.waitForSelector(".cop_analysis", { timeout: TIME_OUT });
    const tableHtml = await page.$eval(".cop_analysis", (el) => (el as HTMLElement).outerHTML);

    return parseNaverConsensus(tableHtml);
  } catch (e) {
    console.error("[NAVER_CONSENSUS_ERROR]", e);
    return undefined;
  }
};
