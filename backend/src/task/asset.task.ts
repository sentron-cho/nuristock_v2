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

  // 최초 실행
  console.log(`[${dayjs().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss")}] start asset task!!!!!`);
  start();
  // test();

  // 12시간마다 실행
  setInterval(start, INTERVAL_TIME);
};
