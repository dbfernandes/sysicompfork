import request from 'supertest';
import app from '../../../src/app';
import editalService from '../../../src/resources/edital/edital.service';
import { StatusCodes } from 'http-status-codes';
import candidatoService from '@/resources/candidato/candidato.service';
import { SignInDto } from '@/resources/selecaoPPGI/selecao.ppgi.types';
import { CreateEditalDto } from '@/resources/edital/edital.types';

function extractCsrfTokenFromBody(res: request.Response): string {
  const body = res.text;
  const csrfTokenMatch = body.match(/name="_csrf" value="([^"]+)"/);

  if (csrfTokenMatch && csrfTokenMatch[1]) {
    return csrfTokenMatch[1];
  } else {
    throw new Error('CSRF token não encontrado no corpo da resposta');
  }
}

const listEditaisValues: CreateEditalDto[] = [
  {
    id: '001-2023', // mudou de editalId para id
    vagasDoutorado: 2, // mudou de vagaDoutorado para vagasDoutorado
    cotasDoutorado: 2,
    vagasMestrado: 5, // mudou de vagaMestrado para vagasMestrado
    cotasMestrado: 5,
    cartaOrientador: '1',
    cartaRecomendacao: '1',
    documento: 'http://www.propesp.ufam.edu.br',
    dataInicio: new Date('2023-08-23T00:00:00.000Z'), // convertido para Date
    dataFim: new Date('2023-09-09T00:00:00.000Z'), // convertido para Date
    status: 1, // convertido para number
    inscricoesIniciadas: 0,
    inscricoesEncerradas: 0,
  },
  {
    id: '002-2023',
    vagasDoutorado: 6,
    cotasDoutorado: 8,
    vagasMestrado: 1,
    cotasMestrado: 3,
    cartaOrientador: '0',
    cartaRecomendacao: '1',
    documento: 'http://www.propesp.ufam.edu.br',
    dataInicio: new Date('2023-06-01T00:00:00.000Z'),
    dataFim: new Date('2023-06-27T00:00:00.000Z'),
    status: 0,
    inscricoesIniciadas: 0,
    inscricoesEncerradas: 0,
  },
  {
    id: '003-2024',
    vagasDoutorado: 9,
    cotasDoutorado: 2,
    vagasMestrado: 2,
    cotasMestrado: 3,
    cartaOrientador: '1',
    cartaRecomendacao: '0',
    documento: 'http://www.propesp.ufam.edu.br',
    dataInicio: new Date('2024-07-14T00:00:00.000Z'),
    dataFim: new Date('2024-09-01T00:00:00.000Z'),
    status: 1,
    inscricoesIniciadas: 0,
    inscricoesEncerradas: 0,
  },
  {
    id: '004-2023',
    vagasDoutorado: 5,
    cotasDoutorado: 2,
    vagasMestrado: 10,
    cotasMestrado: 3,
    cartaOrientador: '1',
    cartaRecomendacao: '1',
    documento: 'http://www.propesp.ufam.edu.br',
    dataInicio: new Date('2024-09-01'),
    dataFim: new Date('2024-10-31'),
    status: 1,
    inscricoesIniciadas: 1,
    inscricoesEncerradas: 0,
  },
];

const candidateValue = {
  id: 1,
  posicaoEdital: 4,
  senhaHash: '$2b$10$iZ.MxrVV8u4jPpA8fFlTPOkO51GnJclQIxexd1rW25yIaXdO6h2U2',
  tokenResetSenha: null,
  validadeTokenReset: null,
  idEdital: '001-2023',
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

const agent = request.agent(app);
describe('Rota Login', () => {
  let csrfToken: string;

  beforeAll(async () => {
    await editalService.criarEdital(listEditaisValues[0]);
    await editalService.criarEdital(listEditaisValues[1]);

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
      await candidatoService.create({
        email: candidateValue.email,
        senha: 'password123',
        edital: candidateValue.idEdital,
      });

      const loginValue = {
        email: candidateValue.email,
        senha: 'password123',
        editalId: candidateValue.idEdital,
      } as SignInDto;

      const response = await agent
        .post(`/selecaoppgi/entrar?_csrf=${csrfToken}`)
        .send(loginValue)
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
    });

    it('deve retornar 422 quando os dados são incompletos', async () => {
      const response = await agent
        .post(`/selecaoppgi/entrar?_csrf=${csrfToken}`)
        .send({
          email: candidateValue.email,
          senha: 'password123',
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    });

    it('deve retornar 401 quando o candidato não é autenticado', async () => {
      const response = await agent
        .post(`/selecaoppgi/entrar?_csrf=${csrfToken}`)
        .send({
          email: candidateValue.email,
          senha: 'password1234',
          idEdital: candidateValue.idEdital,
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('deve retornar 403 quando o candidato já finalizou a inscrição(Em implementação)', async () => {
      const response = await agent
        .post(`/selecaoppgi/entrar?_csrf=${csrfToken}`)
        .send({
          email: candidateValue.email,
          senha: 'password1234',
          idEdital: candidateValue.idEdital,
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });
  });
});
