import { makeInsertSet, makeUpdateSet } from "../lib/db.util.js";
import { FastifyInstance } from "fastify";
import dayjs from "dayjs";
import { getMystockInfo } from "../crawler/service/mystockInfoScraper.service.js";
import { FieldValues, StockDartBasicType } from "../types/data.type.js";

const INTERVAL_TIME = 1 * 10 * 1000; // 1분마다

// 주식 현재가 시세 크롤링
export const startMystockTask = (fastify: FastifyInstance) => {
  // 대시보드 DB의 주식 종목에 대한 시세 크롤링
  const start = async () => {
    const now = dayjs().tz("Asia/Seoul");

    // console.log(`[${now.format("YYYY-MM-DD HH:mm:ss")}] 주식 종목 투자 정보 수집!`);

    const year = dayjs().add(-1, "year").year();
    const sql = `select code, name, type from market where state='open' and type != 'CLOSE' and (mtime != '${year}' or mtime is null) order by type DESC, name limit 1;`;
    const data = await fastify.db.query(sql);

    // console.log({sql})
    console.log(`[${now.format("YYYY-MM-DD HH:mm:ss")}: 종목정보수집] ==> `, {data: data?.[0]});

    // DB 저장
    if (data && data?.[0]) {
      const { code } = data?.[0];

      const stock = await fastify.db.query(`SELECT code, name FROM market WHERE code='${code}';`);

      try {
        const res = await getMystockInfo({
          code6: code?.replace("A", ""),
          from: 2020,
          to: dayjs().add(-1, "year").year(),
        });
        const { value } = res as { value: StockDartBasicType[] };

        // 값이 없을 경우 패스
        if (!value?.length) {
          await fastify.db.query(`UPDATE market SET mtime='${year}' where code='${code}';`);
          return;
        }

        for (const row of value) {
          const params = {
            code: code,
            name: stock?.[0]?.name || "",
            cdate: row?.year, // 대상년도
            profit: row?.netIncome, // 당기순이익
            scount: row?.shares, // 발행주식수
            equity: row?.equity, // 자본(지배주주)
            debt: row?.debt, // 부채
            eps: row?.eps, // EPS
            roe: row?.roe, // ROE
            debtratio: row?.debtRatio, // 부채비율
          };

          const count = await fastify.db.query(
            `SELECT count(1) as count FROM marketinfo WHERE code='${code}' AND cdate='${params?.cdate}';`
          );          

          if (!Number(count?.[0]?.count || 0)) {
            await fastify.db.query(`INSERT INTO marketinfo ${makeInsertSet(params as FieldValues)};`);
          }

          await fastify.db.query(`UPDATE market SET mtime='${row?.year}' where code='${code}';`);
        }
      } catch (error) {
        await fastify.db.query(`UPDATE market SET mtime='${year}' where code='${code}';`);
      }
    }
  };

  // 최초 실행
  console.log(`[${dayjs().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss")}] start asset task!!!!!`);
  start();

  setInterval(start, INTERVAL_TIME);
};
