function insertData(
  worksheet: any,
  dados: any,
  filtro: string | null,
  start: number,
) {
  let currentRow = start || worksheet.rowCount + 1;

  dados.forEach((dado: any) => {
    if (!filtro || dado.nivel === filtro) {
      const row = worksheet.getRow(currentRow++);

      const rowIndex = row.number;

      // Aplica valores dinâmicos com fórmulas
      row.getCell('A').value = dado.nome || '';

      // Prova → por fórmula externa
      row.getCell('B').value = { formula: `=Provas!C${rowIndex}` };

      // Proposta → agora vem do NAC em Titulos!L
      row.getCell('C').value = { formula: `=Propostas!E${rowIndex}` };

      // Títulos → de Titulos!K (Nota total do título)
      const rowTitulo = dado.nivel === 'Mestrado' ? rowIndex + 1 : rowIndex + 2;
      row.getCell('D').value = { formula: `=Titulos!L${rowTitulo}` };

      // Média Final = B*2 + C*2 + D/5
      row.getCell('E').value = {
        formula: `=(B${rowIndex}*2 + C${rowIndex}*2 + D${rowIndex})/5`,
      };

      // Alinhamento
      row.eachCell((cell: any) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    }
  });
}

export function mediaFinalWorksheet(header: any, dados: any, worksheet: any) {
  // Mestrado
  const cabecalhoStyle = {
    font: { bold: true, color: { argb: '00000' } },
    alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFC0C0C0' },
      bgColor: { argb: 'FFC0C0C0' },
    },
  };
  // Cabecalho
  worksheet.mergeCells('A1:E1');
  worksheet.getCell('A1').style = cabecalhoStyle;
  // worksheet.getCell('A1').value = 'Mestrados'

  worksheet.columns = header.map((item: any) => {
    return { header: item.header, key: item.key, width: item.width };
  });
  worksheet.getCell('A1').value = 'Mestrados';
  worksheet.getRow(1).height = 35;

  worksheet
    .addRow(header.map((item: any) => item.header))
    .eachCell((cell: any) => {
      cell.font = { bold: true, color: { argb: '00000' } };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
    });
  worksheet.getRow(2).height = 30;

  const linhaVazia = worksheet.addRow([]);
  // Insiri os dados Mestrado
  insertData(worksheet, dados, 'Mestrado', linhaVazia.number);

  // Doutorado
  const comecoDoutorado = worksheet.rowCount + 1;
  worksheet.mergeCells(`A${comecoDoutorado}:E${comecoDoutorado}`);
  worksheet.getCell(`A${comecoDoutorado}`).value = 'Doutorados';
  worksheet.getCell(`A${comecoDoutorado}`).style = cabecalhoStyle;
  worksheet.getRow(comecoDoutorado).height = 35;

  worksheet
    .addRow(header.map((item: any) => item.header))
    .eachCell((cell: any) => {
      cell.font = { bold: true, color: { argb: '00000' } };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
    });
  worksheet.getRow(worksheet.rowCount).height = 30;

  // Insiri os dados Doutorado
  insertData(worksheet, dados, 'Doutorado', worksheet.rowCount + 1);
}
