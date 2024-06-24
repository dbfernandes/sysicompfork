import { PrismaClient, Edital, Candidate } from '@prisma/client'
import { CreateEditalDto, UpdateEditalDto } from './edital.types'
const moment = require('moment-timezone')
/* eslint-disable camelcase */

const prisma = new PrismaClient()

class EditalService {
  async criarEdital(editalDados: CreateEditalDto): Promise<Edital> {
    try {
      const edital = await prisma.edital.findFirst({
        where: {
          editalId: editalDados.editalId
        }
      })

      if (edital) {
        console.log('edital ja existe')
        throw new Error(`Edital de número ${editalDados.editalId} já existe`)
      }

      return await prisma.edital.create({ data: editalDados })
    } catch (error: any) {
      console.error('Erro ao criar edital:', error)
      throw new Error(error)
    }
  }

  async listEdital(): Promise<Edital[]> {
    const editais = await prisma.edital.findMany().catch(err => {
      console.log(`[ERROR] Listar Editais: ${err}`)
      throw new Error('Não foi possivel listar o edital')
    })
    return editais
  }

  async delete(id: string) {
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

  async arquivar(id_edital: string, {
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
        // updatedAt: moment.tz('America/Manaus').format('YYYY-MM-DD HH:mm:ss')
      }
    }).catch(err => {
      console.log(`[ERROR] Atualizar Edital: ${err}`)
      throw new Error('Não foi possivel alterar o status do edital')
    })

    return edital
  }

  async getEdital(id: string): Promise<Edital | null> {
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

  async update(id_update: string, dados: UpdateEditalDto): Promise<Edital> {
    // const edital = await prisma.edital.findFirst({
    //   where: {
    //     editalId: id_update
    //   }
    // }).catch(err => {
    //   console.log(`[ERROR] Buscar Edital: ${err}`)
    //   console.log('{this.id_update}', id_update)
    //   throw new Error('Não foi possivel buscar o edital')
    // })

    // if (!edital) {
    //   throw new Error('Edital não encontrado')
    // }
    // await prisma.edital.update({
    //   where: {
    //     editalId: id_update
    //   },
    //   data: dados
    //   // updatedAt: moment.tz('America/Manaus').format('YYYY-MM-DD HH:mm:ss')
    // }).catch(err => {
    //   console.log(`[ERROR] Atualizar Edital: ${err}`)
    //   throw new Error('Não foi possivel atualizar o edital')
    // })

    // return edital
    try {
      const edital = await prisma.edital.findFirst({
        where: {
          editalId: dados.editalId
        }
      })

      if (!edital) {
        throw new Error('Edital não encontrado')
      }
      return await prisma.edital.update({
        where: { editalId: id_update },
        data: dados
      })
    } catch (error: any) {
      console.error('Erro ao atualizar edital:', error)
      throw new Error(error)
    }
  }

  async getEditalByNumber(number: any): Promise<Edital | null> {
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

  async listCandidates(id: string): Promise<Candidate[]> {
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

  async getCandidate(id: number): Promise<Candidate | null> {
    try {
      return await prisma.candidate.findFirst({
        where: {
          id: id
        }
      })
    } catch (error) {
      console.log(`[ERROR] Buscar Candidato: ${error}`)
      throw new Error('Não foi possivel buscar o candidato')
    }
  }
}

export default new EditalService()
