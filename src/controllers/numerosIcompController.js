import UsuarioService from "../services/usuarioService";
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
            const professor = await UsuarioService.listarUm(id)
            return res.render('numerosIcomp/perfil', {
                professor,
                ...localsDashboard,
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