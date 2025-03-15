FROM node:20-bullseye

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . ./

RUN npm run build

RUN chmod +x bcrypt-fix-script.sh

CMD ["sh", "-c", "./bcrypt-fix-script.sh && npm run start"]

EXPOSE 3000
