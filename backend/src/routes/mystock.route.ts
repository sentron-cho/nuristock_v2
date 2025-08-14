import { SqlError } from "mariadb/*";
import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { withError } from "../lib/error.js";
import { makeInsertSet, makeUpdateSet } from "../lib/db.util.js";
import { MyStockKeepCreateType, MyStockSellCreateType } from "../types/data.type.js";
import { FieldValues } from "../types/common.type.js";
import dayjs from "dayjs";

const mystockRoute = (fastify: FastifyInstance) => {
  // 보유종목 목록 조회
  fastify.get(URL.MYSTOCK.ROOT, async (req, reply) => {
    try {
      const { code } = req.query as { code?: string };

      const mystocks = await fastify.db.query(`SELECT * FROM dashboard`);
      const stock = await fastify.db.query(`SELECT code, name FROM dashboard WHERE code='${code}'`);
      const keeps = await fastify.db.query(
        `SELECT k.*, m.name as name FROM keeps k JOIN dashboard m ON k.code = m.code WHERE k.code='${code}'`
      );
      const sells = await fastify.db.query(
        `SELECT k.*, m.name as name FROM sells k JOIN dashboard m ON k.code = m.code WHERE k.code='${code}'`
      );
      const sise = await fastify.db.query(
        `SELECT code, stime as time, sise, updown, erate, ecost  FROM market WHERE code='${code}';`
      );

      return {
        value: { ...(stock?.[0] || {}) },
        keeps: keeps,
        sells: sells,
        stocks: mystocks,
        sise: { ...(sise?.[0] || {}) },
      };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.ROOT }));
    }
  });

  // 보유 주식 데이터 업데이트
  const updateDashboardKeep = async (code: string, isSell = false) => {
    try {
      if (!code) throw new Error("is not stock code");

      const keeps = await fastify.db.query(
        `SELECT SUM(scost * count) AS sprice, SUM(count) AS count FROM keeps WHERE code = '${code}'`
      );

      const sells = await fastify.db.query(
        `SELECT SUM(scost * count) AS sprice, SUM(count) as count, SUM(ecost * count) AS eprice FROM sells WHERE code = '${code}'`
      );

      const dashboardData = isSell
        ? {
            kcount: Number(keeps?.[0]?.count), // 보유 수량
            kprice: Number(keeps?.[0]?.sprice), // 보유 금액

            ecount: Number(sells?.[0]?.count), // 매도/매도 수량
            eprice: Number(sells?.[0]?.eprice), // 매도 금액
            sprice: Number(sells?.[0]?.sprice), // 매수 금액
          }
        : {
            kcount: Number(keeps?.[0]?.count), // 보유 수량
            kprice: Number(keeps?.[0]?.sprice), // 보유 금액
          };

      await fastify.db.query(`UPDATE dashboard SET ${makeUpdateSet(dashboardData)} WHERE code='${code}';`);
    } catch (error) {
      throw error;
    }
  };

  // 주식 매수 추가
  fastify.post(URL.MYSTOCK.BUY, async (req, reply) => {
    try {
      const { code, scost, sdate } = req.body as MyStockKeepCreateType;

      const sise = await fastify.db.query(`SELECT sise  FROM market WHERE code='${code}';`);

      // 시세가 없을 경우
      if (!sise?.[0]?.sise) {
        const params = {
          stime: dayjs(sdate).format("YYYYMMDDHHmmss"),
          sise: scost,
          updown: "",
          erate: 0,
          ecost: 0,
        };

        await fastify.db.query(`UPDATE market SET ${makeUpdateSet(params as FieldValues)} WHERE code = '${code}';`);
      } else {
        // 시세 업데이트
        const params = {
          stime: dayjs().format("YYYYMMDDHHmmss"),
          sise: scost,
        };
        await fastify.db.query(`UPDATE market SET ${makeUpdateSet(params as FieldValues)} WHERE code = '${code}';`);
      }

      await fastify.db.query(`INSERT INTO keeps ${makeInsertSet(req.body as FieldValues)};`);
      await updateDashboardKeep(code);

      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.BUY }));
    }
  });

  // 매수 주식 삭제
  fastify.delete(URL.MYSTOCK.BUY, async (req, reply) => {
    try {
      const { rowid, code } = req.query as MyStockKeepCreateType;

      await fastify.db.query(`DELETE FROM keeps WHERE rowid=${rowid};`);
      await updateDashboardKeep(code);
      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.BUY }));
    }
  });

  // 매수 주식 수정
  fastify.put(URL.MYSTOCK.BUY, async (req, reply) => {
    try {
      const { code, rowid } = req.body as MyStockKeepCreateType;

      if (!rowid)
        return reply
          .status(500)
          .send(withError({ code: "ER_NOT_ROWID", sqlMessage: "is not rowid!" } as SqlError, { tag: URL.MYSTOCK.BUY }));

      await fastify.db.query(`UPDATE keeps SET ${makeUpdateSet(req.body as FieldValues)} WHERE rowid ='${rowid}';`);
      await updateDashboardKeep(code);
      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.BUY }));
    }
  });

  // 주식 매도 추가
  fastify.post(URL.MYSTOCK.SELL, async (req, reply) => {
    try {
      const { code, rowid, ecost } = req.body as MyStockSellCreateType;

      const params = JSON.parse(JSON.stringify(req?.body));
      delete params["rowid"];

      await fastify.db.query(`INSERT INTO sells ${makeInsertSet(params as Record<string, string>)};`);
      await fastify.db.query(`DELETE from keeps WHERE rowid=${rowid};`);
      await updateDashboardKeep(code, true);

      // 시세 업데이트
      const siseParams = {
        stime: dayjs().format("YYYYMMDDHHmmss"),
        sise: ecost,
      };
      await fastify.db.query(`UPDATE market SET ${makeUpdateSet(siseParams as FieldValues)} WHERE code = '${code}';`);

      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.BUY }));
    }
  });

  // 매도 주식 삭제
  fastify.delete(URL.MYSTOCK.SELL, async (req, reply) => {
    try {
      const { rowid, code } = req.query as MyStockSellCreateType;

      await fastify.db.query(`DELETE FROM sells WHERE rowid=${rowid};`);
      await updateDashboardKeep(code, true);
      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.BUY }));
    }
  });

  // 매도 주식 수정
  fastify.put(URL.MYSTOCK.SELL, async (req, reply) => {
    try {
      const { code, rowid } = req.body as MyStockSellCreateType;

      if (!rowid)
        return reply
          .status(500)
          .send(withError({ code: "ER_NOT_ROWID", sqlMessage: "is not rowid!" } as SqlError, { tag: URL.MYSTOCK.BUY }));

      await fastify.db.query(`UPDATE sells SET ${makeUpdateSet(req.body as FieldValues)} WHERE rowid ='${rowid}';`);
      await updateDashboardKeep(code, true);
      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.BUY }));
    }
  });
};

export default mystockRoute;
