import request from 'supertest';
import app from '../../../src/app';
import bcrypt from 'bcrypt';
import prisma, { checkDatabaseConnection } from '../../mocks/prismaClient';
import { StatusCodes } from 'http-status-codes';
import { Prisma } from '@prisma/client';
import { ReservaFormularioDto } from '../../../src/resources/reservasDeSalas/reservas.types';

const SENHA_TESTE = 'senha123';
const agent = request.agent(app);

function extractCsrfTokenFromBody(res: request.Response): string {
  const body = res.text;
  const csrfTokenMatch = body.match(
    /<input[^>]*name="_csrf"[^>]*value="([^"]*)"[^>]*>/,
  );

  if (csrfTokenMatch && csrfTokenMatch[1]) {
    return csrfTokenMatch[1];
  } else {
    throw new Error('CSRF token não encontrado no corpo da resposta');
  }
}

describe('Reservas Integration Tests', () => {
  let csrfToken: string;
  let professorId: number;
  let salaId: number;

  // Tipagem para o mock do professor
  const mockProfessor: Prisma.UsuarioCreateInput = {
    email: 'professor@test.com',
    nomeCompleto: 'Professor Teste',
    cpf: '12345678901',
    professor: 1,
    status: 1,
    administrador: 0,
    coordenador: 0,
    secretaria: 0,
    diretor: 0,
    senhaHash: '',
    perfil: 'PROFESSOR',
  };

  // Tipagem para o mock da sala
  const mockSala: Prisma.SalaCreateInput = {
    nome: 'Sala Teste',
    andar: 'Térreo',
    bloco: 'A',
    numero: 101,
    capacidade: 30,
  };

  beforeAll(async () => {
    try {
      const isConnected = await checkDatabaseConnection();
      if (!isConnected) {
        throw new Error('Não foi possível conectar ao banco de dados');
      }

      await prisma.reservaSala.deleteMany();
      await prisma.sala.deleteMany();
      await prisma.usuario.deleteMany();

      const senhaHash = await bcrypt.hash(SENHA_TESTE, 10);
      const professorCriado = await prisma.usuario.create({
        data: {
          ...mockProfessor,
          senhaHash,
        },
      });
      professorId = professorCriado.id;

      const salaCriada = await prisma.sala.create({
        data: mockSala,
      });
      salaId = salaCriada.id;

      const loginPageResponse = await agent
        .get('/login')
        .set('Accept', 'text/html');

      csrfToken = extractCsrfTokenFromBody(loginPageResponse);

      await agent.post('/login').type('form').set('Accept', 'text/html').send({
        cpf: mockProfessor.cpf,
        senha: SENHA_TESTE,
        _csrf: csrfToken,
      });

      const reservasResponse = await agent
        .get('/reservas/gerenciar')
        .set('Accept', 'text/html');

      csrfToken = extractCsrfTokenFromBody(reservasResponse);
    } catch (error) {
      console.error('Erro no setup:', error);
      throw error;
    }
  });

  beforeEach(async () => {
    await prisma.reservaSala.deleteMany();

    const page = await agent
      .get('/reservas/gerenciar')
      .set('Accept', 'text/html');
    csrfToken = extractCsrfTokenFromBody(page);
  });

  afterAll(async () => {
    await prisma.reservaSala.deleteMany();
    await prisma.sala.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.$disconnect();
  });

  describe('GET /reservas/gerenciar', () => {
    it('deve exibir página de gerenciamento para usuário autenticado', async () => {
      const response = await agent
        .get('/reservas/gerenciar')
        .set('Accept', 'text/html');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.text).toContain('Gerenciar Reservas');
    });

    it('deve redirecionar para login quando não autenticado', async () => {
      const unauthenticatedAgent = request(app);
      const response = await unauthenticatedAgent
        .get('/reservas/gerenciar')
        .set('Accept', 'text/html');

      expect(response.status).toBe(StatusCodes.MOVED_TEMPORARILY);
      expect(response.header.location).toBe('/login');
    });
  });

  describe('POST /reservas/adicionar', () => {
    it('deve criar reserva com dados válidos', async () => {
      // interface ReservaFormularioDto
      const reservaData: ReservaFormularioDto & { _csrf: string } = {
        salaId: salaId.toString(),
        usuarioId: professorId.toString(),
        atividade: 'Aula de Teste',
        tipo: 'Aula',
        dia: ['Segunda', 'Quarta'],
        dataInicio: '2025-03-01',
        dataFim: '2025-06-30',
        horaInicio: '08:00',
        horaFim: '10:00',
        _csrf: csrfToken,
      };

      const response = await agent
        .post('/reservas/adicionar')
        .type('form')
        .set('Accept', 'text/html')
        .send(reservaData);

      expect([StatusCodes.MOVED_TEMPORARILY, StatusCodes.OK]).toContain(
        response.status,
      );

      // Busca e verifica a reserva criada
      const reservaCriada = await prisma.reservaSala.findFirst({
        where: { atividade: reservaData.atividade },
      });

      expect(reservaCriada).toBeTruthy();
      expect(reservaCriada?.atividade).toBe(reservaData.atividade);
      expect(reservaCriada?.salaId).toBe(Number(reservaData.salaId));
      expect(reservaCriada?.usuarioId).toBe(Number(reservaData.usuarioId));
      expect(reservaCriada?.dias).toContain('Segunda');
      expect(reservaCriada?.dias).toContain('Quarta');
    });
  });

  describe('POST /reservas/excluir/:id', () => {
    it('deve excluir reserva existente', async () => {
      // Tipagem para a criação da reserva de teste
      const reservaTestData: Prisma.ReservaSalaCreateInput = {
        sala: { connect: { id: salaId } },
        usuario: { connect: { id: professorId } },
        atividade: 'Aula para Excluir',
        tipo: 'Aula',
        dias: 'Segunda',
        dataInicio: new Date('2025-03-01'),
        dataFim: new Date('2025-06-30'),
        horaInicio: '14:00',
        horaFim: '16:00',
      };

      const reserva = await prisma.reservaSala.create({
        data: reservaTestData,
      });

      const response = await agent
        .post(`/reservas/excluir/${reserva.id}`)
        .type('form')
        .set('Accept', 'text/html')
        .send({ _csrf: csrfToken });

      expect([StatusCodes.MOVED_TEMPORARILY, StatusCodes.OK]).toContain(
        response.status,
      );

      const reservaExcluida = await prisma.reservaSala.findUnique({
        where: { id: reserva.id },
      });
      expect(reservaExcluida).toBeNull();
    });

    it('deve retornar erro para reserva inexistente', async () => {
      const response = await agent
        .post('/reservas/excluir/99999')
        .type('form')
        .set('Accept', 'text/html')
        .send({ _csrf: csrfToken });

      expect([
        StatusCodes.NOT_FOUND,
        StatusCodes.INTERNAL_SERVER_ERROR,
      ]).toContain(response.status);
    });
  });

  describe('GET /reservas/editar/:id', () => {
    it('deve exibir formulário de edição para reserva existente', async () => {
      // Tipagem para a criação da reserva
      const reservaTestData: Prisma.ReservaSalaCreateInput = {
        sala: { connect: { id: salaId } },
        usuario: { connect: { id: professorId } },
        atividade: 'Aula para Editar',
        tipo: 'Aula',
        dias: 'Segunda',
        dataInicio: new Date('2025-03-01'),
        dataFim: new Date('2025-06-30'),
        horaInicio: '14:00',
        horaFim: '16:00',
      };

      const reserva = await prisma.reservaSala.create({
        data: reservaTestData,
      });

      const response = await agent
        .get(`/reservas/editar/${reserva.id}`)
        .set('Accept', 'text/html');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.text).toContain('Editar Reserva');
      expect(response.text).toContain(reserva.atividade);
    });
  });

  describe('POST /reservas/editar/:id', () => {
    it('deve atualizar reserva com dados válidos', async () => {
      // Tipagem para a criação da reserva
      const reservaTestData: Prisma.ReservaSalaCreateInput = {
        sala: { connect: { id: salaId } },
        usuario: { connect: { id: professorId } },
        atividade: 'Aula Original',
        tipo: 'Aula',
        dias: 'Segunda',
        dataInicio: new Date('2025-03-01'),
        dataFim: new Date('2025-06-30'),
        horaInicio: '14:00',
        horaFim: '16:00',
      };

      const reserva = await prisma.reservaSala.create({
        data: reservaTestData,
      });

      // Usando a interface ReservaFormularioDto para tipar os dados do formulário de edição
      const dadosAtualizados: ReservaFormularioDto & { _csrf: string } = {
        salaId: salaId.toString(),
        usuarioId: professorId.toString(),
        atividade: 'Aula Atualizada',
        tipo: 'Aula',
        dia: ['Terça'], // Usando dia como array para simular checkboxes
        dataInicio: '2025-04-01',
        dataFim: '2025-07-31',
        horaInicio: '10:00',
        horaFim: '12:00',
        unica: 'on',
        _csrf: csrfToken,
      };

      const response = await agent
        .post(`/reservas/editar/${reserva.id}`)
        .type('form')
        .set('Accept', 'text/html')
        .send(dadosAtualizados);

      expect([StatusCodes.MOVED_TEMPORARILY, StatusCodes.OK]).toContain(
        response.status,
      );

      const reservaAtualizada = await prisma.reservaSala.findUnique({
        where: { id: reserva.id },
      });

      expect(reservaAtualizada).toBeTruthy();
      expect(reservaAtualizada?.atividade).toBe(dadosAtualizados.atividade);
      expect(reservaAtualizada?.dias).toContain('Terça');
      expect(reservaAtualizada?.horaInicio).toBe(dadosAtualizados.horaInicio);
      expect(reservaAtualizada?.horaFim).toBe(dadosAtualizados.horaFim);
    });
  });
});
