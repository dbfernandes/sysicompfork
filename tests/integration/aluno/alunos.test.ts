import request from 'supertest';
import app from '../../src/app';
import bcrypt from 'bcrypt';
import prisma, { checkDatabaseConnection } from '../mocks/prismaClient';
import { StatusCodes } from 'http-status-codes';
import { CreateAlunoDto } from '../../src/resources/alunos/aluno.types';

const SENHA_TESTE = 'senha123';
const agent = request.agent(app);

// Função para extrair o token CSRF
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

describe('Alunos Integration Tests', () => {
  let csrfToken: string;

  // Mock de um usuário da secretaria para os testes
  const mockSecretaria = {
    email: 'secretaria@test.com',
    nomeCompleto: 'Secretaria Teste',
    cpf: '12345678901',
    professor: 0,
    status: 1,
    administrador: 0,
    coordenador: 0,
    secretaria: 1,
    diretor: 0,
    senhaHash: '',
    perfil: 'SECRETARIA',
    tokenResetSenha: null,
    validadeTokenResetSenha: null,
    createdAt: new Date(),
    updatedAt: new Date(),
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
      await prisma.aluno.deleteMany();
      await prisma.usuario.deleteMany();
      console.log('3. Banco limpo');

      // 3. Criar usuário da secretaria
      const senhaHash = await bcrypt.hash(SENHA_TESTE, 10);
      const secretariaData = {
        ...mockSecretaria,
        senhaHash,
      };

      const secretariaCriada = await prisma.usuario.create({
        data: secretariaData,
      });
      console.log('4. Usuário da secretaria criado:', {
        id: secretariaCriada.id,
        email: secretariaCriada.email,
      });

      // 4. Obter CSRF token inicial
      const loginPageResponse = await agent
        .get('/login')
        .set('Accept', 'text/html');

      console.log('5. Login page response:', {
        status: loginPageResponse.status,
        cookies: loginPageResponse.headers['set-cookie'],
      });

      csrfToken = extractCsrfTokenFromBody(loginPageResponse);
      console.log('6. CSRF token obtido:', csrfToken);

      // 5. Fazer login
      const loginResponse = await agent
        .post('/login')
        .type('form')
        .set('Accept', 'text/html')
        .send({
          cpf: mockSecretaria.cpf,
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
      const alunosResponse = await agent
        .get('/alunos')
        .set('Accept', 'text/html');

      csrfToken = extractCsrfTokenFromBody(alunosResponse);

      console.log('8. Setup completo');
    } catch (error) {
      console.error('Erro no setup:', error);
      throw error;
    }
  });

  beforeEach(async () => {
    // Limpar apenas os alunos antes de cada teste
    await prisma.aluno.deleteMany();

    // Atualizar CSRF token
    const page = await agent.get('/alunos').set('Accept', 'text/html');
    csrfToken = extractCsrfTokenFromBody(page);
  });

  afterAll(async () => {
    try {
      await prisma.aluno.deleteMany();
      await prisma.usuario.deleteMany();
      await prisma.$disconnect();
      console.log('Limpeza finalizada com sucesso!');
    } catch (error) {
      console.error('Erro na limpeza final:', error);
    }
  });

  describe('GET /alunos (Página de Gerenciamento)', () => {
    it('deve exibir página de gerenciamento para usuário da secretaria', async () => {
      const response = await agent.get('/alunos').set('Accept', 'text/html');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.text).toContain('Upload Lista de Alunos - SIE');
      expect(response.text).toContain('Listagem dos Alunos ICOMP em CSV');
    });

    it('deve redirecionar para login quando não autenticado', async () => {
      const unauthenticatedAgent = request(app);
      const response = await unauthenticatedAgent
        .get('/alunos')
        .set('Accept', 'text/html');

      expect(response.status).toBe(StatusCodes.MOVED_TEMPORARILY);
      expect(response.header.location).toBe('/login');
    });
  });

  describe('POST /alunos/importar (Importação de Alunos)', () => {
    it('deve importar lista de alunos com dados válidos', async () => {
      const alunos: CreateAlunoDto[] = [
        {
          nomeCompleto: 'Aluno Teste',
          curso: 'Ciência da Computação',
          periodoIngresso: '2024.1',
          periodoConclusao: '2028.1',
          formado: 0,
        },
        {
          nomeCompleto: 'Outro Aluno',
          curso: 'Engenharia de Software',
          periodoIngresso: '2024.2',
          periodoConclusao: '2028.2',
          formado: 0,
        },
      ];

      const response = await agent
        .post('/alunos/importar') // Updated from /alunos/upload
        .type('application/json')
        .set('Accept', 'application/json')
        .send({
          _csrf: csrfToken,
          alunos,
        });

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body.message).toBe(
        'Lista de alunos importada com sucesso',
      );

      // Verificar se os alunos foram salvos
      const alunosSalvos = await prisma.aluno.findMany();
      expect(alunosSalvos).toHaveLength(2);
      expect(alunosSalvos[0].nomeCompleto).toBe('Aluno Teste');
      expect(alunosSalvos[1].nomeCompleto).toBe('Outro Aluno');
    });

    it('deve rejeitar lista de alunos vazia', async () => {
      const response = await agent
        .post('/alunos/importar') // Updated from /alunos/upload
        .type('application/json')
        .set('Accept', 'application/json')
        .send({
          _csrf: csrfToken,
          alunos: [],
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.error).toBe('Lista de alunos vazia');
    });

    it('deve rejeitar dados sem a lista de alunos', async () => {
      const response = await agent
        .post('/alunos/importar') // Updated from /alunos/upload
        .type('application/json')
        .set('Accept', 'application/json')
        .send({
          _csrf: csrfToken,
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.error).toBe(
        'Dados inválidos: Lista de alunos não fornecida',
      );
    });

    it('deve rejeitar upload quando não autenticado', async () => {
      const unauthAgent = request.agent(app);
      const loginPage = await unauthAgent.get('/login');
      const newCsrfToken = extractCsrfTokenFromBody(loginPage);

      const response = await unauthAgent
        .post('/alunos/importar') // Updated from /alunos/upload
        .type('application/json')
        .set('Accept', 'application/json')
        .send({
          _csrf: newCsrfToken,
          alunos: [],
        });

      expect(response.status).toBe(StatusCodes.MOVED_TEMPORARILY);
      expect(response.header.location).toBe('/login');
    });
  });

  describe('Validação dos Dados', () => {
    it('deve processar diferentes cursos e status corretamente', async () => {
      const alunos: CreateAlunoDto[] = [
        {
          nomeCompleto: 'Aluno CC',
          curso: 'Ciência da Computação',
          periodoIngresso: '2024.1',
          periodoConclusao: '2028.1',
          formado: 0,
        },
        {
          nomeCompleto: 'Aluno ES',
          curso: 'Engenharia de Software',
          periodoIngresso: '2024.1',
          periodoConclusao: '2028.1',
          formado: 1,
        },
        {
          nomeCompleto: 'Aluno Mestrado',
          curso: 'Mestrado',
          periodoIngresso: '2024.1',
          periodoConclusao: '2026.1',
          formado: 0,
        },
      ];

      const response = await agent
        .post('/alunos/importar') // Updated from /alunos/upload
        .type('application/json')
        .set('Accept', 'application/json')
        .send({
          _csrf: csrfToken,
          alunos,
        });

      expect(response.status).toBe(StatusCodes.CREATED);

      // Verificar total de alunos
      const totalAlunos = await prisma.aluno.count();
      expect(totalAlunos).toBe(3);

      // Verificar distribuição por curso
      const alunosCC = await prisma.aluno.count({
        where: { curso: 'Ciência da Computação' },
      });
      const alunosES = await prisma.aluno.count({
        where: { curso: 'Engenharia de Software' },
      });
      const alunosMestrado = await prisma.aluno.count({
        where: { curso: 'Mestrado' },
      });

      expect(alunosCC).toBe(1);
      expect(alunosES).toBe(1);
      expect(alunosMestrado).toBe(1);

      // Verificar formados vs não formados
      const formados = await prisma.aluno.count({
        where: { formado: 1 },
      });
      const naoFormados = await prisma.aluno.count({
        where: { formado: 0 },
      });

      expect(formados).toBe(1);
      expect(naoFormados).toBe(2);
    });
  });
});
