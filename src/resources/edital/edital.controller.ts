import fs from 'fs';
import { Response, Request } from 'express';
import { CreateEditalDto, UpdateEditalDto } from './edital.types';
import EditalService from './edital.service';
import gerarPlanilha from '../../utils/gerarPlanilha/gerarPlanilhaMain';
import archiver from 'archiver';
import path from 'path';
import editalService from './edital.service';
import { verificarArquivoDiretorio } from '../selecaoPPGI/selecao.ppgi.controller';
import {
  COMPROVANTE_FILE,
  CURRICULUM_FILE,
  PROPOSTA_FILE,
} from '../selecaoPPGI/selecao.ppgi.types';
import { Candidato } from '@prisma/client';

const locals = {
  layout: 'selecaoppgi',
};

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
        ...locals,
      });

    case 'POST': {
      const novoEdital: CreateEditalDto = {
        editalId: req.body.num_edital,
        documento: req.body.documento,
        dataInicio: req.body.data_inicio,
        dataFim: req.body.data_fim,
        cartaRecomendacao: req.body.carta_recomendacao,
        cartaOrientador: req.body.carta_orientador,
        vagasMestrado: Number(req.body.vaga_regular_mestrado),
        cotasMestrado: Number(req.body.vaga_suplementar_mestrado),
        vagasDoutorado: Number(req.body.vaga_regular_doutorado),
        cotasDoutorado: Number(req.body.vaga_suplementar_doutorado),
        status: 1,
        inscricoesEncerradas: 0,
        inscricoesIniciadas: 0,
      };
      try {
        await EditalService.criarEdital(novoEdital);
        return res.redirect('/edital/listEdital');
      } catch (error) {
        return res.status(500).json({
          csrfToken: req.csrfToken(),
          error: error.message,
          req: req.body,
        });
      }
    }
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
      const editais = await editalService.listEditalComQtdeCandidatos();

      return res.render(resolveView('listSelecao'), {
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        editais,
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
      } catch (error) {
        return res.status(400).json({
          csrfToken: req.csrfToken(),
          error: error.message,
        });
      }
      return res.status(200).send({ message: 'Edital deletado com sucesso' });
    default:
      return res.status(404).send();
  }
};

const arquivarEdital = async (req: Request, res: Response) => {
  const { id_edital } = req.params;

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

      return res.render(resolveView('viewSelecao'), {
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
      const edital = await EditalService.getEdital(id_update).catch((err) => {
        return res.status(400).json({
          error: err.message,
        });
      });
      return res.render(resolveView('editSelecao'), {
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        ...locals,
        edital,
        tipoUsuario: req.session.tipoUsuario,
      });
    }
    case 'PUT': {
      const editalAtualizado: UpdateEditalDto = {
        editalId: req.body.num_edital,
        documento: req.body.documento,
        dataInicio: req.body.data_inicio,
        dataFim: req.body.data_fim,
        cartaRecomendacao: req.body.carta_recomendacao,
        cartaOrientador: req.body.carta_orientador,
        vagasMestrado: parseInt(req.body.vaga_regular_mestrado),
        cotasMestrado: parseInt(req.body.vaga_suplementar_mestrado),
        vagasDoutorado: parseInt(req.body.vaga_regular_doutorado),
        cotasDoutorado: parseInt(req.body.vaga_suplementar_doutorado),
        inscricoesEncerradas: 0,
        inscricoesIniciadas: 0,
        // updatedAt: new Date (moment.tz('America/Manaus').format('YYYY-MM-DD HH:mm:ss'))
      };
      const updatedEdital = await EditalService.update(
        id_update,
        editalAtualizado,
      ).catch((err) => {
        return res.status(400).json({
          error: err.message,
        });
      });
      return res.status(200).send(updatedEdital);
    }
    default:
      return res.status(404).send();
  }
};

const listcandidatosEdital = async (req: Request, res: Response) => {
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
      const candidatos = await editalService.listCandidatos(id);

      const amountcandidatoFinish = candidatos.filter(
        (candidato) => candidato.posicaoEdital >= 4,
      ).length;
      const amountcandidatoInProgress = candidatos.filter(
        (candidato) => candidato.posicaoEdital < 4,
      ).length;
      return res.render(resolveView('listcandidatos'), {
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        tipoUsuario: req.session.tipoUsuario,
        edital,
        amountcandidatoFinish,
        amountcandidatoInProgress,
        ...locals,
      });
    }
    case 'POST': {
      const { id_edital } = req.params;
      const candidatos = await editalService.listCandidatos(id_edital);
      if (!candidatos) {
        return candidatos;
      }
      return res.status(200).json(candidatos);
    }
  }
};

// listEditalcandidatos/:id
const editalcandidatos = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET': {
      try {
        const editalID = req.params.id;
        const candidatos = await editalService.listCandidatos(editalID);

        if (!Array.isArray(candidatos))
          throw new Error('Erro ao buscar candidatos');

        const quantidadeInscricaoAndamento = candidatos.filter(
          (candidato) =>
            candidato.posicaoEdital !== null && candidato.posicaoEdital < 4,
        ).length;

        const quantidadeInscricaoFinalizada = candidatos.filter(
          (candidato) =>
            candidato.posicaoEdital !== null && candidato.posicaoEdital === 4,
        ).length;

        return res.render(resolveView('listcandidatos'), {
          csrfToken: req.csrfToken(),
          nome: req.session.nome,
          ...locals,
          candidatos,
          editalID,
          tipoUsuario: req.session.tipoUsuario,
          quantidadeInscricaoAndamento,
          quantidadeInscricaoFinalizada,
        });
      } catch (error) {
        return res.status(400).json({
          error: error.message,
        });
      }
    }
    default:
      return res.status(404).send();
  }
};

const geraPlanilha = async (req: Request, res: Response) => {
  const planilha = await gerarPlanilha(req.params.id);
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

const getcandidatoDocument = async (req: Request, res: Response) => {
  const candidato = await EditalService.getCandidato(Number(req.params.id));
  const caminhoDoc = path.join(
    'public',
    'uploads',
    'candidato',
    candidato.id.toString(),
    `${req.query.documento}`,
  );

  res.download(caminhoDoc, (error) => {
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  });
};

const getAllcandidatosDocuments = async (req: Request, res: Response) => {
  const candidatos = await editalService.listCandidatos(req.params.id);

  res.setHeader(
    'Content-Disposition',
    `attachment; filename=${req.params.id}-candidatos.zip`,
  );
  const archive = archiver('zip', {
    zlib: { level: 9 },
  });

  archive.on('error', function (err) {
    res.status(500).send({ error: err.message });
  });

  archive.pipe(res);

  candidatos.forEach((candidato: Candidato) => {
    const candDir = path.join(
      __dirname,
      '../../../uploads/candidatos',
      `${String(candidato.id)}-${candidato.nome}`,
    );
    const pastas = [
      'Curriculum',
      'CartaDoOrientador',
      'PropostaDeTrabalho',
      'ProvaAnteriorSelecao',
      'ComprovantePagamento',
      'Recomendacao',
    ];
    // archive.directory(candDir, `${candidato.id}-${candidato.nome}`)
    pastas.forEach((pasta) => {
      const pastaDir = path.join(candDir, pasta);
      if (fs.existsSync(pastaDir)) {
        archive.directory(
          pastaDir,
          `${candidato.id}-${candidato.nome}/${pasta}`,
        );
      }
    });
  });

  archive.finalize();
};

const getAllDocumentsFromOnecandidato = async (req: Request, res: Response) => {
  const candidado = await EditalService.getCandidato(Number(req.params.id));
  const candDir = path.join(
    __dirname,
    '../../../uploads/candidatos',
    `${String(candidado!.id)}-${candidado!.nome}`,
  );

  const pastas = [
    'Curriculum',
    'CartaDoOrientador',
    'PropostaDeTrabalho',
    'ProvaAnteriorSelecao',
    'ComprovantePagamento',
    'Recomendacao',
  ];

  res.setHeader(
    'Content-Disposition',
    `attachment; filename=${candidado?.nome}.zip`,
  );
  const archive = archiver('zip', {
    zlib: { level: 9 },
  });

  archive.on('error', function (err) {
    res.status(500).send({ error: err.message });
  });

  archive.pipe(res);

  pastas.forEach((pasta) => {
    const pastaDir = path.join(candDir, pasta);
    if (fs.existsSync(pastaDir)) {
      archive.directory(pastaDir, pasta);
    }
  });

  archive.finalize();
};

const candidatoDetails = async (req: Request, res: Response) => {
  try {
    const candidato = await editalService.getCandidato(Number(req.params.id));
    const edital = await editalService.getEdital(candidato!.editalId);
    const candidatoDocs = {
      Curriculum: false,
      CartaDoOrientador: false,
      PropostaDeTrabalho: false,
      ProvaAnteriorSelecao: false,
      ComprovantePagamento: false,
      Recomendacao: false,
    };
    const caminhoDiretorioUsuario = path.join(
      'public',
      'uploads',
      'candidato',
      candidato.id.toString(),
    );

    const cartaOrientadorpath = path.join(
      __dirname,
      '../../../uploads/candidatos/',
      `${String(candidato!.id)}-${candidato!.nome}/CartaDoOrientador`,
    );

    const provaAnteriorpath = path.join(
      __dirname,
      '../../../uploads/candidatos/',
      `${String(candidato!.id)}-${candidato!.nome}/ProvaAnteriorSelecao`,
    );

    const recomendacaopath = path.join(
      __dirname,
      '../../../uploads/candidatos/',
      `${String(candidato!.id)}-${candidato!.nome}/Recomendacao`,
    );

    if (verificarArquivoDiretorio(caminhoDiretorioUsuario, CURRICULUM_FILE)) {
      candidatoDocs.Curriculum = true;
    }
    if (fs.existsSync(cartaOrientadorpath)) {
      candidatoDocs.CartaDoOrientador = true;
    }
    if (verificarArquivoDiretorio(caminhoDiretorioUsuario, PROPOSTA_FILE)) {
      candidatoDocs.PropostaDeTrabalho = true;
    }
    if (fs.existsSync(provaAnteriorpath)) {
      candidatoDocs.ProvaAnteriorSelecao = true;
    }
    if (verificarArquivoDiretorio(caminhoDiretorioUsuario, COMPROVANTE_FILE)) {
      candidatoDocs.ComprovantePagamento = true;
    }
    if (fs.existsSync(recomendacaopath)) {
      candidatoDocs.Recomendacao = true;
    }

    return res.render(resolveView('candidatoDetails'), {
      candidato: candidato,
      candidatoDocs: candidatoDocs,
      csrfToken: req.csrfToken(),
      nome: req.session.nome,
      ...locals,
      tipoUsuario: req.session.tipoUsuario,
      edital,
    });
  } catch (error) {
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
  listcandidatosEdital,
  updateEdital,
  geraPlanilha,
  editalcandidatos,
  candidatoDetails,
  getcandidatoDocument,
  getAllDocumentsFromOnecandidato,
  getAllcandidatosDocuments,
};
