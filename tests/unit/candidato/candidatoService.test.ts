import { Candidato } from '@prisma/client';
import CandidatoService from '../../../src/resources/candidato/candidato.service';
import { prismaMock } from 'singleton';

// Mockando os módulos externos
jest.mock('../../../src/resources/email/email.service.ts', () => ({
  sendEmail: jest.fn(),
}));
jest.mock('../../../src/utils/utils', () => ({
  generateHashPassword: jest.fn(),
}));
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));
jest.mock('crypto', () => ({
  randomBytes: jest.fn(),
}));

describe('CandidatoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Testes irão aqui
  describe('list', () => {
    it('should return an array of candidatos', async () => {
      const mockCandidatos = [
        {
          id: 1,
          email: 'user1@example.com',
          senhaHash: 'hash1',
          editalId: '1',
          posicaoEdital: 1,
          tokenResetSenha: null,
          validadeTokenReset: null,
        },
        {
          id: 2,
          email: 'user2@example.com',
          senhaHash: 'hash2',
          editalId: '1',
          posicaoEdital: 2,
          tokenResetSenha: null,
          validadeTokenReset: null,
        },
      ] as Candidato[]; // Usando casting para forçar o tipo

      prismaMock.candidato.findMany.mockResolvedValue(mockCandidatos);
      const candidatos = await CandidatoService.list();
      expect(prismaMock.candidato.findMany).toHaveBeenCalledTimes(1);
      expect(candidatos).toEqual(mockCandidatos);
    });

    it('should return an empty array when no candidatos are found', async () => {
      prismaMock.candidato.findMany.mockResolvedValue([]);
      const candidatos = await CandidatoService.list();
      expect(prismaMock.candidato.findMany).toHaveBeenCalledTimes(1);
      expect(candidatos).toEqual([]);
    });
  });
});
