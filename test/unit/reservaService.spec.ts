import { prismaMock } from "../../singleton";
import { ReservaSala } from "@prisma/client";
import reservasService from "../../src/resources/reservasDeSalas/reservas.service";

describe("ReservasService", () => {

    describe('listarTodos', () => {
        it('deve retornar todas as reservas', async () => {
            const mockReservas: ReservaSala[] = [
                {
                    id: 1,
                    usuarioId: 1,
                    salaId: 1,
                    atividade: 'Reunião',
                    dias: 'Segunda-feira',
                    tipo: 'Sala de reunião',
                    dataInicio: new Date(),
                    dataFim: new Date(),
                    horaInicio: '10:00',
                    horaFim: '11:00',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 2,
                    usuarioId: 2,
                    salaId: 2,
                    atividade: 'Reunião',
                    tipo: 'Sala de reunião',
                    dias: 'Segunda-feira',
                    dataInicio: new Date(),
                    dataFim: new Date(),
                    horaInicio: '10:00',
                    horaFim: '11:00',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            prismaMock.reservaSala.findMany.mockResolvedValue(mockReservas);

            const reservas = await reservasService.listarTodos();
            expect(reservas).toEqual(mockReservas);
        });
    });

    describe('listarReservasSalas', () => {
        it('deve retornar todas as reservas com informações das salas e usuários', async () => {
            const mockReservas = [
                {
                    id: 1,
                    usuarioId: 1,
                    salaId: 1,
                    atividade: 'Reunião',
                    dias: 'Segunda-feira',
                    tipo: 'Sala de reunião',
                    dataInicio: new Date(),
                    dataFim: new Date(),
                    horaInicio: '10:00',
                    horaFim: '11:00',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
            ];

            prismaMock.reservaSala.findMany.mockResolvedValue(mockReservas);

            const reservas = await reservasService.listarReservasSalas();
            expect(reservas).toEqual(mockReservas);
        });
    });

    describe('listarReservasDeUmUsuario', () => {
        it('deve retornar todas as reservas de um usuário específico', async () => {
            const mockReservas = [
                {
                    id: 1,
                    usuarioId: 1,
                    salaId: 1,
                    atividade: 'Reunião',
                    dias: 'Segunda-feira',
                    tipo: 'Sala de reunião',
                    dataInicio: new Date(),
                    dataFim: new Date(),
                    horaInicio: '10:00',
                    horaFim: '11:00',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
            ];

            prismaMock.reservaSala.findMany.mockResolvedValue(mockReservas);

            const reservas = await reservasService.listarReservasDeUmUsuario(1);
            expect(reservas).toEqual(mockReservas);
        });
    });

    describe('buscarReserva', () => {
        it('deve retornar uma reserva pelo ID', async () => {
            const mockReserva = {
                id: 1,
                usuarioId: 1,
                salaId: 1,
                atividade: 'Reunião',
                dias: 'Segunda-feira',
                tipo: 'Sala de reunião',
                dataInicio: new Date(),
                dataFim: new Date(),
                horaInicio: '10:00',
                horaFim: '11:00',
                createdAt: new Date(),
                updatedAt: new Date()
            }

            prismaMock.reservaSala.findUnique.mockResolvedValue(mockReserva);

            const reserva = await reservasService.buscarReserva(1);
            expect(reserva).toEqual(mockReserva);
        });

        it('deve retornar null se a reserva não for encontrada', async () => {
            prismaMock.reservaSala.findUnique.mockResolvedValue(null);

            const reserva = await reservasService.buscarReserva(999);
            expect(reserva).toBeNull();
        });
    });

    describe('criar', () => {
        it('deve criar uma nova reserva', async () => {
            const mockReserva = {
                id: 1,
                usuarioId: 1,
                salaId: 1,
                atividade: 'Reunião',
                dias: 'Segunda-feira',
                tipo: 'Sala de reunião',
                dataInicio: new Date(),
                dataFim: new Date(),
                horaInicio: '10:00',
                horaFim: '11:00',
                createdAt: new Date(),
                updatedAt: new Date()
            }

            prismaMock.reservaSala.create.mockResolvedValue(mockReserva);
            prismaMock.sala.findUnique.mockResolvedValue({
                id: 1,
                nome: 'Sala 1',
                numero: 1,
                capacidade: 10,
                bloco: 'A',
                andar: '1',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const reserva = await reservasService.criar(mockReserva);
            expect(reserva).toEqual(mockReserva);
        });
    });

    describe('atualizar', () => {
        it('deve lançar erro caso a reserva não exista', async () => {

            prismaMock.reservaSala.update.mockRejectedValue(
                new Error('Record to update not found')
            );

            await expect(reservasService.atualizar(1, { /* dados de reserva */ }))
                .rejects
                .toThrow('Record to update not found');
        });
    });

    describe('remover', () => {
        it('deve lançar erro caso a reserva não exista', async () => {

            prismaMock.reservaSala.delete.mockRejectedValue(
                new Error('Record to delete does not exist')
            );

            await expect(reservasService.remover(1))
                .rejects
                .toThrow('Record to delete does not exist');
        });
    });
});
