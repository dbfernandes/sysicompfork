// function insertData(
//   worksheet: any,
//   dados: any,
//   filtro: string | null,
//   start: number,
// ) {
//   let currentRow = start || worksheet.rowCount + 1;
//   dados.forEach((dado: any) => {
//     if (filtro) {
//       if (dado.nivel === filtro) {
//         const row = worksheet.getRow(currentRow++);
//         // formula: '=IF(SUM(B2:E2)>30,30,SUM(B2:E2)) + IF(SUM(F2:H2)>70,70,SUM(F2:H2))'
//         // ws_titulos_nac: { formula: '=5+((5 * I:I)/100)', result: '5' }
//         dado.ws_titulos_nota = {
//           formula: `=IF(SUM(B${currentRow - 1}:E${currentRow - 1})>30,30,SUM(B${currentRow - 1}:E${currentRow - 1})) + IF(SUM(F${currentRow - 1}:H${currentRow - 1})>70,70,SUM(F${currentRow - 1}:H${currentRow - 1})`,
//         };
//         dado.ws_titulos_nac = {
//           formula: `=7+((3*I${currentRow - 1})/100)`,
//           result: '5',
//         };
//         row.values = dado;
//         row.eachCell((cell: any) => {
//           cell.alignment = { vertical: 'middle', horizontal: 'center' };
//         });
//       }
//     } else {
//       const row = worksheet.getRow(currentRow++);
//       row.values = dado;
//       row.eachCell((cell: any) => {
//         cell.alignment = { vertical: 'middle', horizontal: 'center' };
//       });
//     }
//   });
// }

export function insertData(
  worksheet: any,
  dados: any,
  filtro: string | null,
  start: number,
) {
  let currentRow = start || worksheet.rowCount + 1;

  dados.forEach((dado: any) => {
    if (!filtro || dado.nivel === filtro) {
      const row = worksheet.getRow(currentRow++);

      // Define os valores das colunas manualmente
      row.getCell('A').value = dado.nome || '';

      // Atividades Curriculares e Extracurriculares
      // row.getCell('B').value = dado.mestrado || 0;
      // row.getCell('C').value = dado.extensao_monitoria || 0;
      // row.getCell('D').value = dado.docencia || 0;
      // row.getCell('E').value = dado.iniciacao_cientifica || 0;
      // row.getCell('F').value = dado.maratona || 0;
      //
      // // Publicações
      // row.getCell('G').value = dado.a1a2 || 0;
      // row.getCell('H').value = dado.a2a4 || 0;
      // row.getCell('I').value = dado.b1b2 || 0;
      // row.getCell('J').value = dado.b3b5 || 0;

      // Fórmula da Nota (coluna K)
      row.getCell('K').value = {
        formula: `=IF(SUM(B${row.number}:F${row.number})>30,30,SUM(B${row.number}:F${row.number})) + IF(SUM(G${row.number}:J${row.number})>70,70,SUM(G${row.number}:J${row.number}))`,
      };

      // Fórmula do NAC (coluna L)
      row.getCell('L').value = {
        formula: `=7+(3*K${row.number}/100)`,
      };

      // Alinhamento de todas as células
      row.eachCell((cell: any) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    }
  });
}

export function titulosWorksheet(header: any, dados: any, worksheet: any) {
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
  const subHeaderStyle = {
    alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
  };
  // Cabecalho
  worksheet.mergeCells('A1:L1');
  worksheet.getCell('A1').style = cabecalhoStyle;

  worksheet.getCell('A1').value = 'Mestrados';

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

  worksheet.mergeCells('A2:A3');
  worksheet.getCell('A2').value = 'Nome';
  worksheet.mergeCells('B2:F2');
  worksheet.getCell('B2').value =
    'Atividades Curriculares e Extracurriculares (30 pontos)';
  worksheet.getCell('B3').value = 'Mestrado';
  worksheet.getCell('B3').style = subHeaderStyle;
  worksheet.getCell('C3').value = 'Estágio, Extensão e monitoria';
  worksheet.getCell('C3').style = subHeaderStyle;
  worksheet.getCell('D3').value = 'Docência';
  worksheet.getCell('D3').style = subHeaderStyle;
  worksheet.getCell('E3').value = 'IC, IT, ID';
  worksheet.getCell('E3').style = subHeaderStyle;
  worksheet.getCell('F3').value = 'Maratona';
  worksheet.getCell('F3').style = subHeaderStyle;
  // worksheet.getCell('B2').style = cabecalhoStyle;
  worksheet.mergeCells('G2:J2');
  worksheet.getCell('G2').value = 'Publicações (70 pontos)';
  worksheet.getCell('G3').value = 'A1 a A2';
  worksheet.getCell('G3').style = subHeaderStyle;
  worksheet.getCell('H3').value = 'A2 a A4';
  worksheet.getCell('H3').style = subHeaderStyle;
  worksheet.getCell('I3').value = 'B1 a B2';
  worksheet.getCell('I3').style = subHeaderStyle;
  worksheet.getCell('J3').value = 'B3 a B5';
  worksheet.getCell('J3').style = subHeaderStyle;
  // worksheet.getCell('F2').style = cabecalhoStyle;
  worksheet.mergeCells('K2:K3');
  worksheet.getCell('K2').value = 'Nota';
  // worksheet.getCell('I2').style = cabecalhoStyle;
  worksheet.mergeCells('L2:L3');
  worksheet.getCell('L2').value = 'NAC';
  // worksheet.getCell('J2').style = cabecalhoStyle;

  worksheet.getRow(3).height = 30;

  // Linha vazia
  const linhaVazia = worksheet.addRow([]);
  // Insiri os dados Mestrado
  insertData(worksheet, dados, 'Mestrado', linhaVazia.number);

  // Doutorado
  // worksheet.mergeCells('A5:J5')
  // worksheet.getCell('A5').value = 'Doutorados'
  // worksheet.getCell('A5').style = cabecalhoStyle
  // worksheet.getRow(4).height = 35
  const comecoDoutorado = worksheet.rowCount + 1;
  worksheet.mergeCells(`A${comecoDoutorado}:L${comecoDoutorado}`);
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

  worksheet.mergeCells(`A${comecoDoutorado + 1}:A${comecoDoutorado + 2}`);
  worksheet.getCell(`A${comecoDoutorado + 1}`).value = 'Nome';

  worksheet.mergeCells(`B${comecoDoutorado + 1}:F${comecoDoutorado + 1}`);
  worksheet.getCell(`B${comecoDoutorado + 1}`).value =
    'Atividades Curriculares e Extracurriculares (30 pontos)';
  worksheet.getCell(`B${comecoDoutorado + 2}`).value = 'Mestrado';
  worksheet.getCell(`B${comecoDoutorado + 2}`).style = subHeaderStyle;
  worksheet.getCell(`C${comecoDoutorado + 2}`).value =
    'Estágio, Extensão e monitoria';
  worksheet.getCell(`C${comecoDoutorado + 2}`).style = subHeaderStyle;
  worksheet.getCell(`D${comecoDoutorado + 2}`).value = 'Docência';
  worksheet.getCell(`D${comecoDoutorado + 2}`).style = subHeaderStyle;
  worksheet.getCell(`E${comecoDoutorado + 2}`).value = 'IC, IT, ID';
  worksheet.getCell(`E${comecoDoutorado + 2}`).style = subHeaderStyle;
  worksheet.getCell(`F${comecoDoutorado + 2}`).value = 'Maratona';
  worksheet.getCell(`F${comecoDoutorado + 2}`).style = subHeaderStyle;

  worksheet.mergeCells(`G${comecoDoutorado + 1}:J${comecoDoutorado + 1}`);
  worksheet.getCell(`G${comecoDoutorado + 1}`).value =
    'Publicações (70 pontos)';
  worksheet.getCell(`G${comecoDoutorado + 2}`).value = 'A1 a A2';
  worksheet.getCell(`G${comecoDoutorado + 2}`).style = subHeaderStyle;
  worksheet.getCell(`H${comecoDoutorado + 2}`).value = 'A2 a A4';
  worksheet.getCell(`H${comecoDoutorado + 2}`).style = subHeaderStyle;
  worksheet.getCell(`I${comecoDoutorado + 2}`).value = 'B1 a B2';
  worksheet.getCell(`I${comecoDoutorado + 2}`).style = subHeaderStyle;
  worksheet.getCell(`J${comecoDoutorado + 2}`).value = 'B3 a B5';
  worksheet.getCell(`J${comecoDoutorado + 2}`).style = subHeaderStyle;

  worksheet.mergeCells(`K${comecoDoutorado + 1}:K${comecoDoutorado + 2}`);
  worksheet.getCell(`K${comecoDoutorado + 1}`).value = 'Nota';

  worksheet.mergeCells(`L${comecoDoutorado + 1}:L${comecoDoutorado + 2}`);
  worksheet.getCell(`L${comecoDoutorado + 1}`).value = 'NAC';
  // worksheet.getCell(`J${comecoDoutorado + 1}`).style = cabecalhoStyle;

  worksheet.getRow(comecoDoutorado + 2).height = 30;

  // Insere os dados Doutorado
  insertData(worksheet, dados, 'Doutorado', worksheet.rowCount + 1);
}
