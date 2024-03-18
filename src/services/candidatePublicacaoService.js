const { CandidatePublications } = require('../models');

class CandidatePublicacaoService {

  async adicionarVarios(
    idCandidate,
    publicacoes,
    tipoPublicacao
  ) {
    if (publicacoes && publicacoes.length > 0) {
      const publicacoesParaInserir = publicacoes.map(publicacao => ({
        idCandidate: idCandidate,
        titulo: publicacao.titulo || '',
        ano: parseInt(publicacao.ano) || '',
        local: publicacao.local || '',
        tipo: tipoPublicacao,
        natureza: publicacao.natureza || '',
        autores: publicacao.autores.nomeCompleto.join(', ').substring(0, 255),
        ISSN: publicacao.ISSN !== undefined ? publicacao.ISSN : '',
      }));
      
      publicacoesParaInserir.forEach(async publicacao => {
        try {
          const existingPublication = await CandidatePublications.findOne({
            where: {
              idCandidate: idCandidate,
              titulo: publicacao.titulo,
              ano: publicacao.ano,
              tipo: tipoPublicacao
            }
          });

          if (existingPublication) {
            await CandidatePublications.update(publicacao, {
              where: {
                id: existingPublication.id
              }
            });
            console.log(`Publicação ${publicacao.titulo} atualizada com sucesso para o candidato ${idCandidate}!`);
          } else {
            await CandidatePublications.create(publicacao);
            console.log(`Publicação ${publicacao.titulo} adicionada com sucesso para o candidato ${idCandidate}!`);
          }
        } catch (error) {
          console.error(`Erro ao adicionar/atualizar publicação ${publicacao.titulo} para o candidato ${idCandidate}: ${error}`);
          throw new Error("Não foi possível criar/atualizar a publicação");
        }
      });


    }
  }

  async ListarPublicacoesCandidate(idCandidate) {
    try {
      const periodicos = await CandidatePublications.findAll({
        where: {
          idCandidate: idCandidate,
          tipo: 1
        }
      });

      const conferencias = await CandidatePublications.findAll({
        where: {
          idCandidate: idCandidate,
          tipo: 2
        }
      });

      const data = {
        periodicos,
        conferencias
      }
      return data;
    } catch (error) {
      console.error(`Erro ao listar publicações do candidato ${idCandidate}: ${error}`);
      throw new Error("Não foi possível listar as publicações");
    }
  }


}

export default new CandidatePublicacaoService();