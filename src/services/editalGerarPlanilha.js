
import fs from 'fs';
const exceljs = require('exceljs');

// Pegar o edital do banco de dados

// Transformar os dados para JSON
let testeDados = {nome: "teste", cpf: "12345678910", rg: "123456789", dataNascimento: "01/01/2000", sexo: "Masculino"}
let dados = JSON.stringify(testeDados)

async function gerarPlanilha(editaId) {
    // Create a new instance of a Workbook class
    let workbook = new exceljs.Workbook();
    let worksheet = workbook.addWorksheet('Planilha de Candidatos');

    worksheet.columns = [
        { header: 'Nome', key: 'nome', width: 30 },
        { header: 'CPF', key: 'cpf', width: 15 },
        { header: 'RG', key: 'rg', width: 15 },
        { header: 'Data de Nascimento', key: 'dataNascimento', width: 20 },
        { header: 'Sexo', key: 'sexo', width: 10 },
    ];

    // Add rows in the above header
    worksheet.addRow(JSON.parse(dados));

    // Save Excel on Hard Disk
    await workbook.xlsx.writeFile('planilha.xlsx')
        .then(function() {
            console.log("Arquivo salvo!");
        });
    let arquivo = fs.readFileSync('planilha.xlsx');
    
    return arquivo;
}

export default { gerarPlanilha };