import afastamentoTemporarioService from "../../src/resources/afastamentoTemporario/afastamentoTemporario.service";
// import { prismaMock } from '../../../singleton';

jest.mock('@prisma/client', () => {
    const mockPrisma = {
        afastamentoTemporarios: {
            findMany: jest.fn(),
            create: jest.fn(),
            findUnique: jest.fn(),
            delete: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prismaMock = new (require('@prisma/client').PrismaClient)();

describe('AfastamentoTemporarioService', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('AfastamentoService - listarAfastamentosDoUsuario', () => {
        it('deve listar os afastamentos formatados de um usuário', async () => {
            const mockData = [
                {
                    id: 1,
                    usuarioId: 1,
                    usuarioNome: 'Teste',
                    dataSaida: new Date('2024-01-10'),
                    dataRetorno: new Date('2024-01-20'),
                    tipoViagem: 'Nacional',
                    localViagem: 'Brasil',
                    justificativa: 'Teste',
                    planoReposicao: 'Teste',
                    createdAt: new Date('2024-01-01'),
                    updatedAt: new Date('2024-01-01'),
                },
            ];

            prismaMock.afastamentoTemporarios.findMany.mockResolvedValue(mockData);

            const result = await afastamentoTemporarioService.listarAfastamentosDoUsuario('1');
            expect(result).toEqual([
                {
                    id: 1,
                    usuarioId: 1,
                    usuarioNome: 'Teste',
                    dataSaida: new Date('2024-01-10'),
                    dataCriacaoFormata: '01/01/2024',
                    dataRetorno: new Date('2024-01-20'),
                    dataRetornoFormata: '20/01/2024',
                    dataSaidaFormata: '10/01/2024',
                    tipoViagem: 'Nacional',
                    localViagem: 'Brasil',
                    justificativa: 'Teste',
                    planoReposicao: 'Teste',
                    createdAt: new Date('2024-01-01'),
                    updatedAt: new Date('2024-01-01'),
                },
            ]);
            expect(prismaMock.afastamentoTemporarios.findMany).toHaveBeenCalledWith({
                where: { usuarioId: 1 },
            });
        });

        it('deve lançar erro ao listar os afastamentos', async () => {
            prismaMock.afastamentoTemporarios.findMany.mockRejectedValue(new Error('Erro do Prisma'));

            await expect(afastamentoTemporarioService.listarAfastamentosDoUsuario('1')).rejects.toThrow(
                'Erro do Prisma'
            );
        });
    });

    describe('AfastamentoService - listarTodos', () => {
        it('deve listar todos os afastamentos formatados', async () => {
            const mockData = [
                {
                    id: 1,
                    createdAt: '2024-01-01T00:00:00.000Z',
                    dataSaida: '2024-01-10T00:00:00.000Z',
                    dataRetorno: '2024-01-20T00:00:00.000Z',
                },
            ];

            prismaMock.afastamentoTemporarios.findMany.mockResolvedValue(mockData);

            const result = await afastamentoTemporarioService.listarTodos();
            expect(result).toEqual([
                {
                    id: 1,
                    createdAt: '2024-01-01T00:00:00.000Z',
                    dataSaida: '2024-01-10T00:00:00.000Z',
                    dataRetorno: '2024-01-20T00:00:00.000Z',
                    dataCriacaoFormata: '01/01/2024',
                    dataSaidaFormata: '10/01/2024',
                    dataRetornoFormata: '20/01/2024',
                },
            ]);
        });

        it('deve lidar com erros ao listar todos os afastamentos', async () => {
            prismaMock.afastamentoTemporarios.findMany.mockRejectedValue(new Error('Erro do Prisma'));

            const result = await afastamentoTemporarioService.listarTodos();
            expect(result).toBeUndefined();
        });
    });

    describe('AfastamentoService - criar', () => {
        it('deve criar um novo afastamento', async () => {
            const newAfastamento = {
                usuarioId: 1,
                usuarioNome: 'Teste',
                dataSaida: new Date('2024-01-10'),
                dataRetorno: new Date('2024-01-20'),
                tipoViagem: 'Nacional',
                localViagem: 'Brasil',
                justificativa: 'Teste',
                planoReposicao: 'Teste',
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01'),
            };

            prismaMock.afastamentoTemporarios.create.mockResolvedValue(newAfastamento);

            await expect(afastamentoTemporarioService.criar(newAfastamento)).resolves.not.toThrow();
            expect(prismaMock.afastamentoTemporarios.create).toHaveBeenCalledWith({
                data: newAfastamento,
            });
        });

        it('deve lidar com erros ao criar um afastamento', async () => {
            prismaMock.afastamentoTemporarios.create.mockRejectedValue(new Error('Erro do Prisma'));

            await expect(afastamentoTemporarioService.criar({
                usuarioId: 1,
                usuarioNome: 'Teste',
                dataSaida: new Date('2024-01-10'),
                dataRetorno: new Date('2024-01-20'),
                tipoViagem: 'Nacional',
                localViagem: 'Brasil',
                justificativa: 'Teste',
                planoReposicao: 'Teste',
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01'),
            },)).rejects.toThrow('Erro do Prisma');
        });
    });

    describe('AfastamentoService - retornarAfastamento', () => {
        it('deve retornar o afastamento pelo ID', async () => {
            const mockData = { id: 1, usuarioId: 1 };

            prismaMock.afastamentoTemporarios.findUnique.mockResolvedValue(mockData);

            const result = await afastamentoTemporarioService.retornarAfastamento('1');
            expect(result).toEqual(mockData);
            expect(prismaMock.afastamentoTemporarios.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });
    });

    describe('AfastamentoService - vizualizar', () => {
        it('deve visualizar o afastamento formatado', async () => {
            const mockData = {
                id: 1,
                createdAt: '2024-01-01T00:00:00.000Z',
                dataSaida: '2024-01-10T00:00:00.000Z',
                dataRetorno: '2024-01-20T00:00:00.000Z',
            };

            prismaMock.afastamentoTemporarios.findUnique.mockResolvedValue(mockData);

            const result = await afastamentoTemporarioService.vizualizar('1');
            expect(result).toEqual({
                ...mockData,
                dataCriacaoFormata: '01/01/2024',
                dataSaidaFormata: '10/01/2024',
                dataRetornoFormata: '20/01/2024',
            });
        });

        it('deve retornar null se o afastamento não for encontrado', async () => {
            prismaMock.afastamentoTemporarios.findUnique.mockResolvedValue(null);

            const result = await afastamentoTemporarioService.vizualizar('99');
            expect(result).toBeNull();
        });
    });

    describe('AfastamentoService - delete', () => {
        it('deve deletar o afastamento pelo ID', async () => {
            prismaMock.afastamentoTemporarios.delete.mockResolvedValue({});

            await expect(afastamentoTemporarioService.delete('1')).resolves.not.toThrow();
            expect(prismaMock.afastamentoTemporarios.delete).toHaveBeenCalledWith({
                where: { id: 1 },
            });
        });

        it('deve lançar erro ao deletar um afastamento inexistente', async () => {
            prismaMock.afastamentoTemporarios.delete.mockRejectedValue(new Error('Erro do Prisma'));

            await expect(afastamentoTemporarioService.delete('99')).rejects.toThrow('Erro do Prisma');
        });
    });
});