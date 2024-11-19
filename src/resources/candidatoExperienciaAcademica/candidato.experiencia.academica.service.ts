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

  async dropAllByCandidatoId(candidatoId: number) {
    return await prisma.candidatoExperienciaAcademica.deleteMany({
      where: {
        candidatoId,
      },
    });
  }

  async listByCandidatoId(candidatoId: number) {
    return await prisma.candidatoExperienciaAcademica.findMany({
      where: {
        candidatoId,
      },
    });
  }
}

export default new CandidatoExperienciaAcademicaService();
