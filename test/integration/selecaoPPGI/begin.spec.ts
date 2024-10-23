// test/integration/begin.spec.ts

import request from 'supertest';
import app from '../../../src/app';

describe('Rota Begin', () => {
  describe('GET /', () => {
    it('deve renderizar a view begin com status 200', async () => {
      const response = await request(app)
        .get('/selecaoppgi')
        .set('Accept', 'text/html');

      expect(response.status).toBe(200);
      expect(response.text).toContain(
        `Formulário de Inscrição no Processo Seletivo para Mestrado/Doutorado - PPGI/UFAM`,
      );
    });
  });
});
