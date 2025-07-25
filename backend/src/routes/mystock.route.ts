import { SqlError } from "mariadb/*";
import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { withError } from "../lib/error.js";
import { makeInsertSet, makeUpdateSet } from "../lib/db.util.js";
import { MyStockKeepCreateType } from "../types/mystock.type.js";

const mystockRoute = (fastify: FastifyInstance) => {
  // 보유종목 목록 조회
  fastify.get(URL.MYSTOCK.ROOT, async (req, reply) => {
    console.log(`[API:CALL]`, { url: `${URL.MYSTOCK.ROOT}` });
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

  // 주식 매수
  fastify.post(URL.MYSTOCK.BUY, async (req, reply) => {
    console.log(`[API:CALL]`, { url: `${URL.MYSTOCK.ROOT}`, body: req.body });
    const { code, scost, count } = req.body as MyStockKeepCreateType;

    try {
      await fastify.db.query(`INSERT INTO keeps ${makeInsertSet(req.body as Record<string, string>)};`);

      const mystock = await fastify.db.query(`SELECT * FROM dashboard WHERE code='${code}';`);
      const dashboardData = {
        kcount: Number(mystock?.[0]?.kcount) + Number(count),
        kprice: Number(mystock?.[0]?.kprice) + Number(scost * count),
      } as Record<string, unknown>;

      await fastify.db.query(`UPDATE dashboard SET ${makeUpdateSet(dashboardData)} WHERE code='${code}';`);

      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.ROOT }));
    }
  });

  // 주식 매수
  fastify.post(URL.MYSTOCK.SELL, async (req, reply) => {
    console.log(`[API:CALL]`, { url: `${URL.MYSTOCK.ROOT}`, body: req.body });
    const { code, name } = req.body as Record<string, string>;

    try {
      const res = await fastify.db.query(`INSERT INTO keeps (code, name) VALUES ('${code}', '${name}');`);
      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.ROOT }));
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
