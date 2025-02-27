import prisma from '../../client';
import { AfastamentoTemporario } from '@prisma/client';

import { AfastamentoTemporarioExtendido } from './afastamentoTemporario.types';

class AfastamentoService {
  async listarAfastamentosDoUsuario(
    id: number,
  ): Promise<AfastamentoTemporario[]> {
    try {
      const allResearchLines = await prisma.afastamentoTemporario.findMany({
        where: {
          usuarioId: id,
        },
      });
      const dataFormatada = allResearchLines.map((afastamento) => {
        const formatarData = (date: Date | null | undefined) => {
          if (!date || isNaN(new Date(date).getTime())) return 'Data inválida';
          return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'UTC',
          });
        };
        return {
          ...afastamento,
          dataCriacaoFormata: formatarData(afastamento.createdAt),
          dataRetornoFormata: formatarData(afastamento.dataFim),
          dataSaidaFormata: formatarData(afastamento.dataInicio),
        };
      });

      return dataFormatada;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error.message;
      } else {
        throw new Error('Erro desconhecido');
      }
    }
  }

  async listarTodos(): Promise<AfastamentoTemporario[]> {
    try {
      const allResearchLines = await prisma.afastamentoTemporario.findMany();

      const dataFormatada = allResearchLines.map((afastamento) => {
        const formatarData = (date: Date | null | undefined) => {
          if (!date || isNaN(new Date(date).getTime())) return 'Data inválida';
          return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'UTC',
          });
        };

        return {
          ...afastamento,
          dataCriacaoFormata: formatarData(afastamento.createdAt),
          dataRetornoFormata: formatarData(afastamento.dataFim),
          dataSaidaFormata: formatarData(afastamento.dataInicio),
        };
      });

      return dataFormatada;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message || 'Erro ao listar afastamentos!');
        throw error;
      } else {
        console.error('Erro desconhecido');
        throw new Error('Erro desconhecido');
      }
    }
  }

  async criar(
    newAfastamento: Omit<
      AfastamentoTemporario,
      'id' | 'createdAt' | 'updatedAt'
    >,
  ): Promise<void> {
    try {
      await prisma.afastamentoTemporario.create({
        data: newAfastamento,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        console.error('Erro desconhecido');
        throw new Error('Erro desconhecido');
      }
    }
  }

  async retornarAfastamento(id: number): Promise<AfastamentoTemporario | null> {
    try {
      const afastamento = await prisma.afastamentoTemporario.findUnique({
        where: {
          id: id,
        },
      });
      return afastamento;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error.message;
      } else {
        console.error('Erro desconhecido');
        throw new Error('Erro desconhecido');
      }
    }
  }

  async detalhes(id: number): Promise<AfastamentoTemporarioExtendido | null> {
    try {
      const afastamento = await prisma.afastamentoTemporario.findUnique({
        where: { id: id },
      });

      if (!afastamento) return null;

      const formatarData = (date: Date | null | undefined) => {
        if (!date || isNaN(new Date(date).getTime())) return 'Data inválida';
        return new Date(date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone: 'UTC',
        });
      };

      const afastamentoExtendido: AfastamentoTemporarioExtendido = {
        ...afastamento,
        dataCriacaoFormata: formatarData(afastamento.createdAt),
        dataRetornoFormata: formatarData(afastamento.dataFim),
        dataSaidaFormata: formatarData(afastamento.dataInicio),
      };

      return afastamentoExtendido;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          error.message ||
            'Não foi possível visualizar o pedido de afastamento!',
        );
        throw error;
      } else {
        console.error('Erro desconhecido');
        throw new Error('Erro desconhecido');
      }
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await prisma.afastamentoTemporario.delete({
        where: {
          id: id,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        console.error('Erro desconhecido');
        throw new Error('Erro desconhecido');
      }
    }
  }
}

export default new AfastamentoService();
