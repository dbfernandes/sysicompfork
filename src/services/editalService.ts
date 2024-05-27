import { PrismaClient } from '@prisma/client'
const moment = require('moment-timezone')
/* eslint-disable camelcase */

const prisma = new PrismaClient()

class EditalService {
  async criarEdital (
    num_edital: any,
    documento: any ,
    data_inicio: Date,
    data_fim: Date,
    carta_recomendacao: any,
    carta_orientador: any,
    vaga_regular_mestrado:number | undefined,
    vaga_regular_doutorado: number | undefined,
    vaga_suplementar_mestrado: number | undefined,
    vaga_suplementar_doutorado: number | undefined
  ) {
    const edital = await prisma.edital.findFirst({
      where: {
        editalId: num_edital
      }
    })

    if (edital) {
      console.log('edital ja existe')
      throw new Error(`Edital de número ${num_edital} já existe`)
    }

    try {
      const novo_edital = await prisma.edital.create({
        data: {
          editalId: num_edital,
          vagaDoutorado: Number(vaga_regular_doutorado),
          vagaMestrado: Number(vaga_regular_mestrado),
          cotasDoutorado: Number(vaga_suplementar_doutorado),
          cotasMestrado: Number(vaga_suplementar_mestrado),
          cartaOrientador: carta_orientador,
          cartaRecomendacao: carta_recomendacao,
          documento,
          dataInicio: new Date(data_inicio),
          dataFim: new Date(data_fim),
          status: '1',
          inscricoesIniciadas: 0,
          inscricoesEncerradas: 0,
          // createdAt: moment.tz('America/Manaus').format('YYYY-MM-DD HH:mm:ss'),
          // updatedAt: moment.tz('America/Manaus').format('YYYY-MM-DD HH:mm:ss')
        }
      })

      return novo_edital
    } catch (error) {
      console.log(`[ERROR] Criar Edital: ${error}`)
      throw new Error('Não foi possível criar o Edital')
    }
  }

  async listEdital () {
    const editais = await prisma.edital.findMany().catch(err => {
      console.log(`[ERROR] Listar Editais: ${err}`)
      throw new Error('Não foi possivel listar o edital')
    })
    return editais
  }

  async delete (id: string) {
    try {
      const edital = await prisma.edital.findFirst({
        where: {
          editalId: id
        }
      })

      if (!edital) {
        console.log('Edital não existe')
        throw new Error(`Não existe edital de número ${id}`)
      }

      const updatedEdital = await prisma.edital.update({
        where: { editalId: id },
        data: { status: '0' },
      });

      return updatedEdital
    } catch (error: any) {
      console.error('Erro ao arquivar edital:', error)
      throw new Error(error)
    }
  }

  async arquivar (id_edital: string, {
    status
  }: { status: any }) {
    const edital = await prisma.edital.findFirst({
      where: {
        editalId: id_edital
      }
    }).catch(err => {
      console.log(`[ERROR] Buscar Edital: ${err}`)
      console.log('{this.id_update}', id_edital)
      throw new Error('Não foi possivel buscar o edital')
    })

    if (!edital) {
      throw new Error('Edital não encontrado')
    }

    await prisma.edital.update({
      where: {
        editalId: id_edital
      },
      data: {
        status,
        updatedAt: moment.tz('America/Manaus').format('YYYY-MM-DD HH:mm:ss')
      }
    }).catch(err => {
      console.log(`[ERROR] Atualizar Edital: ${err}`)
      throw new Error('Não foi possivel alterar o status do edital')
    })

    return edital
  }

  async getEdital (id: string) {
    console.log('id', id)
    const edital = await prisma.edital.findFirst({
      where: {
        editalId: id
      }
    }).catch(err => {
      console.log(`[ERROR] Buscar Edital: ${err}`)
      throw new Error('Não foi possivel buscar o edital')
    })

    return edital
  }

  async update (id_update: string, {
    num_edital,
    documento,
    data_inicio,
    data_fim,
    carta_recomendacao,
    carta_orientador,
    vaga_regular_mestrado,
    vaga_regular_doutorado,
    vaga_suplementar_mestrado,
    vaga_suplementar_doutorado
  }: { num_edital: any; documento: any; data_inicio: any; data_fim: any; carta_recomendacao: any; carta_orientador: any; vaga_regular_mestrado: any; vaga_suplementar_mestrado: any; vaga_regular_doutorado: any; vaga_suplementar_doutorado: any }) {
    const edital = await prisma.edital.findFirst({
      where: {
        editalId: id_update
      }
    }).catch(err => {
      console.log(`[ERROR] Buscar Edital: ${err}`)
      console.log('{this.id_update}', id_update)
      throw new Error('Não foi possivel buscar o edital')
    })

    if (!edital) {
      throw new Error('Edital não encontrado')
    }
    await prisma.edital.update({
      where: {
        editalId: id_update
      },
      data: {
        editalId: num_edital,
        vagaDoutorado: vaga_regular_doutorado,
        vagaMestrado: vaga_regular_mestrado,
        cotasDoutorado: vaga_suplementar_doutorado,
        cotasMestrado: vaga_suplementar_mestrado,
        cartaOrientador: carta_orientador,
        cartaRecomendacao: carta_recomendacao,
        documento,
        dataInicio: data_inicio,
        dataFim: data_fim,
        updatedAt: moment.tz('America/Manaus').format('YYYY-MM-DD HH:mm:ss')
      }
    }).catch(err => {
      console.log(`[ERROR] Atualizar Edital: ${err}`)
      throw new Error('Não foi possivel atualizar o edital')
    })

    return edital
  }

  async getEditalByNumber (number: any) {
    const edital = await prisma.edital.findFirst({
      where: {
        editalId: number
      }
    }).catch(err => {
      console.log(`[ERROR] Buscar Edital: ${err}`)
      throw new Error('Não foi possivel buscar o edital')
    })

    return edital
  }

  async listCandidates (id: string) {
    const candidates = await prisma.candidate.findMany({
      where: {
        editalId: id
      }
    }
    ).catch(err => {
      console.log(`[ERROR] Listar Candidatos: ${err}`)
      throw new Error('Não foi possivel listar os candidatos')
    })

    return candidates
  }

  async getCandidate (id: string) {
    try {
      const candidate = await prisma.candidate.findFirst({
        where: {
          id: Number(id)
        }
      })
      return candidate
    } catch (error) {
      console.log(`[ERROR] Buscar Candidato: ${error}`)
      throw new Error('Não foi possivel buscar o candidato')
    }
  }
}

export default new EditalService()
