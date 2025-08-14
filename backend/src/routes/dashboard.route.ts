import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { withError } from "../lib/error.js";
import { SqlError } from "mariadb/*";
import { makeUpdateSet } from "../lib/db.util.js";
import { DashboardCreateType } from "../types/data.type.js";

const dashboardRoute = (fastify: FastifyInstance) => {
  fastify.get(URL.DASHBOARD.ROOT, async (_req, reply) => {
    try {
      const dashboard = await fastify.db.query("SELECT * FROM dashboard");

      if (dashboard) {
        const codes = dashboard.map((a) => `'${a.code}'`).join(","); // ✅ 문자열로 변환
        const sise = await fastify.db.query(`SELECT * FROM market WHERE code in (${codes})`);

        return {
          value: dashboard,
          sise: sise,
        };
      } else {
        return {
          value: dashboard,
          sise: undefined,
        };
      }
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.DASHBOARD.ROOT }));
    }
  });

  // 보유 주식 데이터 업데이트
  const updateDashboardKeep = async (code: string) => {
    try {
      if (!code) throw new Error("is not stock code");

      const keeps = await fastify.db.query(
        `SELECT SUM(scost * count) AS sprice, SUM(count) AS count FROM keeps WHERE code = '${code}'`
      );

      const sells = await fastify.db.query(
        `SELECT SUM(scost * count) AS sprice, SUM(count) as count, SUM(ecost * count) AS eprice FROM sells WHERE code = '${code}'`
      );

      const dashboardData = {
        kcount: Number(keeps?.[0]?.count), // 보유 수량
        kprice: Number(keeps?.[0]?.sprice), // 보유 금액

        ecount: Number(sells?.[0]?.count), // 매도/매도 수량
        eprice: Number(sells?.[0]?.eprice), // 매도 금액
        sprice: Number(sells?.[0]?.sprice), // 매수 금액
      };

      await fastify.db.query(`UPDATE dashboard SET ${makeUpdateSet(dashboardData)} WHERE code='${code}';`);
    } catch (error) {
      throw error;
    }
  };

  // 보유종목 추가
  fastify.post(URL.DASHBOARD.ROOT, async (req, reply) => {
    try {
      const { code, name } = req.body as DashboardCreateType;

      await fastify.db.query(`INSERT INTO dashboard (code, name) VALUES ('${code}', '${name}');`);
      await updateDashboardKeep(code);

      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.DASHBOARD.ROOT }));
    }
  });

  // 보유종목 삭제
  fastify.delete(URL.DASHBOARD.ROOT, async (req, reply) => {
    try {
      const { code } = req.query as DashboardCreateType;

      await fastify.db.query(`DELETE FROM dashboard WHERE code='${code}';`);
      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.DASHBOARD.ROOT }));
    }
  });

  // 보유종목 수정
  fastify.put(URL.DASHBOARD.ROOT, async (req, reply) => {
    try {
      const { code, name } = req.body as DashboardCreateType;

      await fastify.db.query(`UPDATE dashboard SET name = '${name}' WHERE code = '${code}';`);
      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.DASHBOARD.ROOT }));
    }
  });
};

export default dashboardRoute;
