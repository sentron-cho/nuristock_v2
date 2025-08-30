import { SqlError } from "mariadb/*";
import { withError } from "../lib/error.js";
import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { StatisticDataType } from "../types/data.type.js";
import dayjs from "../lib/dayjs.js";

const statisticRoute = (fastify: FastifyInstance) => {
  // 종목 전체 목록 조회
  fastify.get(URL.STATISTIC.ROOT, async (_req, reply) => {
    try {
      // const { type } = req.query as ResearchSearchParams;

      const array = [] as StatisticDataType[];

      // 전체 종목 수
      let query = `select count(1) as count, 'market_all' as code from market;`;
      let value = await fastify.db.query(query);
      array.push(value?.[0]);

      // 코스피 종목 수
      query = `select count(1) as count, 'market_kospi' as code from market where type='KOSPI';`;
      value = await fastify.db.query(query);
      array.push(value?.[0]);

      // 코스닥 종목 수
      query = `select count(1) as count, 'market_kosdaq' as code from market where type='KOSDAQ';`;
      value = await fastify.db.query(query);
      array.push(value?.[0]);

      // 코스피 또는 코스닥이 아닌 종목 수
      query = `select count(1) as count, 'market_etc' as code from market where type not in ('KOSPI', 'KOSDAQ');`;
      value = await fastify.db.query(query);
      array.push(value?.[0]);

      // 종목 정보 수집 성공
      query = `select count(1) as count, 'market_success' as code from market where mtime = '2024';`;
      value = await fastify.db.query(query);
      array.push(...value);

      // 종목 정보 수집 실패
      query = `select count(1) as count, 'market_failure' as code from market where mtime = '9999';`;
      value = await fastify.db.query(query);
      array.push(...value);

      // 종목 정보 수집 오류
      query = `select count(1) as count, 'market_error' as code from market where mtime = '0000';`;
      value = await fastify.db.query(query);
      array.push(...value);

      // 종목 정보 수집 실행전
      query = `select count(1) as count, 'market_rest' as code from market where mtime = '';`;
      value = await fastify.db.query(query);
      array.push(...value);

      // 일주일 이내 수집된 정보
      const date = dayjs().tz("Asia/Seoul").subtract(7, "day").format("YYYYMMDD");
      query = `select count(1) as count, 'research_sise_success' as code from market where SUBSTR(stime, 1, 8) >= '${date}';`;
      value = await fastify.db.query(query);
      array.push(value?.[0]);
      console.log(query);

      // 일주일 이내 수집되지 않음 정보
      query = `select count(1) as count, 'research_sise_failure' as code from market where SUBSTR(stime, 1, 8) < '${date}';`;
      value = await fastify.db.query(query);
      array.push(value?.[0]);

      // 보유 또는 거래 종목 수
      query = `select count(1) as count, 'my_keeps' as code from dashboard where kcount > 0 or ecount > 0;`;
      value = await fastify.db.query(query);
      array.push(value?.[0]);

      return { value: array };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.STATISTIC.ROOT }));
    }
  });
};

export default statisticRoute;
