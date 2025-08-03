import axios from "axios";
import * as cheerio from "cheerio";
import { FastifyInstance } from "fastify";
import { MarketSiseUpdateDataType } from "../types/market.type";
import { FieldValues } from "../types/common.type";
import dayjs from "dayjs";
import { makeUpdateSet } from "../lib/db.util.js";

// const stocks = ["A000270", "A003490", "A005380", "A005490"];

const getNaverStockPrice = async (code: string) => {
  try {
    const url = `https://finance.naver.com/item/main.nhn?code=${code}`;
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(data);
    const priceText = $(".no_today .blind").first().text(); // 현재가

    // 전일비 정보
    const exdayElement = $(".no_exday em").first();
    const updown = exdayElement.attr("class")?.replace("no_", "") || ""; // up, down, steady

    const exdayTexts = $(".no_exday .blind")
      .toArray()
      .map((el) => $(el).text());
    const ecost = Number(exdayTexts?.[0]?.replace(/,/g, "") || 0); // 전일비 (ex: +1,500)
    const erate = Number(exdayTexts?.[1]?.replace(/,/g, "") || 0); // 등락률 (ex: +1.94%)

    return {
      code,
      sise: Number(priceText.replace(/,/g, "")),
      ecost: updown === "down" ? ecost * -1 : ecost,
      erate: updown === "down" ? erate * -1 : erate,
      updown: updown,
      stime: dayjs().format("YYYYMMDDHHmmss"),
    };
  } catch (error) {
    console.error(`[ERROR] ${code} 시세 가져오기 실패`, error);
    return null;
  }
};

const updateStockSise = async (fastify: FastifyInstance, item: FieldValues) => {
  try {
    const { code, sise, ecost, erate, updown, stime } = item;
    const params = { sise, ecost, erate, updown, stime };
    await fastify.db.query(`UPDATE market SET ${makeUpdateSet(params)} WHERE code = 'A${code}';`);
  } catch (error) {
    console.error(`[DB ERROR] ${item.code} 저장 실패`, error);
  }
};

const START_TIME = 8;
const END_TIME = 20;
const INTERVAL_TIME = 60 * 1000; // 1분마다

// 주식 현재가 시세 크롤링
export const startStockCollector = (fastify: FastifyInstance) => {
  const fetchAllStocks = async () => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();

    // ⛔️ 토/일요일 제외
    const isWeekend = day === 0 || day === 6;

    // 오전 8시 ~ 오후 8시 (20시) 사이에만 실행
    if (!isWeekend && hour >= START_TIME && hour < END_TIME) {
      console.log(`[${now.toISOString()}] 시세 수집 시작, 크롤링`);
      const data = await fastify.db.query("SELECT code FROM dashboard");
      const codes = data?.map((a) => a?.code?.replace("A", ""));

      const results = await Promise.all(codes.map(getNaverStockPrice));
      const validResults = results.filter(Boolean);

      // console.log({ codes });
      // console.log(`[${now.toISOString()}] 시세 수집 결과:`, validResults);

      // DB 저장
      for (const item of validResults) {
        await updateStockSise(fastify, item as FieldValues);
      }

      // TODO: DB 저장 로직 삽입
    }
    // else {
    //   console.log(`[${now.toISOString()}] 시세 수집 시간 아님, 크롤링 건너뜀`);
    // }
  };

  // 최초 실행
  fetchAllStocks();

  // 1분마다 실행
  setInterval(fetchAllStocks, INTERVAL_TIME);
};
