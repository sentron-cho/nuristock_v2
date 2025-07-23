import URL from "../types/url.js";
import { FastifyInstance } from "fastify";

const mystockRoute = (fastify: FastifyInstance) => {
  fastify.get(URL.MYSTOCK.ROOT, async (req, reply) => {
    console.log(`[API:CALL]`, { url: `${URL.MYSTOCK.ROOT}`, query: req.query });
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
      console.error(`[ERROR:${URL.MYSTOCK.ROOT}]`, error);
      reply.status(500).send({ code: 500, message: "DB 조회 실패" });
    }
  });

  fastify.get(URL.MYSTOCK.SISE, async (req, reply) => {
    console.log(`[API:CALL]`, { url: `${URL.MYSTOCK.SISE}`, query: req.query, req: req.hostname });
    const { code } = req.query as { code?: string };

    try {
      const sise = await fastify.db.query(`SELECT code, stime as time, sise, updown  FROM market WHERE code='${code}'`);
      console.log("[DB Select]", { sise });

      return {
        code: 200,
        value: {
          ...(sise?.[0] || {}),
        },
      };
    } catch (error) {
      console.error("[ERROR]", error);
      reply.status(500).send({ code: 500, message: "DB 조회 실패" });
    }
  });

  fastify.post(URL.MYSTOCK.ROOT, async (req, reply) => {
    console.log(`[API:CALL]`, { url: `${URL.MYSTOCK.ROOT}`, query: req.query });
    const { code, name } = req.body as Record<string, string>;
    console.log({ code, name });

    try {
      const res = await fastify.db.query(`INSERT into dashboard (code, name) values ('${code}', '${name}')`);
      console.log("[DB Select]", { res });

      reply.status(200).send({ value: 0 });
    } catch (error) {
      console.error(`[ERROR:${URL.MYSTOCK.ROOT}]`, error);
      reply.status(500).send({ code: 500, message: "저장 실패!" });
    }
  });
};

export default mystockRoute;
