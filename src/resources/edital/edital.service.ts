import { Edital, Candidato } from '@prisma/client';
import { CreateEditalDto, StatusEdital, UpdateEditalDto } from './edital.types';
import prisma from '@/client';
/* eslint-disable camelcase */

class EditalService {
  async getById(id: string): Promise<Edital | null> {
    try {
      return await prisma.edital.findFirst({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error('Erro ao buscar edital:', error);
      throw new Error(error);
    }
  }

  async criarEdital(editalDados: CreateEditalDto): Promise<Edital> {
    try {
      const edital = await prisma.edital.findFirst({
        where: {
          id: editalDados.id,
        },
      });

      if (edital) {
        console.error('edital ja existe');
        throw new Error(`Edital de número ${editalDados.id} já existe`);
      }

      return await prisma.edital.create({ data: editalDados });
    } catch (error) {
      console.error('Erro ao criar edital:', error);
      throw new Error(error);
    }
  }

  async listEdital() {
    try {
      const editais = await prisma.edital.findMany();
      return editais;
    } catch (error) {
      console.error(`[ERROR] Listar Editais: ${error}`);
      throw new Error('Não foi possivel listar o edital');
    }
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
        candidatos: true,
      },
    });
    return editais.map((edital) => {
      return {
        ...edital,
        qtdeInscricoesFinalizadas: edital.candidatos.filter(
          (candidato) => candidato.posicaoEdital >= 4,
        ).length,
        qtdeInscricoesPendentes: edital.candidatos.filter(
          (candidato) => candidato.posicaoEdital < 4,
        ).length,
      };
    });
  }

  async listEditalsAvailable(): Promise<Edital[]> {
    const dataToday = new Date();
    const editais = await prisma.edital.findMany().catch((err) => {
      console.error(`[ERROR] Listar Editais: ${err}`);
      throw new Error('Não foi possivel listar o edital');
    });
    return editais.filter((edital) => {
      const dateEnd = new Date(edital.dataFim);
      return dateEnd >= dataToday && edital.status === 1;
    });
  }

  async delete(id: string) {
    try {
      const edital = await prisma.edital.findFirst({
        where: {
          id,
        },
      });

      if (!edital) {
        throw new Error(`Não existe edital de número ${id}`);
      }

      const updatedEdital = await prisma.edital.update({
        where: { id: id },
        data: { status: 0 },
      });

      return updatedEdital;
    } catch (error) {
      console.error('Erro ao arquivar edital:', error);
      throw new Error(error);
    }
  }

  async arquivar(id: string, { status }: { status: any }) {
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

    if (!edital) {
      throw new Error('Edital não encontrado');
    }

    await prisma.edital
      .update({
        where: {
          id,
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

  async getEdital(id: string): Promise<Edital | null> {
    const edital = await prisma.edital
      .findFirst({
        where: {
          id: id,
        },
      })
      .catch((err) => {
        console.error(`[ERROR] Buscar Edital: ${err}`);
        throw new Error('Não foi possivel buscar o edital');
      });

    return edital;
  }

  async update(id_update: string, dados: UpdateEditalDto): Promise<Edital> {
    try {
      const edital = await prisma.edital.findFirst({
        where: {
          id: dados.id,
        },
      });

      if (!edital) {
        throw new Error('Edital não encontrado');
      }
      return await prisma.edital.update({
        where: { id: id_update },
        data: dados,
      });
    } catch (error) {
      console.error('Erro ao atualizar edital:', error);
      throw new Error(error);
    }
  }

  async getEditalByNumber(id: string): Promise<Edital | null> {
    const edital = await prisma.edital
      .findFirst({
        where: {
          id: id,
        },
      })
      .catch((err) => {
        console.error(`[ERROR] Buscar Edital: ${err}`);
        throw new Error('Não foi possivel buscar o edital');
      });

    return edital;
  }

  async listCandidatos(id: string): Promise<Candidato[]> {
    try {
      const candidatos = await prisma.candidato.findMany({
        where: {
          editalId: id,
        },
        include: {
          linhaPesquisa: true,
        },
      });
      return candidatos;
    } catch (error) {
      console.error('Erro ao listar candidatos:', error);
      throw new Error(error);
    }
  }

  async getCandidato(id: number) {
    try {
      return await prisma.candidato.findFirst({
        where: {
          id,
        },
        include: {
          recomendacoes: true,
        },
      });
    } catch (error) {
      console.error(`[ERROR] Buscar Candidato: ${error}`);
      throw new Error('Não foi possivel buscar o candidato');
    }
  }
}

export default new EditalService();
