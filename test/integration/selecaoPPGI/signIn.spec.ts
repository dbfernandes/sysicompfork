import request from 'supertest';
import app from '../../../src/app';
import candidatoService from '../../../src/resources/candidato/candidato.service';
import EditalService from '../../../src/resources/edital/edital.service';

function extractCsrfTokenFromBody(res: request.Response): string {
  const body = res.text;
  const csrfTokenMatch = body.match(/name="_csrf" value="([^"]+)"/);

  if (csrfTokenMatch && csrfTokenMatch[1]) {
    return csrfTokenMatch[1];
  } else {
    throw new Error('CSRF token não encontrado no corpo da resposta');
  }
}

// Mock dos serviços
jest.mock('../../../src/resources/candidato/candidato.service');
jest.mock('../../../src/resources/edital/edital.service');

const listEditaisValues = [
  {
    editalId: '001-2023',
    vagaDoutorado: 2,
    cotasDoutorado: 2,
    vagaMestrado: 5,
    cotasMestrado: 5,
    cartaOrientador: '1',
    cartaRecomendacao: '1',
    documento: 'http://www.propesp.ufam.edu.br',
    dataInicio: '2023-08-23T00:00:00.000Z',
    dataFim: '2023-09-09T00:00:00.000Z',
    status: '1',
    inscricoesIniciadas: 0,
    inscricoesEncerradas: 0,
    createdAt: new Date('2024-10-04T12:32:05.000Z'),
    updatedAt: new Date('2024-10-04T12:32:05.000Z'),
  },
  {
    editalId: '002-2023',
    vagaDoutorado: 6,
    cotasDoutorado: 8,
    vagaMestrado: 1,
    cotasMestrado: 3,
    cartaOrientador: '0',
    cartaRecomendacao: '1',
    documento: 'http://www.propesp.ufam.edu.br',
    dataInicio: '2023-06-01T00:00:00.000Z',
    dataFim: '2023-06-27T00:00:00.000Z',
    status: '0',
    inscricoesIniciadas: 0,
    inscricoesEncerradas: 0,
    createdAt: new Date('2024-10-04T12:32:05.000Z'),
    updatedAt: new Date('2024-10-04T12:32:05.000Z'),
  },
  {
    editalId: '003-2024',
    vagaDoutorado: 9,
    cotasDoutorado: 2,
    vagaMestrado: 2,
    cotasMestrado: 3,
    cartaOrientador: '1',
    cartaRecomendacao: '0',
    documento: 'http://www.propesp.ufam.edu.br',
    dataInicio: '2024-07-14T00:00:00.000Z',
    dataFim: '2024-09-01T00:00:00.000Z',
    status: '1',
    inscricoesIniciadas: 0,
    inscricoesEncerradas: 0,
    createdAt: new Date('2024-10-04T12:32:05.000Z'),
    updatedAt: new Date('2024-10-04T12:32:05.000Z'),
  },
  {
    editalId: '004-2023',
    vagaDoutorado: 5,
    cotasDoutorado: 2,
    vagaMestrado: 10,
    cotasMestrado: 3,
    cartaOrientador: '1',
    cartaRecomendacao: '1',
    documento: 'http://www.propesp.ufam.edu.br',
    dataInicio: '2024-09-01',
    dataFim: '2024-10-31',
    status: '1',
    inscricoesIniciadas: 1,
    inscricoesEncerradas: 0,
    createdAt: new Date('2024-10-04T12:32:05.000Z'),
    updatedAt: new Date('2024-10-04T12:33:24.042Z'),
  },
];

const candidateValue = {
  id: 1,
  posicaoEdital: 4,
  senhaHash: '$2b$10$iZ.MxrVV8u4jPpA8fFlTPOkO51GnJclQIxexd1rW25yIaXdO6h2U2',
  tokenResetSenha: null,
  validadeTokenReset: null,
  idEdital: '004-2023',
  idLinhaPesquisa: 1,
  nome: 'Francisco Rivail Santos da Luz Junior',
  email: 'test@example.com',
  dataNascimento: new Date('2003-04-27T00:00:00.000Z'),
  pais: null,
  passaporte: null,
  cpf: '700.833.382-09',
  sexo: 'M',
  nomeSocial: '',
  cep: '69089-140',
  uf: 'AM',
  endereco: 'Rua Rio Xanxerê',
  cidade: 'Manaus',
  bairro: 'Armando Mendes',
  nacionalidade: 'Brasileira',
  telefone: '(92)99299-9106',
  telefoneSecundario: null,
  comoSoube: 'Facebook',
  cursoDesejado: 'Mestrado',
  regime: 'Integral',
  cotista: false,
  cotistaTipo: '',
  condicao: false,
  condicaoTipo: '',
  bolsista: false,
  cursoGraduacao: 'Ciência da Computação',
  instituicaoGraduacao: 'UFAM',
  anoEgressoGraduacao: '2000',
  cursoPos: '',
  tipoPos: null,
  instituicaoPos: '',
  anoEgressoPos: '',
  tituloProposta: 'teste',
  motivos: '',
  nomeOrientador: 'teste',
};

// const entrarValue = {
//   email: 'test@example.com',
//   senha: 'password123',
//   edital: '1',
// };

const agent = request.agent(app);
describe('Rota Login', () => {
  let csrfToken: string;

  beforeAll(async () => {
    // Mock do EditalService
    const EditalServiceMock = EditalService as jest.Mocked<
      typeof EditalService
    >;
    EditalServiceMock.listEdital.mockResolvedValue(listEditaisValues);

    // Obter o formulário e o token CSRF
    const getResponse = await agent.get('/selecaoppgi/entrar');
    csrfToken = extractCsrfTokenFromBody(getResponse);
  });

  describe('GET /selecaoppgi/entrar', () => {
    it('deve renderizar a view signIn com status 200', async () => {
      const response = await agent
        .get('/selecaoppgi/entrar')
        .set('Accept', 'text/html');

      expect(response.status).toBe(200);
      expect(response.text).toContain('<b>Login</b>'); // Ajuste conforme o conteúdo da sua view
    });
  });

  describe('POST /selecaoppgi/entrar', () => {
    it('deve autenticar e iniciar sessão quando os dados são válidos', async () => {
      const candidatoServiceMock = candidatoService as jest.Mocked<
        typeof candidatoService
      >;
      candidatoServiceMock.auth.mockResolvedValue(candidateValue);

      const response = await agent
        .post('/selecaoppgi/entrar')
        .send({
          email: 'test@example.com',
          senha: 'password123',
          edital: '1',
          _csrf: csrfToken,
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
    });

    it('deve retornar 400 quando os dados são incompletos', async () => {
      const response = await agent
        .post('/selecaoppgi/entrar')
        .send({
          email: 'test@example.com',
          senha: '',
          edital: '1',
          _csrf: csrfToken,
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
    });

    it('deve retornar 406 quando o candidato não é autenticado', async () => {
      const candidatoServiceMock = candidatoService as jest.Mocked<
        typeof candidatoService
      >;
      candidatoServiceMock.auth.mockResolvedValue(null);

      const response = await agent
        .post('/selecaoppgi/entrar')
        .send({
          email: 'invalid@example.com',
          senha: 'wrongpassword',
          edital: '1',
          _csrf: csrfToken,
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(406);
    });

    it('deve retornar 401 quando o candidato não está na posição adequada', async () => {
      const candidatoServiceMock = candidatoService as jest.Mocked<
        typeof candidatoService
      >;
      candidatoServiceMock.auth.mockResolvedValue({
        ...candidateValue,
        posicaoEdital: 5,
      });

      const response = await agent
        .post('/selecaoppgi/entrar')
        .send({
          email: 'test@example.com',
          senha: 'Senha123',
          edital: '001-023',
          _csrf: csrfToken,
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(401);
    });

    it('deve retornar 500 em caso de erro no servidor', async () => {
      const candidatoServiceMock = candidatoService as jest.Mocked<
        typeof candidatoService
      >;
      candidatoServiceMock.auth.mockRejectedValue(
        new Error('Erro no servidor'),
      );

      const response = await agent
        .post('/selecaoppgi/entrar')
        .send({
          email: 'test@example.com',
          senha: 'password123',
          edital: '1',
          _csrf: csrfToken,
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(500);
    });
  });
});
