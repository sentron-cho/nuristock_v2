import { SqlError } from "mariadb/*";
import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { withError } from "../lib/error.js";
import { ProfitSearchParams } from "../types/data.type.js";
import { selectLatestAsset } from "./asset.route.js";
import { selectDepositByPerYear, selectLatestDeposit } from "./deposit.route.js";

const profitRoute = (fastify: FastifyInstance) => {
  // 년도별 손익 목록 조회
  fastify.get(URL.PROFIT.ROOT, async (req, reply) => {
    try {
      const { year } = req.query as ProfitSearchParams;

      const where = year ? `WHERE YEAR(k.edate) = ${year}` : "";

      // 거래(매수/매도) 손익
      const sells = await fastify.db.query(
        `SELECT m.name as name, k.* FROM sells k JOIN dashboard m ON k.code = m.code ${where}`
      );

      // 배당금
      const dividend = await fastify.db.query(
        `SELECT k.rowid, k.code, k.cost, k.count, k.sdate, k.price, m.name as name FROM divid k JOIN dashboard m ON k.code = m.code;`
      );

      // 연도별 투자금액
      const asset = await selectDepositByPerYear(fastify);
      
      // 현재 기준 예수금
      const deposit = await selectLatestDeposit(fastify);

      return { value: sells, dividend, asset, deposit };
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
