import axios from "axios";
import * as cheerio from "cheerio";
import { getCorpCodeByStock } from "./dartCorpmap.js";
import { fetchEquity } from "./dartFinancial.js";
import { REST_API } from "../types/url.js";
import dayjs from "dayjs";
import { saveText } from "../lib/writefile.js";
import { fetchHtmlDecoded } from "../lib/iconv.js";


// 1) 네이버 컨센서스(연간 실적)에서 2025E 당기순이익 크롤링
export const getNaverNetProfit = async (code6: string, year: number): Promise<number | undefined> => {
  const url = `${REST_API.NAVER_COINFO}?code=${code6}`;

   // ✅ EUC-KR 대응된 HTML
  const html = await fetchHtmlDecoded(url);

  // const html = (await axios.get<string>(url, { timeout: 15_000 })).data;
  const $ = cheerio.load(html);
  saveText("getNaverNetProfit.html", html);

  let netProfit: number | undefined;

  // 2025E, 2025(E), 2025 추정 등 다양한 표기를 포괄
  const headerRe = new RegExp(`${year}\\s*(E|F|예상|추정)?`, "i");

  $("table").each((_, table) => {
    const text = $(table).text();
    // console.log("[naver]", { text });
    // 테이블 후보: 컨센서스/실적예상/연간 + 당기순이익 포함
    // console.log("[naver]", { table: $(table).text() });

    if (/전체|연간|분기/i.test(text) && /당기순이익/i.test(text)) {
      const headerYears: string[] = [];

      // ✅ push의 반환값을 리턴하지 않도록 중괄호 사용 (void)
      $(table)
        .find("thead th")
        .each((_, th) => {
          headerYears.push($(th).text().trim());
        });

      let niRow: string[] = [];
      $(table)
        .find("tbody tr")
        .each((_, tr) => {
          const rowText = $(tr).text();
          if (/당기\s*순이익|당기순이익/.test(rowText)) {
            // console.log("[naver]", { rowText });
            $(tr)
              .find("td,th")
              .each((_, td) => {
                niRow.push($(td).text().trim());
              });
          }
        });

      const colIndex = headerYears.findIndex((h) => headerRe.test(h));
      if (colIndex > -1 && niRow[colIndex]) {
        // 숫자만 남기고 파싱 (마이너스/소수점/콤마 대응)
        const raw = niRow[colIndex].replace(/[^\d.-]/g, "");
        const val = Number(raw);
        if (Number.isFinite(val)) {
          netProfit = val;
          return false; // ✅ cheerio each 중단
        }
      }
    }
  });

  return netProfit;
};

// 2) 네이버에서 최근 3년 배당성향(%) 평균 추정 (없으면 보수적으로 20~30% 가정)
export const getNaverAvgPayoutRatio = async (code6: string): Promise<number> => {
  const url = `${REST_API.NAVER_ROOT}?code=${code6}`;
  const html = (await axios.get(url, { timeout: 15000 })).data as string;
  const $ = cheerio.load(html);

  // ⚠️ 실제 DOM에 맞게 조정: '배당성향' 표/칸에서 최근 N년 수치 수집
  const ratios: number[] = [];
  $("table").each((_, table) => {
    const text = $(table).text();
    if (/배당성향|배당/i.test(text)) {
      $(table)
        .find("tbody tr")
        .each((_, tr) => {
          const rowText = $(tr).text();
          if (/배당성향/.test(rowText)) {
            $(tr)
              .find("td")
              .each((_, td) => {
                const raw = $(td)
                  .text()
                  .trim()
                  .replace(/[%\s,]/g, "");
                const val = Number(raw);
                if (Number.isFinite(val) && val > 0 && val < 100) ratios.push(val);
              });
          }
        });
    }
  });

  if (!ratios.length) return 25; // 기본 가정 25%
  const avg = ratios.slice(0, 3).reduce((a, b) => a + b, 0) / Math.min(3, ratios.length);
  return avg; // % 값
};

// 3) 종합: 자기자본/ROE 추정
export const getNaverEquityAndROE = async (code6: string, year: number = dayjs().year()) => {
  // (A) DART에서 전년말 자기자본(연결) 가져오기: year-1, 사업보고서

  try {
    const corp = await getCorpCodeByStock(code6);
    if (!corp) {
      console.error("corp_code not found");
      return undefined;
    }

    const equityPrev = await fetchEquity(corp, year - 1);
    if (!equityPrev) {
      console.error("Prev-year equity not found on DART");
      return undefined;
    }

    // (B) 네이버 컨센서스에서 해당 연도(E) 순이익
    const netProfit = await getNaverNetProfit(code6, year);
    if (!netProfit) return console.error("Consensus NetIncome (E) not found on Naver");

    // (C) 배당성향 평균으로 유보율 추정
    const payout = await getNaverAvgPayoutRatio(code6); // %
    const retention = Math.max(0, Math.min(1, 1 - payout / 100)); // 0~1

    // (D) 기말 자기자본(추정) & ROE(추정)
    const equityEstEnd = equityPrev + netProfit * retention;
    const equityAvg = (equityPrev + equityEstEnd) / 2;
    const roe = equityAvg > 0 ? (netProfit / equityAvg) * 100 : undefined;

    console.log("[getNaverEquityAndROE]", { code6, year, payout, retention, equityEstEnd, equityAvg, roe });

    return {
      payoutAvgPercent: payout, // 배당성향 평균 유보율 추정 %
      retentionRatio: retention, // 0~1
      equityPrev, // year-1 말(실제)
      equityEndE: Math.round(equityEstEnd),

      netProfit, // 자기자본 추정치
      roe: roe !== undefined ? roe.toFixed(2) : "", // roe 추정치
      message:
        "네이버 금융의 컨센서스/배당 데이터는 제공 주체 및 DOM 변경에 따라 달라질 수 있으며, 본 추정치는 회계정책/OCI/자사주/기타자본 변동을 반영하지 않은 단순 근사치입니다.",
    };
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
