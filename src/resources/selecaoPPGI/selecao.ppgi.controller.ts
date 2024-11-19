import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

import candidatoExperienciaAcademicaService from '../candidatoExperienciaAcademica/candidato.experiencia.academica.service';
import candidatoService from '../candidato/candidato_inscrição.service';
import EditalService from '../edital/edital.service';
import linhasDePesquisaService from '../linhasDePesquisa/linha.de.pesquisa.service';
import { sendEmailRecoveryPasswordCandidato } from '../../utils/mailerGrid';
import {
  CARTA_ACEITE_ORIENTADOR_FILE,
  COMPROVANTE_FILE,
  CURRICULUM_FILE,
  Nacionalidade,
  PROPOSTA_FILE,
  PROVA_ANTERIOR_FILE,
} from './selecao.ppgi.types';
import editalService from '../edital/edital.service';
import candidatoPublicacaoService from '../candidatoPublicacao/candidato.publicacao.service';
import { TYPES_PUBLICACAO } from '../candidatoPublicacao/candidato.publicacao.types';
import candidatoRecomendacaoService from '../candidatoRecomendacao/candidato.recomendacao.service';
import { gerarPDF } from './gerarInscricao';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

type CustomRequest = Request & {
  session: {
    email: string;
    uid: string;
    editalId: string;
    editalPosition: number;
  };
};

const locals = {
  layout: 'selecaoppgi',
};

const localsBegin = {
  layout: 'begin',
};

function getLanguage(req: CustomRequest) {
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

const begin = async (req: CustomRequest, res: Response) => {
  switch (req.method) {
    case 'GET':
      const currentLanguage = getLanguage(req);

      return res.render(resolveView('begin'), {
        ...localsBegin,
        currentLanguage,
      });
    default:
      return res.status(405).send();
  }
};

const signUp = async (req: CustomRequest, res: Response) => {
  switch (req.method) {
    case 'GET': {
      const listEditais = await EditalService.listEditalsAvailable();
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
      const { email, senha, edital } = req.body;

      if (!email || !senha || !edital) {
        return res.status(403).json({
          error: 'Dados incompletos ou mal formatados',
        });
      }

      try {
        const candidato = await candidatoService.findCandidatoByEmailAndEdital({
          email,
          edital,
        });

        if (candidato) {
          return res.status(409).json({
            error: 'Candidato já existe para este edital',
          });
        }

        const candidatoCreated = await candidatoService.create({
          email,
          password: senha,
          editalNumber: edital,
        });

        req.session.email = candidatoCreated.email;
        req.session.editalId = candidatoCreated.editalId;
        req.session.uid = candidatoCreated.id.toString();
        req.session.editalPosition = candidatoCreated.posicaoEdital;

        return res.status(201).send();
      } catch (err) {
        console.error(`[ERROR] Criar de candidato: ${err}`);
        return res.status(500).json({
          error: 'Não foi possível criar o candidato',
        });
      }
    }
    default:
      return res.status(404).send();
  }
};

const login = async (req: CustomRequest, res: Response) => {
  switch (req.method) {
    case 'GET': {
      try {
        const listEditais = await EditalService.listEdital();
        const currentLanguage = getLanguage(req);

        return res.render(resolveView('signIn'), {
          ...localsBegin,
          csrfToken: req.csrfToken(),
          editais: listEditais,
          currentLanguage,
        });
      } catch (err) {
        return res.status(500).send();
      }
    }
    case 'POST':
      try {
        const { email, senha, edital } = req.body;

        if (!email || !senha || !edital) {
          return res.status(400).send();
        }

        const candidato = await candidatoService.auth({
          email,
          password: senha,
          editalNumber: edital,
        });
        if (!candidato) {
          return res.status(406).send();
        }

        if (candidato.posicaoEdital > 4) {
          return res.status(401).send();
        }

        req.session.email = candidato.email;
        req.session.editalId = candidato.editalId;
        req.session.uid = candidato.id.toString();
        req.session.editalPosition = candidato.posicaoEdital;
        return res.status(200).send();
      } catch (err) {
        return res.status(500).send();
      }
    default:
      return res.status(405).send();
  }
};

function logout(req: CustomRequest, res: Response) {
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

const formProposta = async (req: CustomRequest, res: Response) => {
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
          await candidatoRecomendacaoService.createManyByCandidato(
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

        const candidato = {
          idLinhaPesquisa: Number(body.idLinhaPesquisa),
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
          const url = `http://${req.headers.host}/selecaoppgi/recomendacoes/adicionar`;
          gerarPDF(id);
          await candidatoRecomendacaoService.sendEmailRecoveryPasswordCandidato(
            {
              candidatoId: id,
              url,
            },
          );
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

async function backToStart(req: CustomRequest, res: Response) {
  switch (req.method) {
    case 'POST':
      const id = Number(req.session.uid);
      await candidatoService.update({
        id,
        data: {
          posicaoEdital: 1,
        },
      });
      req.session.editalPosition = 1;
      return res.status(200).send();
    default:
      return res.status(405).send();
  }
}

const forms = async (req: CustomRequest, res: Response) => {
  switch (req.method) {
    case 'GET':
      if (!req.session.uid) {
        res.status(500).redirect('/selecaoppgi/entrar');
        break;
      }
      const { uid, editalPosition } = req.session;
      const currentLanguage = getLanguage(req);

      const candidato = await candidatoService.findById(Number(uid));
      const edital = await editalService.getEdital(candidato.editalId);

      if (!candidato) {
        res.redirect('/selecaoppgi/entrar');
        break;
      }

      const caminhoDiretorioUsuario = path.join(
        'public',
        'uploads',
        'candidato',
        uid.toString(),
      );
      switch (editalPosition) {
        case 1: {
          return res.status(200).render(resolveView('formDados'), {
            ...locals,
            ...candidato,
            csrfToken: req.csrfToken(),
            currentLanguage,
          });
        }

        case 2: {
          const experienciasAcademicas =
            await candidatoExperienciaAcademicaService.listByCandidatoId(
              Number(uid),
            );
          const { conferencias, periodicos } =
            await candidatoPublicacaoService.ListarPublicacoesCandidato(
              Number(uid),
            );

          return res.render(resolveView('forms2'), {
            ...locals,
            ...candidato,
            editalPosicao: editalPosition,
            email: req.session.email,
            id: req.session.uid,
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

        case 3: {
          const linhas = await linhasDePesquisaService.list();
          const recomendacoes =
            await candidatoRecomendacaoService.getRecomendacoesByCandidato(
              Number(uid),
            );
          return res.render(resolveView('forms3'), {
            ...locals,
            ...candidato,
            recomendacoes,
            edital,
            editalPosicao: req.session.editalPosition,
            email: req.session.email,
            id: req.session.uid,
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
        case 4: {
          return res.render(resolveView('formConfirmacao'), {
            ...locals,
            editalPosicao: req.session.editalPosition,
            id: req.session.uid,
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
        default:
          return res.status(400).send();
      }
    default:
      return res.status(405).send();
  }
};

async function form1(req: CustomRequest, res: Response) {
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
      return res.status(405).send();
  }
}

const form2 = async (req: CustomRequest, res: Response) => {
  switch (req.method) {
    case 'PUT': {
      try {
        const { uid } = req.session;
        const experienciaInstituicao = req.body
          .experienciaInstituicao as string[];
        const experienciasAtividade = req.body.experienciaAtividade as string[];
        const experienciasPeriodo = req.body.experienciaPeriodo as string[];

        await candidatoExperienciaAcademicaService.dropAllByCandidatoId(
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

const formPublicacoes = async (req: CustomRequest, res: Response) => {
  switch (req.method) {
    case 'GET': {
      const data = await candidatoPublicacaoService.ListarPublicacoesCandidato(
        Number(req.session.uid),
      );

      const { periodicos, conferencias } = data;

      return res.render(resolveView('forms2'), {
        message: 'Dados salvos com sucesso',
        editalPosicao: req.session.editalPosition,
        email: req.session.email,
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

const candidatos = async (req: CustomRequest, res: Response) => {
  switch (req.method) {
    case 'GET':
      return res.json({
        candidatos: await candidatoService.list(),
      });
    default:
      return res.status(400).send();
  }
};

const backStep = async (req: CustomRequest, res: Response) => {
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

const refresh = async (req: CustomRequest, res: Response) => {
  res.redirect('/selecaoppgi/formulario');
};

const recuperarSenha = async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const currentLanguage = getLanguage(req);
      const listEditais = await EditalService.listEdital();
      return res.render(resolveView('recuperarSenha'), {
        editais: listEditais,
        csrfToken: req.csrfToken(),
        currentLanguage,
        ...localsBegin,
      });
    }
    case 'POST': {
      if (!req.body.email || !req.body.editalId) {
        return res.status(400).send();
      }
      const { email, editalId: edital } = req.body;
      const candidato = await candidatoService.findCandidatoByEmailAndEdital({
        email,
        edital,
      });
      if (!candidato) {
        return res.status(404).send();
      }

      const token = await candidatoService.updateTokenPassword({
        id: candidato.id,
      });

      const url = `http://${req.headers.host}/selecaoppgi/trocarSenha?token=${token}`;
      try {
        sendEmailRecoveryPasswordCandidato({
          email: candidato.email,
          url,
        });
      } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Erro ao enviar e-mail' });
      }

      return res.status(200).send();
    }
    default:
      return res.status(405).send();
  }
};

const trocarSenha = async (req, res: Response) => {
  switch (req.method) {
    case 'GET': {
      const candidato = await candidatoService.findByTokenPassword(
        req.query.token as string,
      );
      const currentLanguage = getLanguage(req);

      if (!candidato) {
        return res.render(resolveView('trocarSenha'), {
          error: 'Token inválido',
          csrfToken: req.csrfToken(),
          currentLanguage,
          ...localsBegin,
        });
      }

      if (candidato.validadeTokenReset < new Date()) {
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
      const { password, token } = req.body;
      if (!password || !token) {
        return res.status(400).send();
      }
      try {
        await candidatoService.changePasswordWithToken({
          token,
          password,
        });
      } catch (err) {
        console.error(err);
        if (err instanceof Error) {
          return res.status(400).send({ message: err.message });
        }
        return res.status(500).send();
      }
      return res.status(200).send();
    }
    default:
      return res.status(405).send();
  }
};

export default {
  begin,
  signUp,
  login,
  forms,
  form1,
  form2,
  candidatos,
  backStep,
  refresh,
  formPublicacoes,
  logout,
  formProposta,
  backToStart,
  recuperarSenha,
  trocarSenha,
  downloadFile,
};
