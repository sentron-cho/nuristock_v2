import { SqlError } from "mariadb/*";
import { FastifyInstance } from "fastify";
import { withError } from "../lib/error.js";
import { makeInsertSet, makeUpdateSet } from "../lib/db.util.js";
import { FieldValues } from "../types/common.type.js";
import { AssetCreateType } from './../types/data.type.js';
import URL from "../types/url.js";

const assetRoute = (fastify: FastifyInstance) => {
  // 투자자산 목록 조회
  fastify.get(URL.ASSET.ROOT, async (_req, reply) => {
    try {
      const value = await fastify.db.query(`SELECT * FROM asset;`);

      return {
        value: value,
      };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.ASSET.ROOT }));
    }
  });

  // 투자자산 항목 추가
  fastify.post(URL.ASSET.ROOT, async (req, reply) => {
    try {
      const { rowid } = req.body as AssetCreateType;
      await fastify.db.query(`INSERT INTO asset ${makeInsertSet(req.body as FieldValues)}`);
      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.ASSET.ROOT }));
    }
  });

  // 투자자산 항목 삭제
  fastify.delete(URL.ASSET.ROOT, async (req, reply) => {
    try {
      const { rowid } = req.query as AssetCreateType;

      await fastify.db.query(`DELETE FROM asset WHERE rowid=${rowid};`);
      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.ASSET.ROOT }));
    }
  });

  // 투자자산 항목 수정
  fastify.put(URL.ASSET.ROOT, async (req, reply) => {
    try {
      const { rowid } = req.body as AssetCreateType;

      if (!rowid)
        return reply
          .status(500)
          .send(withError({ code: "ER_NOT_ROWID", sqlMessage: "is not rowid!" } as SqlError, { tag: URL.ASSET.ROOT }));

      await fastify.db.query(`UPDATE asset SET ${makeUpdateSet(req.body as FieldValues)} WHERE rowid ='${rowid}';`);
      reply.status(200).send({ value: rowid });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.ASSET.ROOT }));
    }
  });
};

export default assetRoute;
