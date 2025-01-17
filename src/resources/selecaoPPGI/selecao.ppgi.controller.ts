import fs from 'fs';
import path from 'path';
import { NextFunction, Request, Response } from 'express';

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
import candidatoRecomendacaoService from '../candidatoRecomendacao/candidato.recomendacao.service';
import editalService from '../edital/edital.service';
import {
  CARTA_ACEITE_ORIENTADOR_FILE,
  COMPROVANTE_FILE,
  CURRICULUM_FILE,
  Nacionalidade,
  PassoFormCandidato,
  PROPOSTA_FILE,
  PROVA_ANTERIOR_FILE,
} from './selecao.ppgi.types';
import linhaDePesquisaService from '../linhasDePesquisa/linha.de.pesquisa.service';

interface AuthenticatedRequest extends Request {
  candidato?: Candidato; // Substitua `any` pelo tipo correto do candidato
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

export function verificarArquivoDiretorio(
  diretorio: string,
  nomeArquivo: string,
) {
  const caminhoArquivo = path.join(diretorio, nomeArquivo);

  return fs.existsSync(caminhoArquivo);
}

function inicio(req: Request, res: Response): void {
  switch (req.method) {
    case 'GET':
      const currentLanguage = getLanguage(req);

      res.render(resolveView('inicio'), {
        ...localsBegin,
        currentLanguage,
      });
      break;
    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).send();
      break;
  }
}

async function signUp(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  switch (req.method) {
    case 'GET': {
      const listEditais = await editalService.listEditaisDisponiveis();
      const currentLanguage = getLanguage(req);

      res.render(resolveView('signUp'), {
        csrfToken: req.csrfToken(),
        editais: listEditais,
        errorSignin: null,
        currentLanguage,
        ...locals,
      });
      break;
    }

    case 'POST': {
      const data = req.body as SignUpDto;
      try {
        const novoCandidato = await candidatoService.signUp(data);
        req.session.uid = novoCandidato.id.toString();

        res.status(StatusCodes.CREATED).send();
      } catch (err) {
        next(err);
      }
      break;
    }
    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).send();
      break;
  }
}

async function signIn(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  switch (req.method) {
    case 'GET': {
      try {
        const listEditais = await editalService.listEditaisDisponiveis();
        const currentLanguage = getLanguage(req);
        const email = (req.query.email as string) || '';

        res.render(resolveView('signIn'), {
          ...localsBegin,
          csrfToken: req.csrfToken(),
          editais: listEditais,
          currentLanguage,
          email,
        });
      } catch (err) {
        console.error(err);
        next(err);
      }
      break;
    }
    case 'POST':
      try {
        const data = req.body as SignInDto;
        const candidato = await candidatoService.signIn(data);

        req.session.uid = candidato.id.toString();
        res.status(StatusCodes.OK).send();
      } catch (err) {
        next(err);
      }
      break;
    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).send();
      break;
  }
}

function logout(req: Request, res: Response): void {
  switch (req.method) {
    case 'POST':
      req.session.destroy((err) => {
        if (err) {
          console.error('Error ao fazer logout', err);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Erro ao sair');
          return;
        }
      });
      res.redirect('/selecaoppgi/entrar');
      break;
    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).send();
      break;
  }
}

async function voltarInicio(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  switch (req.method) {
    case 'POST':
      const id = Number(req.session.uid);
      try {
        await candidatoService.voltarInicioEdital({
          id,
        });
        res.status(StatusCodes.OK).send();
      } catch (err) {
        next(err);
      }
      break;
    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).send();
      break;
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
    await candidatoPublicacaoService.publicacoesCandidato(Number(uid));

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

  const [linhas, recomendacoes, edital] = await Promise.all([
    linhaDePesquisaService.list(),
    candidatoRecomendacaoService.getRecomendacoesByCandidato(Number(uid)),
    editalService.getById(req.candidato.editalId),
  ]);

  res.render(resolveView('formProposta'), {
    ...locals,
    ...req.candidato,
    recomendacoes,
    edital,
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
          break;
        }

        const candidato = await candidatoService.findById(Number(uid));

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

async function formDados(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  switch (req.method) {
    case 'PUT':
      try {
        const { data } = req.body;
        const { uid } = req.session;
        const id = Number(uid);

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

        res.status(StatusCodes.OK).send();
      } catch (err) {
        next(err);
      }
      break;
    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).send();
      break;
  }
}

async function formHistorico(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
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
          anoEgressoGraduacao: body.anoEgressoGraduacao
            ? Number(body.anoEgressoGraduacao)
            : null,
          cursoPos: body.cursoPos,
          instituicaoPos: body.instituicaoPos,
          anoEgressoPos: body.anoEgressoPos ? Number(body.anoEgressoPos) : null,
          posicaoEdital: 3,
        };
        const id = Number(uid);
        await candidatoService.update({
          id,
          data: candidato,
        });

        res.status(StatusCodes.OK).send();
      } catch (err) {
        next(err);
      }
      break;
    }
    default: {
      res.status(StatusCodes.METHOD_NOT_ALLOWED).send();
      break;
    }
  }
}

async function formProposta(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
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
          const candidato = await candidatoService.findByIdComEdital(
            Number(uid),
          );

          await candidatoRecomendacaoService.createManyByCandidate(
            body.recomendacaoNome.map((nome, index) => ({
              nome,
              email: body.recomendacaoEmail[index],
            })),
            Number(uid),
            candidato.editalId,
            new Date(candidato.edital.dataFim),
          );
        }
        const posicaoEdital = body.isNext ? 4 : 3;

        const candidato: Partial<Candidato> = {
          linhaPesquisaId: Number(body.idLinhaPesquisa),
          tituloProposta: body.tituloProposta,
          nomeOrientador: body.nomeOrientador,
          motivos: body.motivos,
          posicaoEdital,
        };
        const id = Number(uid);
        await candidatoService.update({
          id,
          data: candidato,
        });

        if (body.isNext) {
          const url = `http://${req.headers.host}/selecaoppgi/recomendacoes`;
          await gerarPDF(id);
          await candidatoRecomendacaoService.sendEmailForUsersByCandidate({
            id,
            url,
          });
        }

        res.status(StatusCodes.OK).send();
      } catch (err) {
        next(err);
      }
      break;
    }
    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).send();
      break;
  }
}

async function uploadsPublicacoes(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  switch (req.method) {
    case 'GET': {
      const data = await candidatoPublicacaoService.publicacoesCandidato(
        Number(req.session.uid),
      );

      const { periodicos, conferencias } = data;

      return res.render(resolveView('formHistorico'), {
        message: 'Dados salvos com sucesso',
        id: req.session.uid,
        csrfToken: req.csrfToken(),
        periodicos,
        conferencias,
      });
    }

    case 'POST':
      try {
        const uid = req.session.uid;
        const dados = req.body;

        await candidatoPublicacaoService.processarPublicacoes({
          publicacoes: dados,
          uid: Number(uid),
        });

        res.status(StatusCodes.OK).send('Dados salvos com sucesso.');
      } catch (err) {
        next(err);
      }
      break;
    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).send();
      break;
  }
}

async function voltarPassoForm(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  switch (req.method) {
    case 'POST': {
      try {
        const id = Number(req.session.uid);
        await candidatoService.voltarPassoEdital({
          id,
        });
        res.status(200).send();
      } catch (err) {
        next(err);
      }
      break;
    }
    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).send();
      break;
  }
}

async function recuperarSenha(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  switch (req.method) {
    case 'GET': {
      const currentLanguage = getLanguage(req);
      const listEditais = await editalService.listEditaisDisponiveis();
      res.render(resolveView('recuperarSenha'), {
        editais: listEditais,
        csrfToken: req.csrfToken(),
        currentLanguage,
        ...localsBegin,
      });
      break;
    }
    case 'POST': {
      const data = req.body as RecuperarSenhaDto;
      try {
        await candidatoService.recuperarSenha({
          host: req.headers.host,
          ...data,
        });
        res.status(StatusCodes.OK).send();
      } catch (err) {
        next(err);
      }
      break;
    }
    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).send();
      break;
  }
}

async function trocarSenha(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  switch (req.method) {
    case 'GET': {
      const ehTokenValido = await candidatoService.validarTokenTrocarSenha(
        req.query.token as string,
      );
      const currentLanguage = getLanguage(req);

      const error = !ehTokenValido ? 'Token inválido' : null;
      const token = !error ? req.query.token : null;

      res.render(resolveView('trocarSenha'), {
        error,
        currentLanguage,
        token,
        csrfToken: req.csrfToken(),
        ...localsBegin,
      });
      break;
    }
    case 'PUT':
      try {
        const data = req.body as MudarSenhaDto;

        await candidatoService.mudarSenhaComToken(data);
        res.status(StatusCodes.OK).send();
      } catch (err) {
        next(err);
      }
      break;
    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).send();
      break;
  }
}

function downloadFile(req: Request, res: Response): void {
  const userId = req.session.uid;
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
      res
        .status(StatusCodes.NOT_FOUND)
        .json({
          error: 'Arquivo não encontrado',
        })
        .send();
    }
  });
}

export default {
  inicio,
  signUp,
  signIn,
  renderForms,
  formDados,
  formHistorico,
  formProposta,
  uploadsPublicacoes,
  voltarPassoForm,
  logout,
  voltarInicio,
  recuperarSenha,
  trocarSenha,
  downloadFile,
};
