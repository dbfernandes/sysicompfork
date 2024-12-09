import { AfastamentoTemporario, PrismaClient } from '@prisma/client';
import { AfastamentoTemporarioExtendido } from './afastamentoTemporario.types';

const prisma = new PrismaClient();

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
        return {
          ...afastamento,
          dataCriacaoFormata: new Date(
            afastamento.createdAt,
          ).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
          }),
          dataRetornoFormata: new Date(
            afastamento.dataInicio,
          ).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'UTC',
          }),
          dataSaidaFormata: new Date(afastamento.dataFim).toLocaleDateString(
            'pt-BR',
            {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              timeZone: 'UTC',
            },
          ),
        };
      });
      return dataFormatada;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error.message;
      } else {
        console.log('Erro desconhecido');
        throw new Error('Erro desconhecido');
      }
    }
  }

  async listarTodos(): Promise<AfastamentoTemporario[]> {
    try {
      const allResearchLines = await prisma.afastamentoTemporario.findMany();
      const dataFormatada = allResearchLines.map((afastamento) => {
        return {
          ...afastamento,
          dataCriacaoFormata: new Date(
            afastamento.createdAt,
          ).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
          }),
          dataRetornoFormata: new Date(
            afastamento.dataInicio,
          ).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'UTC',
          }),
          dataSaidaFormata: new Date(afastamento.dataFim).toLocaleDateString(
            'pt-BR',
            {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              timeZone: 'UTC',
            },
          ),
        };
      });
      return dataFormatada;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error.message;
      } else {
        console.log('Erro desconhecido');
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
        console.log('Erro desconhecido');
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
        console.log('Erro desconhecido');
        throw new Error('Erro desconhecido');
      }
    }
  }

  async vizualizar(id: number): Promise<AfastamentoTemporarioExtendido | null> {
    try {
      const afastamento = await prisma.afastamentoTemporario.findUnique({
        where: { id: id },
      });

      if (!afastamento) return null;

      const afastamentoExtendido: AfastamentoTemporarioExtendido = {
        ...afastamento,
        dataCriacaoFormata: new Date(afastamento.createdAt).toLocaleDateString(
          'pt-BR',
          {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          },
        ),
        dataRetornoFormata: new Date(afastamento.dataInicio).toLocaleDateString(
          'pt-BR',
          {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'UTC',
          },
        ),
        dataSaidaFormata: new Date(afastamento.dataFim).toLocaleDateString(
          'pt-BR',
          {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'UTC',
          },
        ),
      };

      return afastamentoExtendido;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(
          error.message ||
            'Não foi possível visualizar o pedido de afastamento!',
        );
        throw error;
      } else {
        console.log('Erro desconhecido');
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
        throw error.message;
      } else {
        console.log('Erro desconhecido');
        throw new Error('Erro desconhecido');
      }
    }
  }
}

export default new AfastamentoService();
