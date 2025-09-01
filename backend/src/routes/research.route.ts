import { SqlError } from "mariadb/*";
import { withError } from "../lib/error.js";
import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { FieldValues, ResearchDataType, ResearchSearchParams } from "../types/data.type.js";
import { ERROR } from "../types/enum.js";
import { makeUpdateSet } from "../lib/db.util.js";
import { getNaverReport } from "../crawler/service/naverScraper.service.js";

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

  // 가치투자 종목 항목 수정
  fastify.put(URL.RESEARCH.ROOT, async (req, reply) => {
    try {
      const item = req.body as ResearchDataType;
      const { rowid, code, cdate, stype, sise } = item;

      if (!rowid)
        return reply
          .status(500)
          .send(
            withError({ code: ERROR.ER_NOT_ROWID, sqlMessage: "is not rowid!" } as SqlError, { tag: URL.INVEST.ROOT })
          );

      const res = await fastify.db.query(`SELECT mtime FROM market WHERE code='${code}';`);
      const mtime = res?.[0].mtime;
      if (Number(mtime) === 0 || Number(mtime) >= 9000 || Number(mtime) < (Number(cdate) || 0)) {
        await fastify.db.query(
          `UPDATE market SET mtime='${cdate}', type='${stype?.toUpperCase()}', sise='${sise}', state='open' WHERE code ='${code}';`
        );
      }

      const params = {
        scount: item?.scount,
        roe: item?.roe,
        equity: item?.equity,
        eps: item?.eps,
        profit: item?.profit,
        debt: item?.debt,
        debtratio: item?.debtratio,
      };

      const query = `UPDATE marketinfo SET ${makeUpdateSet({
        ...(params || {}),
      } as FieldValues)} WHERE rowid ='${rowid}';`;
      await fastify.db.query(query);
      // console.log("[PUT:RESEARCH]", query);

      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.RESEARCH.ROOT }));
    }
  });

  // 투자조사 종목 항목 삭제
  fastify.delete(URL.RESEARCH.ROOT, async (req, reply) => {
    try {
      const { rowid, code } = req.query as ResearchDataType;

      // console.log("[DELETE:RESEARCH]", rowid, code);

      if (code) {
        // update market set type='CLOSE', state='close', mtime='9999', sise=null, updown=null, erate=0, ecost=0, stime=null WHERE code = 'A023460';
        // delete from marketinfo WHERE code = 'A023460';
        await fastify.db.query(`DELETE FROM marketinfo WHERE code='${code}';`);
        await fastify.db.query(
          `update market set type='CLOSE', state='close', mtime='9999', sise=null, updown=null, erate=0, ecost=0, stime=null WHERE code = '${code}';`
        );
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

  // 종목 전체 목록 조회
  fastify.get(URL.RESEARCH.NAVER, async (req, reply) => {
    try {
      const { code } = req.query as ResearchSearchParams;

      const value = await getNaverReport(code || "");
      // console.log("[GET:RESEARCH.SISE]", { code, value });
      return { value: value };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.RESEARCH.ROOT }));
    }
  });
};

export default researchRoute;
