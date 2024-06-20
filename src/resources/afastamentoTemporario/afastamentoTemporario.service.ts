import { PrismaClient, AfastamentoTemporarios } from "@prisma/client"
import { CreateAfastamentoTemporarioDto, ExtendedAfastamentoTemporarios } from "./afastamentoTemporario.types"

const prisma = new PrismaClient()

class AfastamentoService {
  async listarAfastamentosDoUsuario(id: number): Promise<AfastamentoTemporarios[] | null> {
    const allResearchLines = await prisma.afastamentoTemporarios.findMany({
      where: {
        usuarioId: id
      }
    })
    const dataFormatada = allResearchLines.map((afastamento: ExtendedAfastamentoTemporarios) => {
      afastamento.dataCriacaoFormata = new Date(afastamento.createdAt).toLocaleDateString(
        'pt-BR', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric'
        }
      )
      afastamento.dataRetornoFormata = new Date(afastamento.dataRetorno).toLocaleDateString(
        'pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone: 'UTC'
        }
      )
      afastamento.dataSaidaFormata = new Date(afastamento.dataSaida).toLocaleDateString(
        'pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone: 'UTC'
        }
      )

      return afastamento
    })
    return dataFormatada
  }

  async listarTodos () {
    try {
      const allResearchLines = await prisma.afastamentoTemporarios.findMany()
      const dataFormatada = allResearchLines.map((afastamento: any) => {
        afastamento.dataCriacaoFormata = new Date(afastamento.createdAt).toLocaleDateString(
          'pt-BR', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
          }
        )
        afastamento.dataRetornoFormata = new Date(afastamento.dataRetorno).toLocaleDateString(
          'pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'UTC'
          }
        )
        afastamento.dataSaidaFormata = new Date(afastamento.dataSaida).toLocaleDateString(
          'pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'UTC'
          }
        )
        return afastamento
      })
      return dataFormatada
    } catch (error: any) {
      console.log(error.message || 'Não foi possível listar os pedidos de afastamento!')
    }

  }

  async criar (newAfastamento: CreateAfastamentoTemporarioDto) {
    await prisma.afastamentoTemporarios.create({ data: newAfastamento })
  }
  

  async retornarAfastamento (id: number) {
    const afastamento = await prisma.afastamentoTemporarios.findUnique({
      where: {
        id: id
      }
    })
    return afastamento
  }

  async vizualizar (id:number) {
    const afastamento = await prisma.afastamentoTemporarios.findUnique({ where: { id } })
    if (!afastamento) return null
    const dataFormatada = {
      ...afastamento,
      dataCriacaoFormata: new Date(afastamento.createdAt).toLocaleDateString(
        'pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }
      ),
      dataRetornoFormata: new Date(afastamento.dataRetorno).toLocaleDateString(
        'pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone: 'UTC'
        }
      ),
      dataSaidaFormata: new Date(afastamento.dataSaida).toLocaleDateString(
        'pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone: 'UTC'
        }
      )
    }
    return dataFormatada
  }

  async delete (id: number) {
    await prisma.afastamentoTemporarios.delete({ where: { id } })
  }
}

export default new AfastamentoService()
