// test/integration/sala/sala.integration.spec.ts
import request from 'supertest';
import app from '../../../src/app';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

describe('Sala Integration Tests', () => {
  let authCookie: string;

  const mockSala = {
    nome: 'Laboratório de Teste',
    andar: 'Térreo',
    bloco: 'A',
    numero: 101,
    capacidade: 30,
  };

  // Setup inicial - criar usuário e fazer login
  beforeAll(async () => {
    // Criar um usuário professor para testes
    const senhaHash = await bcrypt.hash('senha123', 10);
    const professor = await prisma.usuario.create({
      data: {
        email: 'professor.teste@example.com',
        nomeCompleto: 'Professor Teste',
        cpf: '12345678901',
        senhaHash: senhaHash,
        professor: 1,
        status: 1,
        administrador: 0,
        coordenador: 0,
        secretaria: 0,
      },
    });

    // Fazer login
    const loginResponse = await request(app).post('/login').send({
      cpf: '1111111111',
      senha: '123456',
    });

    // Guardar o cookie de autenticação
    authCookie = loginResponse.headers['set-cookie'][0];
  });

  // Limpar dados antes de cada teste
  beforeEach(async () => {
    await prisma.reservaSala.deleteMany();
    await prisma.sala.deleteMany();
  });

  // Cleanup após todos os testes
  afterAll(async () => {
    await prisma.usuario.deleteMany();
    await prisma.$disconnect();
  });

  describe('Operações básicas de Sala', () => {
    it('deve criar uma nova sala', async () => {
      const response = await request(app)
        .post('/salas/adicionar')
        .set('Cookie', authCookie)
        .send(mockSala);

      expect(response.status).toBe(302); // Redirect após criação

      const salaCriada = await prisma.sala.findFirst({
        where: { nome: mockSala.nome },
      });

      expect(salaCriada).toBeTruthy();
      expect(salaCriada?.nome).toBe(mockSala.nome);
    });

    it('deve listar todas as salas', async () => {
      await prisma.sala.create({ data: mockSala });

      const response = await request(app)
        .get('/salas/gerenciar')
        .set('Cookie', authCookie);

      expect(response.status).toBe(200);
      expect(response.text).toContain(mockSala.nome);
    });

    it('deve excluir uma sala', async () => {
      const sala = await prisma.sala.create({ data: mockSala });

      const response = await request(app)
        .post(`/salas/excluir/${sala.id}`)
        .set('Cookie', authCookie);

      expect(response.status).toBe(302);

      const salaExcluida = await prisma.sala.findUnique({
        where: { id: sala.id },
      });
      expect(salaExcluida).toBeNull();
    });
  });

  describe('Validações', () => {
    it('deve falhar ao criar sala sem nome', async () => {
      const salaInvalida = {
        andar: 'Térreo',
        bloco: 'A',
        numero: 101,
        capacidade: 30,
      };

      const response = await request(app)
        .post('/salas/adicionar')
        .set('Cookie', authCookie)
        .send(salaInvalida);

      expect(response.status).toBe(400);
    });
  });
});
