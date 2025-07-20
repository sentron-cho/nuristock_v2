import URL from "../types/url.js";
import { FastifyInstance } from "fastify";
import { mock as mockData } from "../mock/dashboard/dashboard.list.js";
// import { mock as mockSise } from "../mock/dashboard/dashboard.sise.js";

function safeStringify(obj: any) {
  return JSON.stringify(obj, (_, value) => (typeof value === "bigint" ? value.toString() : value));
}

const dashboardRoute = (fastify: FastifyInstance) => {
  fastify.get(URL.DASHBOARD.ROOT, async (req, reply) => {
    console.log(`[API:CALL]`, { url: `${URL.DASHBOARD.ROOT}` });

    try {
      const result = await fastify.db.query("SELECT * FROM dashboard");
      console.log("[DB Select]", { db: fastify.db, result: result?.length });

      return {
        code: 200,
        value: result,
        total: result.length,
        max_page: 1,
        page: "1",
      };
    } catch (error) {
      console.error("[DASHBOARD ERROR]", error); // ← 여기 로그 확인
      reply.status(500).send({ code: 500, message: "DB 조회 실패" });
    }
  });

  fastify.get(URL.DASHBOARD.SISE, async (req, reply) => {
    console.log(`[API:CALL]`, { url: `${URL.DASHBOARD.SISE}` });

    try {
      const result = await fastify.db.query("SELECT * FROM market");
      console.log("[DB Select]", { db: fastify.db, result: result?.length });

      reply
        .code(200)
        .header("Content-Type", "application/json")
        .send(
          JSON.parse(
            safeStringify({
              code: 200,
              value: result,
            })
          )
        );

      // return mockData;
      // return {
      //   code: 200,
      //   value: result,
      // };
    } catch (error) {
      console.error("[DASHBOARD ERROR]", error); // ← 여기 로그 확인
      reply.status(500).send({ code: 500, message: "DB 조회 실패" });
    }

    // return mockSise;
  });
};

export default dashboardRoute;
