# # 프로젝트 빌드
# FROM node:20 AS builder
# WORKDIR /app
# COPY . .
# COPY package*.json .
# # RUN npm ci

# RUN rm -rf node_modules package-lock.json \
#   && npm install \
#   && npm run build

# # Production 런타임 - nginx
# FROM nginxinc/nginx-unprivileged:1.23 AS runner
# WORKDIR /usr/share/nginx/html
# COPY --from=builder /app/dist .

# EXPOSE 3000
# CMD ["nginx", "-g", "daemon off;"]

# 1️⃣ Node.js 환경에서 React 빌드
FROM node:20 AS build
WORKDIR /app

# package.json과 package-lock.json을 먼저 복사하여 의존성 설치
COPY package.json package-lock.json ./
RUN rm -rf node_modules package-lock.json \
  && npm install

# 전체 소스 코드 복사 후 빌드 실행
COPY . .
RUN npm run build

# 2️⃣ Nginx를 사용하여 정적 파일 서빙
FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html

# 환경 변수 설정
# ENV PORT=80
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]