FROM node:14.15.3

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

# alterar para npm run start quando o sistema entrar em produção
CMD npm run start:dev