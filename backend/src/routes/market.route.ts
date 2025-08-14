import { SqlError } from "mariadb/*";
import { withError } from "../lib/error.js";
import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { MarketSelectDataType, MarketSiseUpdateDataType } from "../types/data.type.js";
import { makeUpdateSet } from "../lib/db.util.js";
import { FieldValues } from "../types/common.type.js";

const marketRoute = (fastify: FastifyInstance) => {
  // 종목 전체 목록 조회
  fastify.get(URL.MARKET.ROOT, async (req, reply) => {
    try {
      const { all = false } = req.query as MarketSiseUpdateDataType;
      let query = `SELECT code, name, type, state, sise, updown, erate, ecost, stime FROM market`;
      if (!all) {
        query += ` WHERE state != 'close'`;
      }
      const list = await fastify.db.query(query);
      return { value: list as MarketSelectDataType[] };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MARKET.ROOT }));
    }
  });

  // 종목 시세 수정
  fastify.put(URL.MARKET.SISE, async (req, reply) => {
    try {
      const { code } = req.body as MarketSiseUpdateDataType;
      await fastify.db.query(
        `UPDATE market SET ${makeUpdateSet(req.body as FieldValues)} WHERE code = '${code}';`
      );
      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MARKET.SISE }));
    }
  });
};

export default marketRoute;
