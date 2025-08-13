# 1️⃣ 빌드 스테이지 (TypeScript -> JavaScript)
FROM node:20 AS builder

# 작업 디렉토리 설정
WORKDIR /app
    
# 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 소스 복사
COPY . .

# playwright 설치 (크롤링용)
RUN npx playwright install --with-deps

RUN npm run build

# 2️⃣ 런타임 스테이지 (최소한의 이미지 사용 가능: node:20-slim 등)
FROM node:20

WORKDIR /app

# 필수 시스템 패키지 설치 (Playwright Chromium 실행용)
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libatspi2.0-0 \
    libgtk-3-0 \
    libx11-xcb1 \
    libxss1 \
    libnspr4 \
    libnss3 \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    lsb-release \
    xdg-utils \
    wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 프로덕션 의존성만 설치
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /root/.cache/ms-playwright /root/.cache/ms-playwright

# ✅ 환경 변수 파일 복사
COPY .env.prod .env

# 빌드 결과물 복사
COPY --from=builder /app/dist ./dist

# 포트 설정
EXPOSE 3000

# 앱 실행 (Fastify 엔트리포인트)
CMD ["node", "dist/main.js"]