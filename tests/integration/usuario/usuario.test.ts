import request from 'supertest';
import app from '../../../src/app';
import usuarioService from '../../../src/resources/usuarios/usuario.service';
import bcrypt from 'bcrypt';
import prisma, { checkDatabaseConnection } from '../../mocks/prismaClient';
import { StatusCodes } from 'http-status-codes';
import { CreateUsuarioDto } from '../../../src/resources/usuarios/usuario.types';
import { email } from 'envalid';

const SENHA_TESTE = 'senha123';
const agent = request.agent(app);


describe('Testes de Intregracao: Usuario', () => {
    let csrfToken: string;

    const usuarioMock: CreateUsuarioDto = {
        nomeCompleto: 'Usuário Mock',
        email: 'test@email.com',
        cpf: '77886482050',
        senhaHash: 'senha123',
        status: 1,
        administrador: 1,
        coordenador: 0,
        diretor: 1,
        secretaria: 1,
        professor: 1,
        dataIngresso: new Date(),
        endereco: '',
        formacao: '',
        formacaoIngles: '',
        lattesId: null,
        perfil: null,
        resumo: null,
        tokenResetSenha: null,
        validadeTokenResetSenha: null,
        telCelular: '',
        telResidencial: '',
        resumoIngles: '',
        siape: '',
        turno: '',
        ultimaAtualizacao: null,
        unidade: '',

    }

    beforeAll(async () => {
        try {
            console.log('1. Verificando conexão com banco de dados...');
            const isConnected = await checkDatabaseConnection();
            if (!isConnected) {
                throw new Error('Sem conexão com o banco de dados');
            }
            console.log('2. Conexão estabelecida')

            await prisma.usuario.deleteMany();
            console.log('3. Banco limpo');

            const senhaHash = await bcrypt.hash(SENHA_TESTE, 10);
            const usuario = {
                ...usuarioMock,
                senhaHash
            }

            const usuarioCriado = await prisma.usuario.create({
                data: usuario
            });

            console.log('4. Usuário mock criado:', usuarioCriado);

            const loginPageResponse = await agent
                .get('/login')
                .set('Accept', 'text/html');
            console.log('5. Login page response:', {
                status: loginPageResponse.status,
                cookies: loginPageResponse.headers['set-cookie'],
            });

            const csrfMatch = loginPageResponse.text.match(
                /<input[^>]*name="_csrf"[^>]*value="([^"]*)"[^>]*>/,
            );
            if (!csrfMatch) {
                console.log('Login Page HTML:', loginPageResponse.text);
                throw new Error('CSRF token não encontrado');
            }
            csrfToken = csrfMatch[1];
            console.log('6. CSRF token obtido:', csrfToken);

            const loginResponse = await agent
                .post('/login')
                .type('form')
                .set('Accept', 'application/json')
                .send({
                    cpf: usuario.cpf,
                    senha: SENHA_TESTE,
                    _csrf: csrfToken,
                });
            console.log('7. Login response:', {
                status: loginResponse.status,
                location: loginResponse.header.location,
            });

            if (
                loginResponse.status !== 302 ||
                !loginResponse.header.location?.includes('/inicio')
            ) {
                throw new Error(`Login falhou: ${loginResponse.status}`);
            }

            const gerenciarResponse = await agent
                .get('/usuarios/listar')
                .set('Accept', 'text/html');

            const newCsrfMatch = gerenciarResponse.text.match(
                /<input[^>]*name="_csrf"[^>]*value="([^"]*)"[^>]*>/,
            );
            if (newCsrfMatch) {
                csrfToken = newCsrfMatch[1];
            }

            console.log('8. Setup completo:', {
                status: gerenciarResponse.status,
                finalCsrfToken: csrfToken,
            });

        } catch (error) {
            console.error('Erro no setup:', error);
            throw error;
        }
    });

    beforeEach(async () => {
        await prisma.usuario.deleteMany();

        const page = await agent.get('/usuarios/adicionar').set('Accept', 'text/html');

        const csrfMatch = page.text.match(
            /<input[^>]*name="_csrf"[^>]*value="([^"]*)"[^>]*>/,
        );
        if (csrfMatch) {
            csrfToken = csrfMatch[1];
        }
    })

    afterAll(async () => {
        try {
            await prisma.usuario.deleteMany();
            await prisma.$disconnect();
            console.log('Teardown completo');
        } catch (error) {
            console.error('Erro no teardown:', error);
            throw error;
        }
    })

    describe('GET /usuarios/adicionar', () => {
        it('deve listar a página de adicionar usuário', async () => {
            const response = await agent.get('/usuarios/adicionar').set('Accept', 'text/html');

            expect(response.status).toEqual(StatusCodes.OK);
        })
    })

    describe('POST /usuario/adicionar', () => {
        it('deve adicionar um usuário', async () => {
            const usuario = {
                nomeCompleto: 'Usuário Teste',
                email: 'email',
                cpf: '77886482050',
                senhaHash: 'senha123',
                status: 1,
                administrador: 1,
                coordenador: 0,
                diretor: 1,
                secretaria: 1,
                professor: 1,
            }

            const response = await agent.post('/usuarios/adicionar').type('form').set('Accept', 'application/json').send({
                ...usuario,
                senha: SENHA_TESTE,
                _csrf: csrfToken
            });

            expect(response.status).toEqual(StatusCodes.MOVED_TEMPORARILY);
            expect(response.header.location).toContain('/usuarios/listar');
        })

        it('Deve retornar status 400 se o CPF já estiver cadastrado.', async () => {
            const usuarioExistente = {
                nomeCompleto: 'UsuárioExistente',
                email: 'email@exemplo.com',
                cpf: '77886482050',
                senhaHash: 'senha123',
                status: 1,
                administrador: 1,
                coordenador: 0,
                diretor: 1,
                secretaria: 1,
                professor: 1,
            }

            const usuario = {
                nomeCompleto: 'Usuário Teste',
                email: 'email',
                cpf: '77886482050',
                senhaHash: 'senha123',
                status: 1,
                administrador: 1,
                coordenador: 0,
                diretor: 1,
                secretaria: 1,
                professor: 1,
            }

            await prisma.usuario.create({
                data: usuarioExistente
            })

            const response = await agent.post('/usuarios/adicionar').type('form').set('Accept', 'application/json').send({
                ...usuario,
                senha: SENHA_TESTE,
                _csrf: csrfToken
            });

            expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
        })
    })

    describe('POST /usuarios/bloquear/:id', () => {
        it('deve excluir um usuário', async () => {
            const usuario = {
                nomeCompleto: 'Usuário Teste',
                email: 'email',
                cpf: '77886482050',
                senhaHash: 'senha123',
                status: 1,
                administrador: 1,
                coordenador: 0,
                diretor: 1,
                secretaria: 1,
                professor: 1,
            }

            const usuarioCriado = await prisma.usuario.create({
                data: {
                    ...usuario,
                    senhaHash: await bcrypt.hash(SENHA_TESTE, 10)
                }
            })

            const response = await agent.post(`/usuarios/bloquear/${usuarioCriado.id}`)
                .type('form')
                .set('Accept', 'application/json')
                .send({
                    _csrf: csrfToken
                });

            expect(response.status).toEqual(StatusCodes.MOVED_TEMPORARILY);
            expect(response.header.location).toContain('/usuarios/listar');
        })
    })

    describe('POST /usuarios/restaurar/:id', () => {
        it('deve restaurar um usuário', async () => {
            const usuario = {
                nomeCompleto: 'Usuário Teste',
                email: 'email',
                cpf: '77886482050',
                senhaHash: 'senha123',
                status: 0,
                administrador: 1,
                coordenador: 0,
                diretor: 1,
                secretaria: 1,
                professor: 1,
            }

            const usuarioCriado = await prisma.usuario.create({
                data: {
                    ...usuario,
                    senhaHash: await bcrypt.hash(SENHA_TESTE, 10)
                }
            })

            const response = await agent.post(`/usuarios/restaurar/${usuarioCriado.id}`)
                .type('form')
                .set('Accept', 'application/json')
                .send({
                    _csrf: csrfToken
                });

            expect(response.status).toEqual(StatusCodes.MOVED_TEMPORARILY);
            expect(response.header.location).toContain('/usuarios/listar');
        })
    })

    describe('GET /usuarios/dados/:id', () => {
        it('deve listar os dados de um usuário', async () => {
            const usuario = {
                nomeCompleto: 'Usuário Teste',
                email: 'email',
                cpf: '77886482050',
                senhaHash: 'senha123',
                status: 1,
                administrador: 1,
                coordenador: 0,
                diretor: 1,
                secretaria: 1,
                professor: 1,
            }

            const usuarioCriado = await prisma.usuario.create({
                data: {
                    ...usuario,
                    senhaHash: await bcrypt.hash(SENHA_TESTE, 10)
                }
            })

            const response = await agent.get(`/usuarios/dados/${usuarioCriado.id}`).set('Accept', 'text/html');

            expect(response.status).toEqual(StatusCodes.OK);
        })
    })

    describe('GET /usuarios/editar/:id', () => {
        it('deve listar a página de edição de usuário', async () => {
            const usuario = {
                nomeCompleto: 'Usuário Teste',
                email: 'email',
                cpf: '77886482050',
                senhaHash: 'senha123',
                status: 1,
                administrador: 1,
                coordenador: 0,
                diretor: 1,
                secretaria: 1,
                professor: 1,
            }

            const usuarioCriado = await prisma.usuario.create({
                data: {
                    ...usuario,
                    senhaHash: await bcrypt.hash(SENHA_TESTE, 10)
                }
            })

            const response = await agent.get(`/usuarios/editar/${usuarioCriado.id}`).set('Accept', 'text/html');

            expect(response.status).toEqual(StatusCodes.OK);
        })

        it('deve dar erro caso o id não existir', async () => {
            const usuario = {
                nomeCompleto: 'Usuário Teste',
                email: 'email',
                cpf: '77886482050',
                senhaHash: 'senha123',
                status: 1,
                administrador: 1,
                coordenador: 0,
                diretor: 1,
                secretaria: 1,
                professor: 1,
            }

            const usuarioCriado = await prisma.usuario.create({
                data: {
                    ...usuario,
                    senhaHash: await bcrypt.hash(SENHA_TESTE, 10)
                }
            })

            const response = await agent.get(`/usuarios/editar/999`).set('Accept', 'text/html');

            expect(response.status).toEqual(StatusCodes.SERVICE_UNAVAILABLE);
        })
    })

    describe('POST /usuarios/editar/:id', () => {
        it('deve editar um usuário', async () => {
            const usuario = {
                nomeCompleto: 'Usuário Teste',
                email: 'email',
                cpf: '77886482050',
                senhaHash: 'senha123',
                status: 1,
                administrador: 1,
                coordenador: 0,
                diretor: 1,
                secretaria: 1,
                professor: 1,
            }

            const usuarioCriado = await prisma.usuario.create({
                data: {
                    ...usuario,
                    senhaHash: await bcrypt.hash(SENHA_TESTE, 10)
                }
            })

            const response = await agent.post(`/usuarios/editar/${usuarioCriado.id}`)
                .type('form').
                set('Accept', 'application/json').
                send({
                    ...usuario,
                    senha: SENHA_TESTE,
                    _csrf: csrfToken
                });

            expect(response.status).toEqual(StatusCodes.MOVED_TEMPORARILY);
            expect(response.header.location).toContain(`/usuarios/dados/${usuarioCriado.id}`);
        })

        it('deve dar erro se o id não existir', async () => {
            const usuario = {
                nomeCompleto: 'Usuário Teste',
                email: 'email',
                cpf: '77886482050',
                senhaHash: 'senha123',
                status: 1,
                administrador: 1,
                coordenador: 0,
                diretor: 1,
                secretaria: 1,
                professor: 1,
            }

            const usuarioCriado = await prisma.usuario.create({
                data: {
                    ...usuario,
                    senhaHash: await bcrypt.hash(SENHA_TESTE, 10)
                }
            })

            const response = await agent.post(`/usuarios/editar/999`)
                .type('form')
                .set('Accept', 'application/json')
                .send({
                    ...usuario,
                    senha: SENHA_TESTE,
                    _csrf: csrfToken
                });
            expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        })
    })

    describe('GET /usuarios/verificarDiretor', () => {
        it('deve verificar se o usuário é diretor', async () => {
            const usuario = {
                nomeCompleto: 'Usuário Teste',
                email: 'email',
                cpf: '77886482050',
                senhaHash: 'senha123',
                status: 1,
                administrador: 1,
                coordenador: 0,
                diretor: 1,
                secretaria: 1,
                professor: 1,
            }

            const usuarioCriado = await prisma.usuario.create({
                data: {
                    ...usuario,
                    senhaHash: await bcrypt.hash(SENHA_TESTE, 10)
                }
            })

            const response = await agent.get('/usuarios/verificarDiretor').set('Accept', 'application/json');

            expect(response.status).toEqual(StatusCodes.OK);
            expect(response.body).toEqual({
                diretor: true
            })
        })
    })


})