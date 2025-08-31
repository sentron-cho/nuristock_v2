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

  // 투자조사 종목 항목 삭제
  fastify.delete(URL.RESEARCH.ROOT, async (req, reply) => {
    try {
      const { rowid, code } = req.query as ResearchDataType;

      console.log("[DELETE:RESEARCH]", rowid, code);

      if (code) {
        // update market set type='CLOSE', state='close', mtime='9999', sise=null, updown=null, erate=0, ecost=0, stime=null WHERE code = 'A023460';
        // delete from marketinfo WHERE code = 'A023460';
        await fastify.db.query(`DELETE FROM marketinfo WHERE code='${code}';`);
        await fastify.db.query(`update market set type='CLOSE', state='close', mtime='9999', sise=null, updown=null, erate=0, ecost=0, stime=null WHERE code = '${code}';`);
      } else if (rowid) {
        await fastify.db.query(`DELETE FROM marketinfo WHERE rowid=${rowid};`);
      }

      reply.status(200).send({ value: code || rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.INVEST.ROOT }));
    }
  });

  // 가치투자 종목 목록 조회
  fastify.get(URL.RESEARCH.DETAIL, async (req, reply) => {
    try {
      const { code } = req.query as ResearchSearchParams;
      let query =
        `select m.code, m.name, m.type, m.sise, m.erate, m.ecost, m.state, m.stime, m.mtime,  m.updown, ` +
        `k.rowid, k.cdate, k.scount, k.eps, k.roe, k.debt, k.debtratio, k.profit, k.equity, k.per, ` +
        `k.dividend, k.cprice, k.fprice, k.tprice from market m JOIN marketinfo k ` +
        `where m.code = k.code and k.code = '${code}';`;

      const list = await fastify.db.query(query);
      return { value: list as ResearchDataType[] };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.RESEARCH.DETAIL }));
    }
  });
};

export default researchRoute;
