
function getCSVData(data, cb){
    const files = document.querySelector('#formCSV').files;
    const alunoArr = []
    
    if(files.length > 0 ){

        // Selected file
        const file = files[0];

        // FileReader Object
        const reader = new FileReader();

        // Read file as string 
        reader.readAsText(file, "ISO-8859-1");

        // Load event
        reader.onload = function(event) {

            // Read file data
            const csvdata = event.target.result;
            const csvArray = $.csv.toArrays(csvdata, {
                separator: ";"
            })
            csvArray.forEach(row => {
                if(row[5] === "Sem Evasão" || row[5] === "Formado"){
                    const nomeCompleto = row[1]
                    const formado = row[5] == "Formado" ? 1 : 0
                    var curso = row[6]
                    switch (curso) {
                        case "IE06":
                            curso = "Processamento de Dados"
                            break;
                    
                        case "IE08":
                            curso = "Ciência da Computação"
                            break;
                    
                        case "IE15":
                            curso = "Sistemas de Informação"
                            break;
                    
                        case "IE17":
                            curso = "Engenharia de Software"
                            break;
                        
                        case "PPG-INF-D":
                            curso = "Doutorado"
                            break;
                    
                        case "PPG-INF-M":
                            curso = "Mestrado"
                            break;
                    
                        default:
                            break;
                    }
                    const periodoIngresso = row[10].slice(0,4)
                    const periodoConclusao = row[11].length > 0 ? row[11].slice(6,10) : row[12].length > 0 ? row[12].slice(0,4) : null
    
                    const alunoData = {
                        nomeCompleto,
                        curso,
                        periodoIngresso,
                        periodoConclusao,
                        formado,
                    }
                    
                    alunoArr.push(alunoData)
                }
            });
            data["alunos"] = alunoArr
            cb(data)
        }
    }
}