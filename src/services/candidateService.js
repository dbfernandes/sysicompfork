import { genSalt, hash } from 'bcrypt'
const moment = require('moment')
const { Candidate } = require('../models')

class CandidateService {
  async create ({
    email,
    password,
    editalNumber
  }) {
    const step = 0
    const salt = await genSalt(10)
    const passwordHash = await hash(password, salt)

    let candidate = await Candidate.findOne({
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

    candidate = await Candidate.create({
      email,
      password,
      passwordHash,
      editalId: editalNumber,
      editalPosition: 1,
      currentStep: step,
      status: 'created'
    }).catch(err => {
      console.log(`[ERROR] Criar de candidato: ${err}`)
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
    }).catch(err => {
      console.log(`[ERROR] Listar Candidatos: ${err}`)
      throw new Error('Não foi possivel listar o candidato')
    })
    return candidates
  }

  async auth ({
    email,
    password,
    editalNumber
  }) {
    const candidate = await Candidate.findOne({
      where: {
        email,
        editalId: editalNumber
      }
    })

    if (!candidate) {
      throw new Error('Usuário não encontrado')
    }

    if (!(await candidate.validPassword(password))) {
      throw new Error('Usuário ou senha incorretos')
    }

    return candidate
  }

  async form1 ({
    Candidato,
    id
  }) {
    const dataNascimentoFormatada = moment(Candidato.Nascimento, 'DD/MM/YYYY').format('YYYY-MM-DD')
    console.log(dataNascimentoFormatada)
    Candidato.Nascimento = dataNascimentoFormatada
    const candidateAtualizacao = await Candidate.update({
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
    }, {
      where: {
        id
      }
    }).catch(err => {
      console.log(err)
      throw new Error('Não foi possivel atualizar o candidato')
    })
    const candidate = await Candidate.findOne({
      where: {
        id
      }
    }).catch(err => {
      console.log(err)
      throw new Error('Não foi possivel encontrar o candidato')
    })
    return candidate
  }

  async findOne ({
    id
  }) {
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

  async back ({
    id,
    editalPosition
  }) {
    const candidate = await Candidate.findOne({
      where: {
        id
      }
    }).catch(err => {
      console.log(err)
      throw new Error('Não foi possivel encontrar o candidato')
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
    }).catch(err => {
      console.log(`[ERROR] Listar Candidatos: ${err}`)
      throw new Error('Não foi possivel listar o candidato')
    })
    return candidates
  }
}

export default new CandidateService()
