# Этап 1. Сборка приложения
FROM node:20-bullseye AS builder
WORKDIR /app

# Копируем файлы зависимостей и устанавливаем их
COPY package.json package-lock.json ./
RUN npm install

# Копируем все исходники и выполняем сборку
COPY . .
RUN npm run build

# Этап 2. Формирование production-образа
FROM node:20-bullseye AS runner
WORKDIR /app

# Копируем только необходимые для запуска файлы из этапа сборки
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

# Устанавливаем только production зависимости
RUN npm install --production

# Определяем переменные окружения
ENV NODE_ENV=production
ENV PORT=5173

EXPOSE 5173

# Запускаем приложение; в package.json команда "start" определена как:
# "start": "remix-serve ./build/server/index.js"
CMD ["npm", "start"]
