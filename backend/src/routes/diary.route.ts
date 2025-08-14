import { SqlError } from "mariadb/*";
import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { withError } from "../lib/error.js";
import { DiarySearchParams } from "../types/data.type.js";

const diaryRoute = (fastify: FastifyInstance) => {
  // 년도별 손익 목록 조회
  fastify.get(URL.DIARY.ROOT, async (req, reply) => {
    try {
      console.log("[CALL]", req.query);

      const { year, month } = req.query as DiarySearchParams;

      // 매도 리스트
      let where = year ? `WHERE YEAR(k.edate) = ${year}` : "";
      where = month ? `WHERE MONTH(k.edate) = ${month}` : "";

      const trade = await fastify.db.query(
        `SELECT m.name as name, k.* FROM sells k JOIN dashboard m ON k.code = m.code ${where}`
      );

      // 매수 리스트
      where = year ? `WHERE YEAR(k.sdate) = ${year}` : "";
      where = month ? `WHERE MONTH(k.sdate) = ${month}` : "";

      const keep = await fastify.db.query(
        `SELECT m.name as name, k.* FROM keeps k JOIN dashboard m ON k.code = m.code ${where}`
      );

      return { trade: trade, keep: keep };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.ROOT }));
    }
  });
};

export default diaryRoute;
