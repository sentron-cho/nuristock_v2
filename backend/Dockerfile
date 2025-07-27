# 1️⃣ 빌드 스테이지 (TypeScript -> JavaScript)
FROM node:20 AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 소스 복사
COPY . .
RUN npm run build


# 2️⃣ 런타임 스테이지 (최소한의 이미지 사용 가능: node:20-slim 등)
FROM node:20

WORKDIR /app

# 프로덕션 의존성만 설치
COPY package*.json ./
RUN npm install --omit=dev

# ✅ 환경 변수 파일 복사
COPY .env.prod .env

# 빌드 결과물 복사
COPY --from=builder /app/dist ./dist

# 포트 설정
EXPOSE 3000

# 앱 실행 (Fastify 엔트리포인트)
CMD ["node", "dist/main.js"]