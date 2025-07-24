import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { mock as mockData } from "../mock/dashboard/dashboard.list.js";
import { withError } from "../lib/error.js";
import { SqlError } from "mariadb/*";
// import { mock as mockSise } from "../mock/dashboard/dashboard.sise.js";

function safeStringify(obj: any) {
  return JSON.stringify(obj, (_, value) => (typeof value === "bigint" ? value.toString() : value));
}

const dashboardRoute = (fastify: FastifyInstance) => {
  fastify.get(URL.DASHBOARD.ROOT, async (req, reply) => {
    console.log(`[API:CALL]`, { url: `${URL.DASHBOARD.ROOT}`, req: req.hostname });

    try {
      const dashboard = await fastify.db.query("SELECT * FROM dashboard");

      if (dashboard) {
        const codes = dashboard.map((a) => `'${a.code}'`).join(','); // ✅ 문자열로 변환
        const sise = await fastify.db.query(`SELECT * FROM market WHERE code in (${codes})`);
        
        console.log("[DB Select]", { dashboard: dashboard?.length, sise: sise?.length });
  
        return {
          code: 200,
          value: dashboard,
          sise: sise,
        };
      } else {
        return {
          code: 200,
          value: dashboard,
          sise: undefined,
        };
      }

    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.ROOT }));
    }
  });

  // fastify.get(URL.DASHBOARD.SISE, async (req, reply) => {
  //   console.log(`[API:CALL]`, { url: `${URL.DASHBOARD.SISE}` });

  //   try {
  //     const result = await fastify.db.query("SELECT * FROM market");
  //     console.log("[DB Select]", { db: fastify.db, result: result?.length });

  //     // reply
  //     //   .code(200)
  //     //   .header("Content-Type", "application/json")
  //     //   .send(
  //     //     JSON.parse(
  //     //       safeStringify({
  //     //         code: 200,
  //     //         value: result,
  //     //       })
  //     //     )
  //     //   );

  //     // return mockData;
  //     return {
  //       code: 200,
  //       value: result,
  //       total: result.length,
  //     };
  //   } catch (error) {
  //     console.error("[DASHBOARD ERROR]", error); // ← 여기 로그 확인
  //     reply.status(500).send({ code: 500, message: "DB 조회 실패" });
  //   }

  //   // return mockSise;
  // });

    // 보유종목 시세 수정
  fastify.put(URL.DASHBOARD.SISE, async (req, reply) => {
    console.log(`[API:CALL]`, { url: `${URL.MYSTOCK.SISE}`, query: req.body });
    const { code, sise, updown } = req.body as Record<string, string>;

    try {
      // `SELECT code, stime as time, sise, updown  FROM market WHERE code='${code}';`
      const res = await fastify.db.query(
        `UPDATE market SET sise = '${sise}', updown='${updown}' WHERE code = '${code}';`
      );
      reply.status(200).send({ value: code });
    } catch (error) {
      reply.status(500).send(withError(error as SqlError, { tag: URL.MYSTOCK.ROOT }));
    }
  });
};

export default dashboardRoute;
