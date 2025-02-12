import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['query', 'error', 'warn'],
});

// Função auxiliar para verificar conexão
export async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    return !!result;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

export default prisma;
