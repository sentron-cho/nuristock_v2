import URL from "../types/url.js";
import { FastifyInstance } from "fastify";

const marketRoute = (fastify: FastifyInstance) => {
  fastify.get(URL.MARKET.ROOT, async (req, reply) => {
    console.log(`[API:CALL]`, { url: `${URL.MYSTOCK.ROOT}`, query: req.query });
    // const { code } = req.query as { code?: string };

    try {
      const list = await fastify.db.query(`SELECT code, name, type, state FROM market`);
      console.log("[DB Select]", { keeps: list?.length });

      return {
        code: 200,
        value: list,
      };
    } catch (error) {
      console.error(`[ERROR:${URL.MARKET.ROOT}]`, error);
      reply.status(500).send({ code: 500, message: "DB 조회 실패" });
    }
  });
};

export default marketRoute;
