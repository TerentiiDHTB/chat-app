FROM node:22

WORKDIR /app

RUN npm install -g pnpm --loglevel verbose

COPY . .

RUN pnpm i --force

RUN pnpm build