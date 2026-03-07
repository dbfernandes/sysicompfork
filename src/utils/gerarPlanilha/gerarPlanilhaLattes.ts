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
    { header: 'Projetos', key: 'projetos', width: 12 },

    { header: 'Conferências', key: 'con', width: 14 },
    { header: 'Períodicos', key: 'per', width: 14 },
    { header: 'Livros', key: 'liv', width: 10 },
    { header: 'Capítulos', key: 'cap', width: 14 },
    { header: 'Trabalhos Técnicos', key: 'tec', width: 18 },
    { header: 'Prefácios', key: 'pre', width: 14 },

    { header: 'Iniciação Cientí.', key: 'ini_cie', width: 14 },
    { header: 'TCC', key: 'tcc', width: 8 },
    { header: 'Mestrado', key: 'mes', width: 12 },
    { header: 'Doutorado', key: 'dou', width: 12 },
    { header: 'Pós-Doutorado', key: 'pos_dou', width: 14 },

    { header: 'Prêmios', key: 'premios', width: 10 },
    { header: 'Status', key: 'status', width: 16 },
  ];

  const headerRow = ws.getRow(1);
  headerRow.font = { bold: true };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.height = 18;

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

      premios: (p.premios ?? []).length,
      status: p.status ?? '',
    });
  }

  ws.views = [{ state: 'frozen', ySplit: 1 }];

  ws.getColumn('nome').alignment = { horizontal: 'left' };
  for (const key of [
    'atualizado',
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
    'status',
  ]) {
    ws.getColumn(key).alignment = { horizontal: 'center' };
  }

  // ✅ Não salva em disco: gera em memória
  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}
