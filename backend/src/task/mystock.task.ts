import { makeInsertSet, makeUpdateSet } from "../lib/db.util.js";
import { FastifyInstance } from "fastify";
import dayjs from "dayjs";
import { getMystockInfo } from "../crawler/service/mystockInfoScraper.service.js";
import { FieldValues, StockDartBasicType } from "../types/data.type.js";

const INTERVAL_TIME = 1 * 60 * 1000; // 1분마다

// 주식 현재가 시세 크롤링
export const startMystockTask = (fastify: FastifyInstance) => {
  // 대시보드 DB의 주식 종목에 대한 시세 크롤링
  const start = async () => {
    const now = dayjs().tz("Asia/Seoul");

    // console.log(`[${now.format("YYYY-MM-DD HH:mm:ss")}] 주식 종목 투자 정보 수집!`);

    // 상장폐지(type=close)인 종목은 일단 9999로 업데이트
    await fastify.db.query(`UPDATE market SET mtime='9999' where type='CLOSE' or type='close';`);

    // 오류 또는

    // 이전년도(2025일 경우 2024) 중에서 1개 데이터 검색
    const year = dayjs().add(-1, "year").year();
    const sql = `SELECT code, name, type, mtime FROM market WHERE mtime < '${year}' AND mtime != '0000' ORDER BY type DESC, name LIMIT 1;`;
    const data = await fastify.db.query(sql);
    // console.log({sql})

    console.log(`[${now.format("YYYY-MM-DD HH:mm:ss")}: 종목정보수집] ==> `, data?.[0]);

    // DB 저장
    if (data && data?.[0] && data?.[0]?.code) {
      const { code } = data[0];

      // 3. 검색한 데이터가 종목정보 테이블에 있으면 mtime 업데이트 및 패스
      const isExist = await fastify.db.query(
        `SELECT count(1) as count FROM marketinfo WHERE cdate='${year}' AND code='${code}'`
      );

      // console.log("[1.COUNT]", { isExist });

      if (Number(isExist?.[0]?.count || 0) > 0) {
        await fastify.db.query(`UPDATE market SET mtime='${year}' where code='${code}';`);
        console.log(`[${now.format("YYYY-MM-DD HH:mm:ss")}: 정보수집패스] ==> `, { ...data?.[0], mtime: year });
        return;
      }
      // else {
      //   await fastify.db.query(`UPDATE market SET mtime='0000' where code='${code}';`); // 오류시
      //   return;
      // }

      // const stock = await fastify.db.query(`SELECT code, name FROM market WHERE code='${code}';`);

      // console.log("[2.SEARCH]", { data });

      try {
        const res = await getMystockInfo({
          code6: code?.replace("A", ""),
          from: 2020,
          to: dayjs().add(-1, "year").year(),
        });

        const { value } = res as { value: StockDartBasicType[] };

        // console.log({ data: value });

        if (value?.[0]?.res?.status === "020") {
          console.error("[사용한도 초과]", { data: value?.[0]?.res });
          return;
        }

        if (!value?.length) {
          // 값이 없을 경우 패스
          await fastify.db.query(`UPDATE market SET mtime='${year}' where code='${code}';`);
          return;
        }

        for (const row of value) {
          const params = {
            code: code,
            name: data?.[0]?.name || "",
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

          // 없으면 등록
          if (!Number(count?.[0]?.count || 0)) {
            await fastify.db.query(`INSERT INTO marketinfo ${makeInsertSet(params as FieldValues)};`);
          }

          // 데이터 업데이트
          await fastify.db.query(`UPDATE market SET mtime='${year}' where code='${code}';`);
        }
      } catch (error) {
        await fastify.db.query(`UPDATE market SET mtime='0000' where code='${code}';`); // 오류시
        // await fastify.db.query(`UPDATE market SET mtime='${year}' where code='${code}';`);
      }
    }
  };

  // 최초 실행
  console.log(`[${dayjs().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss")}] start asset task!!!!!`);

  start();
  setInterval(start, INTERVAL_TIME);
};
