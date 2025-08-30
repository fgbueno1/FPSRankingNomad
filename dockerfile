FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

FROM node:20-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production --legacy-peer-deps

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/dev.env dev.env

RUN chown -R appuser:appgroup /usr/src/app

USER appuser

EXPOSE 3000

CMD ["node", "dist/main.js"]
