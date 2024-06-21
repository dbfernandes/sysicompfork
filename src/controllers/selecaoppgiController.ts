import { Request, Response } from "express";

import candidatePublicacaoService from "../services/candidatePublicacaoService";
import CandidateService from "../services/candidateService";
import candidatoExperienciaAcademicaService from "../services/candidatoExperienciaAcademicaService";
import candidatoService from "../services/candidatoService";
import EditalService from "../services/editalService";
import linhasDePesquisaService from "../resources/linhasDePesquisa/linhasDePesquisa.service";
import mailer from '../utils/mailer'
import crypto from 'crypto'
const fs = require("fs");
const path = require("path");

type CustomRequest = Request & {
  session: {
    email: string;
    uid: string;
    editalId: string;
    editalPosition: number;
  };
};

const locals = {
  layout: "selecaoppgi",
};

const begin = async (req: CustomRequest, res: Response) => {
  switch (req.method) {
    case "GET":
      return res.render("selecaoppgi/begin", {
        ...locals,
      });
    default:
      return res.status(404).send("Erro 400");
  }
};

// Rotas para cadastro de candidato
const signUp = async (req: CustomRequest, res: Response) => {
  switch (req.method) {
    case "GET": {
      const listEditais = await EditalService.listEdital();

      return res.render("selecaoppgi/signUp", {
        csrfToken: req.csrfToken(),
        editais: listEditais,
        errorSignin: null,
        ...locals,
      });
    }
    case "POST": {
      const { email, senha, edital } = req.body;

      if (!email || !senha || !edital) {
        return res.status(403).json({
          error: "Dados incompletos ou mal formatados",
        });
      }

      try {
        const candidate = await candidatoService.findCandidatoByEmailAndEdital({
          email,
          edital,
        });

        if (candidate) {
          return res.status(409).json({
            error: "Candidato já existe para este edital",
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
          error: "Não foi possível criar o candidato",
        });
      }
    }
    default:
      return res.status(404).send();
  }
};

const login = async (req: CustomRequest, res: Response) => {
  switch (req.method) {
    case "GET": {
      if (req.session.uid) {
        res.redirect("/selecaoppgi/formulario");
        break;
      }
      try {
        const listEditais = await EditalService.listEdital();
        return res.render("selecaoppgi/login", {
          ...locals,
          csrfToken: req.csrfToken(),
          editais: listEditais,
        });
      } catch (err) {
        return res.status(500).send();
      }
    }
    case "POST":
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
    case "POST":
      req.session.destroy((err) => {
        console.error(err);
        return res.status(500).send();
      });
      return res.status(200).redirect("/selecaoppgi/entrar");
    default:
      return res.status(404).send();
  }
}

const formProposta = async (req: CustomRequest, res: Response) => {
  switch (req.method) {
    case "POST": {
      const id = req.session.uid;
      const hasProposta =
        req.files &&
        !Array.isArray(req.files) &&
        req.files["CartaAceiteOrientador"] !== undefined;
      if (!hasProposta) {
        if (
          fs.existsSync(
            path.join(
              "uploads",
              "candidatos",
              id?.toString(),
              "CartaAceiteOrientador.pdf"
            )
          )
        ) {
          fs.unlinkSync(
            path.join(
              "uploads",
              "candidatos",
              id?.toString(),
              "CartaAceiteOrientador.pdf"
            )
          );
        }
      }
      const candidate = {
        idLinhaPesquisa: Number(req.body.idLinhaPesquisa),
        tituloProposta: req.body.tituloProposta,
        nomeOrientador: req.body.nomeOrientador,
        motivos: req.body.motivos,
        posicaoEdital: 4,
      };
      await candidatoService
        .update({
          id,
          data: candidate,
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).send();
        });
      req.session.editalPosition = 4;
      return res.status(200).send();
    }
    default:
      return res.status(405).send();
  }
};

function verificarArquivoDiretorio(diretorio: string, nomeArquivo: string) {
  const caminhoArquivo = path.join(diretorio, nomeArquivo);
  try {
    // Verifica se o arquivo existe
    fs.accessSync(caminhoArquivo, fs.constants.F_OK);
    return true;
  } catch (err) {
    // Se houver algum erro ao acessar o arquivo, retorna false
    return false;
  }
}

async function editCandidate(req: CustomRequest, res: Response) {
  switch (req.method) {
    case "PUT":
      return res.status(200).send();
    default:
      return res.status(405).send();
  }
}

async function backToStart(req: CustomRequest, res: Response) {
  switch (req.method) {
    case "POST":
      const id = req.session.uid;
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
    case "GET":
      if (!req.session.uid) {
        res.status(500).redirect("/selecaoppgi/entrar");
        break;
      }
      const { uid, editalPosition } = req.session;
      const candidate = await candidatoService.findById(uid).catch((err) => {
        console.error(err);
        return res.status(500).send();
      });
      if (!candidate) {
        res.redirect("/selecaoppgi/entrar");
        break;
      }

      console.log(candidate);
      console.log({ ...candidate });
      if (editalPosition === 1) {
        return res.status(200).render("selecaoppgi/formDados", {
          ...locals,
          ...candidate,
          csrfToken: req.csrfToken(),
        });
      }

      if (editalPosition === 2) {
        const caminhoDiretorioUsuario = path.join(
          "uploads",
          "candidatos",
          uid.toString()
        );
        const experienciasAcademicas =
          await candidatoExperienciaAcademicaService.listByCandidateId(uid);
        return res.render("selecaoppgi/forms2", {
          ...locals,
          ...candidate,
          editalPosicao: editalPosition,
          email: req.session.email,
          id: req.session.uid,
          csrfToken: req.csrfToken(),
          hasCurriculum: verificarArquivoDiretorio(
            caminhoDiretorioUsuario,
            "VitaePDF.pdf"
          ),
          hasProvaAnterior: verificarArquivoDiretorio(
            caminhoDiretorioUsuario,
            "ProvaAnterior.pdf"
          ),
          experienciasAcademicas: experienciasAcademicas.map(
            (experiencia: any) => experiencia.toJSON()
          ),
        });
      }

      if (req.session.editalPosition === 3) {
        const linhas = await linhasDePesquisaService.list();
        return res.render("selecaoppgi/forms3", {
          ...locals,
          ...candidate,
          editalPosicao: req.session.editalPosition,
          email: req.session.email,
          id: req.session.uid,
          linhasPesquisa: linhas,
          csrfToken: req.csrfToken(),
        });
      }
      if (req.session.editalPosition === 4) {
        const caminhoDiretorioUsuario = path.join(
          "uploads",
          "candidatos",
          uid.toString()
        );
        return res.render("selecaoppgi/formConfirmacao", {
          ...locals,
          editalPosicao: (req.session as any).editalPosition,
          email: (req.session as any).email,
          id: req.session.uid,
          csrfToken: req.csrfToken(),
          hasCartaAceiteOrientador: verificarArquivoDiretorio(
            caminhoDiretorioUsuario,
            "CartaAceiteOrientador.pdf"
          ),
        });
      }
      break;

    default:
      return res.status(405).send();
  }
};
function parseDate(dateString: string) {
  const parts = dateString.split("/");
  // Supondo que a data está no formato DD/MM/YYYY
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Mês em JavaScript é 0-indexed
  const year = parseInt(parts[2], 10);

  return new Date(year, month, day);
}
const form1 = async (req: CustomRequest, res: Response) => {
  switch (req.method) {
    case "POST": {
      const { data } = req.body;
      if (req.session.editalPosition === 1) {
        const dataNascimento = data.dataNascimento
          ? new Date(parseDate(data.dataNascimento))
          : null;
        let candidato = {
          ...data,
          dataNascimento,
          posicaoEdital: 2,
          condicao: data.condicao === "true",
          bolsista: data.bolsista === "true",
          cotista: data.cotista === "true",
        };
        const { uid } = req.session;
        await candidatoService.update({
          id: uid,
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
    case "POST": {
      try {
        let VitaePDF = null;
        let Prova = null;
        if (
          !Array.isArray(req.files) &&
          req.files &&
          req.files.Prova !== undefined
        ) {
          Prova = req.files.Prova[0];
        }
        if (
          !Array.isArray(req.files) &&
          req.files &&
          req.files.VitaePDF !== undefined
        ) {
          VitaePDF = req.files.VitaePDF[0];
        }
        const { uid } = req.session;
        console.log(req.body);
        const experienciaInstituicao = req.body.experienciaInstituicao;
        const experienciasAtividade = req.body.experienciaAtividade;
        const experienciasPeriodo = req.body.experienciaPeriodo;
        console.log(
          experienciaInstituicao,
          experienciasAtividade,
          experienciasPeriodo
        );

        // if (
        //   experienciaInstituicao &&
        //   experienciasAtividade &&
        //   experienciasPeriodo && experienciaInstituicao.length > 0
        // ) {
        //   await candidatoExperienciaAcademicaService.dropAllByCandidateId(uid);
        //   await Promise.all(
        //     experienciaInstituicao.map((_: any, index: any) => {
        //       return candidatoExperienciaAcademicaService.create({
        //         data: {
        //           instituicao: experienciaInstituicao[index],
        //           atividade: experienciasAtividade[index],
        //           periodo: experienciasPeriodo[index],
        //         },
        //         idCandidato: uid,
        //       });
        //     })
        //   ).catch((err) => {
        //     console.error(err);
        //     return res.status(500).send();
        //   })
        // }
        const { body } = req;
        const candidato = {
          cursoGraduacao: body.cursoGraduacao,
          instituicaoGraduacao: body.instituicaoGraduacao,
          anoEgressoGraduacao: body.anoEgressoGraduacao,
          cursoPos: body.cursoPos,
          instituicaoPos : body.instituicaoPos,
          anoEgressoPos: body.anoEgressoPos,
          posicaoEdital: 3,
        };
        await candidatoService.update({
          id: uid,
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
    case "GET": {
      const data = await candidatePublicacaoService.ListarPublicacoesCandidate(
        Number(req.session.uid)
      );

      const { periodicos, conferencias } = data;

      return res.render("selecaoppgi/forms2", {
        message: "Dados salvos com sucesso",
        editalPosicao: req.session.editalPosition,
        email: req.session.email,
        id: req.session.uid,
        csrfToken: req.csrfToken(),
        periodicos,
        conferencias,
      });
    }

    case "POST":
      try {
        const dados = req.body;
        const periodicos = dados.publicacoes["ARTIGO-PUBLICADO"];
        const eventos = dados.publicacoes["TRABALHO-EM-EVENTOS"];
        const livros = dados.publicacoes["LIVRO-PUBLICADO-OU-ORGANIZADO"];
        const capitulos = dados.publicacoes["CAPITULO-DE-LIVRO-PUBLICADO"];
        const outras = dados.publicacoes["OUTRA-PRODUCAO-BIBLIOGRAFICA"];
        const prefacios = dados.publicacoes["PREFACIO-POSFACIO"];

        const promises = [];

        promises.push(
          candidatePublicacaoService.adicionarVarios(
            Number(req.session.uid),
            periodicos,
            1
          )
        );
        promises.push(
          candidatePublicacaoService.adicionarVarios(
            Number(req.session.uid),
            eventos,
            2
          )
        );
        promises.push(
          candidatePublicacaoService.adicionarVarios(Number(req.session.uid), livros, 3)
        );
        promises.push(
          candidatePublicacaoService.adicionarVarios(
            Number(req.session.uid),
            capitulos,
            4
          )
        );
        promises.push(
          candidatePublicacaoService.adicionarVarios(Number(req.session.uid), outras, 5)
        );
        promises.push(
          candidatePublicacaoService.adicionarVarios(
            Number(req.session.uid),
            prefacios,
            6
          )
        );

        const results = await Promise.allSettled(promises);

        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            console.log(`Operação ${index + 1} concluída com sucesso.`);
            console.log("Resultado:", result.value);
          } else {
            console.error(`Operação ${index + 1} falhou.`);
            console.error("Erro:", result.reason);
          }
        });

        res.status(200).send("Dados salvos com sucesso.");
      } catch {}

    // res.status(400).send(data);
  }
};

const candidates = async (req: CustomRequest, res: Response) => {
  switch (req.method) {
    case "GET":
      return res.json({
        candidates: await CandidateService.list(),
      });
    default:
      return res.status(400).send();
  }
};

const voltar = async (req: CustomRequest, res: Response) => {
  switch (req.method) {
    case "POST": {
      try {
        const id = req.session.uid;
        const editalPosicao =
          parseInt(req.session.editalPosition?.toString() ?? "1", 10) - 1;
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
  res.redirect("/selecaoppgi/formulario");
};


const recuperarSenha = async (req, res) => {
  if (req.method === 'POST') {

      const { email } = req.body

      try {
          // const user = await CandidateService.findOne({ where: { email } })

          // if (!user)
          //     return res.render('selecaoppgi/recuperarSenha', {
          //         message: "Usuário não encontrado", type: 'danger'
          //     })

          const token = crypto.randomBytes(20).toString('hex')

          const now = new Date()

          now.setHours(now.getHours() + 1)

          // await CandidateService.update({
          //     password_reset_token: token,
          //     password_reset_expires: now
          // }, {
          //     where: { id: user.id }
          // })

        
          mailer.sendMail({
              to: email,
              from: 'api@test.com.br',
              subject: 'Forgot Password?',
              template: 'auth/forgot_password',
              context: { token }
          }, (err) => {
              if (err)
                  return res.render('selecaoppgi/recuperarSenha', {
                      message: "Não foi possível enviar o e-mail de recuperação de senha. Por favor, tente mais tarde",
                      type: 'danger'
                  })

              return res.render('selecaoppgi/recuperarSenha', {
                  message: "Token enviado para o e-mail cadastrado", type: 'success'
              })
          })

      } catch (err) {
          console.log(err)
          return res.render('selecaoppgi/recuperarSenha', {
              message: "Erro durante a recuperação de senha, tente novamente.",
              type: 'danger'
          })
      }
  }
  else if (req.method === 'GET'){
      return res.render('selecaoppgi/recuperarSenha')
  }
}
export default {
  begin,
  signUp,
  login,
  forms,
  form1,
  form2,
  candidates,
  voltar,
  refresh,
  formPublicacoes,
  logout,
  formProposta,
  editCandidate,
  backToStart,
  recuperarSenha
}; 
