import { SqlError } from "mariadb/*";
import { FastifyInstance } from "fastify";
import { withError } from "../lib/error.js";
import { makeInsertSet, makeUpdateSet } from "../lib/db.util.js";
import { FieldValues } from "../types/data.type.js";
import { DepositCreateType } from "../types/data.type.js";
import URL from "../types/url.js";
import dayjs from "dayjs";

export const createDepositData = async (
  fastify: FastifyInstance,
  data: DepositCreateType
): Promise<DepositCreateType | undefined> => {
  try {
    // 현재 최종 예수금 가져오기...
    let value: DepositCreateType[];

    const lastDeposit = await fastify.db.query("SELECT * FROM deposit ORDER BY rowid desc limit 1;");
    if (lastDeposit?.length > 0) {
      const params = {
        ...data,
        sdate: dayjs().format('YYYYMMDDHHmmss'),
        price: Number(lastDeposit[0]?.price) + Number(data?.price),
      };
      value = await fastify.db.query(`INSERT INTO deposit ${makeInsertSet(params as unknown as FieldValues)}`);
    } else {
      value = await fastify.db.query(`INSERT INTO deposit ${makeInsertSet(data as unknown as FieldValues)}`);
    }

    return data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const depositRoute = (fastify: FastifyInstance) => {
  // 예수금 목록 조회
  fastify.get(URL.DEPOSIT.ROOT, async (_req, reply) => {
    try {
      const value = await fastify.db.query(`SELECT * FROM deposit;`);

      return {
        value: value,
      };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.DEPOSIT.ROOT }));
    }
  });

  // 예수금 항목 추가
  fastify.post(URL.DEPOSIT.ROOT, async (req, reply) => {
    try {
      const { rowid } = req.body as DepositCreateType;
      await fastify.db.query(`INSERT INTO deposit ${makeInsertSet(req.body as FieldValues)}`);
      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.DEPOSIT.ROOT }));
    }
  });

  // 예수금 항목 삭제
  fastify.delete(URL.DEPOSIT.ROOT, async (req, reply) => {
    try {
      const { rowid } = req.query as DepositCreateType;

      await fastify.db.query(`DELETE FROM deposit WHERE rowid=${rowid};`);
      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.DEPOSIT.ROOT }));
    }
  });

  // 예수금 항목 수정
  fastify.put(URL.DEPOSIT.ROOT, async (req, reply) => {
    try {
      const { rowid } = req.body as DepositCreateType;

      if (!rowid)
        return reply
          .status(500)
          .send(
            withError({ code: "ER_NOT_ROWID", sqlMessage: "is not rowid!" } as SqlError, { tag: URL.DEPOSIT.ROOT })
          );

      await fastify.db.query(`UPDATE deposit SET ${makeUpdateSet(req.body as FieldValues)} WHERE rowid ='${rowid}';`);
      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.DEPOSIT.ROOT }));
    }
  });
};

export default depositRoute;
