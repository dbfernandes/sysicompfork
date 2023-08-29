const {Usuario} = require('../models');


const adicionar = async (req, res) => {
    if (req.method === 'GET') {
        return res.render('usuarios/usuarios-adicionar', {
            nome: req.session.nome
        })
    }
}

const listar = async (req, res) => {
    if (req.method === 'GET') {
        const usuarios = await Usuario.findAll()
        res.render('usuarios/usuarios-listar', {
            usuarios: usuarios.map(usuario => {
                return {
                    ...usuario.get(),
                    perfis: usuario.perfis()
                }
            }),
            nome: req.session.nome
        })
    }
}
export default { adicionar, listar}