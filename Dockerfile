FROM node:23-alpine

# Criar diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema necessárias para Chromium e Puppeteer
RUN apk update && \
    apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ttf-freefont \
      ca-certificates \
      udev \
      openssl \
      dumb-init && \
    update-ca-certificates

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências do Node
RUN npm install

# Copiar restante do código
COPY . .

# Definimos a variável de ambiente que informa qual binário o Puppeteer deve usar
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
RUN npx prisma generate
# Liberar a porta (caso a sua app use)
EXPOSE 3000

# Executar a aplicação
CMD ["npm", "run", "start"]
