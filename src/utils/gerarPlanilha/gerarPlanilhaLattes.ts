import exceljs from 'exceljs';
import CurriculoService from '@resources/curriculo/curriculo.service';

function formatDateBR(date: any) {
  if (!date) return '-';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '-';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function countByTipo(arr: Array<{ tipo: number }> | undefined, tipo: number) {
  return (arr ?? []).filter((x) => x.tipo === tipo).length;
}

export default async function gerarPlanilhaNumerosLattes() {
  const workbook = new exceljs.Workbook();
  const data = await CurriculoService.getAcompanhamentoLattes();

  const ws = workbook.addWorksheet('Professores');

  ws.columns = [
    { header: 'Nome', key: 'nome', width: 45 },
    { header: 'Atualizado', key: 'atualizado', width: 14 },
    { header: 'Lattes Atualização', key: 'lattes_atualizado', width: 17 },

    { header: 'Projetos', key: 'projetos', width: 12 },

    { header: 'Conferências', key: 'con', width: 14 },
    { header: 'Períodicos', key: 'per', width: 14 },
    { header: 'Livros', key: 'liv', width: 10 },
    { header: 'Capítulos', key: 'cap', width: 14 },
    { header: 'Trabalhos Técnicos', key: 'tec', width: 18 },
    { header: 'Prefácios', key: 'pre', width: 14 },

    { header: 'Iniciação Cientí.', key: 'ini_cie', width: 16 },
    { header: 'TCC', key: 'tcc', width: 8 },
    { header: 'Mestrado', key: 'mes', width: 12 },
    { header: 'Doutorado', key: 'dou', width: 12 },
    { header: 'Pós-Doutorado', key: 'pos_dou', width: 14 },
    { header: 'Participação', key: 'eventos_participacao', width: 17 },
    { header: 'Organização', key: 'eventos_organizacao', width: 17 },
    { header: 'Prêmios', key: 'premios', width: 10 },

    { header: 'Mestrado', key: 'mestrado', width: 14 },
    { header: 'Doutorado', key: 'doutorado', width: 14 },
    { header: 'Pós-Doutorado', key: 'pos_doutorado', width: 17 },
  ];

  // =========================================
  // ✅ NOVO: Linha acima com grupos (merge)
  // =========================================
  ws.insertRow(1, []); // insere uma linha no topo

  // Mescla e escreve os títulos dos grupos
  // Publicações: colunas 4..9 (D..I)
  ws.mergeCells(1, 4, 1, 10);
  ws.getCell(1, 4).value = 'Publicações';

  // Orientações: colunas 10..14 (J..N)
  ws.mergeCells(1, 11, 1, 15);
  ws.getCell(1, 11).value = 'Orientações';

  // Mescla e escreve os títulos dos grupos
  // Publicações: colunas 4..9 (D..I)
  ws.mergeCells(1, 16, 1, 17);
  ws.getCell(1, 16).value = 'Eventos';

  const pubCell = ws.getCell(1, 4);
  pubCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF38761D' },
  };
  pubCell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  pubCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // Orientações (célula mesclada 1,10)
  const oriCell = ws.getCell(1, 11);
  oriCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF7F6000' },
  };
  oriCell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  oriCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // Orientações (célula mesclada 1,10)
  const evvCell = ws.getCell(1, 16);
  evvCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '032336' },
  };
  evvCell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  evvCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // (opcional) estiliza os grupos
  const groupRow = ws.getRow(1);
  groupRow.height = 18;

  function styleGroupCell(cell: exceljs.Cell) {
    cell.font = { bold: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  }
  styleGroupCell(ws.getCell(1, 4));
  styleGroupCell(ws.getCell(1, 10));

  // =========================================
  // Header real agora virou linha 2
  // =========================================
  const headerRow = ws.getRow(2);
  headerRow.font = { bold: true };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.height = 18;

  // Dados começam na linha 3 agora
  for (const p of data.professores ?? []) {
    const orientacoes = p.orientacoes ?? [];
    const inic = orientacoes.filter(
      (o) => o.natureza === 'Iniciacao cientifica',
    );
    const naoInic = orientacoes.filter(
      (o) => o.natureza !== 'Iniciacao cientifica',
    );

    ws.addRow({
      nome: p.nome ?? '',
      atualizado: formatDateBR(p.ultimaAtualizacao),
      lattes_atualizado: p.dataAtualizacao ?? '-',

      projetos: (p.projetos ?? []).length,

      con: countByTipo(p.publicacoes, 1),
      per: countByTipo(p.publicacoes, 2),
      liv: countByTipo(p.publicacoes, 3),
      cap: countByTipo(p.publicacoes, 4),
      tec: countByTipo(p.publicacoes, 5),
      pre: countByTipo(p.publicacoes, 6),

      ini_cie: countByTipo(inic, 1),
      tcc: countByTipo(naoInic, 1),
      mes: countByTipo(orientacoes, 2),
      dou: countByTipo(orientacoes, 3),
      pos_dou: countByTipo(orientacoes, 4),
      eventos_participacao: p.participacaoEvento.length,
      eventos_organizacao: p.organizacaoEvento.length,
      mestrado: p.hasMestrado ? 'Sim' : '-',
      doutorado: p.hasDoutorado ? 'Sim' : '-',
      pos_doutorado: p.hasPos ? 'Sim' : '-',
      premios: (p.premios ?? []).length,
    });
  }

  // Congela 2 linhas (grupos + header)
  ws.views = [{ state: 'frozen', ySplit: 2 }];

  ws.getColumn('nome').alignment = { horizontal: 'left' };
  for (const key of [
    'atualizado',
    'lattes_atualizado',
    'projetos',
    'con',
    'per',
    'liv',
    'cap',
    'tec',
    'pre',
    'ini_cie',
    'tcc',
    'mes',
    'dou',
    'pos_dou',
    'premios',
    'eventos_participacao',
    'mestrado',
    'pos_doutorado',
    'doutorado',
    'eventos_organizacao',
  ]) {
    ws.getColumn(key).alignment = { horizontal: 'center' };
  }

  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}
