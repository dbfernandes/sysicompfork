import UsuarioService from "../services/usuarioService";
import DocenteService from "../services/docenteService";
const {Publicacao} = require('../models');

const localsMain = {
    layout: 'numerosIcompMain'
}

const localsDashboard = {
    layout: 'numerosIcompDashboard'
}

const inicio = async (req, res) => {
    switch (req.method) {
        case 'GET':
            return res.render('numerosIcomp/inicio', {
                ...localsMain,
            });
        case 'POST':
            return res.send('Erro 400');
    }

}


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

const perfil = async (req, res) => {
    switch (req.method) {
        case 'GET':
            const {id} = req.params
            const professor = await DocenteService.listarUm(id)
            const currentYear = new Date().getFullYear()
            const anos = [...Array(11).keys()].map(i => i + currentYear-10)
            var graficoArtigosConferencias = [0,0,0,0,0,0,0,0,0,0,0] 
            var graficoArtigosPeriodicos = [0,0,0,0,0,0,0,0,0,0,0]                                                       
            var graficoProjetos = [0,0,0,0,0,0,0,0,0,0]                                                       
            professor.artigosConferencias.forEach(artigo =>{
                const idx = anos.findIndex((e=>e==artigo.ano))
                if(idx==-1){
                    graficoArtigosConferencias[0] = graficoArtigosConferencias[0]+1
                }else{
                    graficoArtigosConferencias[idx] = graficoArtigosConferencias[idx]+1
                }
            })

            professor.artigosPeriodicos.forEach(artigo =>{
                const idx = anos.findIndex((e=>e==artigo.ano))
                if(idx==-1){
                    graficoArtigosPeriodicos[0] = graficoArtigosPeriodicos[0]+1
                }else{
                    graficoArtigosPeriodicos[idx] = graficoArtigosPeriodicos[idx]+1
                }
            })
            professor.Projetos.forEach(projeto =>{
                const anosProjeto = projeto.fim == 0 ? 
                [...Array(currentYear-projeto.inicio).keys()].map(i => i + currentYear-(currentYear-projeto.inicio-1)):
                [...Array(projeto.fim-projeto.inicio).keys()].map(i => i + projeto.fim-(projeto.fim-projeto.inicio-1))
                anosProjeto.forEach(ano => {
                    const idx = anos.slice(1).findIndex((e=>e==ano))
                    if(idx>-1){
                        graficoProjetos[idx] = graficoProjetos[idx]+1
                    }
                }) 
            })

            return res.render('numerosIcomp/perfil', {
                professor,
                paperConfLen: professor.artigosConferencias.length,
                paperPerLen: professor.artigosPeriodicos.length,
                bookLen: professor.livros.length,
                chapterLen: professor.capitulos.length,
                ...localsDashboard,
                anos,
                graficoArtigosConferencias,
                graficoArtigosPeriodicos,
                graficoProjetos
            });
        case 'POST':
            return res.send('Erro 400');
    }

}

export default {
	inicio,
    professores,
    perfil
};