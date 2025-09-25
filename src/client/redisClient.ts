import { createClient } from 'redis';

const host = process.env.REDIS_HOST || 'redis';
const port = Number(process.env.REDIS_PORT) || 6379;
const client = createClient({
  socket: {
    host,
    port,
  },
});

client.on('connect', () => {
  console.log('✅ Redis conectado com sucesso!');
});

client.on('error', (err) => {
  console.error('❌ Erro no Redis:', err);
});

client.connect();

export default client;
