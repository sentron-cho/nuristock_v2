import { SqlError } from "mariadb/*";
import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { withError } from "../lib/error.js";

const mystockRoute = (fastify: FastifyInstance) => {
  // 보유종목 목록 조회
  fastify.get(URL.MYSTOCK.ROOT, async (req, reply) => {
    console.log(`[API:CALL]`, { url: `${URL.MYSTOCK.ROOT}` });
    const { code } = req.query as { code?: string };

    try {
      const mystocks = await fastify.db.query(`SELECT * FROM dashboard`);
      const stock = await fastify.db.query(`SELECT stockid, name FROM dashboard WHERE code='${code}'`);
      // console.log("[DB Select]", { stock, mystocks: mystocks?.length });

      const { stockid } = stock?.[0];
      const keeps = await fastify.db.query(`SELECT * FROM keeps WHERE stockid='${stockid}'`);
      const sells = await fastify.db.query(`SELECT * FROM sells WHERE stockid='${stockid}'`);

      console.log("[DB Select]", { keeps: keeps?.length, sells: sells?.length });

      return {
        code: 200,
        value: {
          ...(stock?.[0] || {}),
        },
        keeps: keeps,
        sells: sells,
        stocks: mystocks,
      };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.ROOT }));
    }
  });

  // 보유종목 시세 조회
  fastify.get(URL.MYSTOCK.SISE, async (req, reply) => {
    console.log(`[API:CALL]`, { url: `${URL.MYSTOCK.SISE}`, req: req.headers });
    const { code } = req.query as { code?: string };

    try {
      const sise = await fastify.db.query(
        `SELECT code, stime as time, sise, updown  FROM market WHERE code='${code}';`
      );
      console.log("[DB:SELECT]", { sise });

      return {
        code: 200,
        value: {
          ...(sise?.[0] || {}),
        },
      };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.ROOT }));
    }
  });

  // 보유종목 추가
  fastify.post(URL.MYSTOCK.ROOT, async (req, reply) => {
    console.log(`[API:CALL]`, { url: `${URL.MYSTOCK.ROOT}`, body: req.body });
    const { code, name } = req.body as Record<string, string>;
    console.log({ code, name });

    try {
      const res = await fastify.db.query(`INSERT INTO dashboard (code, name) VALUES ('${code}', '${name}');`);
      console.log("[DB:INSERT]", { res });

      reply.status(200).send({ value: 0 });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.ROOT }));
    }
  });

  // 보유종목 삭제
  fastify.delete(URL.MYSTOCK.ROOT, async (req, reply) => {
    console.log(`[API:CALL]`, { url: `${URL.MYSTOCK.ROOT}`, query: req.query });
    const { code, name } = req.query as Record<string, string>;
    console.log({ code, name });

    try {
      const res = await fastify.db.query(`DELETE FROM dashboard WHERE code='${code}';`);
      console.log("[DB:DELETE]", { res });

      reply.status(200).send({ value: 0 });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.ROOT }));
    }
  });

  // 보유종목 수정
  fastify.put(URL.MYSTOCK.ROOT, async (req, reply) => {
    console.log(`[API:CALL]`, { url: `${URL.MYSTOCK.ROOT}`, query: req.body });
    const { code, name } = req.body as Record<string, string>;
    console.log({ code, name });

    try {
      const res = await fastify.db.query(`UPDATE dashboard SET name = '${name}' WHERE code = '${code}';`);
      console.log("[DB:UPDATE]", { res });

      reply.status(200).send({ value: 0 });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.ROOT }));
    }
  });
};

export default mystockRoute;
