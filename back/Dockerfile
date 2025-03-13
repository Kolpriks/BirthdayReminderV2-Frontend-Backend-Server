FROM node:20-bullseye

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package.json package-lock.json ./

RUN npm install

# Копируем весь исходный код приложения
COPY . ./

# Собираем проект (если у вас есть сборка)
RUN npm run build

# Делаем исполняемым скрипт, если он требуется
RUN chmod +x bcrypt-fix-script.sh

# Устанавливаем переменную окружения (можно не задавать, если она из .env)
ENV NODE_ENV=production

# Запускаем скрипт и старт приложения
CMD ["sh", "-c", "./bcrypt-fix-script.sh && npm run start"]

EXPOSE 3000
