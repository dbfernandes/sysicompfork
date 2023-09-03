const {Usuario} = require('../models');
import bcrypt from "bcrypt";

const adicionar = async (req, res) => {
    if (req.method === 'GET') {
        return res.render('usuarios/usuarios-adicionar', {
            nome: req.session.nome,
            csrfToken: req.csrfToken()
        })
    } else if(req.method === 'POST'){
        console.log("Chegou", req.body)
       try{
            let salt = await bcrypt.genSalt(12);
            let senhaHash = await bcrypt.hash(req.body.senha, salt);

            const administrador = req.body.administrador && req.body.administrador == 'on' ? 1 : 0;
            const coordenador = req.body.coordenador && req.body.coordenador == 'on' ? 1 : 0;;
            const secretaria = req.body.secretaria && req.body.secretaria == 'on' ? 1 : 0;;
            const professor = req.body.professor && req.body.professor == 'on' ? 1 : 0;;
            
            await Usuario.create({
                nomeCompleto: req.body.nomeCompleto,
                cpf: req.body.cpf,
                email: req.body.email,
                senhaHash,
                status: 1,
                administrador,
                coordenador,
                secretaria,
                professor,
                endereco: req.body.endereco,
                telresidencial: req.body.telefoneResidencial,
                telcelular: req.body.telefoneCelular,
                siape: req.body.siape,
                dataIngresso: req.body.dateDeIngresso,
                unidade: req.body.unidade,
                turno: req.body.turno,
                idLattes: null,
            }, {})
    
       }catch(error){
           console.log(error)

       }

       return res.redirect(`/usuarios/listar`);
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