import { PrismaClient, Edital, Candidato } from '@prisma/client';
import { CreateEditalDto, StatusEdital } from './edital.types';
/* eslint-disable camelcase */

const prisma = new PrismaClient();

class EditalService {
  async criarEdital(editalDados: CreateEditalDto): Promise<Edital> {
    try {
      const edital = await prisma.edital.findFirst({
        where: {
          editalCodigo: editalDados.editalCodigo,
        },
      });

      if (edital) {
        console.error('edital ja existe');
        throw new Error(
          `Edital de número ${editalDados.editalCodigo} já existe`,
        );
      }

      return await prisma.edital.create({ data: editalDados });
    } catch (error: any) {
      console.error('Erro ao criar edital:', error);
      throw new Error(error);
    }
  }

  async listEdital() {
    const editais = await prisma.edital.findMany().catch((err) => {
      console.error(`[ERROR] Listar Editais: ${err}`);
      throw new Error('Não foi possivel listar o edital');
    });
    return editais;
  }

  async listEditaisDisponiveis(): Promise<Edital[]> {
    const dataToday = new Date();
    const editais = await prisma.edital.findMany();
    return editais.filter((edital) => {
      const dateEnd = new Date(edital.dataFim);
      return dateEnd >= dataToday && edital.status === StatusEdital.ATIVO;
    });
  }

  async listEditalComQtdeCandidatos() {
    const editais = await prisma.edital.findMany({
      include: {
        Candidatos: true,
      },
    });
    return editais.map((edital) => {
      return {
        ...edital,
        qtdeInscricoesFinalizadas: edital.Candidatos.filter(
          (candidato) => candidato.posicaoEdital >= 4,
        ).length,
        qtdeInscricoesPendentes: edital.Candidatos.filter(
          (candidato) => candidato.posicaoEdital < 4,
        ).length,
      };
    });
  }

  async delete(editalCodigo: string) {
    try {
      const edital = await prisma.edital.findFirst({
        where: {
          editalCodigo,
        },
      });

      if (!edital) {
        throw new Error(`Não existe edital de número ${editalCodigo}`);
      }

      const updatedEdital = await prisma.edital.update({
        where: { editalCodigo },
        data: { status: '0' },
      });

      return updatedEdital;
    } catch (error: any) {
      console.error('Erro ao arquivar edital:', error);
      throw new Error(error);
    }
  }

  async arquivar(editalCodigo: string, { status }: { status: any }) {
    const edital = await prisma.edital
      .findFirst({
        where: {
          editalCodigo,
        },
      })
      .catch((err) => {
        console.error(`[ERROR] Buscar Edital: ${err}`);
        throw new Error('Não foi possivel buscar o edital');
      });

    if (!edital) {
      throw new Error('Edital não encontrado');
    }

    await prisma.edital
      .update({
        where: {
          editalCodigo,
        },
        data: {
          status,
          // updatedAt: moment.tz('America/Manaus').format('YYYY-MM-DD HH:mm:ss')
        },
      })
      .catch((err) => {
        console.error(`[ERROR] Atualizar Edital: ${err}`);
        throw new Error('Não foi possivel alterar o status do edital');
      });

    return edital;
  }

  async getEditalById(id: number): Promise<Edital | null> {
    const edital = await prisma.edital
      .findFirst({
        where: {
          id,
        },
      })
      .catch((err) => {
        console.error(`[ERROR] Buscar Edital: ${err}`);
        throw new Error('Não foi possivel buscar o edital');
      });

    return edital;
  }

  async getEditalByCode(editalCodigo: string) {
    const edital = await prisma.edital.findFirst({
      where: {
        editalCodigo,
      },
    });

    return edital;
  }

  async update(id_update: string, dados: any): Promise<Edital> {
    try {
      const edital = await prisma.edital.findFirst({
        where: {
          id: dados.editalId,
        },
      });

      if (!edital) {
        throw new Error('Edital não encontrado');
      }
      return await prisma.edital.update({
        where: { editalCodigo: id_update },
        data: dados,
      });
    } catch (error: any) {
      console.error('Erro ao atualizar edital:', error);
      throw new Error(error);
    }
  }

  async listCandidates(editalCodigo: string): Promise<Candidato[]> {
    const edital = await prisma.edital
      .findFirst({
        where: {
          editalCodigo,
        },
        include: {
          Candidatos: true,
        },
      })
      .catch((err) => {
        console.error(`[ERROR] Listar Candidatos: ${err}`);
        throw new Error('Não foi possivel listar o candidato');
      });
    return edital.Candidatos;
  }

  async getCandidate(id: number): Promise<Candidato | null> {
    try {
      return await prisma.candidato.findFirst({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error(`[ERROR] Buscar Candidato: ${error}`);
      throw new Error('Não foi possivel buscar o candidato');
    }
  }
}

export default new EditalService();
