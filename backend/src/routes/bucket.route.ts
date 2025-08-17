import { SqlError } from "mariadb/*";
import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { withError } from "../lib/error.js";
import { BucketSearchParams } from "../types/data.type.js";
import { selectDepositByPerYear, selectLatestDeposit } from "./deposit.route.js";

const bucketRoute = (fastify: FastifyInstance) => {
  // 년도별 손익 목록 조회
  fastify.get(URL.BUCKET.ROOT, async (req, reply) => {
    try {
      const { page } = req.query as BucketSearchParams;

      // 연도별 투자금액
      const asset = await selectDepositByPerYear(fastify);
      
      // 현재 기준 예수금
      const deposit = await selectLatestDeposit(fastify);

      return { asset, deposit };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.BUCKET.ROOT }));
    }
  });
};

export default bucketRoute;
