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

  async dropAllByCandidateId(idCandidate) {
    return await prisma.candidatoExperienciaAcademica.deleteMany({
      where: {
        idCandidato: idCandidate,
      },
    });
  }

  async listByCandidateId(idCandidate: number) {
    return await prisma.candidatoExperienciaAcademica.findMany({
      where: {
        idCandidato: idCandidate,
      },
    });
  }
}

export default new CandidatoExperienciaAcademicaService();
