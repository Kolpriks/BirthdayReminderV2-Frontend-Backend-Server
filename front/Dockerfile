FROM node:20-bullseye AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-bullseye AS runner
WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

RUN npm install 

ENV PORT=5173

EXPOSE 5173

CMD ["npm", "start"]
