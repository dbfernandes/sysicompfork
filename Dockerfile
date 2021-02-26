FROM node:14.15.3

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

CMD npm start