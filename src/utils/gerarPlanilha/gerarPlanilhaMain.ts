import exceljs from 'exceljs';
import fs from 'fs';

import { candidateWorksheet } from './candidatoSheet';
import { provasWorksheet } from './provasSheet';
import { propostasWorksheet } from './propostasSheet';
import { titulosWorksheet } from './titulosSheet';
import { mediaFinalWorksheet } from './mediaFinalSheet';
import candidatoService from '../../resources/candidato/candidato.service';
import { Candidato, LinhaPesquisa } from '@prisma/client';
import path from 'path';
import {
  AUTODECLARACAO,
  AUTODECLARACAO_VIDEO,
  COMPROVANTE_COTA,
  COMPROVANTE_FILE,
  CURRICULUM_FILE,
  PROPOSTA_FILE,
} from '@resources/selecaoPPGI/selecao.ppgi.types';

interface CandidatoSheet extends Candidato {
  linhaPesquisa: LinhaPesquisa;
}

function getTipoVaga(candidato: Candidato) {
  if (candidato.cotista && candidato.cotistaTipo) {
    return 'Suplementar';
  }
  if (candidato.tae) {
    return 'TAE';
  }
  return 'Regular';
}
function verificarArquivoDiretorio(diretorio: string, nomeArquivo: string) {
  const caminhoArquivo = path.join(diretorio, nomeArquivo);

  return fs.existsSync(caminhoArquivo);
}

function getDocument(document: string, host: string, candidateId: string) {
  const caminhoDiretorioUsuario = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'uploads',
    'candidato',
    candidateId,
  );
  const hasFile = verificarArquivoDiretorio(caminhoDiretorioUsuario, document);
  if (hasFile) {
    return {
      text: 'Visualizar', // texto que aparece
      hyperlink: `http://${host}/edital/viewDocumentCandidate/${candidateId}?documento=${document}`, // URL
      tooltip: 'Clique para abrir a proposta', // opcional
    };
  }
  return '-';
}
// Função pegar dados e formatar
function formatarDados(dados: CandidatoSheet[], host: string) {
  return dados.map((dado) => {
    // Valores-default (ajuste se quiser algo diferente de '' ou false)
    const linhaPesquisaNome = dado.linhaPesquisa?.nome ?? '-';
    const id = dado.id ?? '-'; // pode ser string ou number
    const email = dado.email ?? '-';
    const nome = dado.nome ?? '-';
    const orientador = dado.nomeOrientador ?? '-';
    const nivel = dado.cursoDesejado ?? '-';
    const bolsista = dado.bolsista ?? false;

    // Helper: só gera link se houver id
    const doc = (tipo: string) => (id ? getDocument(tipo, host, id) : null);

    return {
      nome,
      email,
      inscricao: id,
      linha: linhaPesquisaNome,
      orientador,
      bolsa: bolsista,
      tipoVaga: getTipoVaga(dado) ?? '', // se getTipoVaga puder retornar null
      nivel,

      // Arquivos (null se id ausente)
      comprovante: doc(COMPROVANTE_FILE),
      curriculum: doc(CURRICULUM_FILE),
      proposto: doc(PROPOSTA_FILE),
      comprovanteCota: doc(COMPROVANTE_COTA),
      autodeclaracao: doc(AUTODECLARACAO),
      videoAutodeclaracao: doc(AUTODECLARACAO_VIDEO),

      // Fórmulas (mantidas)
      provaInscricao: { formula: '=Candidato!B:B' },
      propostasMediaFinal: { formula: '=SOMA(B2:D2)', result: '0' },

      ws_mediaFinal_prova: { formula: '=Provas!C:C' },
      ws_mediaFinal_proposta: { formula: '=Propostas!E:E' },
      ws_mediaFinal_media: { formula: 'AVERAGE(B2:D2)', result: '0' },
      ws_mediaFinal_titulos: { formula: '=Titulos!L:L', result: '0' },

      ws_titulos_nota: {
        formula:
          '=IF(SUM(B2:E2)>30,30,SUM(B2:E2)) + IF(SUM(F2:H2)>70,70,SUM(F2:H2))',
        result: '0',
      },
      ws_titulos_nac: { formula: '=5+((5 * I2)/100)', result: '5' },
    };
  });
}

// Pegar o canditatos pelo editalId do banco de dados
async function getCandidatos(editalId: string, host: string) {
  const candidatos = await candidatoService.listarCandidatosPorEdital(editalId);
  return formatarDados(candidatos, host);
}

// Função que gera a planilha
export default async function gerarPlanilha(editalId: string, host: string) {
  const workbook = new exceljs.Workbook();

  const candidatos = await getCandidatos(editalId, host);
  const candidateAba = workbook.addWorksheet('Candidato');
  const provasAba = workbook.addWorksheet('Provas');
  const propostasAba = workbook.addWorksheet('Propostas');
  const titulosAba = workbook.addWorksheet('Titulos');
  const mediaFinalAba = workbook.addWorksheet('Media Final');
  candidateWorksheet(
    [
      { header: 'Nome', key: 'nome', width: 40 },
      { header: 'Email', key: 'email', width: 40 },
      { header: 'Inscrição', key: 'inscricao', width: 30 },
      { header: 'Linha', key: 'linha', width: 30 },
      { header: 'Orientador', key: 'orientador', width: 40 },
      { header: 'Bolsa', key: 'bolsa', width: 15 },
      { header: 'Tipo de vaga', key: 'tipoVaga', width: 15 },

      { header: 'Nível', key: 'nivel', width: 15 },
      { header: 'Comprovante', key: 'comprovante', width: 15 },
      { header: 'Curriculum', key: 'curriculum', width: 15 },
      // { header: 'Histórico', key: 'historico', width: 15 },
      { header: 'Proposto', key: 'proposto', width: 15 },
      { header: 'Comprovante cota', key: 'comprovanteCota', width: 15 },
      { header: 'Autodeclaração', key: 'autodeclaracao', width: 15 },
      { header: 'Vídeo autodeclaração', key: 'videoAutodeclaracao', width: 15 },

      // { header: 'Cartas (2 no mínimo)', key: 'cartas', width: 40 },
      { header: 'Homologado', key: 'homologado', width: 40 },
      { header: 'Observações', key: 'observacoes', width: 40 },
    ],
    candidatos,
    candidateAba,
  );

  provasWorksheet(
    [
      { header: 'Nome', key: 'nome', width: 40 },
      { header: 'Inscrição', key: 'provaInscricao', width: 20 },
      { header: 'Nota Final', key: 'notaFinal', width: 20 },
    ],
    candidatos,
    provasAba,
  );

  propostasWorksheet(
    [
      { header: 'Nome', key: 'nome', width: 40 },
      { header: 'Avaliador 1', key: 'avaliador1', width: 40 },
      { header: 'Avaliador 2', key: 'avaliador2', width: 40 },
      { header: 'Avaliador 3', key: 'avaliador3', width: 40 },
      { header: 'Media Final', key: 'propostasMediaFinal', width: 20 },
    ],
    candidatos,
    propostasAba,
  );

  titulosWorksheet(
    [
      { header: 'Nome', key: 'nome', width: 40 },
      { header: 'Mestrado', key: 'mestrado', width: 15 },
      { header: 'Estágio, Extensão e monitoria', key: 'atividades', width: 20 },
      { header: 'Docência', key: 'docencia', width: 10 },
      { header: 'IC, IT, ID', key: 'siglas', width: 10 },
      { header: 'Maratona de Programação', key: 'maratona', width: 10 },

      { header: 'A1 a A2', key: 'publicacoes_A1', width: 10 },
      { header: 'A3 e A4', key: 'publicacoes_A3', width: 10 },
      { header: 'B1 a B2', key: 'publicacoes_B1', width: 10 },
      { header: 'B3 a B5', key: 'publicacoes_B3', width: 10 },
      { header: 'Nota', key: 'ws_titulos_nota', width: 10 },
      { header: 'NAC', key: 'ws_titulos_nac', width: 10 },
    ],
    candidatos,
    titulosAba,
  );

  mediaFinalWorksheet(
    [
      { header: 'Nome', key: 'nome', width: 40 },
      { header: 'Prova', key: 'ws_mediaFinal_prova', width: 20 },
      { header: 'Proposta', key: 'ws_mediaFinal_proposta', width: 20 },
      { header: 'Títulos', key: 'ws_mediaFinal_proposta', width: 20 },
      { header: 'Média', key: 'ws_mediaFinal_media', width: 20 },
    ],
    candidatos,
    mediaFinalAba,
  );

  // Save Excel on Hard Disk
  await workbook.xlsx
    .writeFile('public/files/planilha.xlsx')
    .then(function () {
      console.log('Arquivo salvo!');
    })
    .catch(function (error: any) {
      console.log(error.message);
    });

  const arquivo = fs.readFileSync('public/files/planilha.xlsx');

  return arquivo;
}
