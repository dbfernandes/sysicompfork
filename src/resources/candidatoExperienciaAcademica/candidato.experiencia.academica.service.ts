import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class CandidatoExperienciaAcademicaService {
  async create({ data, candidatoId }: { data: any; candidatoId: string }) {
    return prisma.candidatoExperienciaAcademica.create({
      data: {
        ...data,
        candidatoId,
      },
    });
  }

  async dropAllByCandidateId(candidatoId: string) {
    return prisma.candidatoExperienciaAcademica.deleteMany({
      where: {
        candidatoId,
      },
    });
  }

  async listByCandidateId(candidatoId: string) {
    return prisma.candidatoExperienciaAcademica.findMany({
      where: {
        candidatoId,
      },
    });
  }
}

export default new CandidatoExperienciaAcademicaService();
