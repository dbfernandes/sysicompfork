import EditalService from '../../src/resources/edital/edital.service';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn().mockImplementation(() => ({
        edital: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
        candidato: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
        },
    })),
}));

const prisma = new PrismaClient();

describe('EditalService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('criarEdital', () => {
        it('deve criar um novo edital se ele não existir', async () => {
            const editalDados = { editalId: '123', nome: 'Teste' };

            (prisma.edital.findFirst as jest.Mock).mockResolvedValue(null);
            (prisma.edital.create as jest.Mock).mockResolvedValue(editalDados);

            const result = await EditalService.criarEdital(editalDados);

            expect(prisma.edital.findFirst).toHaveBeenCalledWith({
                where: { editalId: editalDados.editalId },
            });
            expect(prisma.edital.create).toHaveBeenCalledWith({ data: editalDados });
            expect(result).toEqual(editalDados);
        });

        it('deve lançar erro se o edital já existir', async () => {
            const editalDados = { editalId: '123', nome: 'Teste' };

            (prisma.edital.findFirst as jest.Mock).mockResolvedValue(editalDados);

            await expect(EditalService.criarEdital(editalDados)).rejects.toThrow(
                `Edital de número ${editalDados.editalId} já existe`,
            );
        });
    });

    describe('listEdital', () => {
        it('deve retornar todos os editais', async () => {
            const mockEditais = [{ editalId: '1' }, { editalId: '2' }];

            (prisma.edital.findMany as jest.Mock).mockResolvedValue(mockEditais);

            const result = await EditalService.listEdital();

            expect(prisma.edital.findMany).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockEditais);
        });

        it('deve lançar erro se falhar ao listar editais', async () => {
            (prisma.edital.findMany as jest.Mock).mockRejectedValue(
                new Error('Erro ao listar'),
            );

            await expect(EditalService.listEdital()).rejects.toThrow(
                'Não foi possivel listar o edital',
            );
        });
    });

    describe('delete', () => {
        it('deve atualizar o status do edital para "0"', async () => {
            const editalId = '123';
            const mockEdital = { editalId, status: '1' };

            (prisma.edital.findFirst as jest.Mock).mockResolvedValue(mockEdital);
            (prisma.edital.update as jest.Mock).mockResolvedValue({
                ...mockEdital,
                status: '0',
            });

            const result = await EditalService.delete(editalId);

            expect(prisma.edital.findFirst).toHaveBeenCalledWith({
                where: { editalId },
            });
            expect(prisma.edital.update).toHaveBeenCalledWith({
                where: { editalId },
                data: { status: '0' },
            });
            expect(result.status).toBe('0');
        });

        it('deve lançar erro se o edital não existir', async () => {
            const editalId = '123';

            (prisma.edital.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(EditalService.delete(editalId)).rejects.toThrow(
                `Não existe edital de número ${editalId}`,
            );
        });
    });

    describe('listCandidates', () => {
        it('deve retornar os candidatos vinculados a um edital', async () => {
            const editalId = '123';
            const mockCandidatos = [{ id: 1 }, { id: 2 }];

            (prisma.candidato.findMany as jest.Mock).mockResolvedValue(mockCandidatos);

            const result = await EditalService.listCandidates(editalId);

            expect(prisma.candidato.findMany).toHaveBeenCalledWith({
                where: { idEdital: editalId },
                include: { LinhasDePesquisa: true },
            });
            expect(result).toEqual(mockCandidatos);
        });

        it('deve lançar erro se falhar ao listar candidatos', async () => {
            const editalId = '123';

            (prisma.candidato.findMany as jest.Mock).mockRejectedValue(
                new Error('Erro ao listar candidatos'),
            );

            await expect(EditalService.listCandidates(editalId)).rejects.toThrow(
                'Não foi possivel listar os candidatos',
            );
        });
    });
});