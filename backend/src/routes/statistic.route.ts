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

      const year = dayjs().tz("Asia/Seoul").add(-1, "year").year();

      const array = [] as StatisticDataType[];

      // TODO : 거래소 통계
      array.push({ cagetory: "market", title: "market", code: "market", count: 0 });

      // 전체 종목 수
      let query = `select count(1) as count, 'market_all' as code, 'market' as cagetory from market;`;
      let value = await fastify.db.query(query);
      array.push(value?.[0]);

      // 코스피 종목 수
      query = `select count(1) as count, 'market_kospi' as code, 'market' as cagetory from market where type='KOSPI';`;
      value = await fastify.db.query(query);
      array.push(value?.[0]);

      // 코스닥 종목 수
      query = `select count(1) as count, 'market_kosdaq' as code, 'market' as cagetory from market where type='KOSDAQ';`;
      value = await fastify.db.query(query);
      array.push(value?.[0]);

      // 코스피 또는 코스닥이 아닌 종목 수
      query = `select count(1) as count, 'market_etc' as code, 'market' as cagetory from market where type not in ('KOSPI', 'KOSDAQ');`;
      value = await fastify.db.query(query);
      array.push(value?.[0]);

      // TODO : 종목 정보 수집 통계
      array.push({ cagetory: "marketinfo", title: "marketinfo", code: "marketinfo", count: 0 });

      // 종목 정보 수집 성공
      query = `select count(1) as count, 'marketinfo_success' as code, 'marketinfo' as cagetory from market where mtime = '${year}';`;
      value = await fastify.db.query(query);
      array.push(...value);

      // 종목 정보 수집 실패
      query = `select count(1) as count, 'marketinfo_failure' as code, 'marketinfo' as cagetory from market where mtime = '9999';`;
      value = await fastify.db.query(query);
      array.push(...value);

      // 종목 정보 수집 오류
      query = `select count(1) as count, 'marketinfo_warning' as code, 'marketinfo' as cagetory from market where mtime = '9000';`;
      value = await fastify.db.query(query);
      array.push(...value);

      // 종목 정보 수집 오류
      query = `select count(1) as count, 'marketinfo_9001' as code, 'marketinfo' as cagetory from market where mtime = '9001';`;
      value = await fastify.db.query(query);
      array.push(...value);

      // 종목 정보 수집 오류
      query = `select count(1) as count, 'marketinfo_error' as code, 'marketinfo' as cagetory from market where mtime = '0000';`;
      value = await fastify.db.query(query);
      array.push(...value);

      // 종목 정보 수집 실행전
      query = `select count(1) as count, 'marketinfo_rest' as code, 'marketinfo' as cagetory from market where mtime = '';`;
      value = await fastify.db.query(query);
      array.push(...value);

      // TODO : 종목 재무 데이터 통계(연도별)
      array.push({ cagetory: "marketdata_by_year", title: "marketdata_by_year", code: "marketdata_by_year", count: 0 });

      // 종목 정보 데이터 전체 수
      query = `select count(1) as count, 'marketdata_total_by_year' as code, 'marketdata_by_year' as cagetory from marketinfo WHERE cdate='${year}';`;
      value = await fastify.db.query(query);
      array.push(...value);

      // 종목 정보 중 수집 성공 건수
      query = `select count(1) as count, 'marketdata_success_by_year' as code, 'marketdata_by_year' as cagetory from marketinfo WHERE roe REGEXP '^[0-9.-]+$' AND CAST(roe AS DECIMAL(20,6)) IS NOT NULL and cdate='${year}';`;
      value = await fastify.db.query(query);
      array.push(...value);

      // 종목 정보 중 수집 오류 건수
      query = `select count(1) as count, 'marketdata_failure_by_year' as code, 'marketdata_by_year' as cagetory from marketinfo WHERE roe REGEXP '[^0-9.-]' and cdate='${year}';`;
      value = await fastify.db.query(query);
      array.push(...value);

      // TODO : 종목 재무 데이터 통계(개별)
      array.push({ cagetory: "marketdata", title: "marketdata", code: "marketdata", count: 0 });

      // 종목 정보 데이터 전체 수
      query = `select count(1) as count, 'marketdata_total' as code, 'marketdata' as cagetory from marketinfo;`;
      value = await fastify.db.query(query);
      array.push(...value);

      // 종목 정보 중 수집 성공 건수
      query = `select count(1) as count, 'marketdata_success' as code, 'marketdata' as cagetory from marketinfo WHERE roe REGEXP '^[0-9.-]+$' AND CAST(roe AS DECIMAL(20,6)) IS NOT NULL;`;
      value = await fastify.db.query(query);
      array.push(...value);

      // 종목 정보 중 수집 오류 건수
      query = `select count(1) as count, 'marketdata_failure' as code, 'marketdata' as cagetory from marketinfo WHERE roe REGEXP '[^0-9.-]';`;
      value = await fastify.db.query(query);
      array.push(...value);

      // TODO : 시세 수집 통계
      array.push({ cagetory: "sise", title: "sise", code: "sise", count: 0 });

      // 일주일 이내 수집된 정보
      const date = dayjs().tz("Asia/Seoul").subtract(7, "day").format("YYYYMMDD");
      query = `select count(1) as count, 'sise_success' as code, 'sise' as cagetory from market where SUBSTR(stime, 1, 8) >= '${date}';`;
      value = await fastify.db.query(query);
      array.push(value?.[0]);
      console.log(query);

      // 일주일 이내 수집되지 않음 정보
      query = `select count(1) as count, 'sise_failure' as code, 'sise' as cagetory from market where SUBSTR(stime, 1, 8) < '${date}';`;
      value = await fastify.db.query(query);
      array.push(value?.[0]);

      array.push({ cagetory: "dashboard", title: "dashboard", code: "dashboard", count: 0 });

      // 보유 또는 거래 종목 수
      query = `select count(1) as count, 'my_keeps' as code, 'dashboard' as cagetory from dashboard where kcount > 0 or ecount > 0;`;
      value = await fastify.db.query(query);
      array.push(value?.[0]);

      return { value: array };
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.STATISTIC.ROOT }));
    }
  });
};

export default statisticRoute;
