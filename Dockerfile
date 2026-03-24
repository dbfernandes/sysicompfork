# Etapa de build
FROM node:22-alpine AS builder
WORKDIR /app

# ✅ deps para compilar módulos nativos (node-gyp) + prisma no alpine
RUN apk add --no-cache openssl libc6-compat python3 make g++ \
  && ln -sf python3 /usr/bin/python

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

# Etapa final (produção)
FROM node:22-alpine
WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

ENV NODE_ENV=production

# ✅ traz node_modules já compilado no builder
COPY --from=builder /app/node_modules ./node_modules

# copia o resto necessário
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/uploads ./uploads
COPY --from=builder /app/.env* ./
COPY --from=builder /app/logs ./logs

# (opcional) se você roda migrations no start, mantenha prisma cli; caso contrário ok
# CMD exemplo:
#CMD ["node", "build/index.js"]
# Instala apenas as dependências de produção
#RUN npm ci --only=production


