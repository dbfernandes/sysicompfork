const {Usuario} = require('../models');
import bcrypt from "bcrypt";

function criarURL(root, params = {}) {
    if (root instanceof URL) root = root.href;
    params = new URLSearchParams(params).toString();
    const token = !root.endsWith('?') && params ? '?' : '';
    return root + token + params;
  }

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
                telResidencial: req.body.telefoneResidencial,
                telCelular: req.body.telefoneCelular,
                siape: req.body.siape,
                dataIngresso: req.body.dateDeIngresso,
                unidade: req.body.unidade,
                turno: req.body.turno,
                idLattes: null,
            }, {})
    
       }catch(error){
            console.log(error)
            return res.render('usuarios/usuarios-adicionar', {
                nome: req.session.nome,
                csrfToken: req.csrfToken(),
                errors: error.errors,
                message:
                'Não foi possível criar este usuário. Verifique os erros e tente novamente.',
                type: 'danger',
            });

       }

       return res.redirect(
        criarURL('/usuarios/listar', {
            message: 'Usuário criado com sucesso!',
            type: 'success',
        }
       ));
    }
}

const deletar = async (req, res)=> {
    if (req.method === 'POST') {
        try {
            const usuario = await Usuario.findByPk(req.params.id)
            await usuario.update({ 
                status: 0,
            })
            return res.redirect(
                criarURL('/usuarios/listar', {
                  message: 'Usuário excluído com sucesso!',
                  type: 'success',
                })
              );
            
        }catch(error){
            console.log(error)
            return res.redirect(
                criarURL('/usuarios/listar', {
                    message: 'Não foi possível excluir este usuário.',
                    type: 'danger',
                })
              );
        }
    }

    
    

}

const listar = async (req, res) => {
    if (req.method === 'GET') {
        const { message, type } = req.query;
        const usuarios = await Usuario.findAll()
        res.render('usuarios/usuarios-listar', {
            usuarios: usuarios.map(usuario => {
                return {
                    ...usuario.get(),
                    perfis: usuario.perfis()
                }
            }),
            csrfToken: req.csrfToken(),
            nome: req.session.nome,
            message, 
            type
        })
    }
}

const visualizar = async (req, res) => {
    try {
        const { message, type } = req.query;
        const usuario = await Usuario.findByPk(req.params.id, {
            atributes: ["id", "nomeCompleto", "cpf", "email", "status", "siape", 
            "dataIngresso", "endereco", "telCelular", "telResidencial", "unidade", 
            "turno", "idLattes", "createdAt"]
        })
        const usuarioDict = usuario.get()
        usuarioDict["perfil"] = usuario.perfis()
        usuarioDict["createdAt"] = new Date(usuarioDict["createdAt"]).toLocaleString("pt-BR", {
            timeZone: 'America/Manaus',
        }).slice(0,10);
        return res.render("usuarios/usuario-visualizar", {
            usuario: usuarioDict,
            csrfToken: req.csrfToken(),
            nome: req.session.nome,
            message, 
            type
        })
    } catch (error) { 
        console.log(error)
        return res.redirect(
            criarURL('/usuarios/listar', {
                message: 'Não foi possível visualizar este usuário.',
                type: 'danger',
            })
          );
    }
}

const editar = async (req, res) => {
    if(req.method == "GET"){
        try {
            const { message, type } = req.query;
            const usuario = await Usuario.findByPk(req.params.id, {
                atributes: ["id", "nomeCompleto", "cpf", "email", "status", "siape",
                "administrador", "secretaria", "professor", "coordenador",   
                "dataIngresso", "endereco", "telCelular", "telResidencial", "unidade", 
                "turno", "idLattes", "createdAt"]
            })
            const usuarioDict = usuario.get()
            return res.render("usuarios/usuarios-editar", {
                usuario: usuarioDict,
                csrfToken: req.csrfToken(),
                nome: req.session.nome,
                message, 
                type
            })
        } catch (error) { 
            console.log(error)
            return res.redirect(
                criarURL('/usuarios/listar', {
                    message: 'Não foi possível abrir formulário de edição para este usuário.',
                    type: 'danger',
                })
                );
            }
        }else if(req.method == "POST"){
            console.log("Chegou", req.body)
            const administrador = req.body.administrador && req.body.administrador == 'on' ? 1 : 0;
            const coordenador = req.body.coordenador && req.body.coordenador == 'on' ? 1 : 0;;
            const secretaria = req.body.secretaria && req.body.secretaria == 'on' ? 1 : 0;;
            const professor = req.body.professor && req.body.professor == 'on' ? 1 : 0;;
            const dados = { 
                nomeCompleto: req.body.nomeCompleto,
                cpf: req.body.cpf,
                email: req.body.email,
                administrador,
                coordenador,
                secretaria,
                professor,
                endereco: req.body.endereco,
                telResidencial: req.body.telefoneResidencial,
                telCelular: req.body.telefoneCelular,
                siape: req.body.siape,
                dataIngresso: req.body.dateDeIngresso,
                unidade: req.body.unidade,
                turno: req.body.turno,
            }
            if(req.body.senha != ""){
                let salt = await bcrypt.genSalt(12);
                let senhaHash = await bcrypt.hash(req.body.senha, salt);
                dados["senhaHash"] = senhaHash
            }
            try{
            
            
                const usuario = await Usuario.findByPk(req.params.id)
                await usuario.update(dados)

                
                
            }catch(error){
                dados["id"] = req.params.id
                return res.render("usuarios/usuarios-editar", {
                    usuario: dados,
                    csrfToken: req.csrfToken(),
                    nome: req.session.nome,
                    message: 'Não foi possível editar este usuário. Verifique os erros e tente novamente.',
                    type: 'danger',
                    errors: error.errors,
                })
    
            }
    
            return res.redirect(
            criarURL(`/usuarios/dados/${req.params.id}`, {
                message: 'Dados alterados com sucesso!',
                type: 'success',
            }
            ));
        }
    }
export default { adicionar, listar, deletar, visualizar, editar}













