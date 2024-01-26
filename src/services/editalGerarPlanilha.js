
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

    worksheetProvas.columns = [
        { header: 'Nome', key: 'nome', width: 40 },
        { header: 'Inscrição', key: 'inscricao', width: 20 },
        { header: 'Nota Final', key: 'notaFinal', width: 20 }
    ];

    let headerRowProvas = worksheetProvas.getRow(1);
    headerRowProvas.eachCell((cell, number) => {
        cell.font = { bold: true, color: { argb: '00000' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    headerRowProvas.height = 30;
    
    // Cria um separador
    worksheetProvas.spliceRows(1,0, [])

    for (let i = 1; i <= 3; i++) {
        let cell = worksheetProvas.getCell(1, i); 
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC0C0C0' },
            bgColor: { argb: 'FFC0C0C0' }
        };
        cell.font = {color: { argb: 'FFFFFF' } };

        if (i == 2) {
            cell.value = 'Mestrados';
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } 
    }

    // Dados testes

    // Cria um separador
    let separadorProvas2 = worksheetProvas.addRow(['']);
    separador2.height = 30;
    for (let i = 1; i <= 3; i++) {
        let cell = worksheetProvas.getCell(separadorProvas2.number, i); 
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC0C0C0' },
            bgColor: { argb: 'FFC0C0C0' }
        };
        cell.font = {color: { argb: 'FFFFFF' } };

        if (i == 2) {
            cell.value = 'Doutorados';
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } 
    }

    let linhaHeaderProvasDoutorados = worksheetProvas.addRow(
        ['Nome', 'Inscrição', 'Nota Final']
    );

    linhaHeaderProvasDoutorados.eachCell((cell, number) => {
        cell.font = { bold: true, color: { argb: '00000' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    }
    );
    linhaHeaderProvasDoutorados.height = 30;

    // Dados testes

    worksheetPropostas.columns = [
        { header: 'Nome', key: 'nome', width: 40 },
        { header: 'Avaliador 1', key: 'avaliador1', width: 40 },
        { header: 'Avaliador 2', key: 'avaliador2', width: 40 },
        { header: 'Avaliador 3', key: 'avaliador3', width: 40 },
        { header: 'Media Final', key: 'mediaFinal', width: 20 }
    ];

    let headerRowPropostas = worksheetPropostas.getRow(1);
    headerRowPropostas.eachCell((cell, number) => {
        cell.font = { bold: true, color: { argb: '00000' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    headerRowPropostas.height = 30;

    // Cria um separador
    worksheetPropostas.spliceRows(1,0, [])

    for (let i = 1; i <= 5; i++) {
        let cell = worksheetPropostas.getCell(1, i); 
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC0C0C0' },
            bgColor: { argb: 'FFC0C0C0' }
        };

        if (i == 2) {
            cell.value = 'Mestrados';
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
        cell.font = {color: { argb: 'FFFFFF' } };
    }

    // Dados testes

    // Cria um separador
    let separadorPropostas2 = worksheetPropostas.addRow(['']);
    for (let i = 1; i <= 5; i++) {
        let cell = worksheetPropostas.getCell(separadorPropostas2.number, i); 
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC0C0C0' },
            bgColor: { argb: 'FFC0C0C0' }
        };
        cell.font = {color: { argb: 'FFFFFF' } };

        if (i == 2) {
            cell.value = 'Doutorados';
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } 
    }

    let linhaHeaderPropostas = worksheetPropostas.addRow(
        ['Nome', 'Avaliador 1', 'Avaliador 2', 'Avaliador 3', 'Media Final']
    );

    linhaHeaderPropostas.eachCell((cell, number) => {
        cell.font = { bold: true, color: { argb: '00000' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    }
    );
    linhaHeaderPropostas.height = 30;
    
    


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