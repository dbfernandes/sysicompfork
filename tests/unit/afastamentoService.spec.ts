import afastamentoTemporarioService from '@resources/afastamentoTemporario/afastamento.temporario.service';
import { prismaMock } from '../../singleton';
import { AfastamentoTemporario } from '@prisma/client';

describe('AfastamentoTemporarioService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('AfastamentoService - listarAfastamentosDoUsuario', () => {
    it('deve listar os afastamentos formatados de um usuário', async () => {
      const mockData: AfastamentoTemporario[] = [
        {
          id: 1,
          usuarioId: 1,
          nomeCompleto: 'Teste',
          dataInicio: new Date('2024-01-10'),
          dataFim: new Date('2024-01-20'),
          tipoViagem: 'Nacional',
          localViagem: 'Brasil',
          justificativa: 'Teste',
          planoReposicao: 'Teste',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ];

      prismaMock.afastamentoTemporario.findMany.mockResolvedValue(mockData);

      const result = await afastamentoTemporarioService.listarPorUsuario(1);
      expect(prismaMock.afastamentoTemporario.findMany).toHaveBeenCalledWith({
        where: { usuarioId: 1 },
      });
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            usuarioId: 1,
            nomeCompleto: 'Teste',
          }),
        ]),
      );
    });
  });

  describe('AfastamentoService - listarTodos', () => {
    it('deve listar todos os afastamentos formatados', async () => {
      const mockData: AfastamentoTemporario[] = [
        {
          id: 1,
          usuarioId: 1,
          nomeCompleto: 'Teste',
          dataInicio: new Date('2024-01-10'),
          dataFim: new Date('2024-01-20'),
          tipoViagem: 'Nacional',
          localViagem: 'Brasil',
          justificativa: 'Teste',
          planoReposicao: 'Teste',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ];

      prismaMock.afastamentoTemporario.findMany.mockResolvedValue(mockData);

      const result = await afastamentoTemporarioService.listarTodos();

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            createdAt: new Date('2024-01-01'),
            dataInicio: new Date('2024-01-10'),
            dataFim: new Date('2024-01-20'),
            dataCriacaoFormata: '01/01/2024',
            dataSaidaFormata: '10/01/2024',
            dataRetornoFormata: '20/01/2024',
          }),
        ]),
      );
    });
  });

  describe('AfastamentoService - criar', () => {
    it('deve criar um novo afastamento', async () => {
      const mockAfastamento = {
        id: 1,
        usuarioId: 1,
        nomeCompleto: 'Teste',
        dataInicio: new Date('2024-01-10'),
        dataFim: new Date('2024-01-20'),
        tipoViagem: 'Nacional',
        localViagem: 'Brasil',
        justificativa: 'Teste',
        planoReposicao: 'Teste',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      prismaMock.afastamentoTemporario.create.mockResolvedValue(
        mockAfastamento,
      );

      await expect(
        afastamentoTemporarioService.criar(mockAfastamento),
      ).resolves.not.toThrow();
      expect(prismaMock.afastamentoTemporario.create).toHaveBeenCalledWith({
        data: mockAfastamento,
      });
    });

    it('deve lidar com erros ao criar um afastamento', async () => {
      prismaMock.afastamentoTemporario.create.mockRejectedValue(
        new Error('Erro desconhecido'),
      );

      await expect(
        afastamentoTemporarioService.criar({
          usuarioId: 1,
          nomeCompleto: 'Teste',
          dataInicio: new Date('2024-01-10'),
          dataFim: new Date('2024-01-20'),
          tipoViagem: 'Nacional',
          localViagem: 'Brasil',
          justificativa: 'Teste',
          planoReposicao: 'Teste',
        }),
      ).rejects.toThrow('Erro desconhecido');
    });
  });

  describe('AfastamentoService - retornarAfastamento', () => {
    it('deve retornar o afastamento pelo ID', async () => {
      const mockData = {
        id: 1,
        usuarioId: 1,
        nomeCompleto: 'Teste',
        dataInicio: new Date('2024-01-10'),
        dataFim: new Date('2024-01-20'),
        tipoViagem: 'Nacional',
        localViagem: 'Brasil',
        justificativa: 'Teste',
        planoReposicao: 'Teste',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      prismaMock.afastamentoTemporario.findUnique.mockResolvedValue(mockData);

      const result = await afastamentoTemporarioService.buscarPorId(1);
      expect(result).toEqual(mockData);
      expect(prismaMock.afastamentoTemporario.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('AfastamentoService - detalhes', () => {
    it('deve visualizar o afastamento formatado', async () => {
      const mockData = {
        id: 1,
        usuarioId: 1,
        nomeCompleto: 'Teste',
        dataInicio: new Date('2024-01-10'),
        dataFim: new Date('2024-01-20'),
        tipoViagem: 'Nacional',
        localViagem: 'Brasil',
        justificativa: 'Teste',
        planoReposicao: 'Teste',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      prismaMock.afastamentoTemporario.findUnique.mockResolvedValue(mockData);

      const result = await afastamentoTemporarioService.buscarDetalhesPorId(1);
      expect(result).toEqual({
        ...mockData,
        dataCriacaoFormata: '01/01/2024',
        dataSaidaFormata: '10/01/2024',
        dataRetornoFormata: '20/01/2024',
      });
    });

    it('deve retornar null se o afastamento não for encontrado', async () => {
      prismaMock.afastamentoTemporario.findUnique.mockResolvedValue(null);

      const result = await afastamentoTemporarioService.buscarDetalhesPorId(99);
      expect(result).toBeNull();
    });
  });

  describe('AfastamentoService - delete', () => {
    it('deve deletar o afastamento pelo ID', async () => {
      prismaMock.afastamentoTemporario.delete.mockResolvedValue(null);

      await expect(
        afastamentoTemporarioService.excluir(1),
      ).resolves.not.toThrow();
      expect(prismaMock.afastamentoTemporario.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('deve lançar erro ao deletar um afastamento inexistente', async () => {
      prismaMock.afastamentoTemporario.delete.mockRejectedValue(
        new Error('Erro desconhecido'),
      );

      await expect(afastamentoTemporarioService.excluir(99)).rejects.toThrow();
    });
  });
});
