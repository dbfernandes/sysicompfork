import EditalService from '../services/editalService'
import CandidateService from '../services/candidateService'
import candidatePublicacaoService from '../services/candidatePublicacaoService'
import linhasDePesquisaService from '../services/linhasDePesquisaService'

const locals = {
  layout: 'selecaoppgi'
}

const begin = async (req, res) => {
  switch (req.method) {
    case 'GET':
      return res.render('selecaoppgi/begin', {
        ...locals
      })
    default:
      return res.status(404).send('Erro 400')
  }
}

// Rotas para cadastro de candidato
const signUp = async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const editais = await EditalService.listEdital()
      const listEditais = editais.map((edital) => edital.dataValues)

      return res.render('selecaoppgi/signin', {
        csrfToken: req.csrfToken(),
        editais: listEditais,
        errorSignin: null,
        ...locals
      })
    }
    case 'POST': {
      const {
        email, senha, edital
      } = req.body

      if (!email || !senha || !edital) {
        return res.status(400).json({
          error: 'Dados incompletos ou mal formatados'
        })
      }

      let responseError = null

      const candidate = await CandidateService
        .create({
          email,
          password: senha,
          editalNumber: edital
        })
        .catch((err) => {
          responseError = err
        })

      if (!candidate) {
        return res.status(400).json({
          error: responseError.message
        })
      }
      return res.status(200).redirect('/selecaoppgi')
    }
    default:
      return res.status(404).send()
  }
}

const login = async (req, res) => {
  switch (req.method) {
    case 'GET': {
      if (req.session.email) {
        res.redirect('/selecaoppgi/formulario')
      }
      try {
        const editais = await EditalService.listEdital()
        const listEditais = editais.map((edital) => edital.dataValues)
        return res.render('selecaoppgi/login', {
          ...locals,
          csrfToken: req.csrfToken(),
          editais: listEditais
        })
      } catch (err) {
        return res.status(500).send()
      }
    }
    case 'POST':
      try {
        const {
          email, senha, edital
        } = req.body

        if (!email || !senha || !edital) {
          return res.status(400).json({
            error: 'Dados incompletos ou mal formatados'
          })
        }

        const cadidate = await CandidateService
          .auth({
            email,
            password: senha,
            editalNumber: edital
          })
        const editais = await EditalService.listEdital()
        const listEditais = editais.map((edital) => edital.dataValues)
        if (!cadidate) {
          return res.status(406).render('selecaoppgi/login', {
            ...locals,
            csrfToken: req.csrfToken(),
            editais: listEditais,
            message: 'Login, Senha ou Edital incorretos',
            type: 'danger'
          })
        }

        req.session.email = cadidate.email
        req.session.editalId = cadidate.editalId
        req.session.uid = cadidate.id
        req.session.editalPosition = cadidate.editalPosition
        return res.status(200).send()
      } catch (err) {
        return res.status(500).send()
      }
    default:
      return res.status(404).send()
  }
}

function logout (req, res) {
  switch (req.method) {
    case 'POST':
      console.log('logout')
      req.session.destroy()
      return res.status(200).redirect('/selecaoppgi/entrar')
    default:
      return res.status(404).send()
  }
}

const formProposta = async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const candidate = await CandidateService.findOne({
        id: req.session.uid
      })
      const linhas = await linhasDePesquisaService.list()

      return res.render('selecaoppgi/forms3', {
        ...locals,
        csrfToken: req.csrfToken(),
        editalPosicao: req.session.editalPosition,
        email: req.session.email,
        id: req.session.uid,
        linhasPesquisa: linhas,
        linhaPesquisaId: candidate.linhaDePesquisaId
      })
    }
    case 'POST': {
      console.log('POST PROPOSTA')
      try {
        const data = req.body
        const id = req.session.uid
        const candidate = {
          linhaDePesquisaId: data.linhaDePesquisaId
        }
        await CandidateService.postProposta({
          Candidato: candidate,
          id
        })
        req.session.editalPosition = 4
        return res.status(200).send()
      } catch (err) {
        return res.status(500).send()
      }
    }
    default:
      return res.status(400).send()
  }
}
const fs = require('fs')
const path = require('path')

function verificarArquivoDiretorio (diretorio, nomeArquivo) {
  const caminhoArquivo = path.join(diretorio, nomeArquivo)
  try {
    // Verifica se o arquivo existe
    fs.accessSync(caminhoArquivo, fs.constants.F_OK)
    return true
  } catch (err) {
    // Se houver algum erro ao acessar o arquivo, retorna false
    return false
  }
}
const forms = async (req, res) => {
  switch (req.method) {
    case 'GET':
      if (!req.session.email) {
        res.redirect('/selecaoppgi/entrar')
      }
      console.log(req.session)
      if (req.session.editalPosition === 1) {
        const id = req.session.uid
        const candidate = await CandidateService.findOne({
          id
        })
        return res.render('selecaoppgi/formDados', {
          ...locals,
          Nome: candidate.Nome,
          Nascimento: candidate.Nascimento ? candidate.Nascimento : '',
          Sexo: candidate.Sexo,
          NomeSocial: candidate.NomeSocial,
          CEP: candidate.CEP,
          UF: candidate.UF,
          Endereco: candidate.Endereco,
          Cidade: candidate.Cidade,
          Bairro: candidate.Bairro,
          Nacionalidade: candidate.Nacionalidade,
          Telefone: candidate.Telefone,
          TelefoneSecundario: candidate.TelefoneSecundario,
          ComoSoube: candidate.ComoSoube,
          Curso: candidate.CursoDesejado,
          Regime: candidate.RegimeDedicacao,
          Cotista: candidate.Cotista,
          CotistaTipo: candidate.CotistaTipo,
          Condicao: candidate.Condicao,
          CondicaoTipo: candidate.CondicaoTipo,
          Bolsista: candidate.Bolsista,
          editalPosicao: req.session.editalPosition,
          email: req.session.email,
          id: req.session.uid,
          csrfToken: req.csrfToken()
        })
      }
      if (req.session.editalPosition === 2) {
        const candidate = await CandidateService.findOne({
          id: req.session.uid
        })
        console.log('teste form2', candidate)
        const caminhoDiretorioUsuario = path.join('uploads', 'candidatos', req.session.uid.toString())

        return res.render('selecaoppgi/forms2', {
          ...locals,
          cursoGraduacao: candidate.CursoGraduacao,
          instituicao: candidate.InstituicaoGraduacao,
          anoEgresso: candidate.AnoEgressoGraduacao,
          cursoPos: candidate.CursoPos,
          tipoCursoPos: candidate.CursoPosTipo,
          instituicaoPos: candidate.CursoInstituicaoPos,
          anoEgressoPos: candidate.CursoAnoEgressoPos,
          editalPosicao: req.session.editalPosition,
          email: req.session.email,
          id: req.session.uid,
          Curso: candidate.CursoDesejado,
          csrfToken: req.csrfToken(),
          hasCurriculum: verificarArquivoDiretorio(caminhoDiretorioUsuario, 'VitaePDF.pdf')
        })
      }

      if (req.session.editalPosition === 3) {
        formProposta(req, res)
      }
      if (req.session.editalPosition === 4) {
        return res.render('selecaoppgi/formConfirmacao', {
          ...locals,
          editalPosicao: req.session.editalPosition,
          email: req.session.email,
          id: req.session.uid,
          csrfToken: req.csrfToken()
        })
      }
    // case 'POST': {
    //   if (req.session.editalPosition == 1) {
    //     // console.log(req.body)
    //   }
    // }
    //   break
  }
}

const form1 = async (req, res) => {
  switch (req.method) {
    case 'GET':
      res.send('oi')
      break
    case 'POST': {
      console.log('******************************************** FORM 1 POST')
      const data = req.body.data
      // console.log(req.session.editalPosition)
      if (req.session.editalPosition === 1) {
        console.log('teste form1')
        const Candidato = {
          Nome: data.Nome,
          Nascimento: data.Nascimento,
          Sexo: data.Sexo,
          NomeSocial: data.NomeSocial,
          CEP: data.CEP,
          UF: data.UF,
          Endereco: data.Endereco,
          Cidade: data.Cidade,
          Bairro: data.Bairro,
          Nacionalidade: data.Nacionalidade,
          TelefonePrincipal: data.TelefonePrincipal,
          TelefoneAlternativo: data.TelefoneAlternativo,
          ComoSoube: data.ComoSoube,
          CursoDesejado: data.CursoDesejado,
          RegimeDedicacao: data.RegimeDedicacao,
          Cotista: data.Cotista,
          CotistaTipo: data.CotistaTipo,
          Condicao: data.Condicao,
          CondicaoTipo: data.CondicaoTipo,
          Bolsa: data.Bolsa
        }
        const id = req.session.uid

        const candidate = await CandidateService
          .form1({
            Candidato,
            id
          })

        req.session.editalPosition = candidate.editalPosition
        res.status(200).send()

        break
      }

      return res.send('Erro 400 begin')
    }
  }
}

const form2 = async (req, res) => {
  switch (req.method) {
    case 'GET':
      break
    case 'POST': {
      try {
        let VitaePDF = null
        let Prova = null
        if (req.files && req.files.Prova !== undefined) {
          Prova = req.files.Prova[0]
        }
        if (req.files && req.files.VitaePDF !== undefined) {
          VitaePDF = req.files.VitaePDF[0]
        }
        const id = req.session.uid

        const Candidato = {
          CursoGraduacao: req.body.Curso,
          InstituicaoGraduacao: req.body.Instituicao,
          AnoEgressoGraduacao: req.body.AnoEgresso,
          CursoPos: req.body['Curso-Pos'],
          CursoPosTipo: req.body.CursoTipo,
          CursoInstituicaoPos: req.body.InstituicaoPos,
          CursoAnoEgressoPos: req.body.AnoEgressoPos,
          ...(VitaePDF ? { VitaePDF: VitaePDF.path } : {}),
          ...(Prova ? { Prova: Prova.path } : {})
        }

        const candidate = CandidateService.form2({ Candidato, id })
        req.session.editalPosition = 3
        res.status(200).send()
      } catch { }
    }
  }
}

const formPublicacoes = async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const data = await candidatePublicacaoService.ListarPublicacoesCandidate(req.session.uid)

      const periodicos = data.periodicos.map((periodico) => periodico.toJSON())
      const conferencias = data.conferencias.map((conferencia) => conferencia.toJSON())

      data.conferencias.forEach(publicacao => {
        console.log(publicacao.toJSON())
      })

      return res.render('selecaoppgi/forms2', {
        message: 'Dados salvos com sucesso',
        editalPosicao: req.session.editalPosition,
        email: req.session.email,
        id: req.session.uid,
        csrfToken: req.csrfToken(),
        periodicos,
        conferencias
      })
    }

    case 'POST':
      try {
        const dados = req.body
        console.log(dados)
        const periodicos = dados.publicacoes['ARTIGO-PUBLICADO']
        const eventos = dados.publicacoes['TRABALHO-EM-EVENTOS']
        const livros = dados.publicacoes['LIVRO-PUBLICADO-OU-ORGANIZADO']
        const capitulos = dados.publicacoes['CAPITULO-DE-LIVRO-PUBLICADO']
        const outras = dados.publicacoes['OUTRA-PRODUCAO-BIBLIOGRAFICA']
        const prefacios = dados.publicacoes['PREFACIO-POSFACIO']

        console.log('Capitulos', prefacios)

        const promises = []

        promises.push(candidatePublicacaoService.adicionarVarios(req.session.uid, periodicos, 1))
        promises.push(candidatePublicacaoService.adicionarVarios(req.session.uid, eventos, 2))
        promises.push(candidatePublicacaoService.adicionarVarios(req.session.uid, livros, 3))
        promises.push(candidatePublicacaoService.adicionarVarios(req.session.uid, capitulos, 4))
        promises.push(candidatePublicacaoService.adicionarVarios(req.session.uid, outras, 5))
        promises.push(candidatePublicacaoService.adicionarVarios(req.session.uid, prefacios, 6))

        const results = await Promise.allSettled(promises)

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            console.log(`Operação ${index + 1} concluída com sucesso.`)
            console.log('Resultado:', result.value)
          } else {
            console.error(`Operação ${index + 1} falhou.`)
            console.error('Erro:', result.reason)
          }
        })

        res.status(200).send('Dados salvos com sucesso.')
      } catch {

      }

// res.status(400).send(data);
  }
}

const candidates = async (req, res) => {
  switch (req.method) {
    case 'GET':
      return res.json({
        candidates: await CandidateService.list()
      })
    default:
      return res.status(400).send()
  }
}

const voltar = async (req, res) => {
  switch (req.method) {
    case 'POST': {
      const id = req.session.uid
      const editalPosicao = parseInt(req.session.editalPosition, 10) - 1
      await CandidateService.backEdital({
        id
      })
      req.session.editalPosition = editalPosicao
      return res.status(200).send()
    }
    default:
      return res.status(400).send()
  }
}

const refresh = async (req, res) => {
  console.log('asdasdsadasd')
  res.redirect('/selecaoppgi/formulario')
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
  formProposta
}
