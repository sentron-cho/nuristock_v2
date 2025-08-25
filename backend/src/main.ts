import Fastify from "fastify";
import cors from "@fastify/cors";
import dbPlugin from "./plugins/db.js"; // 🔥 DB 플러그인 추가
import { startStockSiseService } from "./crawler/service/stockCrawler.service.js";
import { startAssetTask, startEvalutionPriceTask } from "./task/asset.task.js";
import { startMystockTask } from "./task/mystock.task.js";
import dashboardRoute from "./routes/dashboard.route.js";
import mainboardRoute from "./routes/mainboard.route.js";
import mystockRoute from "./routes/mystock.route.js";
import marketRoute from "./routes/market.route.js";
import profitRoute from "./routes/profit.route.js";
import diaryRoute from "./routes/diary.route.js";
import dividendRoute from "./routes/dividend.route.js";
import appRoute from "./routes/app.route.js";
import investRoute from "./routes/invest.route.js";
import assetRoute from "./routes/asset.route.js";
import depositRoute from "./routes/deposit.route.js";
import bucketRoute from "./routes/bucket.route.js";
import researchRoute from "./routes/research.route.js";

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
await fastify.register(appRoute); // 앱 설정
await fastify.register(mainboardRoute); // 메인
await fastify.register(dashboardRoute); // 대시보드
await fastify.register(mystockRoute); // 보유주식/거래주식
await fastify.register(marketRoute); // 종목
await fastify.register(profitRoute); // 투자손익
await fastify.register(diaryRoute); // 다이어리
await fastify.register(dividendRoute); // 배당
await fastify.register(investRoute); // 가치투자
await fastify.register(assetRoute); // 투자금액
await fastify.register(depositRoute); // 예수금
await fastify.register(bucketRoute); // 버킷리스트
await fastify.register(researchRoute); // 투자조사

// 크롤링 작업 시작
fastify.ready().then(() => {
  startStockSiseService(fastify);
});

// 태스크 작업 시작
fastify.ready().then(() => {
  startAssetTask(fastify); // 일별 투자금액 수집
  startEvalutionPriceTask(fastify); // 일별 평가금액 수집(시세반영)
  startMystockTask(fastify); // 주식 종목 투자 정보 수집
});

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
