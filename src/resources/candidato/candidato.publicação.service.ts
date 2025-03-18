import { compare, genSalt, hash } from 'bcrypt';
import { Candidato, PrismaClient } from '@prisma/client';
import moment from 'moment';
const prisma = new PrismaClient();

async function validPassword(password: string, passwordHash: string) {
  return await compare(password, passwordHash);
}

class CandidatoService {
  async criarCandidato(email: string, password: string, editalNumber: string) {
    try {
      const salt = await genSalt(10);
      const passwordHash = await hash(password, salt);

      let candidato = await prisma.candidato
        .findFirst({
          where: {
            email,
            editalId: editalNumber,
          },
        })
        .catch((err) => {
          console.error(err);
          throw new Error(
            'Não foi possivel criar o candidato erro no find one ',
          );
        });

      if (candidato) {
        throw new Error('Candidato já existe');
      }

      candidato = await prisma.candidato
        .create({
          data: {
            email,
            senhaHash: passwordHash,
            editalId: editalNumber,
            posicaoEdital: 1,
            // etapaAtual: step,
          },
        })
        .catch((err) => {
          console.log(`[ERROR] Criar de candidato: ${err}`);
          throw new Error('Não foi possivel criar o candidato erro no create');
        });

      // delete candidato.password
      // delete candidato.passwordHash

      return candidato;
    } catch (error) {
      console.log(error);
    }
  }

  async listarCandidatos() {
    const candidatos = await prisma.candidato
      .findMany({
        select: {
          senhaHash: false,
        },
      })
      .catch((err) => {
        console.log(`[ERROR] Listar Candidatos: ${err}`);
        throw new Error('Não foi possivel listar o candidato');
      });
    return candidatos;
  }

  async auth(email: string, password: string, editalNumber: string) {
    const candidato = await prisma.candidato
      .findFirst({
        where: {
          email,
          editalId: editalNumber,
        },
      })
      .catch((err) => {
        console.log(err);
        throw new Error('Não foi possivel encontrar o candidato');
      });

    if (!candidato) {
      throw new Error('Usuário não encontrado');
    }

    if (!(await validPassword(password, candidato.senhaHash))) {
      throw new Error('Usuário ou senha incorretos');
    }

    // if (await xprisma.result.candidato.validatePassword({password, passwordHash: candidato.passwordHash})) {
    //   throw new Error('Usuário ou senha incorretos')
    // }

    return candidato;
  }

  async form1(candidatoData: Candidato, id: number) {
    const dataNascimentoFormatada = moment(
      candidatoData.dataNascimento,
      'DD/MM/YYYY',
    ).format('YYYY-MM-DD');

    const dataAtualizada = {
      ...candidatoData,
      dataNascimento: new Date(dataNascimentoFormatada),
      currentStep: 1,
    };

    await prisma.candidato
      .update({
        where: {
          id,
        },
        data: dataAtualizada,
      })
      .catch((err) => {
        console.log(err);
        throw new Error('Não foi possível atualizar o candidato');
      });

    const candidatoAtualizado = await prisma.candidato
      .findUnique({
        where: {
          id,
        },
      })
      .catch((err) => {
        console.log(err);
        throw new Error('Não foi possível encontrar o candidato');
      });

    return candidatoAtualizado;
  }

  async back(id: number) {
    const candidato = await prisma.candidato
      .findUnique({
        where: {
          id,
        },
      })
      .catch((err) => {
        console.log(err);
        throw new Error('Não foi possivel encontrar o candidato');
      });
    return candidato;
  }

  async listarCandidatosPorEdital(editalId: string) {
    const candidatos = await prisma.candidato
      .findMany({
        where: {
          editalId: editalId,
        },
      })
      .catch((err) => {
        console.log(`[ERROR] Listar Candidatos: ${err}`);
        throw new Error('Não foi possivel listar o candidato');
      });
    return candidatos;
  }
}

export default new CandidatoService();
