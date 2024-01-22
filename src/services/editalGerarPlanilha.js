
import fs from 'fs';
const exceljs = require('exceljs');

// Pegar o edital do banco de dados

// Transformar os dados para JSON
let testeDados = { nome: 'Teste', email: 'asd@email.com', 
    inscricao: '123456', linha: 'Teste', orientador: 'Teste', bolsa: 'Teste', nivel: 'Teste' };

let testeDados2 = { nome: 'Teste2', email: 'asd@asd.com',
    inscricao: '123456', linha: 'Teste', orientador: 'Teste', bolsa: 'Teste', nivel: 'Teste' };

let dados = JSON.stringify(testeDados);
let dados2 = JSON.stringify(testeDados2);

async function gerarPlanilha(editaId) {
    // Create a new instance of a Workbook class
    let workbook = new exceljs.Workbook();
    // Novas abas na planilhas
    let worksheetCandidatos = workbook.addWorksheet('Candidato');
    let worksheetProvas = workbook.addWorksheet('Provas');
    let worksheetPropostas = workbook.addWorksheet('Propostas');
    

    worksheetCandidatos.columns = [
        { header: 'Nome', key: 'nome', width: 40 },
        { header: 'Email', key: 'email', width: 40 },
        { header: 'Inscrição', key: 'inscricao', width: 20 },
        { header: 'Linha', key: 'linha', width: 10 },
        { header: 'Orientador', 'key': 'orientador', width: 40 },
        { header: 'Bolsa', key: 'bolsa', width: 15 },
        { header: 'Nível', key: 'nivel', width: 15 },
    ];

    let headerRow = worksheetCandidatos.getRow(1);
    headerRow.eachCell((cell, number) => {
        cell.font = { bold: true, color: { argb: '00000' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    headerRow.height = 30;
    
    // Cria um separador
    worksheetCandidatos.spliceRows(1,0, [])

    for (let i = 1; i <= 7; i++) {
        let cell = worksheetCandidatos.getCell(1, i); 
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC0C0C0' },
            bgColor: { argb: 'FFC0C0C0' }
        };
        cell.font = {color: { argb: 'FFFFFF' } };

        if (i == 4) {
            cell.value = 'Mestrados';
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } 
    }

    // Dados testes
    worksheetCandidatos.addRow(JSON.parse(dados));
    
    // Cria um separador
    let separador2 = worksheetCandidatos.addRow(['']);
    for (let i = 1; i <= 7; i++) {
        let cell = worksheetCandidatos.getCell(separador2.number, i); 
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC0C0C0' },
            bgColor: { argb: 'FFC0C0C0' }
        };
        cell.font = {color: { argb: 'FFFFFF' } };

        if (i == 4) {
            cell.value = 'Doutorados';
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } 
    }

    let linhaHeaderDoutorados = worksheetCandidatos.addRow(
        ['Nome', 'Email', 'Inscrição', 'Linha', 'Orientador', 'Bolsa', 'Nível']
    );

    linhaHeaderDoutorados.eachCell((cell, number) => {
        cell.font = { bold: true, color: { argb: '00000' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    linhaHeaderDoutorados.height = 30;

    // Dados testes
    worksheetCandidatos.addRow(JSON.parse(dados2));



    // Save Excel on Hard Disk
    await workbook.xlsx.writeFile('planilha.xlsx')
        .then(function() {
            console.log("Arquivo salvo!");
        }).catch(function(error) {
            console.log(error.message);
    });
    
    let arquivo = fs.readFileSync('planilha.xlsx');
    
    return arquivo;
}

export default { gerarPlanilha };