function insertData(worksheet: any, dados: any, filtro: string | null, start: number) {
    let currentRow = start || worksheet.rowCount + 1
    dados.forEach((dado: any) => {
        if (filtro) {
            if (dado.nivel === filtro) {
                const row = worksheet.getRow(currentRow++)
                // formula: '=IF(SUM(B2:E2)>30,30,SUM(B2:E2)) + IF(SUM(F2:H2)>70,70,SUM(F2:H2))'
                // ws_titulos_nac: { formula: '=5+((5 * I:I)/100)', result: '5' }
                dado.ws_titulos_nota = {formula: `=IF(SUM(B${currentRow-1}:E${currentRow-1})>30,30,SUM(B${currentRow-1}:E${currentRow-1})) + IF(SUM(F${currentRow-1}:H${currentRow-1})>70,70,SUM(F${currentRow-1}:H${currentRow-1})`}
                dado.ws_titulos_nac = { formula: `=5+((5*I${currentRow-1})/100)`, result: '5' }
                row.values = dado
                row.eachCell((cell: any) => {
                    cell.alignment = { vertical: 'middle', horizontal: 'center' }
                })
            }
        } else {
            const row = worksheet.getRow(currentRow++)
            row.values = dado
            row.eachCell((cell: any) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' }
            })
        }
    })
}

export function titulosWorksheet(header: any, dados: any, worksheet: any) {
    // Mestrado
    const cabecalhoStyle = {
        font: { bold: true, color: { argb: '00000' } },
        alignment: { vertical: 'middle', horizontal: 'center', wrapText: true },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC0C0C0' }, bgColor: { argb: 'FFC0C0C0' } }
    }
    const subHeaderStyle = {
        alignment: { vertical: 'middle', horizontal: 'center', wrapText: true }
    }
    // Cabecalho
    worksheet.mergeCells('A1:J1')
    worksheet.getCell('A1').style = cabecalhoStyle

    worksheet.getCell('A1').value = 'Mestrados'

    worksheet.columns = header.map((item: any) => {
        return { header: item.header, key: item.key, width: item.width }
    })
    worksheet.getCell('A1').value = 'Mestrados'
    worksheet.getRow(1).height = 35

    worksheet.addRow(header.map((item: any) => item.header)).eachCell((cell: any) => {
        cell.font = { bold: true, color: { argb: '00000' } }
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    })
    worksheet.getRow(2).height = 30

    worksheet.mergeCells('A2:A3')
    worksheet.getCell('A2').value = 'Nome'
    worksheet.mergeCells('B2:E2');
    worksheet.getCell('B2').value = 'Atividades Curriculares e Extracurriculares (30 pontos)';
    worksheet.getCell('B3').value = 'Mestrado';
    worksheet.getCell('B3').style = subHeaderStyle;
    worksheet.getCell('C3').value = 'Estágio, Extensão e monitoria';
    worksheet.getCell('C3').style = subHeaderStyle;
    worksheet.getCell('D3').value = 'Docência';
    worksheet.getCell('D3').style = subHeaderStyle;
    worksheet.getCell('E3').value = 'IC, IT, ID';
    worksheet.getCell('E3').style = subHeaderStyle;
    // worksheet.getCell('B2').style = cabecalhoStyle;
    worksheet.mergeCells('F2:H2');
    worksheet.getCell('F2').value = 'Publicações (70 pontos)';
    worksheet.getCell('F3').value = 'A';
    worksheet.getCell('F3').style = subHeaderStyle;
    worksheet.getCell('G3').value = 'B1 a B2';
    worksheet.getCell('G3').style = subHeaderStyle;
    worksheet.getCell('H3').value = 'B3 a B5';
    worksheet.getCell('H3').style = subHeaderStyle;
    // worksheet.getCell('F2').style = cabecalhoStyle;
    worksheet.mergeCells('I2:I3');
    worksheet.getCell('I2').value = 'Nota';
    // worksheet.getCell('I2').style = cabecalhoStyle;
    worksheet.mergeCells('J2:J3');
    worksheet.getCell('J2').value = 'NAC';
    // worksheet.getCell('J2').style = cabecalhoStyle;

    worksheet.getRow(3).height = 30

    // Linha vazia
    const linhaVazia = worksheet.addRow([])
    // Insiri os dados Mestrado
    insertData(worksheet, dados, 'Mestrado', linhaVazia.number)
    
    // Doutorado
    // worksheet.mergeCells('A5:J5')
    // worksheet.getCell('A5').value = 'Doutorados'
    // worksheet.getCell('A5').style = cabecalhoStyle
    // worksheet.getRow(4).height = 35
    const comecoDoutorado = worksheet.rowCount + 1
    worksheet.mergeCells(`A${comecoDoutorado}:J${comecoDoutorado}`)
    worksheet.getCell(`A${comecoDoutorado}`).value = 'Doutorados'
    worksheet.getCell(`A${comecoDoutorado}`).style = cabecalhoStyle
    worksheet.getRow(comecoDoutorado).height = 35

    worksheet.addRow(header.map((item: any) => item.header)).eachCell((cell: any) => {
        cell.font = { bold: true, color: { argb: '00000' } }
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    })
    worksheet.getRow(worksheet.rowCount).height = 30

    worksheet.mergeCells(`A${comecoDoutorado + 1}:A${comecoDoutorado + 2}`)
    worksheet.getCell(`A${comecoDoutorado + 1}`).value = 'Nome'
    worksheet.mergeCells(`B${comecoDoutorado + 1}:E${comecoDoutorado + 1}`);
    worksheet.getCell(`B${comecoDoutorado + 1}`).value = 'Atividades Curriculares e Extracurriculares (30 pontos)';
    worksheet.getCell(`B${comecoDoutorado + 2}`).value = 'Mestrado';
    worksheet.getCell(`B${comecoDoutorado + 2}`).style = subHeaderStyle;
    worksheet.getCell(`C${comecoDoutorado + 2}`).value = 'Estágio, Extensão e monitoria';
    worksheet.getCell(`C${comecoDoutorado + 2}`).style = subHeaderStyle;
    worksheet.getCell(`D${comecoDoutorado + 2}`).value = 'Docência';
    worksheet.getCell(`D${comecoDoutorado + 2}`).style = subHeaderStyle;
    worksheet.getCell(`E${comecoDoutorado + 2}`).value = 'IC, IT, ID';
    worksheet.getCell(`E${comecoDoutorado + 2}`).style = subHeaderStyle;
    // worksheet.getCell(`B${comecoDoutorado + 1}`).style = cabecalhoStyle;
    worksheet.mergeCells(`F${comecoDoutorado + 1}:H${comecoDoutorado + 1}`);
    worksheet.getCell(`F${comecoDoutorado + 1}`).value = 'Publicações (70 pontos)';
    worksheet.getCell(`F${comecoDoutorado + 2}`).value = 'A';
    worksheet.getCell(`F${comecoDoutorado + 2}`).style = subHeaderStyle;
    worksheet.getCell(`G${comecoDoutorado + 2}`).value = 'B1 a B2';
    worksheet.getCell(`G${comecoDoutorado + 2}`).style = subHeaderStyle;
    worksheet.getCell(`H${comecoDoutorado + 2}`).value = 'B3 a B5';
    worksheet.getCell(`H${comecoDoutorado + 2}`).style = subHeaderStyle;
    // worksheet.getCell(`F${comecoDoutorado + 1}`).style = cabecalhoStyle;
    worksheet.mergeCells(`I${comecoDoutorado + 1}:I${comecoDoutorado + 2}`);
    worksheet.getCell(`I${comecoDoutorado + 1}`).value = 'Nota';
    // worksheet.getCell(`I${comecoDoutorado + 1}`).style = cabecalhoStyle;
    worksheet.mergeCells(`J${comecoDoutorado + 1}:J${comecoDoutorado + 2}`);
    worksheet.getCell(`J${comecoDoutorado + 1}`).value = 'NAC';
    // worksheet.getCell(`J${comecoDoutorado + 1}`).style = cabecalhoStyle;

    worksheet.getRow(comecoDoutorado + 2).height = 30

    // Insiri os dados Doutorado
    insertData(worksheet, dados, 'Doutorado', worksheet.rowCount + 1)

}