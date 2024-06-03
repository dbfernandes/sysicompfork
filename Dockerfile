FROM node:18-alpine3.15

WORKDIR /app
COPY package*.json ./

# Add support for https on wget
RUN apk update && apk add --no-cache wget openssl ca-certificates && update-ca-certificates

# Add phantomjs
RUN wget -qO- "https://github.com/DaniSanT17/phantomized/releases/download/2.1.1a/phantomized-2.1.1a.tar.gz" | tar xz -C / \
    && npm config set user 0 \
    && npm install -g phantomjs-prebuilt
    
# Add fonts required by phantomjs to render html correctly
RUN apk add --update ttf-dejavu ttf-droid ttf-freefont ttf-liberation fontconfig font-noto terminus-font && rm -rf /var/cache/apk/* \
    && fc-cache -f \
    && fc-list | sort

# see this: https://github.com/marcbachmann/node-html-pdf/issues/563#issuecomment-712852134
RUN echo "" > /tmp/openssl.cnf
ENV OPENSSL_CONF=/etc/ssl/

COPY . .

RUN npm install

# alterar para 'npm start' quando o sistema entrar em produção
CMD ["npm", "run", "start:dev"]
