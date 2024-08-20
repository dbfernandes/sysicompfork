import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class CandidatoExperienciaAcademicaService {
  async create({ data, idCandidato }) {
    return await prisma.candidatoExperienciaAcademica.create({
      data: {
        ...data,
        idCandidato,
      },
    });
  }

  async dropAllByCandidateId(idCandidato: number) {
    return await prisma.candidatoExperienciaAcademica.deleteMany({
      where: {
        idCandidato,
      },
    });
  }

  async listByCandidateId(idCandidato: number) {
    return await prisma.candidatoExperienciaAcademica.findMany({
      where: {
        idCandidato,
      },
    });
  }
}

export default new CandidatoExperienciaAcademicaService();
