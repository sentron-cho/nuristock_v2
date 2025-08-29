import axios from "axios";
import * as cheerio from "cheerio";
import { FastifyInstance } from "fastify";
import { FieldValues } from "../../types/data.type.js";
import { makeUpdateSet } from "../../lib/db.util.js";
import dayjs from "../../lib/dayjs.js";
import { REST_API } from "../../types/url.js";

export const getNaverStockSise = async (code: string) => {
  try {
    // https://finance.naver.com/item/main.nhn
    const url = `${REST_API.NAVER_ROOT}/item/main.nhn?code=${code}`;
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
      stime: dayjs().tz("Asia/Seoul").format("YYYYMMDDHHmmss"),
    };
  } catch (error) {
    console.error(`[ERROR] ${code} 시세 가져오기 실패`, error);
    return null;
  }
};

export const updateStockSise = async (fastify: FastifyInstance, item: FieldValues) => {
  try {
    const { code, sise, ecost, erate, updown, stime } = item;
    const params = { sise, ecost, erate, updown, stime, utime: dayjs().format("YYYY-MM-DD HH:mm:ss") };
    await fastify.db.query(`UPDATE market SET ${makeUpdateSet(params)} WHERE code = 'A${code}';`);
  } catch (error) {
    console.error(`[DB ERROR] ${item.code} 저장 실패`, error);
  }
};

const START_TIME = 9; // 오전 9시
const END_TIME = 16; // 오후 4시
const INTERVAL_TIME = 5 * 60 * 1000; // 5분마다

const INVEST_START_TIME = 8; // 오전 8시
const INVEST_END_TIME = 18; // 오후 6시
const INVEST_INTERVAL_TIME = 60 * 60 * 1000; // 60분마다

const ALL_START_TIME = 16; // 오후 4시
const ALL_END_TIME = 6; // 오전 6시
const ALL_INTERVAL_TIME = 30 * 1000; // 30초마다

// 주식 현재가 시세 크롤링
export const startStockSiseService = (fastify: FastifyInstance) => {
  // 대시보드 DB의 주식 종목에 대한 시세 크롤링
  const fetchStocksByDashboard = async () => {
    const now = dayjs().tz("Asia/Seoul");
    const hour = now.hour();
    const day = now.day();

    // ⛔️ 토/일요일 제외
    const isWeekend = day === 0 || day === 6;

    // 오전 9시 ~ 오후 4시 (16시) 사이에만 실행
    if (!isWeekend && hour >= START_TIME && hour < END_TIME) {
      console.log(`[${now.format("YYYY-MM-DD HH:mm:ss")}] 대시보드 시세 수집 시작, 크롤링`);

      // 대시보드 DB에 있는 종목들 가져오기
      let data = await fastify.db.query("SELECT code FROM dashboard");
      let codes = data?.map((a) => a?.code?.replace("A", ""));

      // 실시간 주가 가져오기
      let results = await Promise.all(codes.map(getNaverStockSise));
      let validResults = results.filter(Boolean);

      // DB 저장
      for (const item of validResults) {
        await updateStockSise(fastify, item as FieldValues);
      }
    }
    // else {
    //   console.log(`[${now.toISOString()}] 시세 수집 시간 아님, 크롤링 건너뜀`);
    // }
  };

  // 가치투자 DB의 주식 종목에 대한 시세 크롤링
  const fetchStocksByInvestment = async () => {
    const now = dayjs().tz("Asia/Seoul");
    const hour = now.hour();

    // 오전 6시 ~ 오후 8시 (20시) 사이에만 실행
    if (hour >= INVEST_START_TIME && hour < INVEST_END_TIME) {
      console.log(`[${now.format("YYYY-MM-DD HH:mm:ss")}] 가치투자 시세 수집 시작, 크롤링`);

      // 가치투자 DB에 있는 종목들 가져오기
      let data = await fastify.db.query("SELECT code FROM investment GROUP BY code");
      let codes = data?.map((a) => a?.code?.replace("A", ""));

      // 실시간 주가 가져오기
      let results = await Promise.all(codes.map(getNaverStockSise));
      let validResults = results.filter(Boolean);

      // console.log({ codes });
      // console.log(`[${now.toISOString()}] 시세 수집 결과:`, validResults);

      // DB 저장
      for (const item of validResults) {
        await updateStockSise(fastify, item as FieldValues);
      }
    }
    // else {
    //   console.log(`[${now.toISOString()}] 시세 수집 시간 아님, 크롤링 건너뜀`);
    // }
  };

  // 대시보드 DB의 주식 종목에 대한 시세 크롤링
  const fetchStocksByAll = async () => {
    const now = dayjs().tz("Asia/Seoul");
    const hour = now.hour();

    // console.log({hour, a: hour >= ALL_START_TIME, b: hour >= ALL_START_TIME || hour < ALL_END_TIME})

    // 오후 18시 ~ 새벽 06시 사이에만 실행
    if (hour >= ALL_START_TIME || hour < ALL_END_TIME) {
      console.log(`[${now.format("YYYY-MM-DD HH:mm:ss")}] 전체종목 시세 수집 시작, 크롤링`);

      // 대시보드 DB에 있는 종목들 가져오기
      const year = now.add(-1, "year").format("YYYY");
      let data = await fastify.db.query(
        `SELECT code FROM market WHERE mtime = '' or mtime = '${year}' ORDER BY stime ASC LIMIT 3;`
      );
      let codes = data?.map((a) => a?.code?.replace("A", ""));

      // 실시간 주가 가져오기
      let results = await Promise.all(codes.map(getNaverStockSise));
      let validResults = results.filter(Boolean);

      // console.log({ validResults });

      // DB 저장
      for (const item of validResults) {
        await updateStockSise(fastify, item as FieldValues);
      }
    }
    // else {
    //   console.log(`[${now.toISOString()}] 시세 수집 시간 아님, 크롤링 건너뜀`);
    // }
  };

  // 최초 실행
  console.log(`[${dayjs().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss")}] start crawler!!!!!`);
  fetchStocksByDashboard(); // 보유 종목 시세 수집
  fetchStocksByInvestment(); // 가치 투자 종목 시세 수집
  fetchStocksByAll(); // 전체 종목 시세 수집

  // 5분마다 실행
  setInterval(fetchStocksByDashboard, INTERVAL_TIME);
  setInterval(fetchStocksByInvestment, INVEST_INTERVAL_TIME);
  setInterval(fetchStocksByAll, ALL_INTERVAL_TIME);
};
