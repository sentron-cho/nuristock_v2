# # # 프로젝트 빌드
# # FROM node:20 AS builder
# # WORKDIR /app
# # COPY . .
# # COPY package*.json .
# # # RUN npm ci

# # RUN rm -rf node_modules package-lock.json \
# #   && npm install \
# #   && npm run build

# # # Production 런타임 - nginx
# # FROM nginxinc/nginx-unprivileged:1.23 AS runner
# # WORKDIR /usr/share/nginx/html
# # COPY --from=builder /app/dist .

# # EXPOSE 3000
# # CMD ["nginx", "-g", "daemon off;"]

# # 1️⃣ Node.js 환경에서 React 빌드
# FROM node:20 AS build
# WORKDIR /app

# # package.json과 package-lock.json을 먼저 복사하여 의존성 설치
# COPY package.json package-lock.json ./
# RUN rm -rf node_modules package-lock.json \
#   && npm install

# # 전체 소스 코드 복사 후 빌드 실행
# COPY . .
# RUN npm run build

# RUN rm -rf /user/share/nginx/html/*

# RUN mkdir -p /var/cache/nginx/client_temp

# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # 2️⃣ Nginx를 사용하여 정적 파일 서빙
# FROM nginx:alpine
# COPY --from=build /app/dist/ /usr/share/nginx/html

# # 환경 변수 설정
# # ENV PORT=80
# EXPOSE 3000

# CMD ["nginx", "-g", "daemon off;"]


# 1️⃣ 빌드 스테이지
FROM node:20 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN rm -rf node_modules package-lock.json \
  && npm install

COPY . .
RUN npm run build


# 2️⃣ nginx 스테이지
FROM nginx:alpine

# 💡 default.conf 제거 (엔트리포인트 오류 방지)
RUN rm /etc/nginx/conf.d/default.conf

# 🔧 nginx 캐시 디렉토리 생성 + 권한 부여 (중요!)
RUN mkdir -p /var/cache/nginx/client_temp && \
    chown -R nginx:nginx /var/cache/nginx

# 🔄 nginx 설정 복사 (default.conf 또는 nginx.conf)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 📁 정적 파일 복사
COPY --from=build /app/dist /usr/share/nginx/html

# Set enviroment variable from nginx config
RUN chown nginx:nginx /etc/nginx/
RUN chown nginx:nginx /etc/nginx/*
RUN chown nginx:nginx /etc/nginx/config.d/*.conf
RUN chown nginx:nginx /user/lib/nginx/modules/
RUN chown nginx:nginx /user/lib/nginx/modules/*
RUN chown nginx:nginx /var/log/nginx/
RUN chown nginx:nginx /user/share/nginx/

RUN chown 750 /etc/nginx/
RUN chown 750 /etc/nginx/*
RUN chown 750 /etc/nginx/config.d/*.conf
RUN chown 750 /user/lib/nginx/modules/
RUN chown 750 /user/lib/nginx/modules/*
RUN chown 750 /var/log/nginx/
RUN chown 750 /var/log/nginx/*
RUN chown 750 /user/share/nginx/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]