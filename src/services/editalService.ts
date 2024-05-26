import { PrismaClient } from '@prisma/client';
import moment from 'moment-timezone';

const prisma = new PrismaClient();

interface CriarEditalParams {
  num_edital: string;
  documento: string;
  data_inicio: Date;
  data_fim: Date;
  carta_recomendacao: string;
  carta_orientador: string;
  vaga_regular_mestrado: number;
  vaga_regular_doutorado: number;
  vaga_suplementar_mestrado: number;
  vaga_suplementar_doutorado: number;
}

class EditalService {
  async criarEdital({
    num_edital,
    documento,
    data_inicio,
    data_fim,
    carta_recomendacao,
    carta_orientador,
    vaga_regular_mestrado,
    vaga_regular_doutorado,
    vaga_suplementar_mestrado,
    vaga_suplementar_doutorado,
  }: CriarEditalParams) {
    const edital = await prisma.edital.findUnique({
      where: {
        editalId: num_edital,
      },
    });

    if (edital) {
      console.log('edital ja existe');
      throw new Error(`Edital de número ${num_edital} já existe`);
    }

    const novo_edital = await prisma.edital.create({
      data: {
        editalId: num_edital,
        vagaDoutorado: vaga_regular_doutorado,
        vagaMestrado: vaga_regular_mestrado,
        cotasDoutorado: vaga_suplementar_doutorado,
        cotasMestrado: vaga_suplementar_mestrado,
        cartaOrientador: carta_orientador,
        cartaRecomendacao: carta_recomendacao,
        documento,
        dataInicio: data_inicio,
        dataFim: data_fim,
        status: '1',
        inscricoesIniciadas: 0,
        inscricoesEncerradas: 0,
        createdAt: moment.tz('America/Manaus').toDate(),
        updatedAt: moment.tz('America/Manaus').toDate(),
      },
    });

    return novo_edital;
  }

  async listEdital() {
    return await prisma.edital.findMany();
  }

  async delete(id: string) {
    const edital = await prisma.edital.findUnique({
      where: {
        editalId: id,
      },
    });

    if (!edital) {
      console.log('Edital não existe');
      throw new Error(`Não existe edital de número ${id}`);
    }

    const updatedEdital = await prisma.edital.update({
      where: { editalId: id },
      data: { status: '0' },
    });

    return updatedEdital;
  }

  async arquivar(id_edital: string, { status }: { status: string }) {
    const edital = await prisma.edital.findUnique({
      where: {
        editalId: id_edital,
      },
    });

    if (!edital) {
      throw new Error('Edital não encontrado');
    }

    const updatedEdital = await prisma.edital.update({
      where: {
        editalId: id_edital,
      },
      data: {
        status,
        updatedAt: moment.tz('America/Manaus').toDate(),
      },
    });

    return updatedEdital;
  }

  async getEdital(id: string) {
    const edital = await prisma.edital.findUnique({
      where: {
        editalId: id,
      },
    });
    return edital;
  }

  async update(
    id_update: string,
    {
      num_edital,
      documento,
      data_inicio,
      data_fim,
      carta_recomendacao,
      carta_orientador,
      vaga_regular_mestrado,
      vaga_regular_doutorado,
      vaga_suplementar_mestrado,
      vaga_suplementar_doutorado,
    }: {
      num_edital: string;
      documento: string;
      data_inicio: Date;
      data_fim: Date;
      carta_recomendacao: string;
      carta_orientador: string;
      vaga_regular_mestrado: number;
      vaga_regular_doutorado: number;
      vaga_suplementar_mestrado: number;
      vaga_suplementar_doutorado: number;
    }
  ) {
    const edital = await prisma.edital.findUnique({
      where: {
        editalId: id_update,
      },
    });

    if (!edital) {
      throw new Error('Edital não encontrado');
    }

    const updatedEdital = await prisma.edital.update({
      where: {
        editalId: id_update,
      },
      data: {
        editalId: num_edital,
        vagaDoutorado: vaga_regular_doutorado,
        vagaMestrado: vaga_regular_mestrado,
        cotasDoutorado: vaga_suplementar_doutorado,
        cotasMestrado: vaga_suplementar_mestrado,
        cartaOrientador: carta_orientador,
        cartaRecomendacao: carta_recomendacao,
        documento,
        dataInicio: data_inicio,
        dataFim: data_fim,
        updatedAt: moment.tz('America/Manaus').toDate(),
      },
    });

    return updatedEdital;
  }

  async getEditalByNumber(number: string) {
    const edital = await prisma.edital.findUnique({
      where: {
        editalId: number,
      },
    });
    return edital;
  }

  async listCandidates(id: string) {
    const candidates = await prisma.candidate.findMany({
      where: {
        editalId: id,
      },
    });
    return candidates;
  }

  async getCandidate(id: number) {
    const candidate = await prisma.candidate.findUnique({
      where: {
        id,
      },
    });
    return candidate;
  }
}

export default new EditalService();
