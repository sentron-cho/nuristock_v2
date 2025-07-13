# 프로젝트 빌드
FROM node:20 AS builder
WORKDIR /app
COPY . .
COPY package*.json .
# RUN npm ci

RUN rm -rf node_modules package-lock.json \
  && npm install \
  && npm run build

# Production 런타임 - nginx
FROM nginxinc/nginx-unprivileged:1.23 AS runner
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]