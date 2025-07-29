function insertData(
  worksheet: any,
  dados: any,
  filtro: 'Mestrado' | 'Doutorado',
  start: number,
) {
  let currentRow = start || worksheet.rowCount + 1;
  dados.forEach((dado: any) => {
    if (filtro) {
      if (dado.nivel === filtro) {
        const row = worksheet.getRow(currentRow++);
        row.values = dado;
        row.eachCell((cell: any) => {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
      }
    } else {
      const row = worksheet.getRow(currentRow++);
      row.values = dado;
      row.eachCell((cell: any) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    }
  });
}

export function candidateWorksheet(header: any, dados: any, worksheet: any) {
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
  worksheet.mergeCells('A1:Q1');
  worksheet.getCell('A1').style = cabecalhoStyle;

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
  // Insiri os dados Mestrado
  insertData(worksheet, dados, 'Mestrado', worksheet.rowCount + 1);

  // Doutorado
  const comecoDoutorado = worksheet.rowCount + 1;
  worksheet.mergeCells(`A${comecoDoutorado}:Q${comecoDoutorado}`);
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
