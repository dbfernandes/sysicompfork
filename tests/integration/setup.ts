import dotenv from 'dotenv';
import path from 'path';
// Importar mocks
import '../mocks/emailService';
import prisma from '../mocks/prismaClient'; // Modificado aqui: import sem chaves

// Carregar variáveis de ambiente
dotenv.config({
  path: path.resolve(__dirname, '..', '..', '.env.test'),
});

// Desabilitar logs durante os testes
console.log = jest.fn();
console.error = jest.fn();
console.warn = jest.fn();

// Configurações básicas
beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await prisma.$disconnect();
});
