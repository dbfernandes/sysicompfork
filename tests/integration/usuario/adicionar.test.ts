import request from 'supertest';
import app from '../../../src/app';



const agent = request.agent(app);


describe('Rota adicionar usuario', () => {



    describe('GET /usuario/adicionar', () => {
        it('deve renderizar a view adicionar com status 200', async () => {
            const response = await agent.get('/usuario/adicionar').set('Accept', 'text/html');

            expect(response.status).toBe(200);
            expect(response.text).toContain('<b>Adicionar usuário</b>');
        });
    })

});