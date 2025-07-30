import path from 'path';
import { Request, Response } from 'express';
import candidatoRecomendacaoService from './candidato.recomendacao.service';
import {
  RecomendacaoStatus,
  SaveRecomendacaoDto,
} from './candidato.recomendacao.types';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

const locals = {
  layout: 'selecaoppgi',
};

function getLanguage(req: Request): string {
  return req.cookies['lang'] || 'ptBR';
}

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

async function begin(req: Request, res: Response) {
  const { token } = req.query;
  const currentLanguage = getLanguage(req);

  try {
    const recomendacao =
      await candidatoRecomendacaoService.getRecomendacaoByToken(
        token.toString(),
      );
    const notFoundRecomendacao = !Boolean(recomendacao);
    if (notFoundRecomendacao) {
      return res.render(resolveView('tokenInvalido'), {
        ...locals,
        currentLanguage,
      });
    }
    switch (recomendacao.passo) {
      case RecomendacaoStatus.PENDENTE: {
        const graduacaoCandidato = `${recomendacao.candidato.cursoGraduacao} - ${recomendacao.candidato.instituicaoGraduacao}`;
        return res.render(resolveView('adicionar'), {
          ...locals,
          candidato: {
            nome: recomendacao.candidato.nome,
            graduado: graduacaoCandidato,
          },
          recomendacao,
          token,
          currentLanguage,
        });
      }
      case RecomendacaoStatus.PREENCHIDA: {
        if (typeof token === 'string') {
          await candidatoRecomendacaoService.finish(token);
        }
        return res.render(resolveView('mensagemPreenchida'), {
          ...locals,
          token,
          currentLanguage,
        });
      }
      case RecomendacaoStatus.FINALIZADA: {
        return res.render(resolveView('mensagemFinalizada'), {
          ...locals,
          currentLanguage,
        });
      }
    }
  } catch (error) {
    return res.render(resolveView('adicionar'), {
      ...locals,
      currentLanguage,
    });
  }
}

function parseDataToSave(data: {
  places: string[] | string;
  relationships: string[] | string;
  anoContato: string;
  anoTitulacao: string;
  aprendizado: string;
  assiduidade: string;
  cargo: string;
  dominio: string;
  expressao: string;
  informacoes: string;
  iniciativa: string;
  instituicaoAtual: string;
  instituicaoTitulacao: string;
  nome: string;
  relacionamento: string;
  titulacao: string;
  outrasFuncoes: string;
  outrosLugares: string;
  classificacao: string;
}): SaveRecomendacaoDto {
  const anoContato = data.anoContato.length ? Number(data.anoContato) : null;
  const anoTitulacao = data.anoTitulacao.length
    ? Number(data.anoTitulacao)
    : null;
  const aprendizado = data.aprendizado.length ? Number(data.aprendizado) : 0;
  const assiduidade = data.assiduidade.length ? Number(data.assiduidade) : 0;
  const dominio = data.dominio.length ? Number(data.dominio) : 0;
  const expressao = data.expressao.length ? Number(data.expressao) : 0;
  const iniciativa = data.iniciativa.length ? Number(data.iniciativa) : 0;
  const relacionamento = data.relacionamento.length
    ? Number(data.relacionamento)
    : 0;
  const cargo = data.cargo;
  const informacoes = data.informacoes;
  const instituicaoAtual = data.instituicaoAtual;
  const instituicaoTitulacao = data.instituicaoTitulacao;
  const nome = data.nome;
  const titulacao = data.titulacao;

  const places = {
    conheceEmpresa: 0,
    conheceGraduacao: 0,
    conhecePos: 0,
    conheceOutros: 0,
  };
  const relationships = {
    orientador: 0,
    professor: 0,
    empregador: 0,
    coordenador: 0,
    colegaTrabalho: 0,
    colegaCurso: 0,
    outrosContatos: 0,
  };
  const classificacao = data.classificacao.length
    ? Number(data.classificacao)
    : null;
  if (typeof data.places === 'string') {
    places[data.places] = 1;
  } else if (Array.isArray(data.places)) {
    data.places.forEach((place) => {
      places[place] = 1;
    });
  }
  if (typeof data.relationships === 'string') {
    relationships[data.relationships] = 1;
  } else if (Array.isArray(data.relationships)) {
    data.relationships.forEach((relationship) => {
      relationships[relationship] = 1;
    });
  }

  const outrasFuncoes =
    relationships.outrosContatos === 1 ? data.outrasFuncoes : null;

  const outrosLugares = places.conheceOutros === 1 ? data.outrosLugares : null;

  return {
    anoContato,
    anoTitulacao,
    aprendizado,
    assiduidade,
    cargo,
    dominio,
    expressao,
    informacoes,
    iniciativa,
    instituicaoAtual,
    instituicaoTitulacao,
    nome,
    relacionamento,
    titulacao,
    ...places,
    ...relationships,
    outrasFuncoes,
    outrosLugares,
    classificacao,
  };
}

async function salvar(req: Request, res: Response) {
  switch (req.method) {
    case 'PATCH':
      try {
        const { token } = req.params;
        const dataBody = req.body;

        const data = parseDataToSave(dataBody);

        await candidatoRecomendacaoService.save(data, token);
        return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
      } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
      }
    default:
      return res.status(405).send('Method Not Allowed');
  }
}

async function finalizar(req: Request, res: Response) {
  switch (req.method) {
    case 'PUT':
      try {
        const { token } = req.params;
        const dataBody = req.body;

        const data = parseDataToSave(dataBody);

        await candidatoRecomendacaoService.save(data, token);
        await candidatoRecomendacaoService.finishForm(token);
        return res.status(200).send('OK');
      } catch (error) {
        return res.status(500).send('Internal Server Error');
      }
    default:
      return res.status(405).send('Method Not Allowed');
  }
}
export default { begin, salvar, finalizar };
