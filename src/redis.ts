// build/redis.js (ou src/redis.ts antes de compilar)
const { createClient } = require('redis');

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

client.on('connect', () => {
  console.log('✅ Redis conectado com sucesso!');
});

client.on('error', (err) => {
  console.error('❌ Erro no Redis:', err);
});

client.connect();

module.exports = client;
