# Etapa de build
FROM node:23-alpine AS builder

WORKDIR /app

# Dependências do Prisma (necessário para alpine)
RUN apk add --no-cache openssl libc6-compat

# Copia package.json e instala dependências
COPY package*.json ./
RUN npm install

# Copia código-fonte completo
COPY . .

# Gerar Prisma Client (binários corretos p/ linux-musl)
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# Etapa final (produção)
FROM node:23-alpine

WORKDIR /app

# Dependências necessárias para Prisma e bcrypt no alpine
RUN apk add --no-cache openssl libc6-compat

# Copia apenas os arquivos necessários da etapa builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/uploads ./uploads
COPY --from=builder /app/.env* ./
COPY --from=builder /app/logs ./logs

# Instala apenas as dependências de produção
RUN npm ci --only=production

