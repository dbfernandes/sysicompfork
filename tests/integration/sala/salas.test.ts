import request from 'supertest';
import bcrypt from 'bcrypt';
import prisma, { checkDatabaseConnection } from '../../mocks/prismaClient';
import { StatusCodes } from 'http-status-codes';
import app from '@/app';
import { CreateSalaDto } from '@/resources/salas/sala.types';

const SENHA_TESTE = 'senha123';
const agent = request.agent(app);

//CSRF token
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

describe('Salas Integration Tests', () => {
  let csrfToken: string;

  const mockProfessor = {
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
    tokenResetSenha: null,
    validadeTokenResetSenha: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSala: CreateSalaDto = {
    nome: 'Lab Teste',
    andar: 'Térreo',
    bloco: 'A',
    numero: 101,
    capacidade: 30,
  };

  beforeAll(async () => {
    try {
      // 1. Verificar conexão
      console.log('1. Verificando conexão com banco de dados...');
      const isConnected = await checkDatabaseConnection();
      if (!isConnected) {
        throw new Error('Não foi possível conectar ao banco de dados');
      }
      console.log('2. Conexão estabelecida');

      // 2. Limpar banco
      await prisma.reservaSala.deleteMany();
      await prisma.sala.deleteMany();
      await prisma.usuario.deleteMany();
      console.log('3. Banco limpo');

      // 3. Criar professor
      const senhaHash = await bcrypt.hash(SENHA_TESTE, 10);
      const professorData = {
        email: mockProfessor.email,
        nomeCompleto: mockProfessor.nomeCompleto,
        cpf: mockProfessor.cpf,
        professor: mockProfessor.professor,
        status: mockProfessor.status,
        administrador: mockProfessor.administrador,
        coordenador: mockProfessor.coordenador,
        secretaria: mockProfessor.secretaria,
        diretor: mockProfessor.diretor,
        senhaHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const professorCriado = await prisma.usuario.create({
        data: professorData,
      });
      console.log('4. Professor criado:', {
        id: professorCriado.id,
        email: professorCriado.email,
        cpf: professorCriado.cpf,
      });

      // 4. Obter CSRF token inicial
      const loginPageResponse = await agent
        .get('/login')
        .set('Accept', 'text/html');

      console.log('5. Login page response:', {
        status: loginPageResponse.status,
        cookies: loginPageResponse.headers['set-cookie'],
      });

      const csrfMatch = loginPageResponse.text.match(
        /<input[^>]*name="_csrf"[^>]*value="([^"]*)"[^>]*>/,
      );
      if (!csrfMatch) {
        console.log('Login Page HTML:', loginPageResponse.text);
        throw new Error('CSRF token não encontrado');
      }
      csrfToken = csrfMatch[1];
      console.log('6. CSRF token obtido:', csrfToken);

      // 5. Fazer login
      const loginResponse = await agent
        .post('/login')
        .type('form')
        .set('Accept', 'text/html')
        .send({
          cpf: mockProfessor.cpf,
          senha: SENHA_TESTE,
          _csrf: csrfToken,
        });

      console.log('7. Login response:', {
        status: loginResponse.status,
        location: loginResponse.header.location,
      });

      if (
        loginResponse.status !== 302 ||
        !loginResponse.header.location?.includes('/inicio')
      ) {
        throw new Error(`Login falhou: ${loginResponse.status}`);
      }

      // 6. Obter novo CSRF token após login
      const gerenciarResponse = await agent
        .get('/salas/gerenciar')
        .set('Accept', 'text/html');

      const newCsrfMatch = gerenciarResponse.text.match(
        /<input[^>]*name="_csrf"[^>]*value="([^"]*)"[^>]*>/,
      );
      if (newCsrfMatch) {
        csrfToken = newCsrfMatch[1];
      }

      console.log('8. Setup completo:', {
        status: gerenciarResponse.status,
        finalCsrfToken: csrfToken,
      });
    } catch (error) {
      console.error('Erro no setup:', error);
      throw error;
    }
  });

  beforeEach(async () => {
    // Limpar apenas as salas
    await prisma.reservaSala.deleteMany();
    await prisma.sala.deleteMany();

    // Atualizar CSRF token
    const page = await agent.get('/salas/gerenciar').set('Accept', 'text/html');

    const csrfMatch = page.text.match(
      /<input[^>]*name="_csrf"[^>]*value="([^"]*)"[^>]*>/,
    );
    if (csrfMatch) {
      csrfToken = csrfMatch[1];
    }
  });

  afterAll(async () => {
    try {
      await prisma.reservaSala.deleteMany();
      await prisma.sala.deleteMany();
      await prisma.usuario.deleteMany();
      await prisma.$disconnect();
      console.log('Limpeza finalizada com sucesso!');
    } catch (error) {
      console.error('Erro na limpeza final:', error);
    }
  });

  describe('GET /salas/gerenciar', () => {
    it('deve listar salas para usuário autenticado', async () => {
      const sala = await prisma.sala.create({ data: mockSala });
      const response = await agent
        .get('/salas/gerenciar')
        .set('Accept', 'text/html');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.text).toContain(sala.nome);
    });

    it('deve redirecionar para login quando não autenticado', async () => {
      // Usar novo agent para garantir que não está autenticado
      const unauthenticatedAgent = request(app);

      const response = await unauthenticatedAgent
        .get('/salas/gerenciar')
        .set('Accept', 'text/html');

      expect(response.status).toBe(StatusCodes.MOVED_TEMPORARILY);
      expect(response.header.location).toBe('/login');
    });
  });

  describe('POST /salas/adicionar', () => {
    it('deve criar sala com dados válidos', async () => {
      console.log('1. Iniciando teste de criação de sala');

      const response = await agent
        .post('/salas/adicionar')
        .type('form')
        .set('Accept', 'text/html')
        .send({
          ...mockSala,
          _csrf: csrfToken,
        });

      console.log('2. Resposta da criação:', {
        status: response.status,
        location: response.header.location,
        csrf: csrfToken,
        body: response.text.substring(0, 200),
      });

      expect(response.status).toBe(302);
      expect(response.header.location).toBe('/salas/gerenciar');

      const salaCriada = await prisma.sala.findFirst({
        where: { nome: mockSala.nome },
      });

      console.log('3. Sala no banco:', salaCriada);

      expect(salaCriada).toBeTruthy();
      expect(salaCriada?.nome).toBe(mockSala.nome);
    });
  });

  describe('POST /salas/editar/:id', () => {
    it('deve atualizar sala existente', async () => {
      const salaCriada = await prisma.sala.create({ data: mockSala });
      const novoNome = 'Sala Atualizada';

      const response = await agent
        .post(`/salas/editar/${salaCriada.id}`)
        .type('form')
        .set('Accept', 'text/html')
        .send({
          ...mockSala,
          nome: novoNome,
          _csrf: csrfToken,
        });

      expect(response.status).toBe(StatusCodes.MOVED_TEMPORARILY);
      expect(response.header.location).toBe('/salas/gerenciar');

      const salaAtualizada = await prisma.sala.findUnique({
        where: { id: salaCriada.id },
      });
      expect(salaAtualizada?.nome).toBe(novoNome);
    });

    it('deve retornar erro quando sala não existe', async () => {
      const nonExistentId = 999999;

      const response = await agent
        .post(`/salas/editar/${nonExistentId}`)
        .type('form')
        .set('Accept', 'text/html')
        .send({
          ...mockSala,
          _csrf: csrfToken,
        });

      expect([StatusCodes.NOT_FOUND, StatusCodes.BAD_REQUEST]).toContain(
        response.status,
      );
    });

    it('deve retornar erro quando não autenticado', async () => {
      const unauthAgent = request.agent(app);

      //CSRF token
      const loginPage = await unauthAgent.get('/login');
      const newCsrfToken = extractCsrfTokenFromBody(loginPage);

      const response = await unauthAgent
        .post('/salas/editar/1')
        .type('form')
        .set('Accept', 'text/html')
        .send({
          ...mockSala,
          _csrf: newCsrfToken,
        });

      expect(response.status).toBe(StatusCodes.MOVED_TEMPORARILY);
      expect(response.header.location).toBe('/login');
    });
  });

  describe('POST /salas/excluir/:id', () => {
    it('deve excluir sala existente', async () => {
      const sala = await prisma.sala.create({ data: mockSala });

      const response = await agent
        .post(`/salas/excluir/${sala.id}`)
        .type('form')
        .set('Accept', 'text/html')
        .send({ _csrf: csrfToken });

      expect(response.status).toBe(StatusCodes.MOVED_TEMPORARILY);
      expect(response.header.location).toBe('/salas/gerenciar');

      const salaExcluida = await prisma.sala.findUnique({
        where: { id: sala.id },
      });
      expect(salaExcluida).toBeNull();
    });

    it('deve retornar erro para sala inexistente', async () => {
      const response = await agent
        .post('/salas/excluir/99999')
        .type('form')
        .set('Accept', 'text/html')
        .send({ _csrf: csrfToken });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it('deve retornar erro quando não autenticado', async () => {
      const unauthAgent = request.agent(app);

      const loginPage = await unauthAgent.get('/login');
      const newCsrfToken = extractCsrfTokenFromBody(loginPage);

      const response = await unauthAgent
        .post('/salas/excluir/1')
        .type('form')
        .set('Accept', 'text/html')
        .send({ _csrf: newCsrfToken });

      expect(response.status).toBe(StatusCodes.MOVED_TEMPORARILY);
      expect(response.header.location).toBe('/login');
    });
  });
});
