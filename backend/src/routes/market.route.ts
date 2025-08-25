import { SqlError } from "mariadb/*";
import { withError } from "../lib/error.js";
import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { MarketSelectDataType, MarketSiseUpdateDataType, FieldValues, StockDartBasicType } from "../types/data.type.js";
import { makeInsertSet, makeUpdateSet } from "../lib/db.util.js";
import { getMystockInfo } from "../crawler/service/mystockInfoScraper.service.js";

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
      await fastify.db.query(`UPDATE market SET ${makeUpdateSet(req.body as FieldValues)} WHERE code = '${code}';`);
      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MARKET.SISE }));
    }
  });

  // 종목 전체 목록 조회
  fastify.get(URL.MARKET.SEARCH, async (req, reply) => {
    try {
      const { all = false } = req.query as MarketSiseUpdateDataType;
      let query = `SELECT code, name, type, state, mtime FROM market ORDER BY name ASC;`;
      if (!all) {
        query += ` WHERE state != 'close'`;
      }
      const list = await fastify.db.query(query);
      return { value: list as MarketSelectDataType[] };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MARKET.ROOT }));
    }
  });

  // 종목 정보 업데이트
  fastify.put(URL.MARKET.SEARCH, async (req, reply) => {
    try {
      const { code } = req.body as MarketSiseUpdateDataType;

      const stock = await fastify.db.query(`SELECT code, name FROM market WHERE code='${code}';`);
      const res = await getMystockInfo({ code6: code?.replace("A", ""), from: 2020, to: 2024 });

      const { value } = res as { value: StockDartBasicType[] };

      for (const row of value) {
        const params = {
          code: code,
          name: stock?.[0]?.name || "",
          cdate: row?.year, // 대상년도
          profit: row?.netIncome, // 당기순이익
          scount: row?.shares, // 발행주식수
          equity: row?.equity, // 자본(지배주주)
          debt: row?.debt, // 부채
          eps: row?.eps, // EPS
          roe: row?.roe, // ROE
          debtratio: row?.debtRatio, // 부채비율
        };

        const count = await fastify.db.query(
          `SELECT count(1) as count FROM marketinfo WHERE code='${code}' AND cdate='${params?.cdate}';`
        );

        if (!Number(count?.[0]?.count || 0)) {
          await fastify.db.query(`INSERT INTO marketinfo ${makeInsertSet(params as FieldValues)};`);
        }

        // console.log({ query: `INSERT INTO marketinfo ${makeInsertSet(params as FieldValues)};` });
      }

      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MARKET.SISE }));
    }
  });
};

export default marketRoute;
