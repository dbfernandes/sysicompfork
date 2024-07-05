import { Response, Request } from 'express';
import editalGerarPlanilha from '../../utils/editalGerarPlanilha';
import editalService from './edital.service';

/* eslint-disable camelcase */
const fs = require('fs');
const path = require('path');
const os = require('os');
const locals = {
  layout: 'selecaoppgi',
};

const addEditalSelecao = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      console.log(req.session.nome);
      return res.render('edital/addNewSelecao', {
        csrfToken: req.csrfToken(),
        tipoUsuario: req.session.tipoUsuario,
        nome: req.session.nome,
        ...locals,
      });

    case 'POST':
      {
        const {
          num_edital,
          documento,
          data_inicio,
          data_fim,
          carta_recomendacao,
          carta_orientador,
          vaga_regular_mestrado,
          vaga_suplementar_mestrado,
          vaga_regular_doutorado,
          vaga_suplementar_doutorado,
        } = await req.body;

        try {
          await editalService.criarEdital(
            num_edital,
            documento,
            data_inicio,
            data_fim,
            carta_recomendacao,
            carta_orientador,
            vaga_regular_mestrado,
            vaga_suplementar_mestrado,
            vaga_regular_doutorado,
            vaga_suplementar_doutorado,
          );
        } catch (error: any) {
          return res.status(400).json({
            csrfToken: req.csrfToken(),
            error: error.message,
            req: req.body,
          });
        }

        return res.redirect('/edital/listEdital');
      }
      break;

    case 'PUT':
      return res.status(200).send({
        message: 'TO-DO',
      });

    default:
      return res.status(404).send();
  }
};

const listEditalSelecao = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      return res.render('edital/listSelecao', {
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        editais: await editalService.listEdital(),
        tipoUsuario: req.session.tipoUsuario,
      });

    case 'POST': {
      const editais = await editalService.listEdital().catch((err) => {
        return res.status(400).json({
          error: err.message,
        });
      });
      return res.status(200).json(editais);
    }
    default:
      return res.status(404).send();
  }
};

const deleteEdital = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'DELETE':
      const { id } = req.params;

      try {
        await editalService.delete(id);
      } catch (error: any) {
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
  const { id_edital } = req.params;

  console.log('no controler :' + id_edital);
  switch (req.method) {
    case 'PUT': {
      const { status } = await req.body;

      const edital_update = await editalService
        .arquivar(id_edital, {
          status,
        })
        .catch((err) => {
          return res.status(400).json({
            error: err.message,
          });
        });
      return res.status(200).send(edital_update);
    }
    default:
      return res.status(404).send();
  }
};

const viewEdital = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET': {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'ID not found' });
      }
      const edital = await editalService.getEdital(id);

      if (!edital) {
        return res.status(404).json({ error: 'Edital não encontrado' });
      }

      return res.render('edital/viewSelecao', {
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        ...locals,
        edital,
        tipoUsuario: req.session.tipoUsuario,
      });
    }
  }
};

const updateEdital = async (req: Request, res: Response) => {
  const { id_update } = req.params;
  switch (req.method) {
    case 'GET': {
      if (!id_update) {
        return res.status(404).json({ error: 'id não encontrado' });
      }
      const edital = await editalService.getEdital(id_update);

      if (!edital) {
        return res.status(404).json({ error: 'Edital não encontrado' });
      }
      return res.render('edital/editSelecao', {
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        ...locals,
        edital,
        tipoUsuario: req.session.tipoUsuario,
      });
    }
    case 'PUT': {
      const {
        num_edital,
        documento,
        data_inicio,
        data_fim,
        carta_recomendacao,
        carta_orientador,
        vaga_regular_mestrado,
        vaga_suplementar_mestrado,
        vaga_regular_doutorado,
        vaga_suplementar_doutorado,
      } = await req.body;

      const updateEdital = await editalService
        .update(id_update, {
          num_edital,
          documento,
          data_inicio,
          data_fim,
          carta_recomendacao,
          carta_orientador,
          vaga_regular_mestrado,
          vaga_suplementar_mestrado,
          vaga_regular_doutorado,
          vaga_suplementar_doutorado,
        })
        .catch((err) => {
          return res.status(400).json({
            error: err.message,
          });
        });
      return res.status(200).send(updateEdital);
    }
    default:
      return res.status(404).send();
  }
};

const listCandidatesEdital = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET': {
      const { id } = req.params;
      if (!id) {
        return res.status(404).json({ error: 'id não encontrado' });
      }
      const edital = await editalService.getEdital(id);

      if (!edital) {
        return res.status(404).json({ error: 'Edital não encontrado' });
      }

      return res.render('edital/listCandidates', {
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        ...locals,
        edital: edital,
        tipoUsuario: req.session.tipoUsuario,
      });
    }
    case 'POST': {
      const { id_edital } = req.params;
      const candidates = await editalService.listCandidates(id_edital);
      if (!candidates) {
        return candidates;
      }
      return res.status(200).json(candidates);
    }
  }
};

const editalCandidates = async (req: Request, res: Response) => {
  const editalID = req.params.id;
  const candidates = await editalService
    .listCandidates(editalID)
    .catch((err: any) => {
      return res.status(400).json({
        error: err.message,
      });
    });
  if (!Array.isArray(candidates)) throw new Error('Erro ao buscar candidatos');
  const quantidadeInscricaoAndamento = candidates.filter(
    (candidate: { editalPosition: number | null }) =>
      candidate.editalPosition !== null && candidate.editalPosition < 4,
  ).length;
  const quantidadeInscricaoFinalizada: number = candidates.filter(
    (candidate: { editalPosition: number | null }) =>
      candidate.editalPosition !== null && candidate.editalPosition === 4,
  ).length;

  return res.render('edital/listCandidates', {
    csrfToken: req.csrfToken(),
    nome: req.session.nome,
    ...locals,
    candidates,
    editalID,
    tipoUsuario: req.session.tipoUsuario,
    quantidadeInscricaoAndamento,
    quantidadeInscricaoFinalizada,
  });
};

const geraPlanilha = async (req: Request, res: Response) => {
  const planilha = await editalGerarPlanilha.gerarPlanilha(req.params.id);
  return res
    .set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=planilha.xlsx',
      'Content-Length': planilha.length,
    })
    .status(200)
    .send(planilha);
};

const gerarCandidatoPDF = async (req: Request, res: Response) => {
  const candidate = await editalService.getCandidate(req.params.id);
  if (!candidate) return res.status(404).send('Candidato não encontrado');
  const base64Documento = (candidate as any)[req.query.documento as string];
  if (!base64Documento) return res.status(404).send('Documento não encontrado');
  const docPDF = Buffer.from(base64Documento.toString('utf-8'), 'base64');

  return res
    .set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=index.pdf`,
      'Content-Length': docPDF.length,
    })
    .status(200)
    .send(docPDF);
};
// Refazer função
// const getAllCandidatesDocuments = async (req: Request, res: Response) => {
//   try {
//     // Pegue todos os candidatos do edital
//     const candidates = await editalService.listCandidates(req.params.id)
//     // Crie um diretório temporário para armazenar os documentos
//     const tempDirPath = path.join(os.tmpdir(), 'documents-')
//     if (fs.existsSync(tempDirPath)) fs.rmdirSync(tempDirPath, { recursive: true })
//     fs.mkdirSync(tempDirPath)
//     // Para cada candidato, crie um arquivo PDF com os documentos
//     const candidatesDocuments = []
//     for (const candidate of candidates) {
//       if (candidate.Curriculum) {
//         const docCurriculumPath = path.join(tempDirPath, `${candidate.Nome}-Curriculum.pdf`)
//         fs.writeFileSync(docCurriculumPath, candidate.Curriculum.toString('utf-8'), 'base64')
//         candidatesDocuments.push({ path: docCurriculumPath, name: `${candidate.Nome}/${candidate.Nome}-Curriculum.pdf` })
//       }
//       if (candidate.CartaDoOrientador) {
//         const docCartaOrientadorPath = path.join(tempDirPath, `${candidate.Nome}-CartaDoOrientador.pdf`)
//         fs.writeFileSync(docCartaOrientadorPath, candidate.CartaDoOrientador.toString('utf-8'), 'base64')
//         candidatesDocuments.push({ path: docCartaOrientadorPath, name: `${candidate.Nome}/${candidate.Nome}-CartaDoOrientador.pdf` })
//       }
//       if (candidate.PropostaDeTrabalho) {
//         const docPropostaPath = path.join(tempDirPath, `${candidate.Nome}-PropostaDeTrabalho.pdf`)
//         fs.writeFileSync(docPropostaPath, candidate.PropostaDeTrabalho.toString('utf-8'), 'base64')
//         candidatesDocuments.push({ path: docPropostaPath, name: `${candidate.Nome}/${candidate.Nome}-PropostaDeTrabalho.pdf` })
//       }
//     }
//       // Compacte todos os arquivos em um arquivo ZIP
//       const zipFilePath = path.join(tempDirPath, 'documentos.zip');
//       await res.zip(candidatesDocuments, zipFilePath);
//       // Remova o diretório temporário
//       fs.rmdirSync(tempDirPath, { recursive: true });
//       // Envie o arquivo ZIP para o cliente
//       return res.download(zipFilePath, 'documentos.zip');
//   } catch (error: any) {
//     res.status(400).json({
//       error: error.message
//     })
//   }
//   /* Identifica usuarios */
//   /* Busca documentos dos candidatos */
//   /* Cria pastas temporaria para cada candidato */
//   /* Cria arquivos PDF */
//   /* Compacta arquivos em ZIP */
//   /* Envia ZIP para o cliente */
//   /* Remove pasta temporaria e arquivos temporarios */
// };
// Refazer função
// const getAllDocumentsFromOneCandidate = async (req: Request, res: Response) => {
//   const candidate = await editalService.getCandidate(req.params.id)
//   try {
//     const tempDirPath = path.join(os.tmpdir(), 'documents-')
//     if (fs.existsSync(tempDirPath)) fs.rmdirSync(tempDirPath, { recursive: true })
//     fs.mkdirSync(tempDirPath)
//       const candidateDocuments = [];
//       if (candidate.Curriculum) {
//          const docCurriculumPath = path.join(tempDirPath, 'Curriculum.pdf');
//          fs.writeFileSync(docCurriculumPath, candidate.Curriculum.toString('utf-8'), 'base64');
//          candidateDocuments.push({ path: docCurriculumPath, name: 'Curriculum.pdf' });
//       }
//       if (candidate.CartaDoOrientador) {
//          const docCartaOrientadorPath = path.join(tempDirPath, 'CartaDoOrientador.pdf');
//          fs.writeFileSync(docCartaOrientadorPath, candidate.CartaDoOrientador.toString('utf-8'), 'base64');
//          candidateDocuments.push({ path: docCartaOrientadorPath, name: 'CartaDoOrientador.pdf' });
//       }
//       if (candidate.PropostaDeTrabalho) {
//          const docPropostaPath = path.join(tempDirPath, 'PropostaDeTrabalho.pdf');
//          fs.writeFileSync(docPropostaPath, candidate.PropostaDeTrabalho.toString('utf-8'), 'base64');
//          candidateDocuments.push({ path: docPropostaPath, name: 'PropostaDeTrabalho.pdf' });
//       }
//       const zipFilePath = path.join(tempDirPath, 'documentos.zip');
//       await res.zip(candidateDocuments, zipFilePath);
//       fs.rmdirSync(tempDirPath, { recursive: true });
//       return res.download(zipFilePath, 'documentos.zip');
//    } catch (error: any) {
//       res.status(400).json({
//          error: error.message,
//       });
//    }
//   /* Identifica usuario */
//   /* Busca documentos do candidato */
//   /* Cria pasta temporaria */
//   /* Cria arquivos PDF */
//   /* Compacta arquivos em ZIP */
//   /* Envia ZIP para o cliente */
//   /* Remove pasta temporaria e arquivos temporarios */
// };

const candidateDetails = async (req: Request, res: Response) => {
  try {
    const candidate = await editalService.getCandidate(req.params.id);

    return res.render('edital/candidateDetails', {
      candidate,
      csrfToken: req.csrfToken(),
      nome: req.session.nome,
      ...locals,
      tipoUsuario: req.session.tipoUsuario,
    });
  } catch (error: any) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

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
  getAllCandidatesDocuments,
};
