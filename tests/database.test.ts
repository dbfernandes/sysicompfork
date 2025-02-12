import { PrismaClient } from '@prisma/client';

describe('Database Connection', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('deve conectar ao banco de dados', async () => {
    try {
      await prisma.$connect();
      console.log('DATABASE_URL:', process.env.DATABASE_URL);

      const result = await prisma.$queryRaw`SELECT 1 as test`;
      console.log('Query result:', result);

      expect(result).toBeDefined();
    } catch (error) {
      console.error('Erro na conexão:', error);
      throw error;
    }
  });
});
