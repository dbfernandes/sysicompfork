import { genSalt, hash } from 'bcrypt'
const moment = require('moment')
const { Candidate } = require('../models')

class CandidateService {
  async create ({ email, password, editalNumber }) {
    const step = 0
    const salt = await genSalt(10)
    const passwordHash = await hash(password, salt)

    let candidate = await Candidate.findOne({
      where: {
        email,
        editalId: editalNumber
      }
    }).catch((err) => {
      console.error(err)
      throw new Error('Não foi possivel criar o candidato erro no find one ')
    })

    if (candidate) {
      throw new Error('Candidato já existe')
    }

    candidate = await Candidate.create({
      email,
      password,
      passwordHash,
      editalId: editalNumber,
      editalPosition: 1,
      currentStep: step,
      status: 'created'
    }).catch((err) => {
      console.error(`[ERROR] Criar de candidato: ${err}`)
      throw new Error('Não foi possivel criar o candidato erro no create')
    })

    delete candidate.password
    delete candidate.passwordHash

    return candidate
  }

  async list () {
    const candidates = await Candidate.findAll({
      attributes: {
        exclude: ['passwordHash']
      }
    }).catch((err) => {
      console.error(`[ERROR] Listar Candidatos: ${err}`)
      throw new Error('Não foi possivel listar o candidato')
    })
    return candidates
  }

  async getCandidate ({ email, editalNumber }) {
    const candidate = await Candidate.findOne({
      where: {
        email,
        editalId: editalNumber
      }
    })
    return candidate
  }
 
  async auth ({ email, password, editalNumber }) {
    const candidate = await Candidate.findOne({
      where: {
        email,
        editalId: editalNumber
      }
    })
    if(!candidate) {
      return null
    }
    const validPassword = await candidate.validPassword(password)
    return validPassword
  }

  async form1 ({ Candidato, id }) {
    const dataNascimentoFormatada = moment(
      Candidato.Nascimento,
      'DD/MM/YYYY'
    ).format('YYYY-MM-DD')
    Candidato.Nascimento = dataNascimentoFormatada
    await Candidate.update(
      {
        Nome: Candidato.Nome,
        editalPosition: 2,
        Nascimento: Candidato.Nascimento,
        Sexo: Candidato.Sexo,
        NomeSocial: Candidato.NomeSocial,
        CEP: Candidato.CEP,
        UF: Candidato.UF,
        Endereco: Candidato.Endereco,
        Cidade: Candidato.Cidade,
        Bairro: Candidato.Bairro,
        Nacionalidade: Candidato.Nacionalidade,
        Telefone: Candidato.TelefonePrincipal,
        TelefoneSecundario: Candidato.TelefoneAlternativo,
        ComoSoube: Candidato.ComoSoube,
        Curso: Candidato.CursoDesejado,
        Regime: Candidato.RegimeDedicacao,
        Cotista: Candidato.Cotista,
        CotistaTipo: Candidato.CotistaTipo,
        Condicao: Candidato.Condicao,
        CondicaoTipo: Candidato.CondicaoTipo,
        Bolsista: Candidato.Bolsa
      },
      {
        where: {
          id
        }
      }
    ).catch((err) => {
      console.error(err)
      throw new Error('Não foi possivel atualizar o candidato')
    })
    const candidate = await Candidate.findOne({
      where: {
        id
      }
    }).catch((err) => {
      console.error(err)
      throw new Error('Não foi possivel encontrar o candidato')
    })
    return candidate
  }

  async form2 ({ Candidato, id }) {
    // const dataNascimentoFormatada = moment(Candidato.Nascimento, 'DD/MM/YYYY').format('YYYY-MM-DD')
    await Candidate.update(
      {
        ...Candidato,
        editalPosition: 3
        // Nascimento: Candidato.Nascimento,
        // Sexo: Candidato.Sexo,
        // NomeSocial: Candidato.NomeSocial,
        // CEP: Candidato.CEP,
        // UF: Candidato.UF,
        // Endereco: Candidato.Endereco,
        // Cidade: Candidato.Cidade,
        // Bairro: Candidato.Bairro,
        // Nacionalidade: Candidato.Nacionalidade,
        // Telefone: Candidato.TelefonePrincipal,
        // TelefoneSecundario: Candidato.TelefoneAlternativo,
        // ComoSoube: Candidato.ComoSoube,
        // Curso: Candidato.CursoDesejado,
        // Regime: Candidato.RegimeDedicacao,
        // Cotista: Candidato.Cotista,
        // CotistaTipo: Candidato.CotistaTipo,
        // Condicao: Candidato.Condicao,
        // CondicaoTipo: Candidato.CondicaoTipo,
        // Bolsista: Candidato.Bolsa
      },
      {
        where: {
          id
        }
      }
    ).catch((err) => {
      console.error(err)
      throw new Error('Não foi possivel atualizar o candidato')
    })
    const candidate = await Candidate.findOne({
      where: {
        id
      }
    })
    return candidate
  }

  async postProposta ({ Candidato, id }) {
    await Candidate.update(
      {
        ...Candidato,
        editalPosition: 4
      },
      {
        where: {
          id
        }
      }
    ).catch((err) => {
      console.error(err)
      throw new Error('Não foi possivel atualizar o candidato')
    })
    const candidate = await Candidate.findOne({
      where: {
        id
      }
    })
    return candidate
  }

  async findOne ({ id }) {
    const candidate = await Candidate.findOne({
      where: {
        id
      }
    })
    if (!candidate) {
      throw new Error('Candidato não encontrado')
    }
    return candidate
  }

  async backEdital ({ id }) {
    const candidate = await Candidate.findOne({
      where: {
        id
      }
    })
    await candidate.update({
      editalPosition: candidate.editalPosition - 1
    })
    return candidate
  }

  async listCanditatesByEdital (editalId) {
    const candidates = await Candidate.findAll({
      where: {
        editalId
      },
      attributes: {
        exclude: ['passwordHash']
      }
    }).catch((err) => {
      console.error(`[ERROR] Listar Candidatos: ${err}`)
      throw new Error('Não foi possivel listar o candidato')
    })
    return candidates
  }
}

export default new CandidateService()
