import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class AfastamentoService {
  async listarAfastamentosDoUsuario(id: string) {
    try {
      const allResearchLines = await prisma.afastamentoTemporarios.findMany({
        where: {
          usuarioId: parseInt(id),
        },
      });
      // const formatedAnswer = formatDbAnswer(allResearchLines)
      const dataFormatada = allResearchLines.map((afastamento: any) => {
        afastamento.dataCriacaoFormata = new Date(
          afastamento.createdAt,
        ).toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
        });
        afastamento.dataRetornoFormata = new Date(
          afastamento.dataRetorno,
        ).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone: 'UTC',
        });
        afastamento.dataSaidaFormata = new Date(
          afastamento.dataSaida,
        ).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone: 'UTC',
        });

        return afastamento;
      });
      return dataFormatada;
    } catch (error: any) {
      console.log(
        error.message || 'Não foi possível listar os pedidos de afastamento!',
      );
    }
  }

  async listarTodos() {
    try {
      const allResearchLines = await prisma.afastamentoTemporarios.findMany();
      const dataFormatada = allResearchLines.map((afastamento: any) => {
        afastamento.dataCriacaoFormata = new Date(
          afastamento.createdAt,
        ).toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
        });
        afastamento.dataRetornoFormata = new Date(
          afastamento.dataRetorno,
        ).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone: 'UTC',
        });
        afastamento.dataSaidaFormata = new Date(
          afastamento.dataSaida,
        ).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone: 'UTC',
        });
        return afastamento;
      });
      return dataFormatada;
    } catch (error: any) {
      console.log(
        error.message || 'Não foi possível listar os pedidos de afastamento!',
      );
    }
  }

  async criar(newAfastamento: Prisma.AfastamentoTemporariosCreateInput) {
    try {
      await prisma.afastamentoTemporarios.create({
        data: {
          ...newAfastamento,
        },
      });
    } catch (error: any) {
      console.log(
        error.message || 'Não foi possível criar o pedido de afastamento!',
      );
    }
  }

  async retornarAfastamento(id: string) {
    const afastamento = await prisma.afastamentoTemporarios.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    return afastamento;
  }

  async vizualizar(id: string) {
    const afastamento = await prisma.afastamentoTemporarios.findUnique({
      where: { id: parseInt(id) },
    });
    if (!afastamento) return null;
    const dataFormatada = {
      ...afastamento,
      dataCriacaoFormata: new Date(afastamento.createdAt).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        },
      ),
      dataRetornoFormata: new Date(afastamento.dataRetorno).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone: 'UTC',
        },
      ),
      dataSaidaFormata: new Date(afastamento.dataSaida).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone: 'UTC',
        },
      ),
    };
    return dataFormatada;
  }

  async delete(id: string) {
    await prisma.afastamentoTemporarios.delete({
      where: {
        id: parseInt(id),
      },
    });
  }
}

export default new AfastamentoService();
