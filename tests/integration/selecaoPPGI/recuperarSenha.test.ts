import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { candidatos } from '../../../prisma/seed-data/candidatos';
import app from '../../../src/app';
import {
  MudarSenhaDto,
  RecuperarSenhaDto,
} from '../../../src/resources/candidato/candidato.types';
import candidatoService from '../../../src/resources/candidato/candidato.service';

function extractCsrfTokenFromBody(res: request.Response): string {
  const body = res.text;
  const csrfTokenMatch = body.match(/name="_csrf" value="([^"]+)"/);

  if (csrfTokenMatch && csrfTokenMatch[1]) {
    return csrfTokenMatch[1];
  } else {
    throw new Error('CSRF token não encontrado no corpo da resposta');
  }
}

jest.mock('../../../src/resources/email/emailService', () => ({
  sendEmail: jest.fn(),
}));

const agent = request.agent(app);
describe('Rota recuperarSenha', () => {
  let csrfToken: string;
  const candidato = candidatos[0];
  const pathTest = '/selecaoppgi/recuperarSenha';
  beforeAll(async () => {
    // Obter o formulário e o token CSRF
    const getResponse = await agent.get(pathTest);
    csrfToken = extractCsrfTokenFromBody(getResponse);
  });

  describe('GET /selecaoppgi/recuperarSenha', () => {
    it('deve renderizar a view recuperarSenha com status 200', async () => {
      const response = await agent.get(pathTest).set('Accept', 'text/html');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.text).toContain('<b>Recuperar senha</b>');
    });
  });

  describe('POST /selecaoppgi/recuperarSenha', () => {
    it('deve retornar 422 quando os dados são incompletos', async () => {
      const dataPost = {
        senha: 'password123',
      };
      const response = await agent
        .post(`${pathTest}?_csrf=${csrfToken}`)
        .send(dataPost)
        .set('Accept', 'application/json');

      expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    });

    it('deve retornar 404 quando o candidato não existe', async () => {
      const response = await agent
        .post(`${pathTest}?_csrf=${csrfToken}`)
        .send({
          email: 'fulano123@gmail.com',
          editalId: candidato.editalId,
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it('deve retornar 200 e enviar email de recuperação para o candidato', async () => {
      const loginValue: RecuperarSenhaDto = {
        email: candidato.email,
        editalId: candidato.editalId,
      };

      const response = await agent
        .post(`${pathTest}?_csrf=${csrfToken}`)
        .send(loginValue)
        .set('Accept', 'application/json');

      expect(response.status).toBe(StatusCodes.OK);
    });
  });
});

describe('Rota trocar senha', () => {
  let csrfToken: string;
  let tokenCorreto: string;
  const candidato = candidatos[0];
  const candidato2 = candidatos[1];
  const pathTest = '/selecaoppgi/trocarSenha';

  beforeAll(async () => {
    // Obter o formulário e o token CSRF
    const getResponse = await agent.get(pathTest);
    tokenCorreto = await candidatoService
      .findCandidatoByEmailAndEdital({
        editalId: candidato.editalId,
        email: candidato.email,
      })
      .then((candidato) => candidato.tokenResetSenha);
    csrfToken = extractCsrfTokenFromBody(getResponse);
  });

  describe('GET /selecaoppgi/trocarSenha', () => {
    it('deve renderizar a view com mensagem de token inválido', async () => {
      const response = await agent
        .get(`${pathTest}?token=invalid`)
        .set('Accept', 'text/html');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.text).toContain('Token inválido');
    });

    it('deve renderizar a view com mensagem de token expirado', async () => {
      const response = await agent
        .get(`${pathTest}?token=${candidato2.tokenResetSenha}`)
        .set('Accept', 'text/html');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.text).toContain('Token inválido');
    });

    it('deve renderizar a view corretamente', async () => {
      const response = await agent
        .get(`${pathTest}?token=${tokenCorreto}`)
        .set('Accept', 'text/html');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.text).not.toContain('Token inválido');
      expect(response.text).not.toContain('Token expirado');
    });
  });

  describe('POST /selecaoppgi/trocarSenha', () => {
    it('deve retornar 422 quando os dados são incompletos', async () => {
      const dataPost = {
        senha: 'password123',
      };
      const response = await agent
        .put(`${pathTest}?_csrf=${csrfToken}`)
        .send(dataPost)
        .set('Accept', 'application/json');

      expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    });

    it('deve retornar 200 quando o candidato mudar a senha', async () => {
      const dataPost: MudarSenhaDto = {
        senha: 'password123',
        token: tokenCorreto,
      };
      const response = await agent
        .put(`${pathTest}?_csrf=${csrfToken}`)
        .send(dataPost)
        .set('Accept', 'application/json');
      expect(response.status).toBe(StatusCodes.OK);
    });
  });
});
