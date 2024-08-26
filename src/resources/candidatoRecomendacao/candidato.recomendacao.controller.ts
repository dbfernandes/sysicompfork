import path from 'path';
import { Request, Response } from 'express';

import candidatoRecomendacaoService from './candidato.recomendacao.service';
import { SaveRecomendacaoDto } from './candidato.recomendacao.types';
const locals = {
  layout: 'selecaoppgi',
};
function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

export async function adicionar(req: Request, res: Response) {
  switch (req.method) {
    case 'POST':
      candidatoRecomendacaoService.create(req.body).then((aluno) => {
        res.json(aluno);
      });
      break;
    case 'GET':
      const { token } = req.query;
      try {
        const recomendacao =
          await candidatoRecomendacaoService.getRecomendacaoByToken(
            token.toString(),
          );
        const notFoundRecomendacao = !Boolean(recomendacao);
        if (notFoundRecomendacao) {
          return res.render(resolveView('invalidToken'), {
            ...locals,
          });
        }
        const csrfToken = req.csrfToken();
        const graduacaoCandidato = `${recomendacao.Candidato.cursoGraduacao} - ${recomendacao.Candidato.instituicaoGraduacao}`;
        return res.render(resolveView('adicionar'), {
          ...locals,
          candidato: {
            nome: recomendacao.Candidato.nome,
            graduado: graduacaoCandidato,
          },
          recomendacao,
          csrfToken,
          token,
        });
      } catch (error) {
        return res.render(resolveView('adicionar'), {
          ...locals,
        });
      }
  }
}

async function salvar(req: Request, res: Response) {
  switch (req.method) {
    case 'PUT':
      try {
        const { token } = req.params;
        console.log(req.body);
        console.log(token);
        const {
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
        } = req.body;
        const data = {} as SaveRecomendacaoDto;
        data['anoContato'] = anoContato.length ? Number(anoContato) : null;
        data['anoTitulacao'] = anoTitulacao.length
          ? Number(anoTitulacao)
          : null;
        data['aprendizado'] = aprendizado.length ? Number(aprendizado) : 0;
        data['assiduidade'] = assiduidade.length ? Number(assiduidade) : 0;
        data['cargo'] = cargo;
        data['dominio'] = dominio.length ? Number(dominio) : 0;
        data['expressao'] = expressao.length ? Number(expressao) : 0;
        data['informacoes'] = informacoes;
        data['iniciativa'] = iniciativa.length ? Number(iniciativa) : 0;
        data['instituicaoAtual'] = instituicaoAtual;
        data['instituicaoTitulacao'] = instituicaoTitulacao;
        data['nome'] = nome;
        data['relacionamento'] = relacionamento.length
          ? Number(relacionamento)
          : 0;
        data['titulacao'] = titulacao;

        candidatoRecomendacaoService.save(data, token);
        return res.status(200).send('OK');
      } catch (error) {
        return res.status(500).send('Internal Server Error');
      }
    default:
      return res.status(405).send('Method Not Allowed');
  }
}
export default { adicionar, salvar };
