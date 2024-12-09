import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import app from '../../../src/app';
import { SignUpDto } from '../../../src/resources/candidato/candidato.types';
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
describe('Rota SignUp', () => {
  let csrfToken: string;
  const candidato = candidatos[0];
  const pathTest = '/selecaoppgi/cadastro';
  beforeAll(async () => {
    // Obter o formulário e o token CSRF
    const getResponse = await agent.get(pathTest);
    csrfToken = extractCsrfTokenFromBody(getResponse);
  });

  describe('GET /selecaoppgi/cadastro', () => {
    it('deve renderizar a view signIn com status 200', async () => {
      const response = await agent.get(pathTest).set('Accept', 'text/html');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.text).toContain('<b>Instruções:</b>');
    });
  });

  describe('POST /selecaoppgi/cadastro', () => {
    it('deve retornar 422 quando os dados são incompletos', async () => {
      const dataPost = {
        senha: 'password123',
        editalId: 1,
      };
      const response = await agent
        .post(`${pathTest}?_csrf=${csrfToken}`)
        .send(dataPost)
        .set('Accept', 'application/json');

      expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    });

    it('deve retornar 409 quando o candidato já existe para o edital', async () => {
      const response = await agent
        .post(`${pathTest}?_csrf=${csrfToken}`)
        .send({
          email: candidato.email,
          senha: 'password1234',
          editalId: candidato.editalId,
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(StatusCodes.CONFLICT);
    });

    it('deve retornar 201 quando criar corretamente um candidato', async () => {
      const loginValue: SignUpDto = {
        email: 'teste2@gmail.com',
        senha: 'senha123',
        editalId: 1,
      };

      const response = await agent
        .post(`${pathTest}?_csrf=${csrfToken}`)
        .send(loginValue)
        .set('Accept', 'application/json');

      expect(response.status).toBe(StatusCodes.CREATED);
    });
  });
});
