import fs from 'fs';
import { Response, Request } from 'express';
import { CreateEditalDto, UpdateEditalDto } from './edital.types';
import EditalService from './edital.service';
import gerarPlanilha from '../../utils/gerarPlanilha/gerarPlanilhaMain';
import archiver from 'archiver';
import path from 'path';
import editalService from './edital.service';

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
        vagaMestrado: Number(req.body.vaga_regular_mestrado),
        cotasMestrado: Number(req.body.vaga_suplementar_mestrado),
        vagaDoutorado: Number(req.body.vaga_regular_doutorado),
        cotasDoutorado: Number(req.body.vaga_suplementar_doutorado),
        status: '',
        inscricoesEncerradas: 0,
        inscricoesIniciadas: 0,
      };
      try {
        await EditalService.criarEdital(novoEdital)
        return res.redirect('/edital/listEdital')
      } catch (error: any) {
        return res
          .status(400)
          .json({
            csrfToken: req.csrfToken(),
            error: error.message,
            req: req.body,
          })
          .send({ message: error.message });
      }
      break;
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
      const editais = await editalService.listEdital();
      console.log(editais);
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
      } catch (error: any) {
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
        vagaMestrado: parseInt(req.body.vaga_regular_mestrado),
        cotasMestrado: parseInt(req.body.vaga_suplementar_mestrado),
        vagaDoutorado: parseInt(req.body.vaga_regular_doutorado),
        cotasDoutorado: parseInt(req.body.vaga_suplementar_doutorado),
        status: '',
        inscricoesEncerradas: 0,
        inscricoesIniciadas: 0,
        // updatedAt: new Date (moment.tz('America/Manaus').format('YYYY-MM-DD HH:mm:ss'))
      };
      console.log(editalAtualizado);
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

      return res.render(resolveView('listCandidates'), {
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        tipoUsuario: req.session.tipoUsuario,
        edital,
        ...locals,
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
  console.log(candidates);
  if (!Array.isArray(candidates)) throw new Error('Erro ao buscar candidatos');
  const quantidadeInscricaoAndamento = candidates.filter(
    (candidate) =>
      candidate.posicaoEdital !== null && candidate.posicaoEdital < 4,
  ).length;
  const quantidadeInscricaoFinalizada = candidates.filter(
    (candidate) =>
      candidate.posicaoEdital !== null && candidate.posicaoEdital === 4,
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

const getCandidateDocument = async (req: Request, res: Response) => {
  const candidato = await EditalService.getCandidate(Number(req.params.id));

  const caminhoDoc = path.join(
    __dirname,
    '../../../uploads/candidatos',
    `${String(candidato!.id)}-${candidato!.nome}`,
    `${req.query.documento}`,
    'teste.pdf', // Tem que mudar essa forma de baixar o arquivo ou mudar o nome do arquivo no arquivo de upload
  );

  res.download(caminhoDoc, (error) => {
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  });
};

const getAllCandidatesDocuments = async (req: Request, res: Response) => {
  const candidatos = await editalService.listCandidates(req.params.id);

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

  candidatos.forEach((candidato: any) => {
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
    // archive.directory(candDir, `${candidato.id}-${candidato.Nome}`)
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

const getAllDocumentsFromOneCandidate = async (req: Request, res: Response) => {
  const candidado = await EditalService.getCandidate(Number(req.params.id));
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

const candidateDetails = async (req: Request, res: Response) => {
  try {
    const candidate = await editalService.getCandidate(Number(req.params.id));

    const candidatoDocs = {
      Curriculum: false,
      CartaDoOrientador: false,
      PropostaDeTrabalho: false,
      ProvaAnteriorSelecao: false,
      ComprovantePagamento: false,
      Recomendacao: false,
    };

    const curriculopath = path.join(
      __dirname,
      '../../../uploads/candidatos/',
      `${String(candidate!.id)}-${candidate!.nome}/Curriculum`,
    );
    const cartaOrientadorpath = path.join(
      __dirname,
      '../../../uploads/candidatos/',
      `${String(candidate!.id)}-${candidate!.nome}/CartaDoOrientador`,
    );
    const propostaTrabalhopath = path.join(
      __dirname,
      '../../../uploads/candidatos/',
      `${String(candidate!.id)}-${candidate!.nome}/PropostaDeTrabalho`,
    );
    const provaAnteriorpath = path.join(
      __dirname,
      '../../../uploads/candidatos/',
      `${String(candidate!.id)}-${candidate!.nome}/ProvaAnteriorSelecao`,
    );
    const comprovantePagamentopath = path.join(
      __dirname,
      '../../../uploads/candidatos/',
      `${String(candidate!.id)}-${candidate!.nome}/ComprovantePagamento`,
    );
    const recomendacaopath = path.join(
      __dirname,
      '../../../uploads/candidatos/',
      `${String(candidate!.id)}-${candidate!.nome}/Recomendacao`,
    );

    if (fs.existsSync(curriculopath)) {
      candidatoDocs.Curriculum = true;
    }
    if (fs.existsSync(cartaOrientadorpath)) {
      candidatoDocs.CartaDoOrientador = true;
    }
    if (fs.existsSync(propostaTrabalhopath)) {
      candidatoDocs.PropostaDeTrabalho = true;
    }
    if (fs.existsSync(provaAnteriorpath)) {
      candidatoDocs.ProvaAnteriorSelecao = true;
    }
    if (fs.existsSync(comprovantePagamentopath)) {
      candidatoDocs.ComprovantePagamento = true;
    }
    if (fs.existsSync(recomendacaopath)) {
      candidatoDocs.Recomendacao = true;
    }

    return res.render(resolveView('candidateDetails'), {
      candidate: candidate,
      candidatoDocs: candidatoDocs,
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
  getCandidateDocument,
  getAllDocumentsFromOneCandidate,
  getAllCandidatesDocuments,
};
