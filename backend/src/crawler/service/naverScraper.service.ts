import * as cheerio from "cheerio";
import { REST_API } from "../../types/url.js";
import { ConsensusResult, ResearchInfoResult, ResearchInfoValues } from "../../types/data.type.js";
import { parseNumber } from "../../lib/parser.util.js";
import { chromium, Page } from "playwright";
import { TIME_OUT, TIME_OUT_10, TIME_OUT_30, TIME_OUT_5 } from "../../types/constants.js";
import dayjs from "dayjs";
import { parseFnGuideByYear } from "./fnguideScraper.service.js";
import { saveText } from "../../lib/writefile.js";

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
    // console.log("[URL]", { url });
    await page.goto(url, { waitUntil: "networkidle", timeout: TIME_OUT_30 }); // 30초

    await page.waitForSelector(".cop_analysis", { timeout: TIME_OUT });
    const tableHtml = await page.$eval(".cop_analysis", (el) => (el as HTMLElement).outerHTML);

    return parseNaverConsensus(tableHtml);
  } catch (e) {
    console.error("[NAVER_CONSENSUS_ERROR]", e);
    return undefined;
  }
};

export const parseNaverReport = (tableHtml: string, fnguideHtml?: string): ResearchInfoResult[] => {
  const $ = cheerio.load(tableHtml);

  const getRowData = (name: string, index: number = 0) => {
    const row = $("tbody tr")
      .filter((_, tr) => {
        const label = $(tr).find("th strong, th").first().text().replace(/\s+/g, "");
        // name을 정규식으로 만들어서 테스트
        return new RegExp(name).test(label);
      })
      .first();

    const cell = row.find("td").eq(index);
    return parseNumber(cell.attr("title") ?? cell.text());
  };

  const year = dayjs().tz("Asia/Seoul").add(-3, "year").year(); // 3년전까지만
  let arrays: ResearchInfoResult[] = [];

  const EUK = 100000000;

  for (let i = 0; i < 4; i++) {
    // 2022, 2023, 2024, 2025는 예상치
    const roe = getRowData("ROE", i); // ROE
    const profit = Number((Number(getRowData("당기순이익", i)) * EUK).toFixed(0)); // 당기순이익
    // const equity = getRowData("당기순이익", i); // 자본
    const pbr = getRowData("PBR", i); // PBR
    const eps = getRowData("EPS", i); // EPS
    // const debt = getRowData("부채총계", i); // 부채총계
    const debtratio = getRowData("부채비율", i); // 부채비율
    const dividend = getRowData("배당금", i); // 배당금

    let debt = 0;
    let equity = 0;

    if (fnguideHtml) {
      try {
        const res = parseFnGuideByYear(fnguideHtml, year + i);
        equity = res?.equity || 0;
        debt = res?.debt || 0;
      } catch (error) {
        const $ = cheerio.load(fnguideHtml);
        const index = year - dayjs().add(-3, "year").year();

        if (index) {
          const niRow = $("tbody tr")
            .filter((_, tr) => {
              const label = $(tr).find("th div, th").first().text().replace(/\s+/g, "");
              return /자본총계/.test(label);
            })
            .first();

          const niCell = niRow.find("td.r").eq(index);
          const niVal = parseNumber(niCell.attr("title") ?? niCell.text());

          equity = Number((Number(niVal) * EUK).toFixed(0));

          const debtRow = $("tbody tr")
            .filter((_, tr) => {
              const label = $(tr).find("th div, th").first().text().replace(/\s+/g, "");
              return /부채총계/.test(label);
            })
            .first();

          const debtCell = debtRow.find("td.r").eq(index);
          const debtVal = parseNumber(niCell.attr("title") ?? niCell.text());

          debt = Number((Number(debtVal) * EUK).toFixed(0));
        }
      }
    }

    arrays.push({ year: year + i, roe, profit, equity, pbr, eps, debt, debtratio, dividend });
  }

  return arrays;
};

const getNaverSiseByKrx = async (page: Page) => {
  // console.log("[getNaverSiseByKrx]");

  // 2) 시세 정보(KRX)
  await page.waitForSelector("#rate_info_krx", { timeout: TIME_OUT });
  const html = await page.$eval("#rate_info_krx", (el) => (el as HTMLElement).outerHTML);

  let $ = cheerio.load(html);
  const siseText = $(".no_today").first().text();
  const sise = parseNumber(siseText.replace(/,/g, "")) || 0;

  // 전일비 정보
  const exdayElement = $(".no_exday em").first();
  const updown = exdayElement.attr("class")?.replace("no_", "") || ""; // up, down, steady
  const exdayTexts = $(".no_exday em")
    .first()
    .toArray()
    .map((el) => $(el).text());

  const ecost = parseNumber(exdayTexts?.[0]?.replace(/,/g, "")) || 0;

  return { sise, ecost, updown };
};

const getNaverSiseByNxt = async (page: Page) => {
  // console.log("[getNaverSiseByNxt]");

  // 2) 시세 정보(NXT)
  await page.waitForSelector("#rate_info_nxt", { timeout: TIME_OUT });
  const html = await page.$eval("#rate_info_nxt", (el) => (el as HTMLElement).outerHTML);

  let $ = cheerio.load(html);
  const siseText = $(".no_today .blind").first().text();
  const sise = parseNumber(siseText.replace(/,/g, "")) || 0;

  // 전일비 정보
  const exdayElement = $(".no_exday em").first();
  const updown = exdayElement.attr("class")?.replace("no_", "") || ""; // up, down, steady
  const exdayTexts = $(".no_exday .blind")
    .toArray()
    .map((el) => $(el).text());
  const ecost = Number(exdayTexts?.[0]?.replace(/,/g, "") || 0);

  return { sise, ecost, updown };
};

const parseStockShares = async (page: Page) => {
  await page.waitForSelector("#tab_con1", { timeout: TIME_OUT_5 });
  const html = await page.$eval("#tab_con1", (el) => (el as HTMLElement).outerHTML);

  const $ = cheerio.load(html);
  const row = $("tbody tr")
    .filter((_, tr) => {
      const label = $(tr).find("th strong, th").first().text().replace(/\s+/g, "");
      // name을 정규식으로 만들어서 테스트
      return new RegExp("상장주식수").test(label);
    })
    .first();

  let cell = row.find("td").first();
  return parseNumber(cell.attr("title") ?? cell.text());
};

const parseStockType = async (page: Page) => {
  await page.waitForSelector(".h_company .description", { timeout: TIME_OUT_5 });
  const html = await page.$eval(".h_company .description", (el) => (el as HTMLElement).outerHTML);

  const $ = cheerio.load(html);
  const type = $("img").first().attr("class") === "kospi" ? "kospi" : "kosdaq";

  if ($("img").first().attr("alt") === "코넥스") {
    // console.log("===========> konex");
    return "konex";
  } else {
    // console.log(`===========> ${type}`);
    return type;
  }
};

/**
 * 네이버 금융 종목 컨센서스 페이지에서 지배주주순이익 및 ROE 추출
 * @param code6 종목코드 (6자리)
 */
export const getNaverReport = async (code: string): Promise<ResearchInfoValues | undefined> => {
  if (!code) return;

  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({ userAgent: "Mozilla/5.0", locale: "ko-KR" });

    const url = `${REST_API.NAVER_MAIN}?code=${code?.replace("A", "")}`;

    // TODO: 메인 페이지 이동
    await page.goto(url, { waitUntil: "networkidle", timeout: TIME_OUT_5 });
    console.log("[URL]", { url });

    const type = await parseStockType(page); // 1. 상장 거래소
    if (!type || type === "konex") {
      browser?.close();
      return { code, type };
    }

    const shares = await parseStockShares(page); // 2. 발행 주식수
    if (!shares) {
      browser?.close();
      return { code, type, shares };
    }

    // 3. 시세 정보(KRX)
    let siseRes: { sise: number; ecost: number; updown: string } = { sise: 0, ecost: 0, updown: "" };
    const hour = dayjs().tz("Asia/Seoul").hour();

    try {
      siseRes = hour > 9 && hour < 16 ? await getNaverSiseByKrx(page) : await getNaverSiseByNxt(page);
    } catch (error) {
      siseRes = await getNaverSiseByKrx(page);
    }

    const { updown, ecost, sise } = siseRes;

    // 4. 컨센서스 정보
    await page.waitForSelector(".cop_analysis", { timeout: TIME_OUT_5 });
    const html = await page.$eval(".cop_analysis", (el) => (el as HTMLElement).outerHTML);

    let fnguideHtml = undefined;
    const fnurl = `${REST_API.FNGUIDE_MAIN}?pGB=1&gicode=A${code?.replace(
      "A",
      ""
    )}&cID=&MenuYn=Y&ReportGB=&NewMenuID=101&stkGb=701`;

    // TODO: 재무수집 페이지 이동
    await page.goto(fnurl, { waitUntil: "networkidle", timeout: TIME_OUT_5 });

    // 5. 자본 가져오기
    try {
      await page.waitForSelector("#highlight_D_A .us_table_ty1.h_fix", { timeout: TIME_OUT_5 });
      fnguideHtml = await page.$eval("#highlight_D_A .us_table_ty1.h_fix", (el) => (el as HTMLElement).outerHTML);
    } catch (error) {
      console.log("[FNGUIDE:ERROR-1]", error);
    }

    if (!fnguideHtml) {
      try {
        await page.waitForSelector("#highlight_B_A .us_table_ty1.h_fix", { timeout: TIME_OUT_5 });
        fnguideHtml = await page.$eval("#highlight_B_A .us_table_ty1.h_fix", (el) => (el as HTMLElement).outerHTML);
      } catch (error) {
        console.log("[FNGUIDE:ERROR-2]", error);
      }
    }

    const report = parseNaverReport(html, fnguideHtml);

    // console.log("[NAVER_REPORT]", { code, sise, updown, ecost, shares, report });

    browser?.close();
    return { code, type, sise, updown, ecost, shares, report };
  } catch (e) {
    console.error("[NAVER_CONSENSUS_ERROR]", e);
    return undefined;
  } finally {
    browser?.close();
  }
};
