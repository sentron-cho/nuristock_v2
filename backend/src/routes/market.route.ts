import { SqlError } from "mariadb/*";
import { withError } from "../lib/error.js";
import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { MarketSelectDataType, MarketSiseUpdateDataType } from "../types/market.type.js";
import { makeUpdateSet } from "../lib/db.util.js";

const marketRoute = (fastify: FastifyInstance) => {
  // 종목 전체 목록 조회
  fastify.get(URL.MARKET.ROOT, async (req, reply) => {
    console.log(`[API:CALL]`, { url: `${URL.MYSTOCK.ROOT}`, query: req.query });

    try {
      const list = await fastify.db.query(`SELECT code, name, type, state FROM market`);
      console.log("[DB Select]", { keeps: list?.length });

      return {
        code: 200,
        value: list as MarketSelectDataType[],
      };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MARKET.ROOT }));
    }
  });

  // 종목 시세 수정
  fastify.put(URL.MARKET.SISE, async (req, reply) => {
    console.log(`[API:CALL]`, { url: `${URL.MARKET.SISE}`, query: req.body });
    const { code } = req.body as MarketSiseUpdateDataType;

    try {
      await fastify.db.query(
        `UPDATE market SET ${makeUpdateSet(req.body as Record<string, unknown>)} WHERE code = '${code}';`
      );
      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MARKET.SISE }));
    }
  });
};

export default marketRoute;
