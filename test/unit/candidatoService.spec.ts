import CandidatoService from '../../src/resources/candidato/candidato.service';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { generateHashPassword } from '../../src/utils/utils';

jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn().mockImplementation(() => ({
        candidato: {
            findMany: jest.fn(),
            create: jest.fn(),
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        edital: {
            update: jest.fn(),
        },
    })),
}));

const prismaMock = new (require('@prisma/client').PrismaClient)();

jest.mock('bcrypt', () => ({
    compare: jest.fn(),
}));

jest.mock('crypto', () => ({
    randomBytes: jest.fn().mockReturnValue({
        toString: jest.fn(() => 'mockedToken'),
    }),
}));

jest.mock('../../src/utils/utils', () => ({
    generateHashPassword: jest.fn((password) => `hashed_${password}`),
}));


describe('CandidatoService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('list', () => {
        it('deve retornar todos os candidatos', async () => {
            const mockCandidatos = [{ id: 1, email: 'test@test.com' }];
            (prismaMock.candidato.findMany as jest.Mock).mockResolvedValue(mockCandidatos);

            const result = await CandidatoService.list();

            expect(prismaMock.candidato.findMany).toHaveBeenCalled();
            expect(result).toEqual(mockCandidatos);
        });
    });

    describe('create', () => {
        it('deve criar um novo candidato e atualizar o edital', async () => {
            const mockSignUpDto = {
                email: 'test@test.com',
                senha: 'password123',
                idEdital: '1',

            };

            const mockCandidate = {
                id: 1,
                email: 'test@test.com',
                senhaHash: 'hashed_password123',
                idEdital: '1',
                posicaoEdital: 1,
            };

            (prismaMock.candidato.create as jest.Mock).mockResolvedValue(mockCandidate);

            const result = await CandidatoService.create(mockSignUpDto);

            expect(generateHashPassword).toHaveBeenCalledWith('password123');
            expect(prismaMock.candidato.create).toHaveBeenCalledWith({
                data: {
                    email: 'test@test.com',
                    senhaHash: 'hashed_password123',
                    idEdital: '1',
                    posicaoEdital: 1,
                },
            });

            expect(prismaMock.edital.update).toHaveBeenCalledWith({
                where: { editalId: '1' },
                data: { inscricoesIniciadas: { increment: 1 } },
            });

            expect(result).toEqual({ ...mockCandidate, senhaHash: undefined });
        });
    });

    describe('auth', () => {
        it('deve autenticar um candidato com email e senha válidos', async () => {
            const mockSignInDto = {
                email: 'test@test.com',
                senha: 'password123',
                idEdital: '1',
            };

            const mockCandidate = {
                id: 1,
                email: 'test@test.com',
                senhaHash: 'hashed_password123',
            };

            (prismaMock.candidato.findFirst as jest.Mock).mockResolvedValue(mockCandidate);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await CandidatoService.auth(mockSignInDto);

            expect(prismaMock.candidato.findFirst).toHaveBeenCalledWith({
                where: {
                    email: 'test@test.com',
                    idEdital: '1',
                },
            });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password123');
            expect(result).toEqual(mockCandidate);
        });

        it('deve retornar null se as credenciais forem inválidas', async () => {
            (prismaMock.candidato.findFirst as jest.Mock).mockResolvedValue(null);

            const result = await CandidatoService.auth({
                email: 'invalid@test.com',
                senha: 'wrongpassword',
                idEdital: '1',
            });

            expect(result).toBeNull();
        });
    });

    describe('changePasswordWithToken', () => {
        it('deve alterar a senha de um candidato com um token válido', async () => {
            const mockToken = 'validToken';
            const mockCandidate = {
                id: 1,
                validadeTokenReset: new Date(new Date().getTime() + 3600000),
            };

            (prismaMock.candidato.findFirst as jest.Mock).mockResolvedValue(mockCandidate);

            await CandidatoService.changePasswordWithToken({
                token: mockToken,
                password: 'newPassword123',
            });

            expect(generateHashPassword).toHaveBeenCalledWith('newPassword123');
            expect(prismaMock.candidato.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    senhaHash: 'hashed_newPassword123',
                    tokenResetSenha: null,
                    validadeTokenReset: null,
                },
            });
        });

        it('deve lançar erro se o token for inválido ou expirado', async () => {
            (prismaMock.candidato.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(
                CandidatoService.changePasswordWithToken({
                    token: 'invalidToken',
                    password: 'newPassword123',
                }),
            ).rejects.toThrow('Token inválido');
        });
    });
});