import { prismaMock } from '../../singleton';

import linhaDePesquisaService from '../../src/resources/linhasDePesquisa/linha.de.pesquisa.service';

describe('LinhasDePesquisaService', () => {
    describe('Teste unitario da função criar', () => {
        it('deve criar uma linha de pesquisa', async () => {
            const linhaDePesquisa = {
                id: 1,
                nome: "teste",
                sigla: "TE",
                createdAt: new Date('2024-11-01'),
                updatedAt: new Date('2024-11-01')
            }

            prismaMock.linhaPesquisa.create.mockResolvedValue(linhaDePesquisa);

            await expect(linhaDePesquisaService.criar(linhaDePesquisa)).resolves.toEqual(linhaDePesquisa);

        });

        it('deve retornar erro ao criar uma linha de pesquisa', async () => {
            const linhaDePesquisa = {
                id: 1,
                nome: '',
                sigla: "TE",
                createdAt: new Date('2024-11-01'),
                updatedAt: new Date('2024-11-01')
            }

            prismaMock.linhaPesquisa.create.mockRejectedValue(new Error('Erro ao criar linha de pesquisa'));
            await expect(linhaDePesquisaService.criar(linhaDePesquisa)).rejects.toThrow();
        });
    });
});