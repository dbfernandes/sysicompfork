import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

class CandidatePublicacaoService {
  async adicionarVarios (
    idCandidate: number,
    publicacoes: any,
    tipoPublicacao: number
  ) {
    if (publicacoes && publicacoes.length > 0) {
      const publicacoesParaInserir = publicacoes.map((publicacao:any) => ({
        idCandidate,
        titulo: publicacao.titulo || '',
        ano: parseInt(publicacao.ano) || '',
        local: publicacao.local || '',
        tipo: tipoPublicacao,
        natureza: publicacao.natureza || '',
        autores: publicacao.autores.nomeCompleto.join(', ').substring(0, 255),
        ISSN: publicacao.ISSN !== undefined ? publicacao.ISSN : ''
      }))

      publicacoesParaInserir.forEach(async (publicacao:any) => {
        try {
          const existingPublication = await prisma.candidatePublications.findFirst({
            where: {
              idCandidate,
              titulo: publicacao.titulo,
              ano: publicacao.ano,
              tipo: tipoPublicacao
            }
          })

          if (existingPublication) {
            // await CandidatePublications.update(publicacao, {
            //   where: {
            //     id: existingPublication.id
            //   }
            // })
            await prisma.candidatePublications.update({
              where: {
                id_idCandidate: {
                  id: Number(existingPublication.id),
                  idCandidate
                }
              },
              data: publicacao
            })
            console.log(`Publicação ${publicacao.titulo} atualizada com sucesso para o candidato ${idCandidate}!`)
          } else {
            // await CandidatePublications.create(publicacao)
            await prisma.candidatePublications.create({
              data: publicacao
            })
            console.log(`Publicação ${publicacao.titulo} adicionada com sucesso para o candidato ${idCandidate}!`)
          }
        } catch (error) {
          console.error(`Erro ao adicionar/atualizar publicação ${publicacao.titulo} para o candidato ${idCandidate}: ${error}`)
          throw new Error('Não foi possível criar/atualizar a publicação')
        }
      })
    }
  }

  async ListarPublicacoesCandidate (idCandidate: number) {
    try {
      // const periodicos = await CandidatePublications.findAll({
      //   where: {
      //     idCandidate,
      //     tipo: 1
      //   }
      // })
      const periodicos = await prisma.candidatePublications.findMany({
        where: {
          idCandidate,
          tipo: 1
        }
      })

      // const conferencias = await CandidatePublications.findAll({
      //   where: {
      //     idCandidate,
      //     tipo: 2
      //   }
      // })
      const conferencias = await prisma.candidatePublications.findMany({
        where: {
          idCandidate,
          tipo: 2
        }
      })

      const data = {
        periodicos,
        conferencias
      }
      return data
    } catch (error) {
      console.error(`Erro ao listar publicações do candidato ${idCandidate}: ${error}`)
      throw new Error('Não foi possível listar as publicações')
    }
  }
}

export default new CandidatePublicacaoService()
