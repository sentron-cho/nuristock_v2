import { SqlError } from "mariadb/*";
import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { withError } from "../lib/error.js";
import { makeInsertSet, makeUpdateSet } from "../lib/db.util.js";
import { MyStockKeepCreateType } from "../types/mystock.type.js";

const mystockRoute = (fastify: FastifyInstance) => {
  // 보유종목 목록 조회
  fastify.get(URL.MYSTOCK.ROOT, async (req, reply) => {
    const { code } = req.query as { code?: string };

    try {
      const mystocks = await fastify.db.query(`SELECT * FROM dashboard`);
      const stock = await fastify.db.query(`SELECT code, name FROM dashboard WHERE code='${code}'`);
      const keeps = await fastify.db.query(`SELECT * FROM keeps WHERE code='${code}'`);
      const sells = await fastify.db.query(`SELECT * FROM sells WHERE code='${code}'`);
      const sise = await fastify.db.query(
        `SELECT code, stime as time, sise, updown  FROM market WHERE code='${code}';`
      );

      return {
        code: 200,
        value: {
          ...(stock?.[0] || {}),
        },
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
      console.log("[updateDashboardKeep]", { code });
      if (!code) throw new Error("is not stock code");

      const mystock = await fastify.db.query(
        `SELECT SUM(scost * count) AS scost, SUM(count) AS count FROM keeps WHERE code = '${code}'`
      );

      const dashboardData = isSell
        ? { kcount: Number(mystock?.[0]?.count), kprice: Number(mystock?.[0]?.scost) }
        : { kcount: Number(mystock?.[0]?.count), kprice: Number(mystock?.[0]?.scost) };

      await fastify.db.query(`UPDATE dashboard SET ${makeUpdateSet(dashboardData)} WHERE code='${code}';`);
    } catch (error) {
      throw error;
    }
  };

  // 주식 매수
  fastify.post(URL.MYSTOCK.BUY, async (req, reply) => {
    const { code } = req.body as MyStockKeepCreateType;

    try {
      await fastify.db.query(`INSERT INTO keeps ${makeInsertSet(req.body as Record<string, string>)};`);
      await updateDashboardKeep(code);
      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.BUY }));
    }
  });

  // 매수 주식 삭제
  fastify.delete(URL.MYSTOCK.BUY, async (req, reply) => {
    const { rowid, code } = req.query as MyStockKeepCreateType;

    try {
      await fastify.db.query(`DELETE FROM keeps WHERE rowid=${rowid};`);
      await updateDashboardKeep(code);
      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.BUY }));
    }
  });

  // 매수 주식 편집
  fastify.put(URL.MYSTOCK.BUY, async (req, reply) => {
    console.log(req.body);
    const { code, rowid } = req.body as Record<string, string>;

    try {
      if (!rowid)
        return reply
          .status(500)
          .send(withError({ code: "ER_NOT_ROWID", sqlMessage: "is not rowid!" } as SqlError, { tag: URL.MYSTOCK.BUY }));

      await fastify.db.query(
        `UPDATE keeps SET ${makeUpdateSet(req.body as Record<string, unknown>)} WHERE rowid ='${rowid}';`
      );
      await updateDashboardKeep(code);
      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.BUY }));
    }
  });

  // 주식 매도
  fastify.post(URL.MYSTOCK.SELL, async (req, reply) => {
    const { code, name } = req.body as Record<string, string>;

    try {
      await fastify.db.query(`INSERT INTO sells (code, name) VALUES ('${code}', '${name}');`);
      await updateDashboardKeep(code, true);
      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.SELL }));
    }
  });

  // 매도 주식 삭제
  fastify.delete(URL.MYSTOCK.SELL, async (req, reply) => {
    const { rowid, code } = req.query as MyStockKeepCreateType;

    try {
      await fastify.db.query(`DELETE FROM sells WHERE rowid=${rowid};`);
      await updateDashboardKeep(code, true);
      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.BUY }));
    }
  });

  // // 보유주식 삭제
  // fastify.delete(URL.MYSTOCK.ROOT, async (req, reply) => {
  //   console.log(`[API:CALL]`, { url: `${URL.MYSTOCK.ROOT}`, query: req.query });
  //   const { code, name } = req.query as Record<string, string>;

  //   try {
  //     const res = await fastify.db.query(`DELETE FROM keeps WHERE code='${code}';`);
  //     reply.status(200).send({ value: code });
  //   } catch (error) {
  //     reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.ROOT }));
  //   }
  // });

  // // 보유주식 수정
  // fastify.put(URL.MYSTOCK.ROOT, async (req, reply) => {
  //   console.log(`[API:CALL]`, { url: `${URL.MYSTOCK.ROOT}`, query: req.body });
  //   const { code, name } = req.body as Record<string, string>;

  //   try {
  //     const res = await fastify.db.query(`UPDATE keeps SET name = '${name}' WHERE code = '${code}';`);
  //     reply.status(200).send({ value: code });
  //   } catch (error) {
  //     reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.ROOT }));
  //   }
  // });
};

export default mystockRoute;
