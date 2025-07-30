import fs from 'fs';
import path from 'path';

import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { Candidato } from '@prisma/client';

import candidatoService from '../candidato/candidato.service';
import candidatoPublicacaoService from '../candidatoPublicacao/candidato.publicacao.service';
import candidatoRecomendacaoService from '../candidatoRecomendacao/candidato.recomendacao.service';
import candidatoExperienciaAcademicaService from '../../resources/candidatoExperienciaAcademica/candidato.experiencia.academica.service';
import editalService from '../edital/edital.service';
import linhaDePesquisaService from '../linhasDePesquisa/linha.de.pesquisa.service';
import teste from '../../utils/i18n';

import {
  MudarSenhaDto,
  RecuperarSenhaDto,
  SignInDto,
  SignUpDto,
} from '../candidato/candidato.types';

import {
  AUTODECLARACAO,
  AUTODECLARACAO_VIDEO,
  CARTA_ACEITE_ORIENTADOR_FILE,
  COMPROVANTE_COTA,
  COMPROVANTE_FILE,
  CURRICULUM_FILE,
  Nacionalidade,
  PassoFormCandidato,
  PROPOSTA_FILE,
  PROVA_ANTERIOR_FILE,
} from './selecao.ppgi.types';
import { generatePdfEnrollment } from '@resources/pdf/pdf.controller';
import { Edital } from '.prisma/client';
import { verificarArquivoDiretorio } from '@utils/utils';

interface AuthenticatedRequest extends Request {
  candidato?: Candidato & { edital: Edital }; // Substitua `any` pelo tipo correto do candidato
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
  layout: 'beginSelecao',
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

function getCursos(edital: Edital) {
  const hasDoutorado =
    edital.vagasDoutorado || edital.taesDoutorado || edital.cotasDoutorado;
  const hasMestrado =
    edital.vagasMestrado || edital.taesMestrado || edital.cotasMestrado;

  const cursos = [];

  hasMestrado && cursos.push(teste.i18next.t('ppgi.masters'));
  hasDoutorado && cursos.push(teste.i18next.t('ppgi.phd'));
  return cursos.join(` ${teste.i18next.t('ppgi.and')} `);
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
        // csrfToken: req.csrfToken(),
        editais: listEditais.map((edital) => {
          return {
            ...edital,
            cursos: getCursos(edital),
          };
        }),

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
        const expired = req.query.expired === 'true'; // 👈 flag da query

        res.render(resolveView('signIn'), {
          ...localsBegin,
          // csrfToken: req.csrfToken(),
          editais: listEditais,
          currentLanguage,
          email,
          expired, // 👈 passando para o template
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
      res.status(StatusCodes.OK).send('Logout realizado com sucesso');
      return;
    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).send();
      return;
  }
}

async function voltarInicio(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  switch (req.method) {
    case 'POST':
      const id = req.session.uid;
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
  const uid = req.session.uid;

  const currentLanguage = getLanguage(req);
  const caminhoDiretorioUsuario = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'uploads',
    'candidato',
    uid.toString(),
  );
  const hasComprovanteCota = await verificarArquivoDiretorio(
    caminhoDiretorioUsuario,
    COMPROVANTE_COTA,
  );
  const hasAutodeclaracao = await verificarArquivoDiretorio(
    caminhoDiretorioUsuario,
    AUTODECLARACAO,
  );
  const hasVideoAutodeclaracao = await verificarArquivoDiretorio(
    caminhoDiretorioUsuario,
    AUTODECLARACAO_VIDEO,
  );
  res.status(200).render(resolveView('formDados'), {
    ...locals,
    ...req.candidato,
    // csrfToken: req.csrfToken(),
    currentLanguage,
    hasComprovanteCota,
    hasAutodeclaracao,
    hasVideoAutodeclaracao,
  });
}

async function renderFormHistorico(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  const uid = req.session.uid;
  const currentLanguage = getLanguage(req);
  const caminhoDiretorioUsuario = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'uploads',
    'candidato',
    uid.toString(),
  );

  const experienciasAcademicas =
    await candidatoExperienciaAcademicaService.listByCandidateId(uid);
  const { conferencias, periodicos } =
    await candidatoPublicacaoService.getPublicacoes(uid);

  const hasCurriculum = await verificarArquivoDiretorio(
    caminhoDiretorioUsuario,
    CURRICULUM_FILE,
  );
  const hasProvaAnterior = await verificarArquivoDiretorio(
    caminhoDiretorioUsuario,
    PROVA_ANTERIOR_FILE,
  );
  const hasVitaeXML = await verificarArquivoDiretorio(
    caminhoDiretorioUsuario,
    'VitaeXML.xml',
  );
  res.render(resolveView('formHistorico'), {
    ...locals,
    ...req.candidato,
    editalPosicao: req.candidato.posicaoEdital,
    id: uid,
    // csrfToken: req.csrfToken(),
    hasCurriculum,
    hasProvaAnterior,
    hasVitaeXML,
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
    __dirname,
    '..',
    '..',
    '..',
    'uploads',
    'candidato',
    uid.toString(),
  );

  const [linhas, recomendacoes, edital] = await Promise.all([
    linhaDePesquisaService.listarTodos(),
    candidatoRecomendacaoService.getRecomendacoesByCandidato(uid),
    editalService.getById(req.candidato.editalId),
  ]);

  const hasCartaAceiteOrientador = await verificarArquivoDiretorio(
    caminhoDiretorioUsuario,
    CARTA_ACEITE_ORIENTADOR_FILE,
  );

  const hasPropostaTrabalho = await verificarArquivoDiretorio(
    caminhoDiretorioUsuario,
    PROPOSTA_FILE,
  );

  const hasComprovante = await verificarArquivoDiretorio(
    caminhoDiretorioUsuario,
    COMPROVANTE_FILE,
  );

  res.render(resolveView('formProposta'), {
    ...locals,
    ...req.candidato,
    recomendacoes,
    edital,
    editalPosicao: req.session.editalPosition,
    id: uid,
    linhasPesquisa: linhas,
    // csrfToken: req.csrfToken(),
    hasCartaAceiteOrientador,
    hasPropostaTrabalho,
    hasComprovante,
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
    'uploads',
    'candidato',
    uid.toString(),
  );

  const hasCartaAceiteOrientador = await verificarArquivoDiretorio(
    caminhoDiretorioUsuario,
    CARTA_ACEITE_ORIENTADOR_FILE,
  );
  const hasPropostaTrabalho = await verificarArquivoDiretorio(
    caminhoDiretorioUsuario,
    PROPOSTA_FILE,
  );

  const hasAutodeclaracao = await verificarArquivoDiretorio(
    caminhoDiretorioUsuario,
    AUTODECLARACAO,
  );
  const hasVideoAutodeclaracao = await verificarArquivoDiretorio(
    caminhoDiretorioUsuario,
    AUTODECLARACAO_VIDEO,
  );
  const hasComprovanteCota = await verificarArquivoDiretorio(
    caminhoDiretorioUsuario,
    COMPROVANTE_COTA,
  );
  const hasComprovantePagamento = await verificarArquivoDiretorio(
    caminhoDiretorioUsuario,
    COMPROVANTE_FILE,
  );

  res.render(resolveView('formConfirmacao'), {
    ...locals,
    editalPosicao: req.session.editalPosition,
    id: uid,
    // csrfToken: req.csrfToken(),
    hasCartaAceiteOrientador,
    hasPropostaTrabalho,
    hasComprovantePagamento,
    hasAutodeclaracao,
    hasVideoAutodeclaracao,
    hasComprovanteCota,
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
          res.redirect('/entrar');
          break;
        }

        const candidato = await candidatoService.findByIdComEdital(uid);

        if (!candidato) {
          req.session.destroy((err) => {
            if (err) {
              console.error('Error ao fazer logout', err);
              res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send('Erro ao sair');
              return;
            }
          });
          res.redirect('/entrar');

          return;
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
function parseNullable(value: string): string | null {
  return !value || value === 'null' || value === 'undefined' ? null : value;
}

function toBoolean(value: unknown): boolean {
  return value === 'true' || value === true;
}

async function formDados(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  switch (req.method) {
    case 'PUT':
      try {
        const data = req.body;
        const { uid: id } = req.session;

        const uploadPath = path.join(
          __dirname,
          '..',
          '..',
          '..',
          'uploads',
          'candidato',
          id.toString(),
        );

        const comprovantePath = path.join(uploadPath, COMPROVANTE_COTA);
        const autodeclaracaoPath = path.join(uploadPath, AUTODECLARACAO);
        const autodeclaracaoVideoPath = path.join(
          uploadPath,
          AUTODECLARACAO_VIDEO,
        );

        // Verifica se req.files está no formato esperado
        const files = (!Array.isArray(req.files) && req.files) || {};

        // Flags indicando se arquivos foram enviados
        const hasComprovante = !!files['ComprovanteCota'];
        const hasAutodeclaracao = !!files['AutodeclaracaoCiencia'];
        const hasVideo = !!files['VideoAutodeclaracao'];

        // Remove arquivos antigos se um novo **não** foi enviado
        try {
          const shouldBeComprovante =
            data.cotistaTipo === 'indigena' || data.cotistaTipo === 'pcd';
          const shouldBeAutodeclaracao =
            data.cotistaTipo === 'negro' || data.cotistaTipo === 'pardo';

          if (
            !shouldBeComprovante &&
            !hasComprovante &&
            fs.existsSync(comprovantePath)
          ) {
            fs.unlinkSync(comprovantePath);
          }
          if (
            !shouldBeAutodeclaracao &&
            !hasAutodeclaracao &&
            fs.existsSync(autodeclaracaoPath)
          ) {
            fs.unlinkSync(autodeclaracaoPath);
          }
          if (
            !shouldBeAutodeclaracao &&
            !hasVideo &&
            fs.existsSync(autodeclaracaoVideoPath)
          ) {
            fs.unlinkSync(autodeclaracaoVideoPath);
          }
        } catch (err) {
          console.error('Erro ao apagar arquivos antigos:', err);
        }

        const isBrasileira = data.nacionalidade === Nacionalidade.BRASILEIRA;

        const dataNascimento = data.dataNascimento
          ? new Date(parseDate(data.dataNascimento))
          : null;

        const candidato = {
          ...data,
          cotistaTipo: parseNullable(data.cotistaTipo),
          telefoneSecundario: parseNullable(data.telefoneSecundario),
          nomeSocial: parseNullable(data.nomeSocial),
          condicaoTipo: parseNullable(data.condicaoTipo),
          cep: parseNullable(data.cep),
          uf: parseNullable(data.uf),
          dataNascimento,
          posicaoEdital: 2,
          condicao: toBoolean(data.condicao),
          bolsista: toBoolean(data.bolsista),
          cotista: toBoolean(data.cotista),
          tae: toBoolean(data.tae),
          cpf: isBrasileira ? data.cpf : null,
          passaporte: isBrasileira ? null : data.passaporte,
          pais: isBrasileira ? 'Brasil' : data.pais,
        };
        await candidatoService.update({
          id: id,
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

        await candidatoExperienciaAcademicaService.dropAllByCandidateId(uid);
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
                candidatoId: uid,
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
          tipoPos: parseNullable(body.tipoPos),
          posicaoEdital: 3,
        };
        const id = uid;
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
        const uploadPath = path.join(
          __dirname,
          '..',
          '..',
          '..',
          'uploads',
          'candidato',
          uid.toString(),
        );

        const comprovantePath = path.join(uploadPath, COMPROVANTE_FILE);
        const propostaPath = path.join(uploadPath, PROPOSTA_FILE);
        const cartaAceitePath = path.join(
          uploadPath,
          CARTA_ACEITE_ORIENTADOR_FILE,
        );

        // Verifica se req.files está no formato esperado
        const files = (!Array.isArray(req.files) && req.files) || {};

        // Flags indicando se arquivos foram enviados
        const hasComprovante = !!files['ComprovantePagamento'];
        const hasCartaAceite = !!files['CartaAceiteOrientador'];
        const hasProposta = !!files['PropostaTrabalho'];
        // Remove arquivos antigos se um novo **não** foi enviado
        try {
          if (
            toBoolean(body.isExcludeComprovante) &&
            !hasComprovante &&
            fs.existsSync(comprovantePath)
          ) {
            fs.unlinkSync(comprovantePath);
          }
          if (
            toBoolean(body.isExcludeCartaAceite) &&
            !hasCartaAceite &&
            fs.existsSync(cartaAceitePath)
          ) {
            fs.unlinkSync(cartaAceitePath);
          }
          if (
            toBoolean(body.isExcludeProposta) &&
            !hasProposta &&
            fs.existsSync(propostaPath)
          ) {
            fs.unlinkSync(propostaPath);
          }
        } catch (err) {
          console.error('Erro ao apagar arquivos antigos:', err);
        }

        if (
          body.recomendacaoNome &&
          body.recomendacaoEmail &&
          body.recomendacaoNome.length === body.recomendacaoEmail.length
        ) {
          const candidato = await candidatoService.findByIdComEdital(uid);

          await candidatoRecomendacaoService.createManyByCandidate(
            body.recomendacaoNome.map((nome, index) => ({
              nome,
              email: body.recomendacaoEmail[index],
            })),
            uid,
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
          ...(body.isNext && { finishedAt: new Date() }),
        };

        const id = uid;
        await candidatoService.update({
          id,
          data: candidato,
        });

        if (body.isNext) {
          const url = `http://${req.headers.host}/recomendacoes`;
          await generatePdfEnrollment(uid.toString());
          candidatoRecomendacaoService.sendEmailForUsersByCandidate({
            id,
            url,
          });
          candidatoService.enviarEmailConfirmacao({ id });
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
      const data = await candidatoPublicacaoService.getPublicacoes(
        req.session.uid,
      );

      const { periodicos, conferencias } = data;

      return res.render(resolveView('formHistorico'), {
        message: 'Dados salvos com sucesso',
        id: req.session.uid,
        // csrfToken: req.csrfToken(),
        periodicos,
        conferencias,
      });
    }

    case 'POST':
      try {
        const uid = req.session.uid;

        // 1. Converte publicações recebidas (ou usa array vazio)
        const publicacoesPayload = req.body.publicacoes
          ? JSON.parse(req.body.publicacoes)
          : [];

        // 2. Salva (ou atualiza) as publicações do candidato
        await candidatoPublicacaoService.processPublicacoes({
          publicacoes: publicacoesPayload,
          uid,
        });

        // 3. Busca listas atualizadas
        const { periodicos, conferencias } =
          await candidatoPublicacaoService.getPublicacoes(uid);

        // 4. Renderiza o trecho HTML e retorna
        res.render('partials/ppgi/publicacoes', {
          layout: false, // retorna só o fragmento
          periodicos,
          conferencias,
          hasVitaeXML: true, // exibe botões “trocar/deletar” etc.
        });
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
        const id = req.session.uid;
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
        // csrfToken: req.csrfToken(),
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
        // csrfToken: req.csrfToken(),
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
    __dirname,
    '..',
    '..',
    '..',
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

async function deleteAllPublications(
  req: Request,
  res: Response,
): Promise<void> {
  switch (req.method) {
    case 'DELETE':
      try {
        const { uid } = req.session;
        const caminhoDoc = path.join(
          __dirname,
          '..',
          '..',
          '..',
          'uploads',
          'candidato',
          uid,
          'VitaeXML.xml',
        );
        if (fs.existsSync(caminhoDoc)) {
          fs.unlinkSync(caminhoDoc);
        }
        await candidatoPublicacaoService.deleteAllPublicacoes(uid);
        res.status(StatusCodes.OK).send();
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
      }
      break;
    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).send();
      break;
  }
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
  deleteAllPublications,
};
