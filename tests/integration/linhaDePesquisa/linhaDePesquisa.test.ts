import request from 'supertest';
import app from '../../../src/app';
import bcrypt from 'bcrypt';
import prisma, { checkDatabaseConnection } from '../../mocks/prismaClient';
import { StatusCodes } from 'http-status-codes';
import { Prisma } from '@prisma/client';
import { CreateLinhaDePesquisaDto } from '../../../src/resources/linhasDePesquisa/linha.de.pesquisa.types';

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

describe('Linhas de Pesquisa Integration Tests', () => {
  let csrfToken: string;

  // Mock do coordenador para os testes
  const mockCoordenador: Prisma.UsuarioCreateInput = {
    email: 'coordenador@test.com',
    nomeCompleto: 'Coordenador Teste',
    cpf: '98765432101',
    professor: 1,
    status: 1,
    administrador: 0,
    coordenador: 1, // É coordenador
    secretaria: 0,
    diretor: 0,
    senhaHash: '',
    perfil: 'COORDENADOR',
  };

  // Dados de exemplo para criar linha de pesquisa
  const mockLinhaPesquisa: CreateLinhaDePesquisaDto = {
    nome: 'Inteligência Artificial',
    sigla: 'IA',
  };

  beforeAll(async () => {
    try {
      // Verifica conexão com o banco
      const isConnected = await checkDatabaseConnection();
      if (!isConnected) {
        throw new Error('Não foi possível conectar ao banco de dados');
      }

      // Limpa dados existentes
      await prisma.linhaPesquisa.deleteMany();
      await prisma.usuario.deleteMany();

      // Cria coordenador
      const senhaHash = await bcrypt.hash(SENHA_TESTE, 10);
      await prisma.usuario.create({
        data: {
          ...mockCoordenador,
          senhaHash,
        },
      });

      // Autenticação como coordenador
      const loginPageResponse = await agent
        .get('/login')
        .set('Accept', 'text/html');

      csrfToken = extractCsrfTokenFromBody(loginPageResponse);

      await agent.post('/login').type('form').set('Accept', 'text/html').send({
        cpf: mockCoordenador.cpf,
        senha: SENHA_TESTE,
        _csrf: csrfToken,
      });

      // Obtém novo CSRF token após login
      const linhasResponse = await agent
        .get('/linhasDePesquisa/listar')
        .set('Accept', 'text/html');

      csrfToken = extractCsrfTokenFromBody(linhasResponse);
    } catch (error) {
      console.error('Erro no setup:', error);
      throw error;
    }
  });

  beforeEach(async () => {
    // Limpa as linhas de pesquisa antes de cada teste
    await prisma.linhaPesquisa.deleteMany();

    // Atualiza o CSRF token
    const page = await agent
      .get('/linhasDePesquisa/listar')
      .set('Accept', 'text/html');

    try {
      csrfToken = extractCsrfTokenFromBody(page);
    } catch (error) {
      console.log(
        'Erro ao extrair CSRF token. Tentando da página de criação...',
      );
      const criarPage = await agent
        .get('/linhasDePesquisa/criar')
        .set('Accept', 'text/html');

      csrfToken = extractCsrfTokenFromBody(criarPage);
    }
  });

  afterAll(async () => {
    await prisma.linhaPesquisa.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.$disconnect();
  });

  describe('GET /linhasDePesquisa/listar', () => {
    it('deve exibir página de listagem quando existem linhas de pesquisa', async () => {
      // Cria uma linha de pesquisa para a listagem
      await prisma.linhaPesquisa.create({
        data: mockLinhaPesquisa,
      });

      const response = await agent
        .get('/linhasDePesquisa/listar')
        .set('Accept', 'text/html');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.text).toContain('Linhas De Pesquisa');
      expect(response.text).toContain(mockLinhaPesquisa.nome);
      expect(response.text).toContain(mockLinhaPesquisa.sigla);
    });

    it('deve exibir mensagem quando não existem linhas de pesquisa', async () => {
      // Não cria nenhuma linha de pesquisa
      const response = await agent
        .get('/linhasDePesquisa/listar')
        .set('Accept', 'text/html');

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.text).toContain('Nenhuma linha de pesquisa cadastrada');
    });
  });

  describe('GET /linhasDePesquisa/busca/:id', () => {
    it('deve exibir detalhes de uma linha de pesquisa existente', async () => {
      // Cria uma linha de pesquisa para buscar
      const linhaPesquisa = await prisma.linhaPesquisa.create({
        data: mockLinhaPesquisa,
      });

      const response = await agent
        .get(`/linhasDePesquisa/busca/${linhaPesquisa.id}`)
        .set('Accept', 'text/html');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.text).toContain(mockLinhaPesquisa.nome);
      expect(response.text).toContain(mockLinhaPesquisa.sigla);
    });

    it('deve retornar erro para ID inexistente', async () => {
      const response = await agent
        .get('/linhasDePesquisa/busca/99999')
        .set('Accept', 'text/html');

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe('GET e POST /linhasDePesquisa/criar', () => {
    it('deve exibir formulário de criação', async () => {
      const response = await agent
        .get('/linhasDePesquisa/criar')
        .set('Accept', 'text/html');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.text).toContain('Criar Linha de Pesquisa');
    });

    it('deve criar uma nova linha de pesquisa com dados válidos', async () => {
      const linhaData = {
        nome: 'Nova Linha de Pesquisa',
        sigla: 'NLP',
        _csrf: csrfToken,
      };

      const response = await agent
        .post('/linhasDePesquisa/criar')
        .type('form')
        .set('Accept', 'text/html')
        .send(linhaData);

      expect(response.status).toBe(StatusCodes.MOVED_TEMPORARILY); // 302 redirect
      expect(response.header.location).toBe('/linhasDePesquisa/listar');

      // Verifica se a linha foi criada no banco
      const linhaCriada = await prisma.linhaPesquisa.findFirst({
        where: { nome: linhaData.nome },
      });

      expect(linhaCriada).toBeTruthy();
      expect(linhaCriada?.nome).toBe(linhaData.nome);
      expect(linhaCriada?.sigla).toBe(linhaData.sigla);
    });

    it('não deve permitir criar linha com nome duplicado', async () => {
      // Primeiro, cria uma linha
      await prisma.linhaPesquisa.create({
        data: mockLinhaPesquisa,
      });

      // Tenta criar outra com o mesmo nome
      const linhaData = {
        nome: mockLinhaPesquisa.nome,
        sigla: 'LP2',
        _csrf: csrfToken,
      };

      const response = await agent
        .post('/linhasDePesquisa/criar')
        .type('form')
        .set('Accept', 'text/html')
        .send(linhaData);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.text).toContain('Linha de Pesquisa já cadastrada');
    });

    it('não deve permitir criar linha com sigla duplicada', async () => {
      // Primeiro, cria uma linha
      await prisma.linhaPesquisa.create({
        data: mockLinhaPesquisa,
      });

      // Tenta criar outra com a mesma sigla
      const linhaData = {
        nome: 'Linha diferente',
        sigla: mockLinhaPesquisa.sigla,
        _csrf: csrfToken,
      };

      const response = await agent
        .post('/linhasDePesquisa/criar')
        .type('form')
        .set('Accept', 'text/html')
        .send(linhaData);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.text).toContain('Sigla já cadastrada');
    });
  });

  describe('GET e POST /linhasDePesquisa/editar/:id', () => {
    it('deve exibir formulário de edição com dados da linha existente', async () => {
      // Cria uma linha para editar
      const linhaPesquisa = await prisma.linhaPesquisa.create({
        data: mockLinhaPesquisa,
      });

      const response = await agent
        .get(`/linhasDePesquisa/editar/${linhaPesquisa.id}`)
        .set('Accept', 'text/html');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.text).toContain('Editar Linha de Pesquisa');
      expect(response.text).toContain(mockLinhaPesquisa.nome);
      expect(response.text).toContain(mockLinhaPesquisa.sigla);
    });

    it('deve atualizar uma linha existente com dados válidos', async () => {
      // Cria uma linha para editar
      const linhaPesquisa = await prisma.linhaPesquisa.create({
        data: mockLinhaPesquisa,
      });

      const dadosAtualizados = {
        nome: 'Nome Atualizado',
        sigla: 'NA',
        _csrf: csrfToken,
      };

      const response = await agent
        .post(`/linhasDePesquisa/editar/${linhaPesquisa.id}`)
        .type('form')
        .set('Accept', 'text/html')
        .send(dadosAtualizados);

      expect(response.status).toBe(StatusCodes.MOVED_TEMPORARILY); // 302 redirect
      expect(response.header.location).toBe('/linhasDePesquisa/listar');

      // Verifica se a linha foi atualizada no banco
      const linhaAtualizada = await prisma.linhaPesquisa.findUnique({
        where: { id: linhaPesquisa.id },
      });

      expect(linhaAtualizada).toBeTruthy();
      expect(linhaAtualizada?.nome).toBe(dadosAtualizados.nome);
      expect(linhaAtualizada?.sigla).toBe(dadosAtualizados.sigla);
    });

    it('não deve permitir atualizar com nome já existente em outra linha', async () => {
      // Cria duas linhas
      await prisma.linhaPesquisa.create({
        data: mockLinhaPesquisa,
      });

      const linha2 = await prisma.linhaPesquisa.create({
        data: {
          nome: 'Linha 2',
          sigla: 'L2',
        },
      });

      // Tenta atualizar linha2 com o nome da linha1
      const dadosAtualizados = {
        nome: mockLinhaPesquisa.nome,
        sigla: 'L2A',
        _csrf: csrfToken,
      };

      const response = await agent
        .post(`/linhasDePesquisa/editar/${linha2.id}`)
        .type('form')
        .set('Accept', 'text/html')
        .send(dadosAtualizados);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.text).toContain('Linha de Pesquisa já cadastrada');
    });
  });

  describe('POST /linhasDePesquisa/remover/:id', () => {
    it('deve remover uma linha existente', async () => {
      // Cria uma linha para remover
      const linhaPesquisa = await prisma.linhaPesquisa.create({
        data: mockLinhaPesquisa,
      });

      const response = await agent
        .post(`/linhasDePesquisa/remover/${linhaPesquisa.id}`)
        .type('form')
        .set('Accept', 'text/html')
        .send({ _csrf: csrfToken });

      expect(response.status).toBe(StatusCodes.MOVED_TEMPORARILY); // 302 redirect
      expect(response.header.location).toBe('/linhasDePesquisa/listar');

      // Verifica se a linha foi removida
      const linhaRemovida = await prisma.linhaPesquisa.findUnique({
        where: { id: linhaPesquisa.id },
      });

      expect(linhaRemovida).toBeNull();
    });
  });

  describe('Verificação de autorização', () => {
    it('não deve permitir acesso a /criar para usuários não coordenadores', async () => {
      // Precisamos criar um agente sem autenticação
      const noAuthAgent = request.agent(app);

      // Tenta acessar a página de criar
      const response = await noAuthAgent
        .get('/linhasDePesquisa/criar')
        .set('Accept', 'text/html');

      // Deve redirecionar para login ou negar acesso
      expect([StatusCodes.MOVED_TEMPORARILY, StatusCodes.FORBIDDEN]).toContain(
        response.status,
      );
    });
  });
});
