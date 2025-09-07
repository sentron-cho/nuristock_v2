import { SqlError } from "mariadb/*";
import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { withError } from "../lib/error.js";
import { BucketCreateType, BucketSearchParams, FieldValues } from "../types/data.type.js";
import { selectDepositByPerYear, selectLatestDeposit } from "./deposit.route.js";
import { makeInsertSet, makeUpdateSet } from "../lib/db.util.js";
import { ERROR } from "../types/enum.js";

const bucketRoute = (fastify: FastifyInstance) => {
  // 년도별 손익 목록 조회
  fastify.get(URL.BUCKET.ROOT, async (req, reply) => {
    try {
      // const { page } = req.query as BucketSearchParams;

      const value = await fastify.db.query(`SELECT * from app WHERE sgroup = 'bucket'`);

      // 연도별 투자금액
      const asset = await selectDepositByPerYear(fastify);

      // 현재 기준 예수금
      const deposit = await selectLatestDeposit(fastify);

      return { value, asset, deposit };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.BUCKET.ROOT }));
    }
  });

  // 버킷 항목 추가
  fastify.post(URL.BUCKET.ROOT, async (req, reply) => {
    try {
      const data = req.body as BucketCreateType;

      console.log(req.body);

      if (!data?.page)
        return reply
          .status(500)
          .send(
            withError({ code: ERROR.ER_NOT_ROWID, sqlMessage: "is not page!" } as SqlError, { tag: URL.BUCKET.ROOT })
          );

      const params = {
        sgroup: "bucket",
        skey: `bucket_${data.page}`,
        svalue: `${JSON.stringify(data)}`,
      };

      await fastify.db.query(`INSERT INTO app ${makeInsertSet(params as FieldValues)}`);

      reply.status(200).send({ value: data.rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.BUCKET.ROOT }));
    }
  });

  // 버킷 항목 삭제
  fastify.delete(URL.BUCKET.ROOT, async (req, reply) => {
    try {
      const { rowid } = req.query as BucketCreateType;

      if (!rowid)
        return reply
          .status(500)
          .send(
            withError({ code: ERROR.ER_NOT_ROWID, sqlMessage: "is not rowid!" } as SqlError, { tag: URL.BUCKET.ROOT })
          );

      console.log(`DELETE FROM app WHERE rowid=${rowid};`)
      
      await fastify.db.query(`DELETE FROM app WHERE rowid=${rowid};`);
      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.BUCKET.ROOT }));
    }
  });

  // 버킷 항목 수정
  fastify.put(URL.BUCKET.ROOT, async (req, reply) => {
    try {
      const data = req.body as BucketCreateType;

      if (!data?.rowid)
        return reply
          .status(500)
          .send(
            withError({ code: ERROR.ER_NOT_ROWID, sqlMessage: "is not rowid!" } as SqlError, { tag: URL.BUCKET.ROOT })
          );

      const params = {
        sgroup: "bucket",
        skey: `bucket_${data.rowid}`,
        svalue: `${JSON.stringify(data)}`,
      };

      await fastify.db.query(`UPDATE app SET ${makeUpdateSet(params as FieldValues)} WHERE rowid ='${data?.rowid}';`);
      reply.status(200).send({ value: data?.rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.BUCKET.ROOT }));
    }
  });
};

export default bucketRoute;
