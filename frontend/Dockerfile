# 1️⃣ 빌드 스테이지
FROM node:20 AS build

WORKDIR /app

COPY . .

RUN npm config set strict-ssl false

COPY package.json package-lock.json ./
RUN rm -rf node_modules package-lock.json \
  && npm install

RUN npm run build

# 2️⃣ nginx 스테이지
FROM nginx:alpine as dev

# 🔧 nginx 캐시 디렉토리 생성 + 권한 부여 (중요!)
RUN mkdir -p /var/cache/nginx/client_temp && \
    mkdir -p /var/cache/nginx/proxy_temp && \
    mkdir -p /var/cache/nginx/fastcgi_temp && \
    mkdir -p /var/cache/nginx/uwsgi_temp && \
    mkdir -p /var/cache/nginx/scgi_temp && \
    chown -R nginx:nginx /var/cache/nginx
    
# conf.d 디렉토리 제거 또는 깨끗이 비우기
RUN rm -rf /user/share/nginx/html/*

# 🔄 nginx 설정 복사 (default.conf 또는 nginx.conf)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 📁 정적 파일 복사
COPY --from=build /app/dist /usr/share/nginx/html

# Set enviroment variable from nginx config
RUN chown nginx:nginx /etc/nginx/
RUN chown nginx:nginx /etc/nginx/*
RUN chown nginx:nginx /etc/nginx/conf.d/default.conf
RUN chown nginx:nginx /var/log/nginx/

RUN chown 750 /etc/nginx/
RUN chown 750 /etc/nginx/*
RUN chown 750 /etc/nginx/conf.d/default.conf
RUN chown 750 /var/log/nginx/
RUN chown 750 /var/log/nginx/*

EXPOSE 3300
