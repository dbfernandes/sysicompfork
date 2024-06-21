import { Request, Response } from 'express'
import multer from 'multer'
import editalService from '../edital/edital.service'
import candidateService from '../candidate/candidate.service'
import candidatePublicacaoService from '../candidate/candidatePublicacao.service'

const locals = {
  layout: 'selecaoppgi'
}

const begin = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      return res.render('selecaoppgi/begin', {
        ...locals
      })
    case 'POST':
      return res.send('Erro 400')
  }
}

const signin = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET': {
      const editais = await editalService.listEdital()
      return res.render('selecaoppgi/signin', {
        csrfToken: req.csrfToken(),
        ...locals,
        editais: editais.map((edital) => {
          return {
            ...edital
          }
        }),
        errorSignin: null
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

      const candidate = await candidateService
        .create(
          (email as string),
          (senha as string),
          (edital as string)
        )
        .catch((err: any) => {
          responseError = err
        })

      if (!candidate) {
        return res.status(400).json({
          error: responseError!.message
        })
      }
      return res.status(200).redirect('/selecaoppgi')
    }
    default:
      return res.status(404).send()
  }
}

const login = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET': {
      const editais = await editalService.listEdital();
      return res.render('selecaoppgi/login', {
        csrfToken: req.csrfToken(),
        teste: 'teste',
        ...locals,
        editais: editais.map((edital) => {
          return {
            ...edital
          }
        })
      })
    }
    case 'POST':
      try {
        const { email, senha, edital } = req.body;

        console.log({
          email,
          senha,
          edital,
        });

        if (!email || !senha || !edital) {
          return res.status(400).json({
            error: 'Dados incompletos ou mal formatados',
          });
        }
        const IsCandidateValid = await candidateService.auth(
          email,
          senha,
          edital
        );

        const editais2 = await editalService.listEdital();

        if (!editais2) {
          return res.status(404).send('Não encontrou premios');
        }

        if (!IsCandidateValid) {
          console.log('error teste');
          console.log(req.csrfToken());

          return res.render('selecaoppgi/login', {
            csrfToken: req.csrfToken(),
            message: 'Usuário não cadastrado',
            type: 'danger',
            ...locals,
            // editais: editais2.map((edital: { get: () => any }) => {
            //   return {
            //     ...edital.get()
            //   }
            // })
            editais: editais2.map((edital) => {
              return {
                ...edital
              }
            })
          })
        }

        (req.session as any).email = IsCandidateValid.email;
        (req.session as any).editalId = IsCandidateValid.editalId;
        (req.session as any).uid = IsCandidateValid.id;
        (req.session as any).editalPosition = IsCandidateValid.editalPosition;
        return res.status(200).send();
      } catch (err) {
        console.log(err);
        return res.status(500).send();
      }

    default:
      return res.status(404).send();
  }
};

const forms = async (req: Request, res: Response) => {
  console.log(req.method)
  console.log('teste forms')

  switch (req.method) {
    case 'GET':
      const id = parseInt(req.session.uid!)
      if (!(req.session as any).email) {
        res.redirect('/selecaoppgi/entrar')
      }
      if ((req.session as any).editalPosition === 1) {
        // console.log((req.session as any).email)
        // console.log((req.session as any).editalId)
        // console.log(req.session.uid)
        const candidate = await candidateService.findOneCandidate(id)
        // console.log(candidate)
        return res.render('selecaoppgi/forms1', {
          ...locals,
          Nome: candidate.Nome,
          Nascimento: candidate.Nascimento,
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
          Curso: candidate.CursoGraduacao,
          Regime: candidate.Regime,
          Cotista: candidate.Cotista,
          CotistaTipo: candidate.CotistaTipo,
          Condicao: candidate.Condicao,
          CondicaoTipo: candidate.CondicaoTipo,
          Bolsista: candidate.Bolsista,
          editalPosicao: (req.session as any).editalPosition,
          email: (req.session as any).email,
          id: req.session.uid,
          csrfToken: req.csrfToken()
        })
      }
      if ((req.session as any).editalPosition === 2) {
        const candidate = await candidateService.findOneCandidate(id)

        return res.render('selecaoppgi/forms2', {
          ...locals,
          cursoGraduacao: candidate.CursoGraduacao,
          instituicao: candidate.InstituicaoGraduacao,
          anoEgresso: candidate.AnoEgressoGraduacao,
          cursoPos: candidate.CursoPos,
          tipoCursoPos: candidate.CursoPos,
          instituicaoPos: candidate.CursoInstituicaoPos,
          anoEgressoPos: candidate.CursoAnoEgressoPos,
          editalPosicao: (req.session as any).editalPosition,
          email: (req.session as any).email,
          id: req.session.uid,
          Curso: candidate.CursoGraduacao,
          csrfToken: req.csrfToken()
        })
      }

      if ((req.session as any).editalPosition === 3) {
        await candidateService.findOneCandidate(id)

        console.log('*************************************************')
        return res.render('selecaoppgi/forms3', {
          ...locals,
          editalPosicao: (req.session as any).editalPosition,
          email: (req.session as any).email,
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

const form1 = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      res.send('oi')
      break
    case 'POST': {
      console.log('******************************************** FORM 1 POST')
      const data = req.body.data
      // console.log(req.session.editalPosition)
      if ((req.session as any).editalPosition === 1) {
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
        const id = parseInt(req.session.uid!)

        const candidate = await candidateService.form1(Candidato, id);

        (req.session as any).editalPosition = candidate!.editalPosition
        res.status(200).send()

        break
      }

      return res.send('Erro 400 begin')
    }
  }
}

const form2 = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      break
    case 'POST': {
      try {
        console.log('form2post')

        let VitaePDF = null
        let Prova = null
        console.log(req.files)
        if (typeof req.files === 'object' && 'Prova' in req.files) {
          Prova = req.files.Prova[0]
        }
        if (typeof req.files === 'object' && 'VitaePDF' in req.files) {
          VitaePDF = req.files.VitaePDF[0]
        }

        if (Prova) {
          const caminhoDoArquivoVittae = VitaePDF!.path

          const ProvaPDF = Prova.path

          const Candidato = {
            CursoGraduacao: req.body.Curso,
            InstituicaoGraduacao: req.body.Instituicao,
            AnoEgressoGraduacao: req.body.AnoEgresso,
            CursoPos: req.body.CursoPos,
            CursoPosTipo: req.body.TipoCursoPos,
            CursoInstituicaoPos: req.body.InstituicaoPos,
            CursoAnoEgressoPos: req.body.AnoEgressoPos,
            VitaePDF: caminhoDoArquivoVittae,
            Prova: ProvaPDF
          }
          console.log(Candidato)
          console.log('Caminho do arquivo:', ProvaPDF)
        } else {
          console.log('FILES__________________')
          console.log(req.files)
          console.log('EndFILES__________________')
          console.log(req.body)
          console.log('EndBody__________________')

          console.log('Nenhum arquivo de prova encontrado.')
        }

        res.status(200).send()
      } catch { }
    }
  }
}

const formPublicacoes = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET': {
      const uid = Number(req.session.uid)
      const data = await candidatePublicacaoService.ListarPublicacoesCandidate(uid)

      // const periodicos = data.periodicos.map((periodico: { toJSON: () => any }) => periodico.toJSON())
      const periodicos = data.periodicos.map((periodico: any) => periodico.toJSON())
      // const conferencias = data.conferencias.map((conferencia: { toJSON: () => any }) => conferencia.toJSON())
      const conferencias = data.conferencias.map((conferencia: any) => conferencia.toJSON())

      // data.conferencias.forEach((publicacao: { toJSON: () => any }) => {
      //   console.log(publicacao.toJSON())
      // })
      data.conferencias.forEach((publicacao: any) => {
        console.log(publicacao.toJSON())
      })

      return res.render('selecaoppgi/forms2', {
        message: 'Dados salvos com sucesso',
        editalPosicao: (req.session as any).editalPosition,
        email: (req.session as any).email,
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

        const uid = Number(req.session.uid)

        promises.push(candidatePublicacaoService.adicionarVarios(uid, periodicos, 1))
        promises.push(candidatePublicacaoService.adicionarVarios(uid, eventos, 2))
        promises.push(candidatePublicacaoService.adicionarVarios(uid, livros, 3))
        promises.push(candidatePublicacaoService.adicionarVarios(uid, capitulos, 4))
        promises.push(candidatePublicacaoService.adicionarVarios(uid, outras, 5))
        promises.push(candidatePublicacaoService.adicionarVarios(uid, prefacios, 6))

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

const candidates = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      return res.json({
        candidates: await candidateService.list()
      })
    default:
      return res.status(400).send()
  }
}

const voltar = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'POST': {
      const id = req.body.id
      console.log(id)
      let editalPosicao = req.body.editalPosicao
      console.log(editalPosicao)
      editalPosicao = parseInt(editalPosicao, 10) - 1

      // res.redirect('/selecaoppgi')
      console.log(editalPosicao)

      const candidate = await candidateService.back(id);
      (req.session as any).editalPosition = editalPosicao
      res.status(200).send()
    }
      break
    default:
      return res.status(400).send()
  }
}

const refresh = async (req: Request, res: Response) => {
  console.log('asdasdsadasd')
  res.redirect('/selecaoppgi/formulario')
}
export default {
  begin,
  signin,
  login,
  forms,
  form1,
  form2,
  candidates,
  voltar,
  refresh,
  formPublicacoes
}
