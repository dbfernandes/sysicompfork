import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

import { Candidato } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import candidatoExperienciaAcademicaService from '../../resources/candidatoExperienciaAcademica/candidato.experiencia.academica.service';
import { gerarPDF } from '../../utils/gerarInscricao';
import candidatoService from '../candidato/candidato.service';
import {
  MudarSenhaDto,
  RecuperarSenhaDto,
  SignInDto,
  SignUpDto,
} from '../candidato/candidato.types';
import candidatoPublicacaoService from '../candidatoPublicacao/candidato.publicacao.service';
import { TYPES_PUBLICACAO } from '../candidatoPublicacao/candidato.publicacao.types';
import candidatoRecomendacaoService from '../candidatoRecomendacao/candidato.recomendacao.service';
import {
  default as EditalService,
  default as editalService,
} from '../edital/edital.service';
import linhasDePesquisaService from '../linhasDePesquisa/linhasDePesquisa.service';
import {
  CARTA_ACEITE_ORIENTADOR_FILE,
  COMPROVANTE_FILE,
  CURRICULUM_FILE,
  Nacionalidade,
  PassoFormCandidato,
  PROPOSTA_FILE,
  PROVA_ANTERIOR_FILE,
} from './selecaoppgi.types';

interface AuthenticatedRequest extends Request {
  candidato?: any; // Substitua `any` pelo tipo correto do candidato
}

type RenderFunction = (
  req: AuthenticatedRequest,
  res: Response,
) => Promise<void>;

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const locals = {
  layout: 'selecaoppgi',
};

const localsBegin = {
  layout: 'begin',
};

function getLanguage(req: Request) {
  return req.cookies['lang'] || 'ptBR';
}

function parseDate(dateString: string) {
  const parts = dateString.split('/');
  // Supondo que a data está no formato DD/MM/YYYY
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Mês em JavaScript é 0-indexed
  const year = parseInt(parts[2], 10);

  return new Date(year, month, day);
}

function downloadFile(req, res) {
  // Define o caminho do arquivo
  const userId = req.session.uid.toString();
  const nomeArquivo = req.params.name;
  const caminhoDoc = path.join(
    'public',
    'uploads',
    'candidato',
    userId,
    nomeArquivo,
  );

  res.download(caminhoDoc, (error) => {
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  });
}

export function verificarArquivoDiretorio(
  diretorio: string,
  nomeArquivo: string,
) {
  const caminhoArquivo = path.join(diretorio, nomeArquivo);

  return fs.existsSync(caminhoArquivo);
}

function inicio(req: Request, res: Response) {
  switch (req.method) {
    case 'GET':
      const currentLanguage = getLanguage(req);

      return res.render(resolveView('inicio'), {
        ...localsBegin,
        currentLanguage,
      });
    default:
      return res.status(405).send();
  }
}

async function signUp(req: Request, res: Response, next: NextFunction) {
  switch (req.method) {
    case 'GET': {
      const listEditais = await EditalService.listEditaisDisponiveis();
      const currentLanguage = getLanguage(req);

      return res.render(resolveView('signUp'), {
        csrfToken: req.csrfToken(),
        editais: listEditais,
        errorSignin: null,
        currentLanguage,
        ...locals,
      });
    }

    case 'POST': {
      const data = req.body as SignUpDto;
      try {
        const novoCandidato = await candidatoService.signUp(data);
        req.session.uid = novoCandidato.id.toString();

        return res.status(201).send();
      } catch (err) {
        next(err);
      }
    }
    default:
      return res.status(404).send();
  }
}

async function signIn(req: Request, res: Response, next: NextFunction) {
  switch (req.method) {
    case 'GET': {
      try {
        const listEditais = await EditalService.listEditaisDisponiveis();
        const currentLanguage = getLanguage(req);

        return res.render(resolveView('signIn'), {
          ...localsBegin,
          csrfToken: req.csrfToken(),
          editais: listEditais,
          currentLanguage,
        });
      } catch (err) {
        next(err);
      }
    }
    case 'POST':
      try {
        const data = req.body as SignInDto;
        const candidato = await candidatoService.signIn(data);

        req.session.uid = candidato.id.toString();
        return res.status(200).send();
      } catch (err) {
        next(err);
      }
    default:
      return res.status(405).send();
  }
}

function logout(req: Request, res: Response) {
  switch (req.method) {
    case 'POST':
      req.session.destroy((err) => {
        console.error(err);
        return res.status(500).send();
      });
      return res.status(200).redirect('/selecaoppgi/entrar');
    default:
      return res.status(404).send();
  }
}

const formProposta = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'PUT': {
      try {
        const { uid } = req.session;
        const { body } = req;
        const hasProposta =
          req.files &&
          !Array.isArray(req.files) &&
          req.files['CartaAceiteOrientador'] !== undefined;
        if (!hasProposta) {
          if (
            fs.existsSync(
              path.join(
                'uploads',
                'candidatos',
                uid,
                'CartaAceiteOrientador.pdf',
              ),
            )
          ) {
            fs.unlinkSync(
              path.join(
                'uploads',
                'candidatos',
                uid.toString(),
                'CartaAceiteOrientador.pdf',
              ),
            );
          }
        }
        if (
          body.recomendacaoNome &&
          body.recomendacaoEmail &&
          body.recomendacaoNome.length === body.recomendacaoEmail.length
        ) {
          const candidato = await candidatoService.findByIdWithEdital(
            Number(uid),
          );
          await candidatoRecomendacaoService.createManyByCandidate(
            body.recomendacaoNome.map((nome, index) => ({
              nome,
              email: body.recomendacaoEmail[index],
            })),
            Number(uid),
            candidato.editalId,
            new Date(candidato.Edital.dataFim),
          );
        }
        const posicaoEdital = body.isNext ? 4 : 3;

        const candidate: Partial<Candidato> = {
          linhaPesquisaId: Number(body.idLinhaPesquisa),
          tituloProposta: body.tituloProposta,
          nomeOrientador: body.nomeOrientador,
          motivos: body.motivos,
          posicaoEdital,
        };
        const id = Number(uid);
        await candidatoService.update({
          id,
          data: candidate,
        });

        if (body.isNext) {
          const url = `http://${req.headers.host}/selecaoppgi/recomendacoes`;
          await gerarPDF(id);
          await candidatoRecomendacaoService.sendEmailForUsersByCandidate({
            id,
            url,
          });
        }

        req.session.editalPosition = posicaoEdital;
        return res.status(200).send();
      } catch (err) {
        console.error(err);
        return res.status(500).send(err);
      }
    }
    default:
      return res.status(405).send();
  }
};

async function voltarInicio(req: Request, res: Response, next: NextFunction) {
  switch (req.method) {
    case 'POST':
      const id = Number(req.session.uid);
      try {
        await candidatoService.voltarInicioEdital({
          id,
        });
        return res.status(200).send();
      } catch (err) {
        next(err);
      }
    default:
      return res.status(405).send();
  }
}

// Mapeamento de posicaoEdital para funções de renderização
const posicaoEditalMap: Record<number, RenderFunction> = {
  [PassoFormCandidato.DADOS_PESSOAIS]: renderFormDados,
  [PassoFormCandidato.HISTORICO]: renderFormHistorico,
  [PassoFormCandidato.PROPOSTA]: renderFormProposta,
  [PassoFormCandidato.FINALIZACAO]: renderFormConfirmacao,
};

async function renderFormDados(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  const currentLanguage = getLanguage(req);
  res.status(200).render(resolveView('formDados'), {
    ...locals,
    ...req.candidato,
    csrfToken: req.csrfToken(),
    currentLanguage,
  });
}

async function renderFormHistorico(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  const uid = req.session.uid;
  const currentLanguage = getLanguage(req);
  const caminhoDiretorioUsuario = path.join(
    'public',
    'uploads',
    'candidato',
    uid.toString(),
  );

  const experienciasAcademicas =
    await candidatoExperienciaAcademicaService.listByCandidateId(Number(uid));
  const { conferencias, periodicos } =
    await candidatoPublicacaoService.ListarPublicacoesCandidate(Number(uid));

  res.render(resolveView('formHistorico'), {
    ...locals,
    ...req.candidato,
    editalPosicao: req.candidato.posicaoEdital,
    id: uid,
    csrfToken: req.csrfToken(),
    hasCurriculum: verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      CURRICULUM_FILE,
    ),
    hasProvaAnterior: verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      PROVA_ANTERIOR_FILE,
    ),
    experienciasAcademicas,
    conferencias,
    periodicos,
    currentLanguage,
  });
}

async function renderFormProposta(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  const uid = req.session.uid;
  const currentLanguage = getLanguage(req);
  const caminhoDiretorioUsuario = path.join(
    'public',
    'uploads',
    'candidato',
    uid.toString(),
  );

  const [linhas, recomendacoes] = await Promise.all([
    linhasDePesquisaService.list(),
    candidatoRecomendacaoService.getRecomendacoesByCandidato(Number(uid)),
  ]);

  res.render(resolveView('formProposta'), {
    ...locals,
    ...req.candidato,
    recomendacoes,
    edital: req.candidato.Edital,
    editalPosicao: req.session.editalPosition,
    id: uid,
    linhasPesquisa: linhas,
    csrfToken: req.csrfToken(),
    hasCartaAceiteOrientador: verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      CARTA_ACEITE_ORIENTADOR_FILE,
    ),
    hasPropostaTrabalho: verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      PROPOSTA_FILE,
    ),
    hasComprovante: verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      COMPROVANTE_FILE,
    ),
    currentLanguage,
  });
}

async function renderFormConfirmacao(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  const uid = req.session.uid;
  const currentLanguage = getLanguage(req);
  const caminhoDiretorioUsuario = path.join(
    'public',
    'uploads',
    'candidato',
    uid.toString(),
  );

  res.render(resolveView('formConfirmacao'), {
    ...locals,
    editalPosicao: req.session.editalPosition,
    id: uid,
    csrfToken: req.csrfToken(),
    hasCartaAceiteOrientador: verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      CARTA_ACEITE_ORIENTADOR_FILE,
    ),
    hasPropostaTrabalho: verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      PROPOSTA_FILE,
    ),
    hasComprovante: verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      COMPROVANTE_FILE,
    ),
    currentLanguage,
  });
}

async function renderForms(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  switch (req.method) {
    case 'GET':
      try {
        const { uid } = req.session;
        if (!uid) {
          res.redirect('/selecaoppgi/entrar');
          return;
        }

        const candidato = await candidatoService.findByIdComEdital(Number(uid));

        if (!candidato) {
          res.redirect('/selecaoppgi/entrar');
          break;
        }
        const renderFunction = posicaoEditalMap[candidato.posicaoEdital];

        if (renderFunction) {
          delete candidato.senhaHash;
          const newReq = {
            ...req,
            candidato,
          } as AuthenticatedRequest;
          await renderFunction(newReq, res);
        } else {
          res
            .status(StatusCodes.BAD_REQUEST)
            .send('Posição do edital inválida.');
        }
      } catch (err) {
        next(err);
      }
      break;
    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).send();
      break;
  }
}

async function formDados(req: Request, res: Response) {
  switch (req.method) {
    case 'PUT': {
      const { data } = req.body;
      const { uid } = req.session;
      const id = Number(uid);

      if (req.session.editalPosition === 1) {
        const isBrasileira = data.nacionalidade === Nacionalidade.BRASILEIRA;

        const dataNascimento = data.dataNascimento
          ? new Date(parseDate(data.dataNascimento))
          : null;
        const candidato = {
          ...data,
          dataNascimento,
          posicaoEdital: 2,
          condicao: data.condicao === 'true',
          bolsista: data.bolsista === 'true',
          cotista: data.cotista === 'true',
          cpf: isBrasileira ? data.cpf : null,
          passaporte: isBrasileira ? null : data.passaporte,
          pais: isBrasileira ? null : data.pais,
        };

        await candidatoService.update({
          id,
          data: candidato,
        });

        req.session.editalPosition = 2;

        return res.status(200).send();
      }

      return res.status(400).send();
    }
    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).send();
  }
}

const form2 = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'PUT': {
      try {
        const { uid } = req.session;
        const experienciaInstituicao = req.body
          .experienciaInstituicao as string[];
        const experienciasAtividade = req.body.experienciaAtividade as string[];
        const experienciasPeriodo = req.body.experienciaPeriodo as string[];

        await candidatoExperienciaAcademicaService.dropAllByCandidateId(
          Number(uid),
        );
        if (
          experienciaInstituicao &&
          experienciasAtividade &&
          experienciasPeriodo &&
          experienciaInstituicao.length > 0
        ) {
          await Promise.all(
            experienciaInstituicao.map((_, index) => {
              if (
                experienciaInstituicao[index] === '' ||
                experienciasAtividade[index] === '' ||
                experienciasPeriodo[index] === ''
              ) {
                return;
              }
              return candidatoExperienciaAcademicaService.create({
                data: {
                  instituicao: experienciaInstituicao[index],
                  atividade: experienciasAtividade[index],
                  periodo: experienciasPeriodo[index],
                },
                candidatoId: Number(uid),
              });
            }),
          );
        }
        const { body } = req;
        const candidato = {
          cursoGraduacao: body.cursoGraduacao,
          instituicaoGraduacao: body.instituicaoGraduacao,
          anoEgressoGraduacao: body.anoEgressoGraduacao,
          cursoPos: body.cursoPos,
          instituicaoPos: body.instituicaoPos,
          anoEgressoPos: body.anoEgressoPos,
          posicaoEdital: 3,
        };
        const id = Number(uid);
        await candidatoService.update({
          id,
          data: candidato,
        });

        req.session.editalPosition = 3;
        return res.status(200).send();
      } catch (err) {
        console.error(err);
        return res.status(500).send();
      }
    }
    default: {
      return res.status(405).send();
    }
  }
};

const formPublicacoes = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET': {
      const data = await candidatoPublicacaoService.ListarPublicacoesCandidate(
        Number(req.session.uid),
      );

      const { periodicos, conferencias } = data;

      return res.render(resolveView('formHistorico'), {
        message: 'Dados salvos com sucesso',
        editalPosicao: req.session.editalPosition,
        id: req.session.uid,
        csrfToken: req.csrfToken(),
        periodicos,
        conferencias,
      });
    }

    case 'POST':
      try {
        const dados = req.body;
        const periodicos = dados.publicacoes['ARTIGO-PUBLICADO'];
        const eventos = dados.publicacoes['TRABALHO-EM-EVENTOS'];
        const livros = dados.publicacoes['LIVRO-PUBLICADO-OU-ORGANIZADO'];
        const capitulos = dados.publicacoes['CAPITULO-DE-LIVRO-PUBLICADO'];
        const outras = dados.publicacoes['OUTRA-PRODUCAO-BIBLIOGRAFICA'];
        const prefacios = dados.publicacoes['PREFACIO-POSFACIO'];

        const promises = [];

        promises.push(
          candidatoPublicacaoService.adicionarVarios(
            Number(req.session.uid),
            periodicos,
            TYPES_PUBLICACAO.PERIODICOS,
          ),
        );
        promises.push(
          candidatoPublicacaoService.adicionarVarios(
            Number(req.session.uid),
            eventos,
            TYPES_PUBLICACAO.EVENTOS,
          ),
        );
        promises.push(
          candidatoPublicacaoService.adicionarVarios(
            Number(req.session.uid),
            livros,
            TYPES_PUBLICACAO.LIVROS,
          ),
        );
        promises.push(
          candidatoPublicacaoService.adicionarVarios(
            Number(req.session.uid),
            capitulos,
            TYPES_PUBLICACAO.CAPITULOS,
          ),
        );
        promises.push(
          candidatoPublicacaoService.adicionarVarios(
            Number(req.session.uid),
            outras,
            TYPES_PUBLICACAO.OUTRAS,
          ),
        );
        promises.push(
          candidatoPublicacaoService.adicionarVarios(
            Number(req.session.uid),
            prefacios,
            TYPES_PUBLICACAO.PREFACIOS,
          ),
        );

        const results = await Promise.allSettled(promises);

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            console.log(`Operação ${index + 1} concluída com sucesso.`);
            console.log('Resultado:', result.value);
          } else {
            console.error(`Operação ${index + 1} falhou.`);
            console.error('Erro:', result.reason);
          }
        });

        res.status(200).send('Dados salvos com sucesso.');
      } catch {}

    // res.status(400).send(data);
  }
};

const candidates = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      return res.json({
        candidates: await candidatoService.list(),
      });
    default:
      return res.status(400).send();
  }
};

const backStep = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'POST': {
      try {
        const id = Number(req.session.uid);
        const editalPosicao =
          parseInt(req.session.editalPosition?.toString() ?? '1', 10) - 1;
        await candidatoService.backEdital({
          id,
        });
        req.session.editalPosition = editalPosicao;
        return res.status(200).send();
      } catch (err) {
        console.error(err);
        return res.status(500).send();
      }
    }
    default:
      return res.status(405).send();
  }
};

const refresh = async (req: Request, res: Response) => {
  res.redirect('/selecaoppgi/formulario');
};

const recuperarSenha = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  switch (req.method) {
    case 'GET': {
      const currentLanguage = getLanguage(req);
      const listEditais = await EditalService.listEditaisDisponiveis();
      return res.render(resolveView('recuperarSenha'), {
        editais: listEditais,
        csrfToken: req.csrfToken(),
        currentLanguage,
        ...localsBegin,
      });
    }
    case 'POST': {
      const data = req.body as RecuperarSenhaDto;
      try {
        await candidatoService.recuperarSenha({
          host: req.headers.host,
          ...data,
        });

        return res.status(200).send();
      } catch (err) {
        console.error(err);
        next(err);
      }
    }
    default:
      return res.status(405).send();
  }
};

const trocarSenha = async (req, res: Response) => {
  switch (req.method) {
    case 'GET': {
      const candidate = await candidatoService.findByTokenPassword(
        req.query.token as string,
      );
      const currentLanguage = getLanguage(req);

      if (!candidate) {
        return res.render(resolveView('trocarSenha'), {
          error: 'Token inválido',
          csrfToken: req.csrfToken(),
          currentLanguage,
          ...localsBegin,
        });
      }
      if (new Date(candidate.validadeTokenReset) < new Date()) {
        return res.render(resolveView('trocarSenha'), {
          error: 'Token expirado',
          csrfToken: req.csrfToken(),
          currentLanguage,
          ...localsBegin,
        });
      }
      return res.render(resolveView('trocarSenha'), {
        csrfToken: req.csrfToken(),
        token: req.query.token,
        currentLanguage,
        ...localsBegin,
      });
    }
    case 'PUT': {
      const { senha, token } = req.body as MudarSenhaDto;

      try {
        await candidatoService.changePasswordWithToken({
          token,
          senha,
        });
        return res.status(200).send();
      } catch (err) {
        console.error(err);
        if (err instanceof Error) {
          return res.status(400).send({ message: err.message });
        }
        return res.status(500).send();
      }
    }
    default:
      return res.status(405).send();
  }
};

export default {
  inicio,
  signUp,
  signIn,
  renderForms,
  formDados,
  form2,
  candidates,
  backStep,
  refresh,
  formPublicacoes,
  logout,
  formProposta,
  voltarInicio,
  recuperarSenha,
  trocarSenha,
  downloadFile,
};
