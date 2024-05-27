import candidatePublicacaoService from "../services/candidatePublicacaoService";
import CandidateService from "../services/candidateService";
import candidatoExperienciaAcademicaService from "../services/candidatoExperienciaAcademicaService";
import candidatoService from "../services/candidatoService";
import EditalService from "../services/editalService";
import linhasDePesquisaService from "../services/linhasDePesquisaService";
const fs = require("fs");
const path = require("path");

const locals = {
  layout: "selecaoppgi",
};

const begin = async (req: Request, res: Response) => {
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
const signUp = async (req, res) => {
  switch (req.method) {
    case "GET": {
      const editais = await EditalService.listEdital();
      const listEditais = editais.map((edital) => edital.dataValues);

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
        req.session.uid = candidateCreated.id;
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

const login = async (req: Request, res: Response) => {
  switch (req.method) {
    case "GET": {
      if (req.session.email) {
        res.redirect("/selecaoppgi/formulario");
        break;
      }
      try {
        const editais = await EditalService.listEdital();
        const listEditais = editais.map((edital) => edital.dataValues);
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

        if(candidate.posicaoEdital > 4){
          return res.status(401).send();
        }

        req.session.email = candidate.email;
        req.session.editalId = candidate.idEdital;
        req.session.uid = candidate.id;
        req.session.editalPosition = candidate.posicaoEdital;
        return res.status(200).send();
      } catch (err) {
        return res.status(500).send();
      }
    default:
      return res.status(405).send();
  }
};

function logout(req, res) {
  switch (req.method) {
    case "POST":
      req.session.destroy();
      return res.status(200).redirect("/selecaoppgi/entrar");
    default:
      return res.status(404).send();
  }
};

const formProposta = async (req, res) => {
  switch (req.method) {
    case "POST": {
        const id = req.session.uid;
        const hasProposta = req.files["CartaAceiteOrientador"] !== undefined;
        if (!hasProposta) { 
          if(fs.existsSync(path.join("uploads", "candidatos", id.toString(), "CartaAceiteOrientador.pdf"))){
            fs.unlinkSync(path.join("uploads", "candidatos", id.toString(), "CartaAceiteOrientador.pdf"));
          }
        }
        const candidate = {
          ...req.body, 
          posicaoEdital: 4,
        };
        await candidatoService.update({
          id,
          data: candidate,
        }).catch((err) => {
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

function verificarArquivoDiretorio(diretorio, nomeArquivo) {
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

async function editCandidate(req, res) {
  switch (req.method) {
    case "PUT":
      return res.status(200).send();
    default:
      return res.status(405).send();
  }
}

async function backToStart(req, res) {
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
const forms = async (req, res) => {
  switch (req.method) {
    case "GET":
      if (!req.session.uid || !req.session.editalPosition) {
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

      if (editalPosition === 1) {
        return res.status(200).render("selecaoppgi/formDados", {
          ...locals,
          ...candidate.get(),
          csrfToken: req.csrfToken(),
        });
      }

      if (editalPosition === 2) {
        const caminhoDiretorioUsuario = path.join(
          "uploads",
          "candidatos",
          uid.toString()
        );
        const experienciasAcademicas = await candidatoExperienciaAcademicaService.listByCandidateId(uid);
        return res.render("selecaoppgi/forms2", {
          ...locals,
          ...candidate.get(),
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
          experienciasAcademicas: experienciasAcademicas.map((experiencia) => experiencia.toJSON())
        });
      }

      if (req.session.editalPosition === 3) {
        const linhas = await linhasDePesquisaService.list();
        return res.render("selecaoppgi/forms3", {
          ...locals,
          ...candidate.get(),
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
function parseDate(dateString) {
  const parts = dateString.split("/");
  // Supondo que a data está no formato DD/MM/YYYY
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Mês em JavaScript é 0-indexed
  const year = parseInt(parts[2], 10);

  return new Date(year, month, day);
}
const form1 = async (req, res) => {
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

const form2 = async (req: Request, res: Response) => {
  switch (req.method) {
    case "POST": {
      try {
        let VitaePDF = null;
        let Prova = null;
        if (req.files && req.files.Prova !== undefined) {
          Prova = req.files.Prova[0];
        }
        if (req.files && req.files.VitaePDF !== undefined) {
          VitaePDF = req.files.VitaePDF[0];
        }
        const { uid } = req.session;
        console.log(req.body);
        const experienciaInstituicao = req.body.experienciaInstituicao;
        const experienciasAtividade = req.body.experienciaAtividade;
        const experienciasPeriodo = req.body.experienciaPeriodo;
        console.log(experienciaInstituicao, experienciasAtividade, experienciasPeriodo);

        if(experienciaInstituicao && experienciasAtividade && experienciasPeriodo){
          await candidatoExperienciaAcademicaService.dropAllByCandidateId(uid)
          await Promise.all(
            experienciaInstituicao.map((_, index) => {
              return candidatoExperienciaAcademicaService.create({
                data: {
                  instituicao: experienciaInstituicao[index],
                  atividade: experienciasAtividade[index],
                  periodo: experienciasPeriodo[index],
                },
                idCandidato: uid,
              });
            })
          ); 
        }
        const candidato = { 
          ...req.body,
          ...(VitaePDF ? { VitaePDF: VitaePDF.path } : {}),
          ...(Prova ? { Prova: Prova.path } : {}),
          posicaoEdital: 3,
        };
        await candidatoService.update({
          id: uid,
          data: candidato,
        }).catch((err) => {
          return res.status(500).send();
        });

        req.session.editalPosition = 3;
        return res.status(200).send();
      } catch(err) {
        console.error(err)
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
    case "GET": {
      const data = await candidatePublicacaoService.ListarPublicacoesCandidate(
        req.session.uid
      );

      const periodicos = data.periodicos.map((periodico) => periodico.toJSON());
      const conferencias = data.conferencias.map((conferencia) =>
        conferencia.toJSON()
      );

      data.conferencias.forEach((publicacao) => {
        console.log(publicacao.toJSON());
      });

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
            req.session.uid,
            periodicos,
            1
          )
        );
        promises.push(
          candidatePublicacaoService.adicionarVarios(
            req.session.uid,
            eventos,
            2
          )
        );
        promises.push(
          candidatePublicacaoService.adicionarVarios(req.session.uid, livros, 3)
        );
        promises.push(
          candidatePublicacaoService.adicionarVarios(
            req.session.uid,
            capitulos,
            4
          )
        );
        promises.push(
          candidatePublicacaoService.adicionarVarios(req.session.uid, outras, 5)
        );
        promises.push(
          candidatePublicacaoService.adicionarVarios(
            req.session.uid,
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

const candidates = async (req: Request, res: Response) => {
  switch (req.method) {
    case "GET":
      return res.json({
        candidates: await CandidateService.list(),
      });
    default:
      return res.status(400).send();
  }
};

const voltar = async (req: Request, res: Response) => {
  switch (req.method) {
    case "POST": {
      const id = req.session.uid;
      const editalPosicao = parseInt(req.session.editalPosition, 10) - 1;
      await candidatoService.backEdital({
        id,
      });
      req.session.editalPosition = editalPosicao;
      return res.status(200).send();
    }
    default:
      return res.status(405).send();
  }
};

const refresh = async (req, res) => {
  res.redirect("/selecaoppgi/formulario");
};
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
  backToStart
};
