"use strict";
// Fastify 모듈 가져오기
const fastify = require("fastify")();
// 루트 URL에 대한 라우트 핸들러 정의
fastify.get("/", async (request, reply) => {
    return { hello: "world" };
});
// 서버 시작
const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
        console.log("서버가 http://localhost:3000 에서 실행 중입니다.");
    }
    catch (error) {
        console.error("서버 시작 오류:", error);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=main.js.map