import UsuarioService from "../services/usuarioService";
import DocenteService from "../services/docenteService";

// Escolha do Layout
const layoutMain = {
    layout: 'numerosIcompMain'
}

const layoutDashboard = {
    layout: 'numerosIcompDashboard'
}


// Listagem de Docentes

const professores = async (req, res) => {
    switch (req.method) {
        case 'GET':
            try {
                const professores = await UsuarioService.listarTodosPorCondicao({
                    professor: 1
                  })
                return res.status(200).render('numerosIcomp/docentes', {
                    professores,
                    ...layoutMain,
                });
            } catch (error) {
                return res.status(502).send('O Servidor não obteve uma resposta válida. Bad Gateway (502)');
            }
        default:
            return res.status(400).send('A requisição enviada ao servidor é invalida. Bad Request (400)');
    }

}

// Perfil

const perfil = async (req, res) => {
    switch (req.method) {
        case 'GET':
            try {
                const {id} = req.params
                const professor = await DocenteService.listarPerfil(id)
                if(!professor){
                    return res.redirect('/numerosIcomp/docentes')
                }
                return res.render('numerosIcomp/perfil/perfil', {
                    professor,
                    ...layoutDashboard,
                });

            } catch (error) {
                return res.status(502).send('O Servidor não obteve uma resposta válida. Bad Gateway (502)');
            }
        default:
            return res.status(400).send('A requisição enviada ao servidor é invalida. Bad Request (400)');
    }

}

const publicacoes = async (req, res) => {
    switch (req.method) {
        case 'GET':
            try {
                const {id} = req.params
                const professor = await DocenteService.listarPerfil(id)
                if(!professor){
                    return res.redirect('/numerosIcomp/docentes')
                }
                const publicacoes = await DocenteService.listarPublicacoes(id)

                const currentYear = new Date().getFullYear()
                const anos = [...Array(11).keys()].map(i => i + currentYear-10)
                var graficoArtigosConferencias = [0,0,0,0,0,0,0,0,0,0,0] 
                var graficoArtigosPeriodicos = [0,0,0,0,0,0,0,0,0,0,0]                                                                                                          
                publicacoes.artigosConferencias.forEach(artigo =>{
                    const idx = anos.findIndex((e=>e==artigo.ano))
                    if(idx==-1){
                        graficoArtigosConferencias[0] = graficoArtigosConferencias[0]+1
                    }else{
                        graficoArtigosConferencias[idx] = graficoArtigosConferencias[idx]+1
                    }
                })

                publicacoes.artigosPeriodicos.forEach(artigo =>{
                    const idx = anos.findIndex((e=>e==artigo.ano))
                    if(idx==-1){
                        graficoArtigosPeriodicos[0] = graficoArtigosPeriodicos[0]+1
                    }else{
                        graficoArtigosPeriodicos[idx] = graficoArtigosPeriodicos[idx]+1
                    }
                })


                return res.render('numerosIcomp/perfil/perfil-publicacao', {
                    professor,
                    publicacoes,
                    paperConfLen: publicacoes.artigosConferencias.length,
                    paperPerLen: publicacoes.artigosPeriodicos.length,
                    bookLen: publicacoes.livros.length,
                    chapterLen: publicacoes.capitulos.length,
                    ...layoutDashboard,
                    anos,
                    graficoArtigosConferencias,
                    graficoArtigosPeriodicos,
                });

            } catch (error) {
                return res.status(502).send('O Servidor não obteve uma resposta válida. Bad Gateway (502)');
            }
        default:
            return res.status(400).send('A requisição enviada ao servidor é invalida. Bad Request (400)');
    }

}

const pesquisa = async (req, res) => {
    switch (req.method) {
        case 'GET':
            try {
                const {id} = req.params
                const professor = await DocenteService.listarPerfil(id)
                if(!professor){
                    return res.redirect('/numerosIcomp/docentes')
                }
                const projetos = await DocenteService.listarPesquisas(id)
    
                const currentYear = new Date().getFullYear()
                const anos = [...Array(10).keys()].map(i => i + currentYear-9)
                                                        
                var graficoProjetos = [0,0,0,0,0,0,0,0,0,0]                                                       
    
                projetos.forEach(projeto =>{
                    const anosProjeto = projeto.fim == 0 ? 
                    [...Array(currentYear-projeto.inicio).keys()].map(i => i + currentYear-(currentYear-projeto.inicio-1)):
                    [...Array(projeto.fim-projeto.inicio).keys()].map(i => i + projeto.fim-(projeto.fim-projeto.inicio-1))
                    anosProjeto.forEach(ano => {
                        const idx = anos.findIndex((e=>e==ano))
                        if(idx>-1){
                            graficoProjetos[idx] = graficoProjetos[idx]+1
                        }
                    }) 
                })
                return res.render('numerosIcomp/perfil/perfil-projeto', {
                    professor,
                    projetos,
                    projetosLen: projetos.length,
                    ...layoutDashboard,
                    anos,
                    graficoProjetos
                });
                
            } catch (error) {
                return res.status(502).send('O Servidor não obteve uma resposta válida. Bad Gateway (502)');
            }

        default:
            return res.status(400).send('A requisição enviada ao servidor é invalida. Bad Request (400)');
    }

}

const orientacao = async (req, res) => {
    switch (req.method) {
        case 'GET':
            try {
                const {id, tipo} = req.params
                const tipos = ["graduacao","mestrado","doutorado"]
                const t = tipos.findIndex(e=>e==tipo) + 1
                if(t==0){
                    return res.redirect('/numerosIcomp/docentes')
                }
                const professor = await DocenteService.listarPerfil(id)
                if(!professor){
                    return res.redirect('/numerosIcomp/docentes')
                }
                const orientacoes = await DocenteService.listarOrientacoes(id, t)
    
                const currentYear = new Date().getFullYear()
                const anos = [...Array(10).keys()].map(i => i + currentYear-9)
                                                        
                var graficoOrientacoesConcluidas = [0,0,0,0,0,0,0,0,0,0]                                                       
                var graficoOrientacoesAndamento = [0,0,0,0,0,0,0,0,0,0]          
    
                orientacoes.concluidas.forEach(orientacao =>{
                    const idx = anos.findIndex((e=>e==orientacao.ano))
                    if(idx==-1){
                        graficoOrientacoesConcluidas[0] = graficoOrientacoesConcluidas[0]+1
                    }else{
                        graficoOrientacoesConcluidas[idx] = graficoOrientacoesConcluidas[idx]+1
                    }
                })
    
                orientacoes.andamento.forEach(orientacao =>{
                    const idx = anos.findIndex((e=>e==orientacao.ano))
                    if(idx==-1){
                        graficoOrientacoesAndamento[0] = graficoOrientacoesAndamento[0]+1
                    }else{
                        graficoOrientacoesAndamento[idx] = graficoOrientacoesAndamento[idx]+1
                    }
                })
    
                return res.render('numerosIcomp/perfil/perfil-orientacao', {
                    professor,
                    orientacoes,
                    orientacoesConcluidasLen: orientacoes.concluidas.length,
                    orientacoesAndamentoLen: orientacoes.andamento.length,
                    ...layoutDashboard,
                    anos,
                    tipo: tipo == "graduacao" ? "Graduação" : tipo.charAt(0).toUpperCase() + tipo.slice(1),
                    graficoOrientacoesAndamento,
                    graficoOrientacoesConcluidas,
                });
            } catch (error) {
                return res.status(502).send('O Servidor não obteve uma resposta válida. Bad Gateway (502)');
            }
        default:
            return res.status(400).send('A requisição enviada ao servidor é invalida. Bad Request (400)');
    }

}

const premios = async (req, res) => {
    switch (req.method) {
        case 'GET':
            try {
                const {id} = req.params
                const professor = await DocenteService.listarPerfil(id)
                if(!professor){
                    return res.redirect('/numerosIcomp/docentes')
                }
                const premios = await DocenteService.listarPremios(id)

                return res.render('numerosIcomp/perfil/perfil-premio', {
                    premios,
                    professor,
                    premiosLen: premios.length,
                    ...layoutDashboard,
                });
            } catch (error) {
                return res.status(502).send('O Servidor não obteve uma resposta válida. Bad Gateway (502)');
            }
        default:
            return res.status(400).send('A requisição enviada ao servidor é invalida. Bad Request (400)');
    }

}

export default {
    professores,
    perfil,
    publicacoes,
    pesquisa,
    orientacao,
    premios
}