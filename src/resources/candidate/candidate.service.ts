const moment = require('moment')
import { compare, genSalt, hash } from 'bcrypt'
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function validPassword( password: string, passwordHash: string) {
  return await compare(password, passwordHash)
}

class CandidateService {
  async create(email: string, password: string, editalNumber: string) {
    try {
      const step = 0
      const salt = await genSalt(10)
      const passwordHash = await hash(password, salt)

      let candidate = await prisma.candidate.findFirst({
        where: {
          email,
          editalId: editalNumber
        }
      }).catch(err => {
        console.log(err)
        throw new Error('Não foi possivel criar o candidato erro no find one ')
      })

      if (candidate) {
        throw new Error('Candidato já existe')
      }

      candidate = await prisma.candidate.create({
        data: {
          email,
          passwordHash,
          editalId: editalNumber,
          editalPosition: 1,
          etapaAtual: step
        }
      }).catch(err => {
        console.log(`[ERROR] Criar de candidato: ${err}`)
        throw new Error('Não foi possivel criar o candidato erro no create')
      })

      // delete candidate.password
      // delete candidate.passwordHash

      return candidate
    } catch (error) {
      console.log(error)
    }

  }

  async list() {
    const candidates = await prisma.candidate.findMany({
      select: {
        passwordHash: false
      }
    }).catch(err => {
      console.log(`[ERROR] Listar Candidatos: ${err}`)
      throw new Error('Não foi possivel listar o candidato')
    })
    return candidates
  }

  async auth(
    email: string,
    password: string,
    editalNumber: string
  ) {
    const candidate = await prisma.candidate.findFirst({
      where: {
        email,
        editalId: editalNumber
      }
    }).catch(err => {
      console.log(err)
      throw new Error('Não foi possivel encontrar o candidato')
    })

    if (!candidate) {
      throw new Error('Usuário não encontrado')
    }

    if (!(await validPassword(password, candidate.passwordHash))) {
      throw new Error('Usuário ou senha incorretos')
    }
      
    // if (await xprisma.result.candidate.validatePassword({password, passwordHash: candidate.passwordHash})) {
    //   throw new Error('Usuário ou senha incorretos')
    // }

    return candidate
  }

  async form1(
    Candidato: any,
    id: number
  ) {
    const dataNascimentoFormatada = moment(Candidato.Nascimento, 'DD/MM/YYYY').format('YYYY-MM-DD')
    Candidato.Nascimento = new Date(dataNascimentoFormatada).toISOString()
    await prisma.candidate.update({
      where: {
        id
      },
      data: {
        ...Candidato,
        currentStep: 1
      }
    }).catch(err => {
      console.log(err)
      throw new Error('Não foi possivel atualizar o candidato')
    })
    const candidate = await prisma.candidate.findUnique({
      where: {
        id
      }
    }).catch(err => {
      console.log(err)
      throw new Error('Não foi possivel encontrar o candidato')
    })
    return candidate
  }

  async findOneCandidate(id: number) {
    const candidate = await prisma.candidate.findUnique({
      where: {
        id
      }
    }).catch(err => {
      console.log(err)
      throw new Error('Não foi possivel encontrar o candidato')
    })
    if (!candidate) {
      throw new Error('Candidato não encontrado')
    }
    return candidate
  }

  async back(id: number) {
    const candidate = await prisma.candidate.findUnique({
      where: {
        id
      }
    }).catch(err => {
      console.log(err)
      throw new Error('Não foi possivel encontrar o candidato')
    })
    return candidate
  }

  async listCanditatesByEdital(editalId: string) {
    const candidates = await prisma.candidate.findMany({
      where: {
        editalId
      },
      select: {
        passwordHash: false
      }
    }).catch(err => {
      console.log(`[ERROR] Listar Candidatos: ${err}`)
      throw new Error('Não foi possivel listar o candidato')
    })
    return candidates
  }
}

export default new CandidateService()
