import fs from 'fs';
import { SignUpDto as CreateCandidatoDto } from '../resources/candidato/candidato.types';

import exceljs from 'exceljs';
import CandidatoService from '@resources/candidato/candidato.service';

function formatarDados(dados: any) {
  return dados.map((dado: any) => ({
    nome: dado.name,
    email: dado.email,
    inscricao: dado.inscricaoposcomp,
    linha: dado.linha,
    orientador: dado.orientador,
    bolsa: dado.bolsa,
    nivel: dado.nivel,
    proposto: dado.proposto,

    provaInscricao: { formula: '=Candidato!B:B' },
    propostasMediaFinal: { formula: 'SUM(B2:D2)', result: '0' },

    ws_mediaFinal_prova: { formula: '=Provas!C:C' },
    ws_mediaFinal_proposta: { formula: '=Propostas!E:E' },
    ws_mediaFinal_media: { formula: 'AVERAGE(B2:D2)', result: '0' },
    ws_mediaFinal_titulos: { formula: '=Titulos!I2', result: '0' },

    ws_titulos_nota: {
      formula:
        '=IF(SUM(B2:E2)>30,30,SUM(B2:E2)) + IF(SUM(F2:H2)>70,70,SUM(F2:H2))',
      result: '0',
    },
    ws_titulos_nac: { formula: '=5+((5 * I2)/100)', result: '5' },
  }));
}

function insertData(worksheet: any, dados: any, filtro: string | null) {
  dados.forEach((dado: any) => {
    if (filtro) {
      if (dado.nivel === filtro) {
        const row = worksheet.addRow(dado);
        row.eachCell((cell: any, number: any) => {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
      }
    } else worksheet.addRow(dado);
  });
}
// Pegar o canditatos pelo editalId do banco de dados
async function getCandidatos(EditalId: string) {
  const candidatos =
    await CandidatoService.listarCandidatosPorEdital2(EditalId);
  const candidatosFormatado = formatarDados(candidatos);
  return candidatosFormatado;
}

function createSeparador(
  worksheet: any,
  header: any,
  cellValue: any,
  line: any,
  limit: any,
) {
  worksheet.mergeCells(
    `A${line}:${String.fromCharCode(65 + Math.min(header.length, limit) - 1)}${line}`,
  );
  // worksheet.mergeCells(`A${line}:${String.fromCharCode(65 + header.length - 1)}${line}`);
  worksheet.getCell(`A${line}`).value = cellValue;
  worksheet.getCell(`A${line}`).alignment = {
    vertical: 'middle',
    horizontal: 'center',
  };
  worksheet.getCell(`A${line}`).font = {
    color: { argb: 'FFFFFF' },
    bold: true,
  };
  worksheet.getCell(`A${line}`).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFC0C0C0' },
    bgColor: { argb: 'FFC0C0C0' },
  };
  worksheet.getRow(line).height = 20;
}

function createWorksheetTitulo(
  header: any,
  dados: CreateCandidatoDto[],
  worksheet: any,
) {
  worksheet.columns = header.map((item: any) => {
    return { header: item.header, key: item.key, width: item.width };
  });

  worksheet.spliceRows(1, 0, []);
  // createSeparador(worksheet, header, 'Mestrados', 1);
  createSeparador(worksheet, header, 'Mestrados', 1, 11);
  worksheet.spliceRows(2, 0, []);
  worksheet.mergeCells('A3:A2');
  worksheet.getCell('A3').value = 'Nome';
  worksheet.mergeCells('B2:E2');
  worksheet.mergeCells('F2:H2');
  worksheet.mergeCells('I3:I2');
  worksheet.mergeCells('J3:J2');

  worksheet.getCell('B2').value = 'Atividades';
  worksheet.getCell('F2').value = 'Publicações';
  worksheet.getCell('I3').value = 'Nota';
  worksheet.getCell('J3').value = 'NAC';

  const headerRow = worksheet.getRow(2);
  worksheet.getRow(3).alignment = {
    vertical: 'middle',
    horizontal: 'center',
    wrapText: true,
  };
  worksheet.getRow(3).height = 30;
  const secondHeaderRow = header.map((item: any) => item.header);
  headerRow.eachCell((cell: any, number: any) => {
    cell.font = { bold: true, color: { argb: '00000' } };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
  });
  headerRow.height = 15;
  insertData(worksheet, dados, 'Mestrado');

  createSeparador(worksheet, header, 'Doutorados', worksheet.rowCount + 1, 11);
  const linhaHeaderDoutorados = worksheet.addRow(secondHeaderRow);
  worksheet.spliceRows(worksheet.rowCount, 0, []);

  worksheet.mergeCells(`A${worksheet.rowCount}:A${worksheet.rowCount - 1}`);
  worksheet.mergeCells(`B${worksheet.rowCount - 1}:E${worksheet.rowCount - 1}`);
  worksheet.mergeCells(`F${worksheet.rowCount - 1}:H${worksheet.rowCount - 1}`);
  worksheet.mergeCells(`I${worksheet.rowCount}:I${worksheet.rowCount - 1}`);
  worksheet.mergeCells(`J${worksheet.rowCount}:J${worksheet.rowCount - 1}`);

  worksheet.getCell(`A${worksheet.rowCount}`).value = 'Nome';
  worksheet.getCell(`B${worksheet.rowCount - 1}`).value = 'Atividades';
  worksheet.getCell(`F${worksheet.rowCount - 1}`).value = 'Publicações';
  worksheet.getCell(`I${worksheet.rowCount}`).value = 'Nota';
  worksheet.getCell(`J${worksheet.rowCount}`).value = 'NAC';

  worksheet.getRow(worksheet.rowCount).alignment = {
    vertical: 'middle',
    horizontal: 'center',
    wrapText: true,
  };
  worksheet.getRow(worksheet.rowCount).height = 30;

  linhaHeaderDoutorados.eachCell((cell: any, number: any) => {
    cell.font = { bold: true, color: { argb: '00000' } };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
  });
  linhaHeaderDoutorados.height = 15;
  insertData(worksheet, dados, 'Doutorado');
}

// Axuliar na formatação dos dados na tabela
function createWorksheet(header: any, dados: any, worksheet: any) {
  worksheet.columns = header.map((item: any) => {
    return { header: item.header, key: item.key, width: item.width };
  });

  worksheet.spliceRows(1, 0, []);

  createSeparador(worksheet, header, 'Mestrados', 1, 14);

  const headerRow = worksheet.getRow(2);
  const secondHeaderRow = header.map((item: any) => item.header);
  // secondHeaderRow = secondHeaderRow.filter((item) => item !== 'Homologado');

  headerRow.eachCell((cell: any, number: any) => {
    cell.font = { bold: true, color: { argb: '00000' } };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
  });
  headerRow.height = 40;

  insertData(worksheet, dados, 'Mestrado');

  createSeparador(worksheet, header, 'Doutorados', worksheet.rowCount + 1, 14);

  const linhaHeaderDoutorados = worksheet.addRow(secondHeaderRow);

  linhaHeaderDoutorados.eachCell((cell: any, number: any) => {
    cell.font = { bold: true, color: { argb: '00000' } };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
  });
  linhaHeaderDoutorados.height = 40;

  insertData(worksheet, dados, 'Doutorado');
}

async function gerarPlanilha(editalId: string) {
  // Create a new instance of a Workbook class
  const workbook = new exceljs.Workbook();
  // Novas abas na planilhas
  const worksheetCandidatos = workbook.addWorksheet('Candidato');
  const worksheetProvas = workbook.addWorksheet('Provas');
  const worksheetPropostas = workbook.addWorksheet('Propostas');
  const worksheetTitulos = workbook.addWorksheet('Titulos');
  const worksheetMediaFinal = workbook.addWorksheet('Média Final');

  const candidatos = await getCandidatos(editalId);

  createWorksheet(
    [
      { header: 'Nome', key: 'nome', width: 40 },
      { header: 'Email', key: 'email', width: 40 },
      { header: 'Inscrição', key: 'inscricao', width: 20 },
      { header: 'Linha', key: 'linha', width: 10 },
      { header: 'Orientador', key: 'orientador', width: 40 },
      { header: 'Bolsa', key: 'bolsa', width: 15 },
      { header: 'Nível', key: 'nivel', width: 15 },
      { header: 'Comprovante', key: 'comprovante', width: 15 },
      { header: 'Curriculum', key: 'curriculum', width: 15 },
      { header: 'Histórico', key: 'historico', width: 15 },
      { header: 'Proposto', key: 'proposto', width: 15 },
      { header: 'Cartas (2 no mínimo)', key: 'cartas', width: 40 },
      { header: 'Homologado', key: 'homologado', width: 40 },
      { header: 'Observações', key: 'observacoes', width: 40 },
    ],
    candidatos,
    worksheetCandidatos,
  );

  createWorksheet(
    [
      { header: 'Nome', key: 'nome', width: 40 },
      { header: 'Inscrição', key: 'provaInscricao', width: 20 },
      { header: 'Nota Final', key: 'notaFinal', width: 20 },
    ],
    candidatos,
    worksheetProvas,
  );

  createWorksheet(
    [
      { header: 'Nome', key: 'nome', width: 40 },
      { header: 'Avaliador 1', key: 'avaliador1', width: 40 },
      { header: 'Avaliador 2', key: 'avaliador2', width: 40 },
      { header: 'Avaliador 3', key: 'avaliador3', width: 40 },
      { header: 'Media Final', key: 'propostasMediaFinal', width: 20 },
    ],
    candidatos,
    worksheetPropostas,
  );

  createWorksheetTitulo(
    [
      { header: 'Nome', key: 'nome', width: 40 },
      { header: 'Mestrado', key: 'mestrado', width: 15 },
      { header: 'Estágio, Extensão e monitoria', key: 'atividades', width: 20 },
      { header: 'Docência', key: 'docencia', width: 10 },
      { header: 'IC, IT, ID', key: 'siglas', width: 10 },
      { header: 'A', key: 'publicacoes_A', width: 10 },
      { header: 'B1 a B2', key: 'publicacoes_B1', width: 10 },
      { header: 'B3 a B5', key: 'publicacoes_B3', width: 10 },
      { header: 'Nota', key: 'ws_titulos_nota', width: 10 },
      { header: 'NAC', key: 'ws_titulos_nac', width: 10 },
    ],
    candidatos,
    worksheetTitulos,
  );

  createWorksheet(
    [
      { header: 'Nome', key: 'nome', width: 40 },
      { header: 'Prova', key: 'ws_mediaFinal_prova', width: 20 },
      { header: 'Proposta', key: 'ws_mediaFinal_proposta', width: 20 },
      { header: 'Títulos', key: 'ws_mediaFinal_titulos', width: 20 },
      { header: 'Média', key: 'ws_mediaFinal_media', width: 20 },
    ],
    candidatos,
    worksheetMediaFinal,
  );

  // Save Excel on Hard Disk
  await workbook.xlsx
    .writeFile('planilha.xlsx')
    .then(function () {
      console.log('Arquivo salvo!');
    })
    .catch(function (error: any) {
      console.log(error.message);
    })
    .catch(function (error: any) {
      console.log(error.message);
    });

  const arquivo = fs.readFileSync('planilha.xlsx');

  return arquivo;
}

export default { gerarPlanilha };
