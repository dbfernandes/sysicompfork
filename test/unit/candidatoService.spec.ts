import CandidatoService from '../../src/resources/candidato/candidato.service';
import { prismaMock } from '../../singleton';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { generateHashPassword } from '../../src/utils/utils';


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

    describe('create', () => {
        it('deve criar um novo candidato e atualizar o edital', async () => {
            const mockSignUpDto = {
                email: 'test@test.com',
                senha: 'password123',
                edital: '1',
            };

            const mockCandidate = {
                id: 1,
                email: 'test@test.com',
                senhaHash: 'hashed_password123',
                posicaoEdital: 1,
            };

            (prismaMock.candidato.create as jest.Mock).mockResolvedValue(mockCandidate);

            const result = await CandidatoService.create(mockSignUpDto);

            expect(prismaMock.candidato.create).toHaveBeenCalledWith({
                data: {
                    id: '1',
                    email: 'test@test.com',
                    editalId: '1',
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
                editalId: '1',
            };

            const mockCandidate = {
                id: 1,
                email: 'test@test.com',
                senhaHash: 'password123',
            };

            (prismaMock.candidato.findFirst as jest.Mock).mockResolvedValue(mockCandidate);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await CandidatoService.auth(mockSignInDto);

            expect(prismaMock.candidato.findFirst).toHaveBeenCalledWith({
                where: {
                    email: 'test@test.com',
                    editalId: '1',
                },
            });

            expect(result).toEqual(mockCandidate);
        });

        it('deve retornar null se as credenciais forem inválidas', async () => {
            (prismaMock.candidato.findFirst as jest.Mock).mockResolvedValue(null);

            const result = await CandidatoService.auth({
                email: 'invalid@test.com',
                senha: 'wrongpassword',
                editalId: '1',
            });

            expect(result).toBeNull();
        });
    });

    describe('changePasswordWithToken', () => {
        it('deve alterar a senha de um candidato com um token válido', async () => {
            (prismaMock.candidato.findFirst as jest.Mock).mockResolvedValue({
                id: 1,
                tokenResetSenha: 'validToken',
                validadeTokenReset: new Date('2100-01-01T00:00:00.000Z'),
            });

            (prismaMock.candidato.update as jest.Mock).mockResolvedValue({
                id: 1,
                senhaHash: 'hashedPassword',
                tokenResetSenha: null,
                validadeTokenReset: null,
            });

            const result = await CandidatoService.changePasswordWithToken({
                token: 'validToken',
                password: 'newPassword123',
            });
            console.log('Resultado do teste:', result);

            expect(result).toEqual({
                id: 1,
                senhaHash: 'hashedPassword',
                tokenResetSenha: null,
                validadeTokenReset: null,
            });
        });

        it('deve lançar erro se o token for inválido', async () => {
            (prismaMock.candidato.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(
                CandidatoService.changePasswordWithToken({
                    token: 'invalidToken',
                    password: 'newPassword123',
                }),
            ).rejects.toThrow('Token inválido');
        });

        it('deve lançar erro se o token estiver expirado', async () => {
            (prismaMock.candidato.findFirst as jest.Mock).mockResolvedValue({
                id: 1,
                tokenResetSenha: 'validToken',
                validadeTokenReset: new Date('2024-01-01T00:00:00.000Z'), // Data expirada
            });

            await expect(
                CandidatoService.changePasswordWithToken({
                    token: 'validToken',
                    password: 'newPassword123',
                }),
            ).rejects.toThrow('Token expirado');
        });
    });
});