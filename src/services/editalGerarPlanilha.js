
import fs from 'fs';
const exceljs = require('exceljs');

// Pegar o edital do banco de dados

// Transformar os dados para JSON
let testeDados = {nome: "teste", cpf: "12345678910", rg: "123456789", dataNascimento: "01/01/2000", sexo: "Masculino", tipo: "mestrado"}
let testeDados2 = {nome: "teste2", cpf: "12345678910", rg: "123456789", dataNascimento: "01/01/2000", sexo: "Masculino", tipo: "doutorado"}  
let dados = JSON.stringify(testeDados);
let dados2 = JSON.stringify(testeDados2);

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
        { header: 'Tipo', key: 'tipo', width: 10 },
    ];
    // Cria um separador
    worksheet.spliceRows(1,0, [])
    let separador = worksheet.getCell(1,1);
    separador.value = 'Candidatos';
    separador.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFC0C0C0' },
        bgColor: { argb: 'FFC0C0C0' }
    };
    separador.alignment = { vertical: 'middle', horizontal: 'center' };

    // Dados testes
    worksheet.addRow(JSON.parse(dados));

    let separador2 = worksheet.addRow(['']);
    separador2.getCell(1).value = 'Professores';
    separador2.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFC0C0C0' },
        bgColor: { argb: 'FFC0C0C0' }
    };
    separador2.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.addRow(['Nome', 'CPF', 'RG', 'Data de Nascimento', 'Sexo', 'Tipo']);

    // Dados testes
    worksheet.addRow(JSON.parse(dados2));

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