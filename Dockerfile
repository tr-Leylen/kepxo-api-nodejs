FROM node:21.2.0

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN mkdir -p /app/uploads && chmod -R 777 /app/uploads

CMD ["node", "index.js"]
