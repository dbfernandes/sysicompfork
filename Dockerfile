FROM node:23-alpine

WORKDIR /app
COPY package*.json ./

RUN apk update && \
    apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont \
    wget \
    ca-certificates \
    udev \
    dumb-init && \
    update-ca-certificates


COPY . .

RUN npm install

# alterar para 'npm start:prod' quando o sistema entrar em produção
CMD ["npm", "run", "start"]
