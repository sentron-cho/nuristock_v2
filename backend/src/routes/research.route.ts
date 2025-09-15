import { ResearchInfoResult, ResearchInfoValues } from "./../types/data.type";
import { SqlError } from "mariadb/*";
import { withError } from "../lib/error.js";
import URL, { REST_API } from "../types/url.js";
import { FastifyInstance } from "fastify";
import { FieldValues, ResearchDataType, ResearchSearchParams } from "../types/data.type.js";
import { ERROR } from "../types/enum.js";
import { makeInsertSet, makeUpdateSet } from "../lib/db.util.js";
import { getNaverReport } from "../crawler/service/naverScraper.service.js";
import { FAILURE, SUCCESS, TIME_OUT_5 } from "../types/constants.js";
import dayjs from "dayjs";
import { parseFnGuideByYear } from "../crawler/service/fnguideScraper.service.js";
import { chromium } from "playwright";

export const insertMystockinfoData = async (fastify: FastifyInstance, value?: ResearchInfoValues) => {
  if (fastify && value?.type && value?.report) {
    if (value.type === "konex") {
      await fastify.db.query(
        `UPDATE market SET mtime='0000', state = 'close', type = 'CLOSE' where code='${value?.code}';`
      ); // 1차 실패
      return;
    }

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
        name: value?.name,
        cdate: year,
      };
      const count = await fastify.db.query(
        `SELECT count(1) as count FROM marketinfo WHERE code='${value?.code}' AND cdate='${year}';`
      );

      // 없으면 등록
      if (!Number(count?.[0]?.count || 0)) {
        console.log("[재무정보 추가]", `[${year}] ${value?.name}(${value.code})`);
        await fastify.db.query(
          `INSERT INTO marketinfo ${makeInsertSet({ ...params, code: value?.code } as FieldValues)};`
        );
      } else {
        console.log("[재무정보 수정]", `[${year}] ${value?.name}(${value.code})`);
        await fastify.db.query(
          `UPDATE marketinfo SET ${makeUpdateSet({
            ...(params || {}),
          } as FieldValues)} WHERE code ='${value?.code}' and cdate='${year}';`
        );
      }

      const erate = ecost && sise && (ecost / sise).toFixed(2);
      await fastify.db.query(
        `UPDATE market SET mtime='${year}', type='${type?.toUpperCase()}', ` +
          `sise='${sise}', updown='${updown}', ecost='${ecost}', erate = '${erate}' where code='${value?.code}';`
      );
    }
  } else {
    console.log("[재무정보 실패]", `[${value?.name}(${value?.code})`);
    await fastify.db.query(`UPDATE market SET mtime='${9001}' where code='${value?.code}';`); // 1차 실패
  }
};

const removeMarketData = async (fastify: FastifyInstance, code?: string) => {
  if (!code) return;

  await fastify.db.query(`DELETE FROM marketinfo WHERE code='${code}';`);
  await fastify.db.query(
    `update market set type='CLOSE', state='close', mtime='9999', sise=null, updown=null, erate=0, ecost=0, stime=null WHERE code = '${code}';`
  );
};

const researchRoute = (fastify: FastifyInstance) => {
  // 종목 전체 목록 조회
  fastify.get(URL.RESEARCH.ROOT, async (req, reply) => {
    try {
      const { year } = req.query as ResearchSearchParams;

      let query =
        `select m.code, m.name, m.type, m.sise, m.erate, m.ecost, m.state, m.stime, m.mtime,  m.updown, ` +
        `k.cdate, k.scount, k.eps, k.roe, k.debt, k.debtratio, k.profit, k.equity, k.per, ` +
        `k.dividend, k.cprice, k.fprice, k.tprice, 0 as prevProfit from market m JOIN marketinfo k ` +
        `ON m.code = k.code and k.cdate = '${year}';`;

      const prevYear = dayjs(year).add(-1).year();
      const list = await fastify.db.query(query);
      const arrays = await fastify.db.query(`select code, profit from marketinfo where cdate = '${prevYear}'`);

      return { value: list?.map(a => ({...a, prevProfit: arrays?.find(b => a.code === b.code)?.profit})) as ResearchDataType[], arrays };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.RESEARCH.ROOT }));
    }
  });

  // 가치투자 종목 항목 수정
  fastify.put(URL.RESEARCH.ROOT, async (req, reply) => {
    try {
      const item = req.body as ResearchDataType;
      const { rowid, code, cdate, stype, sise } = item;

      if (!rowid)
        return reply
          .status(500)
          .send(
            withError({ code: ERROR.ER_NOT_ROWID, sqlMessage: "is not rowid!" } as SqlError, { tag: URL.INVEST.ROOT })
          );

      const res = await fastify.db.query(`SELECT mtime FROM market WHERE code='${code}';`);
      const mtime = Number(res?.[0].mtime) || 0;

      if (res?.[0]) {
        if (mtime < (Number(cdate) || 0)) {
          await fastify.db.query(
            `UPDATE market SET mtime='${cdate}', type='${stype?.toUpperCase()}', sise='${sise}', state='open' WHERE code ='${code}';`
          );
        } else {
          await fastify.db.query(
            `UPDATE market SET type='${stype?.toUpperCase()}', sise='${sise}', state='open' WHERE code ='${code}';`
          );
        }
      }

      const params = {
        scount: item?.scount,
        roe: item?.roe,
        equity: item?.equity,
        eps: item?.eps,
        profit: item?.profit,
        debt: item?.debt,
        debtratio: item?.debtratio,
      };

      const query = `UPDATE marketinfo SET ${makeUpdateSet({
        ...(params || {}),
      } as FieldValues)} WHERE rowid ='${rowid}';`;
      await fastify.db.query(query);
      // console.log("[PUT:RESEARCH]", query);

      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.RESEARCH.ROOT }));
    }
  });

  // 투자조사 종목 항목 삭제
  fastify.delete(URL.RESEARCH.ROOT, async (req, reply) => {
    try {
      const { rowid, code } = req.query as ResearchDataType;

      if (code) {
        await fastify.db.query(`DELETE FROM marketinfo WHERE code='${code}';`);
        await fastify.db.query(
          `update market set type='CLOSE', state='close', mtime='9999', sise=null, updown=null, erate=0, ecost=0, stime=null WHERE code = '${code}';`
        );
      } else if (rowid) {
        await fastify.db.query(`DELETE FROM marketinfo WHERE rowid=${rowid};`);
      }

      reply.status(200).send({ value: code || rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.INVEST.ROOT }));
    }
  });

  // 가치투자 종목 목록 조회
  fastify.get(URL.RESEARCH.DETAIL, async (req, reply) => {
    try {
      const { code } = req.query as ResearchSearchParams;
      let query =
        `select m.code, m.name, m.type, m.sise, m.erate, m.ecost, m.state, m.stime, m.mtime,  m.updown, ` +
        `k.rowid, k.cdate, k.scount, k.eps, k.roe, k.debt, k.debtratio, k.profit, k.equity, k.per, ` +
        `k.dividend, k.cprice, k.fprice, k.tprice from market m JOIN marketinfo k ` +
        `where m.code = k.code and k.code = '${code}';`;

      const list = await fastify.db.query(query);
      return { value: list as ResearchDataType[] };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.RESEARCH.DETAIL }));
    }
  });

  // 가치투자 종목 재무정보 조회(크롤링)
  fastify.get(URL.RESEARCH.NAVER, async (req, reply) => {
    try {
      const { code } = req.query as ResearchSearchParams;

      const value = await getNaverReport(code || "");

      const now = dayjs().tz("Asia/Seoul").add(-1, "year").year();
      const index = value?.report?.findIndex((a) => a?.year?.toString() === now.toString());
      const lastItem = index && (value?.report as ResearchInfoResult[])?.[index];

      if (lastItem && (!lastItem?.roe || !Number(lastItem?.roe))) {
        console.log("[ROE ERROR]", { code });
        try {
          const browser = await chromium.launch();
          const page = await browser.newPage({ userAgent: "Mozilla/5.0", locale: "ko-KR" });

          const rCode = code?.replace("A", "");
          const url = `${REST_API.FNGUIDE_MAIN}?pGB=1&gicode=A${rCode}&cID=&MenuYn=Y&ReportGB=&NewMenuID=101&stkGb=701`;
          await page.goto(url, { waitUntil: "networkidle", timeout: TIME_OUT_5 }); // 5초

          // Annual 하이라이트 테이블 대기 후 outerHTML 추출
          await page.waitForSelector("#highlight_D_A .us_table_ty1.h_fix", { timeout: TIME_OUT_5 });
          const tableHtml = await page.$eval(
            "#highlight_D_A .us_table_ty1.h_fix",
            (el) => (el as HTMLElement).outerHTML
          );

          const data = parseFnGuideByYear(tableHtml, now);
          (value?.report as ResearchInfoResult[])[index]["roe"] = data?.roe;
        } catch (error) {
          console.error(error);
        }
      }
      // console.log("[GET:RESEARCH.SISE]", { code, value });
      return { value: value };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.RESEARCH.ROOT }));
    }
  });

  // 가치투자 종목 재무정보 조회(크롤링) 및 추가
  fastify.put(URL.RESEARCH.REFRESH, async (req, reply) => {
    try {
      const { code, name } = req.body as ResearchSearchParams;

      console.log("[PUT:RESEARCH.REFRESH]", { code, name });
      const value = await getNaverReport(code || "");

      console.log("[PUT:RESEARCH.NAVER]", { value });

      // 코넥스면 삭제
      if (value?.type === "konex") {
        await removeMarketData(fastify, code);
        return { value: SUCCESS };
      }

      if (value && value?.type && value?.report) {
        const row = await fastify.db.query(`select code, name FROM market WHERE code = '${code}';`);
        await insertMystockinfoData(fastify, { ...value, name: row?.[0]?.name });
        return { value: SUCCESS };
      } else {
        return { value: FAILURE };
      }
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.RESEARCH.REFRESH }));
    }
  });
};

export default researchRoute;
