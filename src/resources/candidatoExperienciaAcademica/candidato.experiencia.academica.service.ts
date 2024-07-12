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
    return await prisma.candidateAcademicExperience.deleteMany({
      where: {
        idCandidate,
      },
    });
  }

  async listByCandidateId(idCandidate) {
    return await prisma.candidateAcademicExperience.findMany({
      where: {
        idCandidate,
      },
    });
  }
}

export default new CandidatoExperienciaAcademicaService();
