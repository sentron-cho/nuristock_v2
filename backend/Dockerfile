# FROM node:20
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build
# EXPOSE 3030
# CMD ["node", "dist/index.js"]

# 1️⃣ Node.js 베이스 이미지 사용
FROM node:20

# 2️⃣ 작업 디렉토리 설정
WORKDIR /app

# 3️⃣ 종속성 파일 복사
COPY package*.json ./

# 4️⃣ 패키지 설치
RUN npm install

# 5️⃣ 소스 코드 전체 복사
COPY . .

# 6️⃣ 포트 지정 (Fastify 기본 포트: 3000)
EXPOSE 3300

# 7️⃣ 앱 실행
CMD ["npm", "run", "start"]