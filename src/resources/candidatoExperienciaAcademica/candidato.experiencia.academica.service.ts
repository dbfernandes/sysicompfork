import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class CandidatoExperienciaAcademicaService {
  async create({ data, candidatoId }) {
    return await prisma.candidatoExperienciaAcademica.create({
      data: {
        ...data,
        candidatoId,
      },
    });
  }

  async dropAllByCandidateId(candidatoId: number) {
    return await prisma.candidatoExperienciaAcademica.deleteMany({
      where: {
        candidatoId,
      },
    });
  }

  async listByCandidateId(candidatoId: number) {
    return await prisma.candidatoExperienciaAcademica.findMany({
      where: {
        candidatoId,
      },
    });
  }
}

export default new CandidatoExperienciaAcademicaService();
