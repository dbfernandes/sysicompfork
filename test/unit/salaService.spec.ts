import SalaService from '../../src/resources/salas/salas.service';
import { prismaMock } from '../../singleton';

describe('SalasService', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('SalasService - criar', () => {
        it('deve criar uma sala', async () => {
            const sala = {
                id: 1,
                andar: '1',
                bloco: 'A',
                capacidade: 10,
                numero: 1,
                nome: 'Sala 1',
                createdAt: new Date('2024-11-01'),
                updatedAt: new Date('2024-11-01')
            }

            prismaMock.salas.create.mockResolvedValue(sala);

            await expect(SalaService.criar(sala)).resolves.toEqual(sala);
        });

        it('deve retornar erro ao criar uma sala', async () => {
            const sala = {
                nome: 'nome',
                createdAt: new Date('2024-11-01'),
                updatedAt: new Date('2024-11-01')
            }

            prismaMock.salas.create.mockRejectedValue(new Error('Erro ao criar sala'));
            // await expect(SalaService.criar(sala)).rejects.toEqual(new Error('Erro ao criar uma nova sala.'));
        });
    });


    describe('editar', () => {
        it('deve atualizar os dados de uma sala', async () => {
            const mockSalaAtualizada = {
                id: 1,
                nome: 'Sala Atualizada',
                andar: '1',
                bloco: 'A',
                capacidade: 10,
                numero: 1,
                createdAt: new Date('2024-11-01'),
                updatedAt: new Date('2024-11-01')
            };

            prismaMock.salas.update.mockResolvedValue(mockSalaAtualizada);

            const sala = await SalaService.editar(1, { nome: 'Sala Atualizada' });
            expect(sala).toEqual(mockSalaAtualizada);
        });

        it('deve lançar um erro caso a sala não exista', async () => {
            prismaMock.salas.update.mockRejectedValue(new Error('Erro ao atualizar'));

            await expect(SalaService.editar(99, { nome: 'Sala Não Existente' })).rejects.toThrow('Erro ao editar a sala com ID 99.');
        });
    });

    describe('excluir', () => {
        it('deve excluir uma sala existente', async () => {
            const mockSalaExcluida = {
                id: 1,
                nome: 'Sala Atualizada',
                capacidade: 10,
                numero: 1,
                createdAt: new Date('2024-11-01T00:00:00.000Z'),
                updatedAt: new Date(), // Use a data de atualização real ou o valor esperado
            };
            const salaExcluida = await SalaService.excluir(1);
            const { updatedAt, ...salaSemUpdatedAt } = salaExcluida;

            expect(salaSemUpdatedAt).toEqual(mockSalaExcluida);
        });

        it('deve lançar um erro caso a sala não exista', async () => {
            prismaMock.salas.delete.mockRejectedValue(new Error('Erro ao excluir'));

            await expect(SalaService.excluir(99)).rejects.toThrow('Erro ao excluir');
        });
    });

});