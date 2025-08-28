import { SqlError } from "mariadb/*";
import { withError } from "../lib/error.js";
import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { ResearchDataType, ResearchSearchParams } from "../types/data.type.js";

const researchRoute = (fastify: FastifyInstance) => {
  // 종목 전체 목록 조회
  fastify.get(URL.RESEARCH.ROOT, async (req, reply) => {
    try {
      const { year } = req.query as ResearchSearchParams;
      let query =
        `select m.code, m.name, m.type, m.sise, m.erate, m.ecost, m.state, m.stime, m.mtime,  m.updown, ` +
        `k.cdate, k.scount, k.eps, k.roe, k.debt, k.debtratio, k.profit, k.equity, k.per, ` +
        `k.dividend, k.cprice, k.fprice, k.tprice from market m JOIN marketinfo k ` +
        `where m.code = k.code and k.cdate = '${year}';`;

      const list = await fastify.db.query(query);
      return { value: list as ResearchDataType[] };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.RESEARCH.ROOT }));
    }
  });
};

export default researchRoute;
