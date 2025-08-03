import Fastify from "fastify";
import cors from "@fastify/cors";
import dbPlugin from "./plugins/db.js"; // 🔥 DB 플러그인 추가
import dotenv from "dotenv";
import dashboardRoute from "./routes/dashboard.route.js";
import mystockRoute from "./routes/mystock.route.js";
import marketRoute from "./routes/market.route.js";
import profitRoute from "./routes/profit.route.js";
import diaryRoute from "./routes/diary.route.js";

// dotenv.config({ path: '.env' });

const fastify = Fastify({
  logger: true,
  serializerOpts: {
    bigint: "string", // 🔥 핵심 설정
  },
});

await fastify.register(cors, {
  // origin: '*', //process.env.FRONT_END_ORIGIN,
  // origin: process.env.FRONT_END_ORIGIN || true,
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ DELETE 추가
});

// DB 플러그인 등록
await fastify.register(dbPlugin);

// 라우트 등록
await fastify.register(dashboardRoute);
await fastify.register(mystockRoute);
await fastify.register(marketRoute);
await fastify.register(profitRoute);
await fastify.register(diaryRoute);

fastify.get("/", async (req, reply) => {
  return { hello: "world" };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log("[START] http://localhost:3000");
  } catch (err) {
    console.error("[START ERROR] 서버 시작 오류:", err);
    process.exit(1);
  }
};

start();
