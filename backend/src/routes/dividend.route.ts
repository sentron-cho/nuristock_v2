import { SqlError } from "mariadb/*";
import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { withError } from "../lib/error.js";
import { makeInsertSet, makeUpdateSet } from "../lib/db.util.js";
import { DepositCreateType, DividendCreateType, FieldValues } from "../types/data.type.js";
import { createDepositData } from "./deposit.route.js";
import { DEPOSIT_TYPE, ERROR } from "../types/enum.js";

const dividendRoute = (fastify: FastifyInstance) => {
  // 배당 목록 조회
  fastify.get(URL.DIVIDEND.ROOT, async (_req, reply) => {
    try {
      const stock = await fastify.db.query(`SELECT code, name, kcount FROM dashboard order by kcount desc;`);
      const value = await fastify.db.query(
        `SELECT k.rowid, k.code, k.cost, k.count, k.sdate, k.price, m.name as name FROM divid k JOIN dashboard m ON k.code = m.code;`
      );

      return {
        value: value,
        stock: stock,
      };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.DIVIDEND.ROOT }));
    }
  });

  // 배당 항목 추가
  fastify.post(URL.DIVIDEND.ROOT, async (req, reply) => {
    try {
      const { code, price } = req.body as DividendCreateType;
      await fastify.db.query(`INSERT INTO divid ${makeInsertSet(req.body as FieldValues)}`);

      // 매도금 예수금에 반영(가감)
      await createDepositData(fastify, {
        stype: DEPOSIT_TYPE.DIVIDEND,
        price: Number(price),
      } as DepositCreateType);

      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.DIVIDEND.ROOT }));
    }
  });

  // 배당 항목 삭제
  fastify.delete(URL.DIVIDEND.ROOT, async (req, reply) => {
    try {
      const { rowid } = req.query as DividendCreateType;

      await fastify.db.query(`DELETE FROM divid WHERE rowid=${rowid};`);
      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.DIVIDEND.ROOT }));
    }
  });

  // 배당 항목 수정
  fastify.put(URL.DIVIDEND.ROOT, async (req, reply) => {
    try {
      const { rowid } = req.body as DividendCreateType;

      if (!rowid)
        return reply
          .status(500)
          .send(
            withError({ code: ERROR.ER_NOT_ROWID, sqlMessage: "is not rowid!" } as SqlError, { tag: URL.DIVIDEND.ROOT })
          );

      await fastify.db.query(`UPDATE divid SET ${makeUpdateSet(req.body as FieldValues)} WHERE rowid ='${rowid}';`);
      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.DIVIDEND.ROOT }));
    }
  });
};

export default dividendRoute;
