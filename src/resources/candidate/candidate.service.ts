const moment = require('moment')
import { compare, genSalt, hash } from 'bcrypt'
import { PrismaClient, Candidate } from "@prisma/client"
import { CreateCandidateDto, CandidateSemSenha } from './candidate.types'
const prisma = new PrismaClient()

async function validPassword( password: string, passwordHash: string) {
  return await compare(password, passwordHash)
}

function excludePassword(candidade: Candidate): CandidateSemSenha {
  // return Object.fromEntries(
  //   Object.entries(candidade).filter(([key]) => key !== 'passwordHash')
  // )
  const { passwordHash, ...CandidateSemSenha } = candidade
  return CandidateSemSenha as CandidateSemSenha
}

class CandidateService {
  async create(novoCandidate: CreateCandidateDto): Promise<Candidate> {
    // const step = 0
    const salt = await genSalt(10)
    // const passwordHash = await hash(novoCandidate.passwordHash, salt)
    novoCandidate.passwordHash = await hash(novoCandidate.passwordHash, salt)
    novoCandidate.etapaAtual = 0

    let candidate = await prisma.candidate.findFirst({
      where: {
        email: novoCandidate.email,
        editalId: novoCandidate.editalId
      }
    }).catch(err => {
      console.log(err)
      throw new Error('Não foi possivel criar o candidato erro no find one ')
    })

    if (candidate) {
      throw new Error('Candidato já existe')
    }
    
    return await prisma.candidate.create({
      data: novoCandidate
    }).catch(err => {
      console.log(`[ERROR] Criar de candidato: ${err}`)
      throw new Error('Não foi possivel criar o candidato erro no create')
    })
  }

  async list(){
    return await prisma.candidate.findMany({
      select: {
        passwordHash: false
      }
    }).catch(err => {
      console.log(`[ERROR] Listar Candidatos: ${err}`)
      throw new Error('Não foi possivel listar o candidato')
    })
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

  async findOneCandidate(id: number): Promise<Candidate>{
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

  async listCanditatesByEdital(editalId: string): Promise<CandidateSemSenha[]>{
    const candidates = await prisma.candidate.findMany({
      where: {
        editalId
      },
    }).catch(err => {
      console.log(`[ERROR] Listar Candidatos: ${err}`)
      throw new Error('Não foi possivel listar o candidato')
    })
    
    return candidates.map(candidate => excludePassword(candidate))
  }
}

export default new CandidateService()
