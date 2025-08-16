import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { withError } from "../lib/error.js";
import { SqlError } from "mariadb/*";
import { selectLatestAsset } from "./asset.route.js";
import { selectLatestDeposit } from "./deposit.route.js";

const mainboardRoute = (fastify: FastifyInstance) => {
  fastify.get(URL.MAINBOARD.ROOT, async (_req, reply) => {
    try {
      const dashboard = await fastify.db.query("SELECT * FROM dashboard");
      const latestSells = await fastify.db.query("SELECT k.*, m.name as name FROM sells k JOIN dashboard m ON k.code = m.code ORDER BY edate DESC limit 10;");
      const latestBuys = await fastify.db.query("SELECT k.*, m.name as name FROM keeps k JOIN dashboard m ON k.code = m.code ORDER BY sdate DESC limit 10;");
      const buys = await fastify.db.query("SELECT k.*, m.name as name FROM keeps k JOIN dashboard m ON k.code = m.code ORDER BY sdate DESC");
      const asset = await selectLatestAsset(fastify); // 현재 기준 투자총액
      const deposit = await selectLatestDeposit(fastify); // 현재 기준 예수금

      if (dashboard) {
        const codes = dashboard.map((a) => `'${a.code}'`).join(","); // ✅ 문자열로 변환
        const sise = await fastify.db.query(`SELECT * FROM market WHERE code in (${codes})`);

        return {
          value: dashboard, // 보유 및 거래 종목 전체
          trades: dashboard?.filter(a => a?.eprice), // 보유 종목만
          keeps: dashboard?.filter(a => a?.kprice), // 거래 종목만
          latestSells, // 최근 매도 종목
          latestBuys, // 최근 매수 종목
          buys, // 매수 종목 전체
          sise,
          asset,
          deposit,
        };
      } else {
        return {
          value: dashboard,
          sise: undefined,
          asset,
          deposit,
        };
      }
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MAINBOARD.ROOT }));
    }
  });
};

export default mainboardRoute;
