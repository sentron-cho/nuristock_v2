# 1단계: 빌드
FROM node:20 AS builder
WORKDIR /src
COPY . .
RUN npm install && npm run build

# 2단계: nginx로 서비스
FROM nginx:alpine
COPY --from=builder /dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]