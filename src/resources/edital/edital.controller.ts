import {Response, Request} from 'express'
import { CreateEditalDto, UpdateEditalDto } from './edital.types'
import EditalService from './edital.service'
import editalGerarPlanilha from '../../utils/editalGerarPlanilha'
import path from 'path'
/* eslint-disable camelcase */
const fs = require('fs')
const os = require('os')
import moment from 'moment-timezone'
const locals = {
  layout: 'selecaoppgi'
}

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}


const addEditalSelecao = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      return res.render(resolveView('addNewSelecao'), {
        csrfToken: req.csrfToken(),
        tipoUsuario: req.session.tipoUsuario,
        nome: req.session.nome,
        ...locals
      })

    case 'POST': {
      const novoEdital: CreateEditalDto = {
        editalId: req.body.num_edital,
        documento: req.body.documento,
        dataInicio: req.body.data_inicio,
        dataFim: req.body.data_fim,
        cartaRecomendacao: req.body.carta_recomendacao,
        cartaOrientador: req.body.carta_orientador,
        vagaMestrado: Number(req.body.vaga_regular_mestrado),
        cotasMestrado: Number(req.body.vaga_suplementar_mestrado),
        vagaDoutorado: Number(req.body.vaga_regular_doutorado),
        cotasDoutorado: Number(req.body.vaga_suplementar_doutorado),
        status: '',
        inscricoesEncerradas: 0,
        inscricoesIniciadas: 0
      }
      try {
        await EditalService.criarEdital(novoEdital)
      } catch (error: any) {
        return res.status(400).json({
          csrfToken: req.csrfToken(),
          error: error.message,
          req: req.body
        }).send({ message: error.message })
      }
      
      return res.redirect('/edital/listEdital')
    }
      break

    case 'PUT':
      return res.status(200).send({
        message: 'TO-DO'
      })

    default:
      return res.status(404).send()
  }
}

const listEditalSelecao = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      return res.render(resolveView('listSelecao'), {
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        editais: await EditalService.listEdital(),
        tipoUsuario: req.session.tipoUsuario
      })

    case 'POST': {
      const editais = await EditalService.listEdital().catch((err) => {
        return res.status(400).json({
          error: err.message
        })
      })
      return res.status(200).json(editais)
    }
    default:
      return res.status(404).send()
  }
}

const deleteEdital = async (req: Request, res: Response) => {
   switch (req.method) {
      case "DELETE":
         const { id } = req.params;

         try {
            await EditalService.delete(id);  
         }catch (error: any) {
            return res.status(400).json({
               csrfToken: req.csrfToken(),
               error: error.message,
            });
        }

      default:
         return res.status(404).send();
   }
};

const arquivarEdital = async (req: Request, res: Response) => {
  const { id_edital } = req.params

  console.log('no controler :' + id_edital)
  switch (req.method) {
    case 'PUT': {
      const { status } = await req.body

      const edital_update = await EditalService.arquivar(id_edital, {
        status
      }).catch((err) => {
        return res.status(400).json({
          error: err.message
        })
      })
      return res.status(200).send(edital_update)
    }
    default:
      return res.status(404).send()
  }
}

const viewEdital = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET': {
      const {
        id
      } = req.params
      const edital = await EditalService.getEdital(id).catch((err) => {
        return res.status(400).json({
          error: err.message
        })
      })
      return res.render(resolveView('viewSelecao'), {
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        ...locals,
        edital: edital,
        tipoUsuario: req.session.tipoUsuario
      })
    }
  }
}

const updateEdital = async (req: Request, res: Response) => {
  const { id_update } = req.params
  switch (req.method) {
    case 'GET': {
      const edital = await EditalService.getEdital(id_update).catch((err) => {
        return res.status(400).json({
          error: err.message
        })
      })
      return res.render(resolveView('editSelecao'), {
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        ...locals,
        edital: edital,
        tipoUsuario: req.session.tipoUsuario
      })
    }
    case 'PUT':{
      const editalAtualizado: UpdateEditalDto = {
        editalId: req.body.num_edital,
        documento: req.body.documento,
        dataInicio: req.body.data_inicio,
        dataFim: req.body.data_fim,
        cartaRecomendacao: req.body.carta_recomendacao,
        cartaOrientador: req.body.carta_orientador,
        vagaMestrado: parseInt(req.body.vaga_regular_mestrado),
        cotasMestrado: parseInt(req.body.vaga_suplementar_mestrado),
        vagaDoutorado: parseInt(req.body.vaga_regular_doutorado),
        cotasDoutorado: parseInt(req.body.vaga_suplementar_doutorado),
        status: '',
        inscricoesEncerradas: 0,
        inscricoesIniciadas: 0,
        // updatedAt: new Date (moment.tz('America/Manaus').format('YYYY-MM-DD HH:mm:ss'))
      }
      console.log(editalAtualizado)
      const updateEdital = await EditalService.update(id_update, editalAtualizado).catch((err) => {
        return res.status(400).json({
          error: err.message
        })
      })
      return res.status(200).send(updateEdital)
    }
    default:
      return res.status(404).send()
  }
}

const listCandidatesEdital = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':{
      const {
        id
      } = req.params
      const edital = await EditalService.getEdital(id).catch((err) => {
        return res.status(400).json({
          error: err.message
        })
      })
      return res.render(resolveView('listCandidates'), {
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        ...locals,
        edital: edital,
        tipoUsuario: req.session.tipoUsuario
      })
    }
    case 'POST': {
      const {
        id_edital
      } = req.params
      const candidates = await EditalService.listCandidates(id_edital).catch(
        (err) => {
          return res.status(400).json({
            error: err.message
          })
        }
      )
      return res.status(200).json(candidates)
    }
  }
}

const editalCandidates = async (req: Request, res: Response) => {
  const editalID = req.params.id
  const candidates = await EditalService.listCandidates(editalID).catch(
    (err: any) => {
      return res.status(400).json({
        error: err.message
      })
    }
  )
  // Isso aqui não deveria estar no controller, devia estar no service
  let quantidaDeInscricaoAndamento: number = 0
  let quantidaIncricaoFinalizada: number = 0
  if (Array.isArray(candidates) && candidates.length === 0) {
    quantidaDeInscricaoAndamento = candidates.filter((candidate: { editalPosition: number | null }) => candidate.editalPosition! < 4).length
    quantidaIncricaoFinalizada = candidates.filter((candidate: { editalPosition: number | null }) => candidate.editalPosition! === 4).length;
  }
  return res.render(resolveView('listCandidates'), {
    csrfToken: req.csrfToken(),
    nome: req.session.nome,
    ...locals,
    candidates,
    editalID,
    tipoUsuario: req.session.tipoUsuario,
    quantidaDeInscricaoAndamento,
    quantidaIncricaoFinalizada

  })
}

const geraPlanilha = async (req: Request, res: Response) => {
   const planilha = await editalGerarPlanilha.gerarPlanilha(req.params.id);
   return res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=planilha.xlsx',
      'Content-Length': planilha.length
   }).status(200).send(planilha);
}

const gerarCandidatoPDF = async (req: Request, res: Response) => {
   const candidate = await EditalService.getCandidate(req.params.id);
  //  const base64Documento = candidate[req.query.documento];
  //  const docPDF = Buffer.from(base64Documento.toString('utf-8'),'base64')
   
  //  return res.set({
  //     'Content-Type': 'application/pdf',
  //     'Content-Disposition': `attachment; filename=index.pdf`,
  //     'Content-Length': docPDF.length
  //  }).status(200).send(docPDF);
}
// Refazer função
const getAllCandidatesDocuments = async (req: Request, res: Response) => {
  // try {
  //   // Pegue todos os candidatos do edital
  //   const candidates = await EditalService.listCandidates(req.params.id)

  //   // Crie um diretório temporário para armazenar os documentos
  //   const tempDirPath = path.join(os.tmpdir(), 'documents-')
  //   if (fs.existsSync(tempDirPath)) fs.rmdirSync(tempDirPath, { recursive: true })
  //   fs.mkdirSync(tempDirPath)

  //   // Para cada candidato, crie um arquivo PDF com os documentos
  //   const candidatesDocuments = []
  //   for (const candidate of candidates) {
  //     if (candidate.Curriculum) {
  //       const docCurriculumPath = path.join(tempDirPath, `${candidate.Nome}-Curriculum.pdf`)
  //       fs.writeFileSync(docCurriculumPath, candidate.Curriculum.toString('utf-8'), 'base64')
  //       candidatesDocuments.push({ path: docCurriculumPath, name: `${candidate.Nome}/${candidate.Nome}-Curriculum.pdf` })
  //     }

  //     if (candidate.CartaDoOrientador) {
  //       const docCartaOrientadorPath = path.join(tempDirPath, `${candidate.Nome}-CartaDoOrientador.pdf`)
  //       fs.writeFileSync(docCartaOrientadorPath, candidate.CartaDoOrientador.toString('utf-8'), 'base64')
  //       candidatesDocuments.push({ path: docCartaOrientadorPath, name: `${candidate.Nome}/${candidate.Nome}-CartaDoOrientador.pdf` })
  //     }

  //     if (candidate.PropostaDeTrabalho) {
  //       const docPropostaPath = path.join(tempDirPath, `${candidate.Nome}-PropostaDeTrabalho.pdf`)
  //       fs.writeFileSync(docPropostaPath, candidate.PropostaDeTrabalho.toString('utf-8'), 'base64')
  //       candidatesDocuments.push({ path: docPropostaPath, name: `${candidate.Nome}/${candidate.Nome}-PropostaDeTrabalho.pdf` })
  //     }
  //   }


  //     // Compacte todos os arquivos em um arquivo ZIP
  //     const zipFilePath = path.join(tempDirPath, 'documentos.zip');
  //     await res.zip(candidatesDocuments, zipFilePath);

  //     // Remova o diretório temporário
  //     fs.rmdirSync(tempDirPath, { recursive: true });

  //     // Envie o arquivo ZIP para o cliente
  //     return res.download(zipFilePath, 'documentos.zip');
  // } catch (error: any) {
  //   res.status(400).json({
  //     error: error.message
  //   })
  // }
  
  /*Identifica usuarios*/
  /*Busca documentos dos candidatos*/
  /*Cria pastas temporaria para cada candidato*/
  /*Cria arquivos PDF*/
  /*Compacta arquivos em ZIP*/
  /*Envia ZIP para o cliente*/
  /*Remove pasta temporaria e arquivos temporarios*/

}
//Refazer função
const getAllDocumentsFromOneCandidate = async (req: Request, res: Response) => {  
  // const candidate = await EditalService.getCandidate(req.params.id)
  // try {
  //   const tempDirPath = path.join(os.tmpdir(), 'documents-')
  //   if (fs.existsSync(tempDirPath)) fs.rmdirSync(tempDirPath, { recursive: true })
  //   fs.mkdirSync(tempDirPath)

  //     const candidateDocuments = [];

  //     if (candidate.Curriculum) {
  //        const docCurriculumPath = path.join(tempDirPath, 'Curriculum.pdf');
  //        fs.writeFileSync(docCurriculumPath, candidate.Curriculum.toString('utf-8'), 'base64');
  //        candidateDocuments.push({ path: docCurriculumPath, name: 'Curriculum.pdf' });
  //     }

  //     if (candidate.CartaDoOrientador) {
  //        const docCartaOrientadorPath = path.join(tempDirPath, 'CartaDoOrientador.pdf');
  //        fs.writeFileSync(docCartaOrientadorPath, candidate.CartaDoOrientador.toString('utf-8'), 'base64');
  //        candidateDocuments.push({ path: docCartaOrientadorPath, name: 'CartaDoOrientador.pdf' });
  //     }

  //     if (candidate.PropostaDeTrabalho) {
  //        const docPropostaPath = path.join(tempDirPath, 'PropostaDeTrabalho.pdf');
  //        fs.writeFileSync(docPropostaPath, candidate.PropostaDeTrabalho.toString('utf-8'), 'base64');
  //        candidateDocuments.push({ path: docPropostaPath, name: 'PropostaDeTrabalho.pdf' });
  //     }

  //     const zipFilePath = path.join(tempDirPath, 'documentos.zip');
  //     await res.zip(candidateDocuments, zipFilePath);

  //     fs.rmdirSync(tempDirPath, { recursive: true });
      
  //     return res.download(zipFilePath, 'documentos.zip');
   
  //  } catch (error: any) {
  //     res.status(400).json({
  //        error: error.message,
  //     });
  //  }
  
  /**
   * Procurar usuario
   * Pegar documentos da pasta do candidado
   * Criar pasta para cada tipo de documento
   * Compactar em .zip
   * Enviar
   */

}

const candidateDetails = async (req: Request, res: Response) => {
  try {
    const candidate = await EditalService.getCandidate(req.params.id)

    return res.render(resolveView('candidateDetails'), {
      candidate: candidate,
      csrfToken: req.csrfToken(),
      nome: req.session.nome,
      ...locals,
      tipoUsuario: req.session.tipoUsuario
    })
  } catch (error: any) {
    return res.status(400).json({
      error: error.message
    })
  }
}

export default {
  listEditalSelecao,
  addEditalSelecao,
  deleteEdital,
  arquivarEdital,
  viewEdital,
  listCandidatesEdital,
  updateEdital,
  geraPlanilha,
  editalCandidates,
  candidateDetails,
  gerarCandidatoPDF,
  getAllDocumentsFromOneCandidate,
  getAllCandidatesDocuments
}
