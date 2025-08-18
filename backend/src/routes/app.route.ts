import { SqlError } from "mariadb/*";
import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { withError } from "../lib/error.js";
import { makeInsertSet, makeUpdateSet } from "../lib/db.util.js";
import { FieldValues } from "../types/data.type.js";
import { AppConfigDataType } from "../types/data.type.js";
import { ERROR } from "../types/enum.js";

const appRoute = (fastify: FastifyInstance) => {
  // 앱 설정 목록 조회
  fastify.get(URL.APP.CONFIG, async (_req, reply) => {
    try {
      const value = await fastify.db.query(`SELECT rowid, sgroup, skey, svalue FROM app;`);
      
      return {
        value: value,
      };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.APP.CONFIG }));
    }
  });

  // 앱 설정 항목 추가
  fastify.post(URL.APP.CONFIG, async (req, reply) => {
    try {
      const { sgroup, skey } = req.body as AppConfigDataType;

      const row = await fastify.db.query(`SELECT rowid, sgroup, skey, svalue FROM app where sgroup = '${sgroup}' and skey = '${skey}';`);

      // 항목이 있으면 업데이트
      if (row?.[0]?.rowid) {
        console.log(`UPDATE app SET ${makeUpdateSet(req.body as FieldValues)} WHERE rowid ='${row[0].rowid}';`);
        await fastify.db.query(`UPDATE app SET ${makeUpdateSet(req.body as FieldValues)} WHERE rowid ='${row[0].rowid}';`);
      } else {
        await fastify.db.query(`INSERT INTO app ${makeInsertSet(req.body as FieldValues)}`);
      }

      reply.status(200).send({ value: skey });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.APP.CONFIG }));
    }
  });

  // 앱 설정 항목 삭제
  fastify.delete(URL.APP.CONFIG, async (req, reply) => {
    try {
      const { rowid } = req.query as AppConfigDataType;

      await fastify.db.query(`DELETE FROM app WHERE rowid=${rowid};`);
      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.APP.CONFIG }));
    }
  });

  // 앱 설정 항목 수정
  fastify.put(URL.APP.CONFIG, async (req, reply) => {
    try {
      const { rowid } = req.body as AppConfigDataType;

      if (!rowid)
        return reply
          .status(500)
          .send(
            withError({ code: ERROR.ER_NOT_ROWID, sqlMessage: "is not rowid!" } as SqlError, { tag: URL.APP.CONFIG })
          );

      await fastify.db.query(`UPDATE app SET ${makeUpdateSet(req.body as FieldValues)} WHERE rowid ='${rowid}';`);
      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.APP.CONFIG }));
    }
  });
};

export default appRoute;
