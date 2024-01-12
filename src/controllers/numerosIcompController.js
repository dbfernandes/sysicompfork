import UsuarioService from "../services/usuarioService";
import DocenteService from "../services/docenteService";
import AlunoService from "../services/alunoService";
import ProjetoService from "../services/projetoService"
import PublicacaoService from "../services/publicacaoService";
import { Op } from "sequelize";

const localsMain = {
    layout: 'numerosIcompMain'
}

const localsDashboard = {
    layout: 'numerosIcompDashboard'
}

// Home-page

const inicio = async (req, res) => {
    switch (req.method) {
        case 'GET':
            const contagem = await AlunoService.contarTodos()
            return res.render('numerosIcomp/inicio', {
                ...localsMain,
                contagem
            });
        case 'POST':
            return res.send('Erro 400');
    }

}

// Listagem de Docentes

const professores = async (req, res) => {
    switch (req.method) {
        case 'GET':
            const professores = await UsuarioService.listarTodosPorCondicao({
                professor: 1
              })
            return res.render('numerosIcomp/docentes', {
                professores,
                ...localsMain,
            });
        case 'POST':
            return res.send('Erro 400');
    }

}

// Listagem Projetos

const projetos = async (req, res) => {
    switch (req.method ) {
        case "GET":
            const projetosFiltrados = await ProjetoService.listarAtuais()

            return res.status(200).render('numerosIcomp/projetos', {
                ...localsMain,
                projetosFiltrados
            })
        default:
            return res.status(400)

    }
}

// Listagem de Alunos

const alunos = async (req, res) => {
    switch (req.method) {
        case 'GET':
            const {curso} = req.params
            const cursos = ["processamento-de-dados","ciencia-computacao","engenharia-de-software", "mestrado", "doutorado"]
            const c = cursos.findIndex(e=>e==curso) + 1
            if(c){
                const cursoSearch = curso == "ciencia-computacao" ? "Ciência Da Computação" : 
                curso.split("-").map((p)=> {
                    const palavra = p == 'de' ? p : p.charAt(0).toUpperCase() + p.slice(1) 
                    return palavra
                }).join(" ")
                const alunosInfo = await AlunoService.listarTodos(
                    cursoSearch == "Engenharia de Software" ? ["Engenharia de Software", "Sistemas de Informação"] : cursoSearch, 
                    1)
                const alunosFormados = alunosInfo.length                             
                return res.render('numerosIcomp/alunos', {
                    alunosInfo,
                    alunosFormados,
                    ...localsMain,
                    curso: cursoSearch == "Engenharia de Software" ? cursoSearch +" / Sistemas de Informação" : cursoSearch,
                });
            }else{
                return res.send('Erro 400');
            }
        case 'POST':
            return res.send('Erro 400');
    }

}

// Listagem Publicações

const publicacaoList = async (req, res) => {
    switch (req.method) {
        case "GET":
            const ano = new Date().getFullYear()
            const publicacoes = await PublicacaoService.listarTodos({
                ano: {
                    [Op.gt]: ano - 3
                }
            })

            return res.render('numerosIcomp/publicacoes', {
                ...localsMain,
                publicacoes,
                ano
            });
    
        default:

        return res.status(400)
            break;
    }
}

// Perfil

const perfil = async (req, res) => {
    switch (req.method) {
        case 'GET':
            const {id} = req.params
            const professor = await DocenteService.listarPerfil(id)

            return res.render('numerosIcomp/perfil/perfil', {
                professor,
                ...localsDashboard,
            });
        case 'POST':
            return res.send('Erro 400');
    }

}

const publicacoes = async (req, res) => {
    switch (req.method) {
        case 'GET':
            const {id} = req.params
            const professor = await DocenteService.listarPerfil(id)
            const publicacoes = await DocenteService.listarPublicacoes(id)

            const currentYear = new Date().getFullYear()
            const anos = [...Array(11).keys()].map(i => i + currentYear-10)
            var graficoArtigosConferencias = [0,0,0,0,0,0,0,0,0,0,0] 
            var graficoArtigosPeriodicos = [0,0,0,0,0,0,0,0,0,0,0]                                                       
            var graficoProjetos = [0,0,0,0,0,0,0,0,0,0]                                                       
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
                ...localsDashboard,
                anos,
                graficoArtigosConferencias,
                graficoArtigosPeriodicos,
            });
        case 'POST':
            return res.send('Erro 400');
    }

}

const pesquisa = async (req, res) => {
    switch (req.method) {
        case 'GET':
            const {id} = req.params
            const professor = await DocenteService.listarPerfil(id)
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
                ...localsDashboard,
                anos,
                graficoProjetos
            });
        case 'POST':
            return res.send('Erro 400');
    }

}

const orientacao = async (req, res) => {
    switch (req.method) {
        case 'GET':
            const {id, tipo} = req.params
            const tipos = ["graduacao","mestrado","doutorado"]
            const t = tipos.findIndex(e=>e==tipo) + 1
            if(t){
                const professor = await DocenteService.listarPerfil(id)

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
                    ...localsDashboard,
                    anos,
                    tipo: tipo == "graduacao" ? "Graduação" : tipo.charAt(0).toUpperCase() + tipo.slice(1),
                    graficoOrientacoesAndamento,
                    graficoOrientacoesConcluidas,
                });
            }else{
                return res.send('Erro 400');
            }
        case 'POST':
            return res.send('Erro 400');
    }

}

const premios = async (req, res) => {
    switch (req.method) {
        case 'GET':
            const {id} = req.params
            const premios = await DocenteService.listarPremios(id)
            const professor = await DocenteService.listarPerfil(id)

            return res.render('numerosIcomp/perfil/perfil-premio', {
                premios,
                professor,
                premiosLen: premios.length,
                ...localsDashboard,
            });
        case 'POST':
            return res.send('Erro 400');
    }

}


export default {
	inicio,
    professores,
    perfil,
    publicacoes,
    pesquisa,
    orientacao,
    premios,
    alunos,
    projetos,
    publicacaoList
};