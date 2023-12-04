function get_index(obj, idx){
    const keys = Object.keys(obj);
    for (var key in keys){
        if(keys[key].includes(idx)){
            return keys[key]
        }
    }
    return ""
}

function get_publicDict(dados){
    const autoresArr = dados["AUTORES"]
    const autores = {
        nomeCompleto: [], 
        nomeAbreviado: [],
    }
    if(autoresArr.length>0){
        for (a in autoresArr){
            autores.nomeCompleto.push(autoresArr[a]["_NOME-COMPLETO-DO-AUTOR"])
            autores.nomeAbreviado.push(autoresArr[a]["_NOME-PARA-CITACAO"])
        }
    }else{
        autores.nomeCompleto.push(autoresArr["_NOME-COMPLETO-DO-AUTOR"])
        autores.nomeAbreviado.push(autoresArr["_NOME-PARA-CITACAO"])
    }
    
    const dbIndx = get_index(dados, "DADOS-BASICOS")
    const anoIdx = get_index(dados[dbIndx], "_ANO")
    const ano = dados[dbIndx][anoIdx]
    const tituloIdx = get_index(dados[dbIndx], "_TITULO")
    const titulo = dados[dbIndx][tituloIdx]
    const natIdx = get_index(dados[dbIndx], "_NATUREZA")
    const natureza = dados[dbIndx][natIdx]
    const dtIndx = get_index(dados, "DETALHAMENTO")
    const issnIdx = get_index(dados[dtIndx], "_IS")
    const issn = dados[dtIndx][issnIdx]
    const localIdx = get_index(dados[dtIndx], "_NOME-DO-EVENTO") != '' ? get_index(dados[dtIndx], "_NOME-DO-EVENTO") : get_index(dados[dtIndx], "_TITULO-")
    const local = dados[dtIndx][localIdx]
    //localIdx = get_index(sub_val[l][dtIndx], "_LOCAL") 
    const pub = {
        titulo,
        autores,
        ano,
        issn,
        local,
        natureza
    }
    return pub
}

function getCompleteData(data, publicCallback){
    const [file] = document.querySelector("input[type=file]").files; 
    const reader = new FileReader(); 
    var xmlText = "" 
    var x2js = new X2JS(); 
    reader.addEventListener(
        "load", 
        () => { 
        xmlText = x2js.xml_str2json(reader.result); 
        console.log(xmlText)
        const publicacoes = xmlText["CURRICULO-VITAE"]["PRODUCAO-BIBLIOGRAFICA"] 
        let publicDict = {}
        if(publicacoes){
            console.log(publicacoes)
            for(var i in publicacoes){
                var val = publicacoes[i];
                for(var j in val){
                    var sub_key = j;
                    var sub_val = val[j];
                    if(sub_val.length > 0){
                        publicDict[j] = []
                        for (var m in sub_val){
                            const public = get_publicDict(sub_val[m])
                            publicDict[j].push(public)

                        }
                    }else{
                        if(sub_val.hasOwnProperty("AUTORES")){
                            publicDict[j] = []
                            const public = get_publicDict(sub_val)
                            publicDict[j].push(public)
                        }else{
                            for(var k in sub_val){
                                if(sub_val[k].length > 0){
                                    publicDict[k] = []
                                    for (var l in sub_val[k]){
                                        const public = get_publicDict(sub_val[k][l])
                                        publicDict[k].push(public)
                                    }
                                }else{
                                    if(sub_val[k].hasOwnProperty("AUTORES")){
                                        publicDict[k] = []
                                        const public = get_publicDict(sub_val[k])
                                        publicDict[k].push(public)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        data["publicacoes"] = publicDict
        publicCallback(data)
        },
        false,
    );
    reader.readAsText(file, "ISO-8859-1");
}

function getCompleteFormData(data, publicCallback){
    const [file] = document.querySelector("input[type=file]").files; 
    const reader = new FileReader(); 
    var xmlText = "" 
    var x2js = new X2JS(); 
    reader.addEventListener(
        "load", 
        () => { 
        xmlText = x2js.xml_str2json(reader.result); 
        console.log(xmlText)
        const publicacoes = xmlText["CURRICULO-VITAE"]["PRODUCAO-BIBLIOGRAFICA"] 
        let publicDict = {}
        if(publicacoes){
            console.log(publicacoes)
            for(var i in publicacoes){
                var val = publicacoes[i];
                for(var j in val){
                    var sub_key = j;
                    var sub_val = val[j];
                    if(sub_val.length > 0){
                        publicDict[j] = []
                        for (var m in sub_val){
                            const public = get_publicDict(sub_val[m])
                            publicDict[j].push(public)

                        }
                    }else{
                        if(sub_val.hasOwnProperty("AUTORES")){
                            publicDict[j] = []
                            const public = get_publicDict(sub_val)
                            publicDict[j].push(public)
                        }else{
                            for(var k in sub_val){
                                if(sub_val[k].length > 0){
                                    publicDict[k] = []
                                    for (var l in sub_val[k]){
                                        const public = get_publicDict(sub_val[k][l])
                                        publicDict[k].push(public)
                                    }
                                }else{
                                    if(sub_val[k].hasOwnProperty("AUTORES")){
                                        publicDict[k] = []
                                        const public = get_publicDict(sub_val[k])
                                        publicDict[k].push(public)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        
        data.append("publicacoes", JSON.stringify(publicDict));
        publicCallback(data)
        },
        false,
    );
    reader.readAsText(file, "ISO-8859-1");
}