import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

import candidatoExperienciaAcademicaService from '../../resources/candidatoExperienciaAcademica/candidato.experiencia.academica.service';
import candidatoService from '../candidato/candidato.service';
import EditalService from '../edital/edital.service';
import linhasDePesquisaService from '../linhasDePesquisa/linhasDePesquisa.service';
import { sendEmailRecoveryPasswordCandidate } from '../../utils/mailerGrid';
import {
  CARTA_ACEITE_ORIENTADOR_FILE,
  COMPROVANTE_FILE,
  CURRICULUM_FILE,
  PROPOSTA_FILE,
  PROVA_ANTERIOR_FILE,
} from './selecaoppgi.types';
import editalService from '../edital/edital.service';
import candidatoPublicacaoService from '../candidatoPublicacao/candidato.publicacao.service';
import { TYPES_PUBLICACAO } from '../candidatoPublicacao/candidato.publicacao.types';
import candidatoRecomendacaoService from '../candidatoRecomendacao/candidato.recomendacao.service';

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

const begin = async (req: CustomRequest, res: Response) => {
  switch (req.method) {
    case 'GET':
      return res.render(resolveView('begin'), {
        ...localsBegin,
      });
    default:
      return res.status(405).send();
  }
};

const signUp = async (req: CustomRequest, res: Response) => {
  switch (req.method) {
    case 'GET': {
      const listEditais = await EditalService.listEditalsAvailable();

      return res.render(resolveView('signUp'), {
        csrfToken: req.csrfToken(),
        editais: listEditais,
        errorSignin: null,
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
        const candidate = await candidatoService.findCandidatoByEmailAndEdital({
          email,
          edital,
        });

        if (candidate) {
          return res.status(409).json({
            error: 'Candidato já existe para este edital',
          });
        }

        const candidateCreated = await candidatoService.create({
          email,
          password: senha,
          editalNumber: edital,
        });

        req.session.email = candidateCreated.email;
        req.session.editalId = candidateCreated.idEdital;
        req.session.uid = candidateCreated.id.toString();
        req.session.editalPosition = candidateCreated.posicaoEdital;

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
        return res.render(resolveView('signIn'), {
          ...localsBegin,
          csrfToken: req.csrfToken(),
          editais: listEditais,
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

        const candidate = await candidatoService.auth({
          email,
          password: senha,
          editalNumber: edital,
        });
        if (!candidate) {
          return res.status(406).send();
        }

        if (candidate.posicaoEdital > 4) {
          return res.status(401).send();
        }

        req.session.email = candidate.email;
        req.session.editalId = candidate.idEdital;
        req.session.uid = candidate.id.toString();
        req.session.editalPosition = candidate.posicaoEdital;
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
        console.log(body);
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
            candidato.idEdital,
            new Date(candidato.Edital.dataFim),
          );
        }
        const posicaoEdital = body.isNext ? 4 : 3;

        const candidate = {
          idLinhaPesquisa: Number(body.idLinhaPesquisa),
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
          const url = `http://${req.headers.host}/selecaoppgi/recomendacoes/adicionar`;

          candidatoRecomendacaoService.sendEmailRecoveryPasswordCandidate({
            idCandidato: id,
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

export function verificarArquivoDiretorio(
  diretorio: string,
  nomeArquivo: string,
) {
  const caminhoArquivo = path.join(diretorio, nomeArquivo);

  return fs.existsSync(caminhoArquivo);
}

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

      const candidate = await candidatoService.findById(Number(uid));
      const edital = await editalService.getEdital(candidate.idEdital);

      if (!candidate) {
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
            ...candidate,
            csrfToken: req.csrfToken(),
          });
        }

        case 2: {
          const experienciasAcademicas =
            await candidatoExperienciaAcademicaService.listByCandidateId(
              Number(uid),
            );
          const { conferencias, periodicos } =
            await candidatoPublicacaoService.ListarPublicacoesCandidate(
              Number(uid),
            );

          return res.render(resolveView('forms2'), {
            ...locals,
            ...candidate,
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
          });
        }

        case 3: {
          const linhas = await linhasDePesquisaService.list();
          const recomendacoes =
            await candidatoRecomendacaoService.getRecomendacoesByCandidato(
              Number(uid),
            );
          console.log(recomendacoes);
          return res.render(resolveView('forms3'), {
            ...locals,
            ...candidate,
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
          });
        }
        default:
          return res.status(400).send();
      }
    default:
      return res.status(405).send();
  }
};
function parseDate(dateString: string) {
  const parts = dateString.split('/');
  // Supondo que a data está no formato DD/MM/YYYY
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Mês em JavaScript é 0-indexed
  const year = parseInt(parts[2], 10);

  return new Date(year, month, day);
}

const form1 = async (req: CustomRequest, res: Response) => {
  switch (req.method) {
    case 'PUT': {
      const { data } = req.body;
      if (req.session.editalPosition === 1) {
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
        };
        const { uid } = req.session;
        const id = Number(uid);
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
};

const form2 = async (req: CustomRequest, res: Response) => {
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
                idCandidato: uid,
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
      const data = await candidatoPublicacaoService.ListarPublicacoesCandidate(
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

const candidates = async (req: CustomRequest, res: Response) => {
  switch (req.method) {
    case 'GET':
      return res.json({
        candidates: await candidatoService.list(),
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
      const listEditais = await EditalService.listEdital();
      return res.render(resolveView('recuperarSenha'), {
        editais: listEditais,
        csrfToken: req.csrfToken(),
        ...localsBegin,
      });
    }
    case 'POST': {
      if (!req.body.email || !req.body.editalId) {
        return res.status(400).send();
      }
      const { email, editalId: edital } = req.body;
      const candidate = await candidatoService.findCandidatoByEmailAndEdital({
        email,
        edital,
      });
      if (!candidate) {
        return res.status(404).send();
      }

      const token = await candidatoService.updateTokenPassword({
        id: candidate.id,
      });

      const url = `http://${req.headers.host}/selecaoppgi/trocarSenha?token=${token}`;
      try {
        sendEmailRecoveryPasswordCandidate({
          email: candidate.email,
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
      const candidate = await candidatoService.findByTokenPassword(
        req.query.token as string,
      );

      if (!candidate) {
        return res.render(resolveView('trocarSenha'), {
          error: 'Token inválido',
          csrfToken: req.csrfToken(),
          ...localsBegin,
        });
      }

      if (candidate.validadeTokenReset < new Date()) {
        return res.render(resolveView('trocarSenha'), {
          error: 'Token expirado',
          csrfToken: req.csrfToken(),
          ...localsBegin,
        });
      }
      return res.render(resolveView('trocarSenha'), {
        csrfToken: req.csrfToken(),
        token: req.query.token,
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

const downloadFile = (req, res) => {
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
  // const nomeArquivo = req.params.name;
  // const caminhoArquivo = path.join(
  //   __dirname,
  //   '..',
  //   '..',
  //   'public',
  //   'uploads',
  //   'candidato',
  //   userId,
  //   nomeArquivo,
  // );
  // // Verifica se o arquivo existe
  // if (fs.existsSync(caminhoArquivo)) {
  //   // Define o cabeçalho para o download
  //   // Define os cabeçalhos para evitar o armazenamento em cache
  //   res.setHeader(
  //     'Cache-Control',
  //     'no-store, no-cache, must-revalidate, max-age=0',
  //   );
  //   res.setHeader('Pragma', 'no-cache');
  //   res.setHeader('Expires', '0');
  //   res.setHeader('Content-Disposition', `attachment; filename=${nomeArquivo}`);
  //   res.setHeader('Content-Type', 'application/octet-stream');

  //   // Envia o arquivo como resposta
  //   res.sendFile(caminhoArquivo);
  // } else {
  //   res.status(404).send('Arquivo não encontrado.');
  // }
};
export default {
  begin,
  signUp,
  login,
  forms,
  form1,
  form2,
  candidates,
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
