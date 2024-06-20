import { genSalt, hash } from "bcrypt";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";
const prisma = new PrismaClient();

class CandidatoService {
  validPassword(candidate, password) {
    return candidate.validPassword(password);
  }

  async create({ email, password, editalNumber }) {
    const step = 1;
    const salt = await genSalt(10);
    const passwordHash = await hash(password, salt);
    const candidate = await prisma.candidato.create({
      data: {
        email,
        senhaHash: passwordHash,
        idEdital: editalNumber,
        posicaoEdital: step,
      },
    });

    delete candidate.senhaHash;
    return candidate;
  }

  async findCandidatoByEmailAndEdital({ email, edital }) {
    const candidato = await prisma.candidato.findFirst({
      where: {
        email,
        idEdital: edital,
      },
    });

    return candidato;
  }

  async auth({ email, password, editalNumber }) {
    const candidate = await prisma.candidato.findFirst({
      where: {
        email,
        idEdital: editalNumber,
      },
    });

    if (!candidate) {
      return null;
    }
    return (await bcrypt.compare(password, candidate.senhaHash))
      ? candidate
      : null;
  }

  async findById(id) {
    return await prisma.candidato.findUnique({
      where: {
        id,
      },
    });
  }

  async update({ id, data }) {
    return await prisma.candidato.update({
      where: {
        id,
      },
      data,
    });
  }

  async backEdital({ id }) {
    const candidate = await prisma.candidato.findFirst({
      where: {
        id,
      },
    });
    await prisma.candidato.update({
      where: {
        id,
      },
      data: {
        posicaoEdital: candidate.posicaoEdital - 1,
      },
    });

    return candidate;
  }

  async updateTokenPassword({ id }) {
    const candidate = await prisma.candidato.findFirst({
      where: {
        id,
      },
    });
    const token = crypto.randomBytes(20).toString("hex");

    await prisma.candidato.update({
      where: {
        id,
      },
      data: {
        tokenResetSenha: token,
      },
    });
    return token;
  }
 
  async findByTokenPassword(token) {
    return await prisma.candidato.findFirst({ 
      where: {
        tokenResetSenha: token,
      }
    });
  }

  async changePasswordWithToken({ token, password }) {
    const candidate = await prisma.candidato.findFirst({
      where: {
        tokenResetSenha: token,
      },
    });

    if (!candidate) {
      return false
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    return await prisma.candidato.update({
      where: {
        id: candidate.id,
      },
      data: {
        senhaHash: passwordHash,
        tokenResetSenha: null,
      },
    });
  }
}

export default new CandidatoService();
