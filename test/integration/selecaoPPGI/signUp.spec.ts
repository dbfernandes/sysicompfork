// test/integration/signUp.spec.ts
import request from 'supertest';
import app from '../../../src/app'; // Ajuste o caminho conforme necessário
import candidatoService from '../../../src/resources/candidato/candidato.service';
import EditalService from '../../../src/resources/edital/edital.service';

// Mock dos serviços
jest.mock('../../../src/resources/candidato/candidato.service');
jest.mock('../../../src/resources/edital/edital.service');

const agent = request.agent(app);
let csrfToken: string;

function extractCsrfTokenFromBody(res: request.Response): string {
  const body = res.text;

  // Expressão regular para encontrar o campo _csrf no HTML
  const csrfTokenMatch = body.match(/name="_csrf" value="([^"]+)"/);

  if (csrfTokenMatch && csrfTokenMatch[1]) {
    return csrfTokenMatch[1];
  } else {
    throw new Error('CSRF token não encontrado no corpo da resposta');
  }
}

describe('Rota SignUp', () => {
  beforeAll(async () => {
    // Configurar mocks antes dos testes
    (EditalService.listEditaisDisponiveis as jest.Mock).mockResolvedValue([
      // Mock dos editais disponíveis
      { id: 1, name: 'Edital 1' },
    ]);
    const response = await agent.get('/selecaoppgi/cadastro');
    csrfToken = extractCsrfTokenFromBody(response);
  });

  describe('GET /selecaoppgi/cadastro', () => {
    it('deve renderizar a view signUp com status 200', async () => {
      const response = await request(app)
        .get('/selecaoppgi/cadastro')
        .set('Accept', 'text/html');
      expect(response.status).toBe(200);
      expect(response.text).toContain('<h1>Editais Disponíveis</h1>');
    });
  });

  describe('POST /selecaoppgi/cadastro', () => {
    it('deve criar um novo candidato quando os dados são válidos', async () => {
      (
        candidatoService.findCandidatoByEmailAndEdital as jest.Mock
      ).mockResolvedValue(null);
      (candidatoService.create as jest.Mock).mockResolvedValue({
        email: 'test@example.com',
        idEdital: 1,
        id: 123,
        posicaoEdital: 1,
      });
      const response = await agent
        .post('/selecaoppgi/cadastro')
        .send({
          email: 'test@example.com',
          senha: 'password123',
          edital: '1',
          _csrf: csrfToken,
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(201);
    });

    it('deve retornar 403 quando os dados são incompletos', async () => {
      const response = await agent
        .post('/selecaoppgi/cadastro')
        .send({
          email: 'test@example.com',
          senha: '',
          edital: '1',
          _csrf: csrfToken,
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Dados incompletos ou mal formatados');
    });

    it('deve retornar 409 quando o candidato já existe', async () => {
      (
        candidatoService.findCandidatoByEmailAndEdital as jest.Mock
      ).mockResolvedValue({
        id: 123,
        email: 'existing@example.com',
      });

      const response = await agent
        .post('/selecaoppgi/cadastro')
        .send({
          email: 'existing@example.com',
          senha: 'password123',
          edital: '1',
          _csrf: csrfToken,
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Candidato já existe para este edital');
    });

    it('deve retornar 500 em caso de erro no servidor', async () => {
      (
        candidatoService.findCandidatoByEmailAndEdital as jest.Mock
      ).mockResolvedValue(null);
      (candidatoService.create as jest.Mock).mockRejectedValue(
        new Error('Erro no banco de dados'),
      );

      const response = await agent
        .post('/selecaoppgi/cadastro')
        .send({
          email: 'test@example.com',
          senha: 'password123',
          edital: '1',
          _csrf: csrfToken,
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Não foi possível criar o candidato');
    });
  });
});
