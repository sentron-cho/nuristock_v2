import dayjs from "dayjs";
import { FastifyInstance } from "fastify";
import { getNaverReport } from "../crawler/service/naverScraper.service.js";
import { makeInsertSet, makeUpdateSet } from "../lib/db.util.js";
import { FieldValues } from "../types/data.type.js";

const INTERVAL_TIME = 3 * 60 * 60 * 1000; // 3시간마다

export const startMarketCheck = (fastify: FastifyInstance) => {
  const start = async () => {
    const now = dayjs().tz("Asia/Seoul");

    console.log(`[${now.format("YYYY-MM-DD HH:mm:ss")}] 상폐종목 점검!`);

    const list = [""];

    console.log({ total: list.length });

    // 리스트 목록을 순회하며 DB에 존재하면 상장폐지 종목으로 업데이트
    let count = 0;
    for (const code of list ?? []) {
      try {
        // select count(*) FROM market WHERE mtime = '9000' and state = 'open';
        const value = await fastify.db.query(
          `SELECT code, name, type, mtime, stime FROM market WHERE code='${code}' AND state != 'open';`
        );

        if (value?.length > 0) {
          count++;
          const market = value?.[0];
          console.log(`- 상장종목: ${market.name}(${market.code}) : [${market.type}]${market.mtime}`);
          // await fastify.db.query(`UPDATE market SET state='open', type='NONE' WHERE code='${code}';`);
        }
      } catch (error) {
        console.error(`[DB ERROR] ${code} 조회 실패`, error);
      }
    }

    console.log(`\n\n ====> 총 ${count}개의 상장이상 종목 발견!`);
  };

  // const start = async () => {
  //   const now = dayjs().tz("Asia/Seoul");

  //   console.log(`[${now.format("YYYY-MM-DD HH:mm:ss")}] 상폐종목 점검!`);
  //   console.log({ length: list.length });

  //   // 리스트 목록을 순회하며 DB에 존재하면 상장폐지 종목으로 업데이트
  //   let count = 0;
  //   for (const item of list ?? []) {
  //     try {
  //       const value = await fastify.db.query(
  //         `SELECT code, name, type, state
  //      FROM market
  //      WHERE code='${item.code}' AND state = 'open';`
  //       );

  //       if (value?.length > 0) {
  //         count++;
  //         const market = value?.[0];
  //         console.log(`- 상장폐지: ${market.name}(${market.code}) : [${market.type}]${market.state} - ${item.date}`);
  //         await fastify.db.query(`UPDATE market SET state='close', type='CLOSE' WHERE code='${item.code}';`);
  //       }
  //     } catch (error) {
  //       console.error(`[DB ERROR] ${item.code} 조회 실패`, error);
  //     }
  //   }

  //   console.log(`\n\n ====> 총 ${count}개의 상장폐지 종목 발견!`);
  // };

  // 최초 실행
  console.log(`[${dayjs().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss")}] start asset task!!!!!`);

  start();
  setInterval(start, INTERVAL_TIME);
};

const INTERVAL_TIME_UPDATE = 1 * 60 * 1000; // 1분마다

// 크롤링 실패 종목 업데이트
export const startMarketUpdate = (fastify: FastifyInstance) => {
  const start = async () => {
    const now = dayjs().tz("Asia/Seoul");
    console.log(`[${now.format("YYYY-MM-DD HH:mm:ss")}] 크롤링 실패 종목 업데이트!`);

    // 리스트 목록을 순회하며 DB에 존재하면 상장폐지 종목으로 업데이트
    let code = "";
    try {
      // select count(*) FROM market WHERE mtime = '9000' and state = 'open';
      const value = await fastify.db.query(
        `select code, name FROM market WHERE mtime = '9000' and state = 'open' limit 1;`
      );

      if (value?.[0]) {
        const item = value?.[0];
        code = item?.code;

        if (code) {
          const value = await getNaverReport(code || "");
          console.log(`[SUCCESS]상장종목: ${item.name}(${item.code})`);

          if (value?.type && value?.report) {
            const { type, sise, updown, ecost, shares } = value;

            for (const row of value?.report) {
              const { year, roe, profit, equity, debt, debtratio, eps, dividend } = row;
              if (year === dayjs().year()) continue;

              const params = {
                roe,
                profit,
                equity,
                debt,
                debtratio,
                eps,
                dividend: dividend || "",
                scount: shares,
                name: item.name,
                cdate: year,
              };
              const count = await fastify.db.query(
                `SELECT count(1) as count FROM marketinfo WHERE code='${code}' AND cdate='${year}';`
              );

              // 없으면 등록
              if (!Number(count?.[0]?.count || 0)) {
                console.log("[재무정보 추가]", `[${year}] ${item.name}(${item.code})`);
                await fastify.db.query(`INSERT INTO marketinfo ${makeInsertSet({ ...params, code } as FieldValues)};`);
              } else {
                console.log("[재무정보 수정]", `[${year}] ${item.name}(${item.code})`);
                await fastify.db.query(
                  `UPDATE marketinfo SET ${makeUpdateSet({
                    ...(params || {}),
                  } as FieldValues)} WHERE rowid ='${code}' and cdate='${year}';`
                );
              }

              const erate = ecost && sise && (ecost / sise).toFixed(2);
              await fastify.db.query(
                `UPDATE market SET mtime='${year}', type='${type?.toUpperCase()}', ` +
                  `sise='${sise}', updown='${updown}', ecost='${ecost}', erate = '${erate}' where code='${code}';`
              );
            }
          } else {
            await fastify.db.query(`UPDATE market SET mtime='${9001}' where code='${code}';`); // 1차 실패
          }
        }
      }
    } catch (error) {
      code && (await fastify.db.query(`UPDATE market SET mtime='${9001}' where code='${code}';`));
      console.error(`[ERROR] ${code} 조회 실패`, error);
    }
  };

  // 최초 실행
  console.log(`[${dayjs().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss")}] start asset task!!!!!`);

  start();
  setInterval(start, INTERVAL_TIME_UPDATE);
};
