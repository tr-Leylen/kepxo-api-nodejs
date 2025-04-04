FROM node:21.2.0

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

CMD ["node", "index.js"]
