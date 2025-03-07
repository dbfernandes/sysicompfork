import request from 'supertest';
import app from '../../../src/app';
import bcrypt from 'bcrypt';
import prisma, { checkDatabaseConnection } from '../../mocks/prismaClient';
import { StatusCodes } from 'http-status-codes';
import { CreateUsuarioDto } from '../../../src/resources/usuarios/usuario.types';
import { CreateAfastamentoDTO } from '../../../src/resources/afastamentoTemporario/afastamentoTemporario.types';

const SENHA_TESTE = 'senha123';
const agent = request.agent(app);

describe('Testes de Intregracao: Linha de Pesquisa', () => {
    let csrfToken: string;
    const userMock: CreateUsuarioDto = {
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
        tokenResetSenha: 'true',
        validadeTokenResetSenha: new Date(2025, 12, 30),
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
                ...userMock,
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
                .get('/linhaPesquisa/listar')
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
        await prisma.afastamentoTemporario.deleteMany()
        await prisma.usuario.deleteMany()

        const page = await agent.get('/login').set('Accept', 'text/html');

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
            await prisma.afastamentoTemporario.deleteMany();
            await prisma.$disconnect();
            console.log('Tear down completo');
        } catch (error) {
            console.error('Erro no teardown:', error);
            throw error;
        }
    })

    describe('GET /linhaPesquisa/listar', () => {
        test('Deve retornar status 200 e listar as linhas de pesquisa', async () => {

            const linhaPesquisa = {
                nome: 'Linha de Pesquisa Teste',
                sigla: 'LPT'
            }

            await prisma.linhaPesquisa.create({
                data: linhaPesquisa
            });

            const response = await agent.get('/linhasdepesquisa/listar')
                .send({
                    _csrf: csrfToken
                })
                .set('Accept', 'application/json')

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.text).toContain('Linhas de Pesquisa');
        });
    });

    describe('GET /linhaPesquisa/criar', () => {
        test('Deve retornar status 200 e renderizar o formulário de criação de linha de pesquisa', async () => {
            const linhaPesquisa = {
                nome: 'Linha de Pesquisa Teste',
                sigla: 'LPT'
            }

            const response = await agent
                .get('/linhasdepesquisa/criar')
                .set('Accept', 'text/html')
                .send({
                    ...linhaPesquisa,
                    _csrf: csrfToken
                })

            expect(response.status).toBe(StatusCodes.OK);
        });
    });

    describe('POST /linhaPesquisa/criar', () => {

        test('Deve retornar status 400 e mensagem de erro ao tentar criar linha de pesquisa já existente', async () => {
            await prisma.linhaPesquisa.create({
                data: {
                    nome: 'Linha de Pesquisa Teste',
                    sigla: 'LPT'
                }
            });

            const novaLinhaPesquisa = {
                nome: 'Linha de Pesquisa Teste',
                sigla: 'LPT'
            }

            const response = await agent
                .post('/linhasDePesquisa/criar')
                .set('Accept', 'text/html')
                .send({
                    ...novaLinhaPesquisa,
                    _csrf: csrfToken
                });

            expect(response.status).toBe(StatusCodes.BAD_REQUEST);
            expect(response.text).toContain('Linha de Pesquisa já cadastrada!');
        });

        test('Deve retornar status 400 ao tentar criar linha de pesquisa com sigla já existente', async () => {
            await prisma.linhaPesquisa.create({
                data: {
                    nome: 'Linha de Pesquisa Teste',
                    sigla: 'LPT'
                }
            });

            const novaLinhaPesquisa = {
                nome: 'Linha de Pesquisa Teste 2',
                sigla: 'LPT'
            }

            const response = await agent
                .post('/linhasDePesquisa/criar')
                .set('Accept', 'text/html')
                .send({
                    ...novaLinhaPesquisa,
                    _csrf: csrfToken
                });

            expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        });
    });

    describe('GET /linhaPesquisa/editar/:id', () => {
        test('Deve retornar status 200 e renderizar o formulário de edição de linha de pesquisa', async () => {
            const response = await agent
                .get('/linhasdepesquisa/editar/1')
                .set('Accept', 'text/html')
                .send({
                    _csrf: csrfToken
                })

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.text).toContain('Editar Linha de Pesquisa');
        });
    });

    describe('POST /linhaPesquisa/editar/:id', () => {
        test('Deve editar uma linha de pesquisa e redirecionar para a listagem', async () => {
            const linhaPesquisaEditada = {
                nome: 'Linha de Pesquisa Teste Editada',
                sigla: 'LPTE'
            }

            const response = await agent
                .post('/linhasdepesquisa/editar/1')
                .set('Accept', 'text/html')
                .send({
                    ...linhaPesquisaEditada,
                    _csrf: csrfToken
                });

            expect(response.status).toBe(StatusCodes.MOVED_TEMPORARILY);
            expect(response.header.location).toBe('/linhasDePesquisa/listar');
        });
    });

    describe('POST /linhaPesquisa/remover/:id', () => {
        test('Deve remover uma linha de pesquisa e redirecionar para a listagem', async () => {
            await prisma.linhaPesquisa.create({
                data: {
                    nome: 'Linha de Pesquisa Teste',
                    sigla: 'LPT'
                }
            });

            const response = await agent
                .post('/linhasdepesquisa/remover/1')
                .set('Accept', 'text/html')
                .send({
                    _csrf: csrfToken
                });

            expect(response.status).toBe(StatusCodes.MOVED_TEMPORARILY);
            expect(response.header.location).toBe('/linhasDePesquisa/listar');
        });
    });


})