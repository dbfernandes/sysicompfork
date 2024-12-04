import ReservaService from "../../src/resources/reservasDeSalas/reservas.service";
import { prismaMock } from "../../singleton";
import { ReservaSalas } from "@prisma/client";

describe("ReservasService", () => {

    describe('listarTodos', () => {
        it('deve retornar todas as reservas', async () => {
            const mockReservas: ReservaSalas[] = [
                {
                    id: 1,
                    UsuarioId: 1,
                    SalaId: 1,
                    atividade: 'Reunião',
                    dias: 'Segunda-feira',
                    tipo: 'Sala de reunião',
                    dataInicio: new Date(),
                    dataTermino: new Date(),
                    horaInicio: '10:00',
                    horaTermino: '11:00',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 2,
                    UsuarioId: 2,
                    SalaId: 2,
                    atividade: 'Reunião',
                    tipo: 'Sala de reunião',
                    dias: 'Segunda-feira',
                    dataInicio: new Date(),
                    dataTermino: new Date(),
                    horaInicio: '10:00',
                    horaTermino: '11:00',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            prismaMock.reservaSalas.findMany.mockResolvedValue(mockReservas);

            const reservas = await ReservaService.listarTodos();
            expect(reservas).toEqual(mockReservas);
        });
    });

    describe('listarReservasSalas', () => {
        it('deve retornar todas as reservas com informações das salas e usuários', async () => {
            const mockReservas = [
                {

                    id: 1,
                    UsuarioId: 1,
                    SalaId: 1,
                    atividade: 'Reunião',
                    dias: 'Segunda-feira',
                    tipo: 'Sala de reunião',
                    dataInicio: new Date(),
                    dataTermino: new Date(),
                    horaInicio: '10:00',
                    horaTermino: '11:00',
                    createdAt: new Date(),
                    updatedAt: new Date()

                },
            ];

            prismaMock.reservaSalas.findMany.mockResolvedValue(mockReservas);

            const reservas = await ReservaService.listarReservasSalas();
            expect(reservas).toEqual(mockReservas);
        });
    });

    describe('listarReservasDeUmUsuario', () => {
        it('deve retornar todas as reservas de um usuário específico', async () => {
            const mockReservas = [
                {
                    id: 1,
                    UsuarioId: 1,
                    SalaId: 1,
                    atividade: 'Reunião',
                    dias: 'Segunda-feira',
                    tipo: 'Sala de reunião',
                    dataInicio: new Date(),
                    dataTermino: new Date(),
                    horaInicio: '10:00',
                    horaTermino: '11:00',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
            ];

            prismaMock.reservaSalas.findMany.mockResolvedValue(mockReservas);

            const reservas = await ReservaService.listarReservasDeUmUsuario(1);
            expect(reservas).toEqual(mockReservas);
        });
    });

    describe('buscarReserva', () => {
        it('deve retornar uma reserva pelo ID', async () => {
            const mockReserva = {
                id: 1,
                UsuarioId: 1,
                SalaId: 1,
                atividade: 'Reunião',
                dias: 'Segunda-feira',
                tipo: 'Sala de reunião',
                dataInicio: new Date(),
                dataTermino: new Date(),
                horaInicio: '10:00',
                horaTermino: '11:00',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            prismaMock.reservaSalas.findUnique.mockResolvedValue(mockReserva);

            const reserva = await ReservaService.buscarReserva(1);
            expect(reserva).toEqual(mockReserva);
        });

        it('deve retornar null se a reserva não for encontrada', async () => {
            prismaMock.reservaSalas.findUnique.mockResolvedValue(null);

            const reserva = await ReservaService.buscarReserva(999);
            expect(reserva).toBeNull();
        });
    });

    describe('criar', () => {
        it('deve criar uma nova reserva', async () => {
            const mockReserva = {
                id: 1,
                UsuarioId: 1,
                SalaId: 1,
                atividade: 'Reunião',
                dias: 'Segunda-feira',
                tipo: 'Sala de reunião',
                dataInicio: new Date(),
                dataTermino: new Date(),
                horaInicio: '10:00',
                horaTermino: '11:00',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            prismaMock.reservaSalas.create.mockResolvedValue(mockReserva);

            const reserva = await ReservaService.criar(mockReserva);
            expect(reserva).toEqual(mockReserva);
        });
    });

    describe('atualizar', () => {
        it('deve atualizar uma reserva existente', async () => {
            const mockReservaAtualizada = {
                id: 1,
                UsuarioId: 1,
                SalaId: 1,
                atividade: 'Reunião',
                dias: 'Segunda-feira',
                tipo: 'Sala de reunião',
                dataInicio: new Date(),
                dataTermino: new Date(),
                horaInicio: '10:00',
                horaTermino: '11:00',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            prismaMock.reservaSalas.update.mockResolvedValue(mockReservaAtualizada);

            const reserva = await ReservaService.atualizar(1, mockReservaAtualizada);
            expect(reserva).toEqual(mockReservaAtualizada);
        });
    });

    describe('remover', () => {
        it('deve remover uma reserva existente', async () => {
            const mockReservaRemovida = {
                id: 1,
                UsuarioId: 1,
                SalaId: 1,
                atividade: 'Reunião',
                dias: 'Segunda-feira',
                tipo: 'Sala de reunião',
                dataInicio: new Date(),
                dataTermino: new Date(),
                horaInicio: '10:00',
                horaTermino: '11:00',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            prismaMock.reservaSalas.delete.mockResolvedValue(mockReservaRemovida);

            const reserva = await ReservaService.remover(1);
            expect(reserva).toEqual(mockReservaRemovida);
        });
    });
});
