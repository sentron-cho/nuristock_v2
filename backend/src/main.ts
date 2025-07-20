import Fastify from "fastify";
import cors from "@fastify/cors";
import { FRONT_END_ORIGIN } from "./types/url.js"; // tsconfig가 moduleResolution: node라면 .js 필요
import dashboardRoute from "./routes/dashboard.route.js";
import mystockRoute from "./routes/mystock.route.js";
import dbPlugin from "./plugins/db.js"; // 🔥 DB 플러그인 추가
import dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({
  serializerOpts: {
    bigint: 'string', // 🔥 핵심 설정
  },
});

await fastify.register(cors, {
  origin: FRONT_END_ORIGIN,
  credentials: true,
});

// DB 플러그인 등록
await fastify.register(dbPlugin);

// 라우트 등록
await fastify.register(dashboardRoute);
await fastify.register(mystockRoute);

fastify.get("/", async (req, reply) => {
  return { hello: "world" };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3300 });
    console.log("[START] http://localhost:3300");
  } catch (err) {
    console.error("[START ERROR] 서버 시작 오류:", err);
    process.exit(1);
  }
};

start();
