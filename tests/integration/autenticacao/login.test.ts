import request from 'supertest';
import app from '../../../src/app';
import usuarioService from '../../../src/resources/usuarios/usuario.service';

const agent = request.agent(app);
describe('Rota login', () => {
    let csrfToken: string;
    beforeAll(async () => {
        // Obter o formulário e o token CSRF
        const getResponse = await agent.get('/login');
        csrfToken = getResponse.text.match(/_csrf" value="(.+?)"/)[1];
    });

    describe('GET /login', () => {
        it('deve renderizar a view login com status 200', async () => {
            const response = await agent.get('/login').set('Accept', 'text/html');

            expect(response.status).toBe(200);
            expect(response.text).toContain('<b>Login</b>');
        });
    })

    describe('POST /login', () => {
        it('deve redirecionar para / com status 302', async () => {
            console.log(await usuarioService.buscarUsuarioPor({ id: 1 }));
            const response = await agent.post('/login').send({
                cpf: '778.864.820-50',
                senha: 'senha123'
            }).set('Accept', 'application/json').set('Cookie', `csrf-token=${csrfToken}`);
            expect(response.status).toBe(302);
            expect(response.header.location).toBe('/');
        });
    })
})