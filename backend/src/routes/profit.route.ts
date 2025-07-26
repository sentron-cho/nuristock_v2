import { SqlError } from "mariadb/*";
import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { withError } from "../lib/error.js";
import { makeInsertSet, makeUpdateSet } from "../lib/db.util.js";
import { MyStockKeepCreateType, MyStockSellCreateType } from "../types/mystock.type.js";
import dayjs from "dayjs";
import { ProfitSearchParams } from "../types/profit.type.js";

const profitRoute = (fastify: FastifyInstance) => {
  // 년도별 손익 목록 조회
  fastify.get(URL.PROFIT.ROOT, async (req, reply) => {
    try {
      console.log("[CALL]", req.query);

      const { year = dayjs().format("YYYY") } = req.query as ProfitSearchParams;

      const sells = await fastify.db.query(
        `SELECT m.name as name, k.* FROM sells k JOIN dashboard m ON k.code = m.code WHERE YEAR(k.edate) = ${year}`
      );

      return { value: sells };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.ROOT }));
    }
  });

  // 년도별 손익 합계 조회
  fastify.get(URL.PROFIT.YEARS, async (req, reply) => {
    try {
      const years = await fastify.db.query(
        `SELECT YEAR(k.edate) as year, SUM((k.ecost - k.scost) * k.count) as sum FROM sells k GROUP BY YEAR(k.edate);`
      );
      return { value: years };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.ROOT }));
    }
  });
};

export default profitRoute;
