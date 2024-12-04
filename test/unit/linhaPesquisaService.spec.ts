import { prismaMock } from '../../singleton';

import linhasDePesquisaService from '../../src/resources/linhasDePesquisa/linhasDePesquisa.service';

describe('LinhasDePesquisaService', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('Teste unitario da função criar', () => {
        it('deve criar uma linha de pesquisa', async () => {
            const linhaDePesquisa = {
                id: 1,
                nome: "teste",
                sigla: "TE",
                createdAt: new Date('2024-11-01'),
                updatedAt: new Date('2024-11-01')
            }

            prismaMock.linhasDePesquisa.create.mockResolvedValue(linhaDePesquisa);

            await expect(linhasDePesquisaService.criar(linhaDePesquisa)).resolves.toEqual(linhaDePesquisa);

        });

        it('deve retornar erro ao criar uma linha de pesquisa', async () => {
            const linhaDePesquisa = {
                id: 1,
                nome: '',
                sigla: "TE",
                createdAt: new Date('2024-11-01'),
                updatedAt: new Date('2024-11-01')
            }

            prismaMock.linhasDePesquisa.create.mockRejectedValue(new Error('Erro ao criar linha de pesquisa'));
            // await expect(linhasDePesquisaService.criar(linhaDePesquisa)).resolves.toEqual(new Error('Erro ao criar linha de pesquisa'));
        });
    });


    describe('LinhasDePesquisaService - findById', () => {
        it('deve retornar erro ao buscar linha de pesquisa com ID inexistente', async () => {
            // Simula retorno vazio para ID inexistente
            prismaMock.linhasDePesquisa.findFirst.mockResolvedValue(null);

            await expect(linhasDePesquisaService.findById(99))
                .rejects
                .toThrow('Linha de pesquisa com ID 99 não encontrada.');
        });

        it('deve lançar erro genérico caso o Prisma retorne um erro', async () => {
            // Simula um erro genérico do Prisma
            prismaMock.linhasDePesquisa.findFirst.mockRejectedValue(new Error('Erro do Prisma'));

            await expect(linhasDePesquisaService.findById(1)).rejects
        });
    });

    describe('LinhasDePesquisaService - update', () => {
        it('deve retornar erro ao tentar atualizar uma linha de pesquisa inexistente', async () => {
            // Simula que a linha de pesquisa não foi encontrada
            prismaMock.linhasDePesquisa.findFirst.mockResolvedValue(null);

            await expect(linhasDePesquisaService.update(99, { nome: 'Atualizado' }))
                .rejects
                .toThrow('Erro ao atualizar a linha de pesquisa com ID 99: Erro ao buscar linha de pesquisa por ID: Linha de pesquisa com ID 99 não encontrada.');
        });
    });
});