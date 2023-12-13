
function get_index(obj, idx){
    const keys = Object.keys(obj);
    for (var key in keys){
        if(keys[key].includes(idx)){
            return keys[key]
        }
    }
    return ""
}

function get_projetos_from_instituicao(instituicoes){
    if(instituicoes.length > 0){
        for (var idx in instituicoes){
            if(instituicoes[idx]["_CODIGO-INSTITUICAO"]=="008200000000"){
                return instituicoes[idx]["ATIVIDADES-DE-PARTICIPACAO-EM-PROJETO"]
            }
        }
    }else{
        return instituicoes["ATIVIDADES-DE-PARTICIPACAO-EM-PROJETO"]
    }
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

function get_projectDict(dados, nome, idLattes){
    const titulo = dados["_NOME-DO-PROJETO"]
    const descricao = dados["_DESCRICAO-DO-PROJETO"]
    const inicio = dados["_ANO-INICIO"]
    const fim = dados["_ANO-FIM"]
    var integrantes = []
    var papel = ""
    var financiadores = []
    
    const integrantesArr = dados["EQUIPE-DO-PROJETO"]["INTEGRANTES-DO-PROJETO"]
    if(integrantesArr.length > 0){
        for (var i in integrantesArr){
            integrantes.push(integrantesArr[i]["_NOME-COMPLETO"])
            if(integrantesArr[i]["_NRO-ID-CNPQ"] == idLattes || integrantesArr[i]["_NOME-COMPLETO"] == nome){
                papel = integrantesArr[i]["_FLAG-RESPONSAVEL"] == "SIM" ? "Coordenador" : "Participante"
            }
        }
    }else{
        integrantes = integrantesArr["_NOME-COMPLETO"]
        papel = "Coordenador"
    }

    const financiadoresArr = dados["FINANCIADORES-DO-PROJETO"]
    if(financiadoresArr){
        if(financiadoresArr["FINANCIADOR-DO-PROJETO"].length > 0){
            for (var j in financiadoresArr["FINANCIADOR-DO-PROJETO"]){
                var nomeFinanciador = financiadoresArr["FINANCIADOR-DO-PROJETO"][j]["_NOME-INSTITUICAO"]
                financiadores.push(nomeFinanciador == "" ? "Não possui" : nomeFinanciador)
            }
        }else{
            var nomeFinanciador = financiadoresArr["FINANCIADOR-DO-PROJETO"]["_NOME-INSTITUICAO"]
            financiadores = nomeFinanciador == "" ? "Não possui" : nomeFinanciador
        }
    }else{
        financiadores.push("Não possui")
    }

    return {
        titulo,
        descricao,
        inicio,
        fim,
        integrantes: typeof integrantes != "string" ? integrantes.join("; ") : integrantes,
        financiadores: typeof financiadores != "string" ? financiadores.join("; ") : financiadores,
        papel,
    }
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
        const publicacoes = xmlText["CURRICULO-VITAE"]["PRODUCAO-BIBLIOGRAFICA"] 
        let publicDict = {}
        if(publicacoes){
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
        const nomeCompleto = xmlText["CURRICULO-VITAE"]["DADOS-GERAIS"]["NOME-COMPLETO"]
        const userDict = {}
        userDict["idLattes"] = xmlText["CURRICULO-VITAE"]["_NUMERO-IDENTIFICADOR"]
        userDict["resumo"] = xmlText["CURRICULO-VITAE"]["DADOS-GERAIS"]["RESUMO-CV"] ? xmlText["CURRICULO-VITAE"]["DADOS-GERAIS"]["RESUMO-CV"]["_TEXTO-RESUMO-CV-RH"] : ""
        userDict["ultimaAtualizacao"] = new Date()
        const formacao = xmlText["CURRICULO-VITAE"]["DADOS-GERAIS"]["FORMACAO-ACADEMICA-TITULACAO"]
        var formacaoTexto = ""
        if(formacao.hasOwnProperty("DOUTORADO")){
            formacaoTexto += "Doutorado;"
            if(formacao["DOUTORADO"].length > 0){
                formacaoTexto +=  formacao["DOUTORADO"][0]["_NOME-CURSO"] +";"+formacao["DOUTORADO"][0]["_NOME-INSTITUICAO"]+";"+ formacao["DOUTORADO"][0]["_ANO-DE-CONCLUSAO"]+";"
            }else{
                formacaoTexto +=  formacao["DOUTORADO"]["_NOME-CURSO"] +";"+formacao["DOUTORADO"]["_NOME-INSTITUICAO"]+";"+ formacao["DOUTORADO"]["_ANO-DE-CONCLUSAO"]+";"
            }
        }else if(formacao.hasOwnProperty("MESTRADO")){
            if(formacao["MESTRADO"].length > 0){
                formacaoTexto +=  formacao["MESTRADO"][0]["_NOME-CURSO"] +";"+formacao["MESTRADO"][0]["_NOME-INSTITUICAO"]+";"+ formacao["MESTRADO"][0]["_ANO-DE-CONCLUSAO"]+";"
            }else{
                formacaoTexto +=  formacao["MESTRADO"]["_NOME-CURSO"] +";"+formacao["MESTRADO"]["_NOME-INSTITUICAO"]+";"+ formacao["MESTRADO"]["_ANO-DE-CONCLUSAO"]+";"
            }
        }else{
            if(formacao["GRADUACAO"].length > 0){
                formacaoTexto +=  formacao["GRADUACAO"][0]["_NOME-CURSO"] +";"+formacao["GRADUACAO"][0]["_NOME-INSTITUICAO"]+";"+ formacao["GRADUACAO"][0]["_ANO-DE-CONCLUSAO"]+";"
            }else{
                formacaoTexto +=  formacao["GRADUACAO"]["_NOME-CURSO"] +";"+formacao["GRADUACAO"]["_NOME-INSTITUICAO"]+";"+ formacao["GRADUACAO"]["_ANO-DE-CONCLUSAO"]+";"
            }
        }
        userDict["formacao"] = formacaoTexto

        const publicacoes = xmlText["CURRICULO-VITAE"]["PRODUCAO-BIBLIOGRAFICA"]
        let publicDict = {}
        if(publicacoes){
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

        const instituicoes = xmlText["CURRICULO-VITAE"]["DADOS-GERAIS"]["ATUACOES-PROFISSIONAIS"]["ATUACAO-PROFISSIONAL"]
        const projetos = get_projetos_from_instituicao(instituicoes)
        console.log(projetos)
        const projectDict = { "projetos": []}
        if(projetos){
            if(projetos["PARTICIPACAO-EM-PROJETO"].length > 0){
                sub_val = projetos["PARTICIPACAO-EM-PROJETO"]
                for (var p in sub_val){
                    if(sub_val[p]["PROJETO-DE-PESQUISA"].length > 0){
                        for (var o in sub_val[p]["PROJETO-DE-PESQUISA"]){
                             const project = get_projectDict(sub_val[p]["PROJETO-DE-PESQUISA"][o], nomeCompleto, userDict["idLattes"])
                             projectDict["projetos"].push(project)
                        }
                    }else{
                        const project = get_projectDict(sub_val[p]["PROJETO-DE-PESQUISA"], nomeCompleto, userDict["idLattes"])
                        projectDict["projetos"].push(project)
                    }
                }
            }else{
                const project = get_projectDict(sub_val["PROJETO-DE-PESQUISA"], nomeCompleto, userDict["idLattes"])
                projectDict["projetos"].push(project)
            }
        }

        const premios =  xmlText["CURRICULO-VITAE"]["DADOS-GERAIS"]["PREMIOS-TITULOS"] == undefined ? null : xmlText["CURRICULO-VITAE"]["DADOS-GERAIS"]["PREMIOS-TITULOS"]["PREMIO-TITULO"]
        let premiosArr= []
        if(premios){
            if(premios.length>0){
                for(var i in premios){
                    const titulo = premios[i]["_NOME-DO-PREMIO-OU-TITULO"]
                    const ano = premios[i]["_ANO-DA-PREMIACAO"]
                    const entidade = premios[i]["_NOME-DA-ENTIDADE-PROMOTORA"]
                    premiosArr.push({
                        titulo,
                        ano,
                        entidade
                    })
                }
            }else{
                const titulo = premios["_NOME-DO-PREMIO-OU-TITULO"]
                const ano = premios["_ANO-DA-PREMIACAO"]
                const entidade = premios["_NOME-DA-ENTIDADE-PROMOTORA"]
                premiosArr.push({
                    titulo,
                    ano,
                    entidade
                })
            }
        }

        data.append("projetos", JSON.stringify(projectDict))
        data.append("premios", JSON.stringify({"premios": premiosArr}))
        data.append("publicacoes", JSON.stringify(publicDict));
        data.append("info", JSON.stringify(userDict));
        publicCallback(data)
    },
    false,
    );
    reader.readAsText(file, "ISO-8859-1");
}