import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import app from '../../../src/app';
import { SignInDto } from '../../../src/resources/candidato/candidato.types';
import { candidatos } from '../../../prisma/seed-data/candidatos';

function extractCsrfTokenFromBody(res: request.Response): string {
  const body = res.text;
  const csrfTokenMatch = body.match(/name="_csrf" value="([^"]+)"/);

  if (csrfTokenMatch && csrfTokenMatch[1]) {
    return csrfTokenMatch[1];
  } else {
    throw new Error('CSRF token não encontrado no corpo da resposta');
  }
}

const agent = request.agent(app);
describe('Rota Login', () => {
  let csrfToken: string;
  const candidato = candidatos[0];
  beforeAll(async () => {
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
      expect(response.text).toContain('<b>Login</b>');
    });
  });

  describe('POST /selecaoppgi/entrar', () => {
    it('deve autenticar e iniciar sessão quando os dados são válidos', async () => {
      const loginValue: SignInDto = {
        email: candidato.email,
        senha: 'senha123',
        editalId: candidato.editalId,
      };

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
          email: candidato.email,
          senha: 'password123',
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    });

    it('deve retornar 401 quando o candidato não é autenticado', async () => {
      const response = await agent
        .post(`/selecaoppgi/entrar?_csrf=${csrfToken}`)
        .send({
          email: candidato.email,
          senha: 'password1234',
          editalId: candidato.editalId,
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('deve retornar 403 quando o candidato já finalizou a inscrição(Em implementação)', async () => {
      const response = await agent
        .post(`/selecaoppgi/entrar?_csrf=${csrfToken}`)
        .send({
          email: candidato.email,
          senha: 'password1234',
          editalId: candidato.editalId,
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });
  });
});
