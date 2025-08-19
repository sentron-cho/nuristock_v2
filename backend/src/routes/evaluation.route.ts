import { SqlError } from "mariadb/*";
import { FastifyInstance } from "fastify";
import { withError } from "../lib/error.js";
import { makeInsertSet, makeUpdateSet } from "../lib/db.util.js";
import { EvaluationCreateType, FieldValues } from "../types/data.type.js";
import URL from "../types/url.js";
import { ERROR } from "../types/enum.js";

const evaluationRoute = (fastify: FastifyInstance) => {
  // 평가금액 목록 조회
  fastify.get(URL.EVALUATION.ROOT, async (_req, reply) => {
    try {
      const value = await fastify.db.query(`SELECT * FROM evaluation;`);

      return {
        value: value,
      };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.EVALUATION.ROOT }));
    }
  });

  // 평가금액 항목 추가
  fastify.post(URL.EVALUATION.ROOT, async (req, reply) => {
    try {
      const { rowid } = req.body as EvaluationCreateType;
      await fastify.db.query(`INSERT INTO evaluation ${makeInsertSet(req.body as FieldValues)}`);
      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.EVALUATION.ROOT }));
    }
  });

  // 평가금액 항목 삭제
  fastify.delete(URL.EVALUATION.ROOT, async (req, reply) => {
    try {
      const { rowid } = req.query as EvaluationCreateType;

      await fastify.db.query(`DELETE FROM evaluation WHERE rowid=${rowid};`);
      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.EVALUATION.ROOT }));
    }
  });

  // 평가금액 항목 수정
  fastify.put(URL.EVALUATION.ROOT, async (req, reply) => {
    try {
      const { rowid } = req.body as EvaluationCreateType;

      if (!rowid)
        return reply
          .status(500)
          .send(withError({ code: ERROR.ER_NOT_ROWID, sqlMessage: "is not rowid!" } as SqlError, { tag: URL.ASSET.ROOT }));

      await fastify.db.query(`UPDATE evaluation SET ${makeUpdateSet(req.body as FieldValues)} WHERE rowid ='${rowid}';`);
      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.EVALUATION.ROOT }));
    }
  });
};

export default evaluationRoute;
