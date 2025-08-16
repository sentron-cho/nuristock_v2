import { makeInsertSet, makeUpdateSet } from "./../lib/db.util.js";
import { FastifyInstance } from "fastify";
import dayjs from "dayjs";

const INTERVAL_TIME = 12 * 60 * 60 * 1000; // 12시간마다

// 주식 현재가 시세 크롤링
export const startAssetTask = (fastify: FastifyInstance) => {
  // 대시보드 DB의 주식 종목에 대한 시세 크롤링
  const start = async () => {
    const now = dayjs().tz("Asia/Seoul");

    console.log(`[${now.format("YYYY-MM-DD HH:mm:ss")}] 보유금액 수집!`);

    // 보유 금액 합계
    const data = await fastify.db.query("SELECT sum(scost * count) as price FROM keeps");

    // DB 저장
    if (data && data?.[0]) {
      const { price } = data?.[0];
      const today = dayjs().format("YYYYMMDD");
      const params = { price, sdate: today, utime: dayjs().format("YYYY-MM-DD HH:mm:ss") };
      const value = await fastify.db.query(`SELECT rowid FROM asset WHERE sdate='${today}';`);
      if (value?.length > 0) {
        await fastify.db.query(`UPDATE asset SET ${makeUpdateSet(params)} WHERE sdate = '${today}';`);
      } else {
        await fastify.db.query(`INSERT INTO asset ${makeInsertSet(params)};`);
      }
    }
  };

  // 이전의 자본 데이터 임의 저장
  // const test = async () => {
  //   const now = dayjs().tz("Asia/Seoul");

  //   console.log(`[${now.format("YYYY-MM-DD HH:mm:ss")}] 보유금액 수집!`);

  //   let start = dayjs("20110101", "YYYYMMDD");

  //   // 2011 ~ 2024년도
  //   for (let k = 0; k < 14; k++) {
  //     const year = start.add(k, 'year');
  //     const nYear = Number(year?.format('YYYY'));
  //     const price = nYear < 2012 ? 10 * 1000000 : nYear < 2015 ? 20 * 1000000 : nYear < 2020 ? 30 * 1000000 : 40 * 1000000;

  //     for (let i = 0; i < 12; i++) {
  //       const date = year.add(i, "month").format("YYYYMMDD");
  //       const params = { price: price, sdate: date, utime: dayjs().format("YYYY-MM-DD HH:mm:ss") };
  //       await fastify.db.query(`INSERT INTO asset ${makeInsertSet(params)};`);
  //     }
  //   }

  //   // 2025년도
  //   start = dayjs("20250101", "YYYYMMDD");
  //   for (let i = 0; i < 8; i++) {
  //     const date = start.add(i, "month").format("YYYYMMDD");
  //     const params = { price: 45 * 1000000, sdate: date, utime: dayjs().format("YYYY-MM-DD HH:mm:ss") };
  //     await fastify.db.query(`INSERT INTO asset ${makeInsertSet(params)};`);
  //   }
  // };

  // 최초 실행
  console.log(`[${dayjs().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss")}] start asset task!!!!!`);
  start();
  // test();

  // 12시간마다 실행
  setInterval(start, INTERVAL_TIME);
};
