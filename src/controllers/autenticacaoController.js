// const {Usuario} = require('../models');
import UsuarioService from '../services/usuarioService';
const bcrypt = require('bcrypt');


const autorizarAdmin = async (req, res, next) => {
    if (req.session.tipoUsuario.administrador || req.session.tipoUsuario.secretaria) next();
    else return res.redirect('/');
}
const autorizarCoord = async (req, res, next) => {
    if (req.session.tipoUsuario.administrador || req.session.tipoUsuario.secretaria || 
        req.session.tipoUsuario.coordenador) next();
    else return res.redirect('/');
}
const autorizarProf = async (req, res, next) => {
    if (req.session.tipoUsuario.administrador || req.session.tipoUsuario.secretaria || 
        req.session.tipoUsuario.professor) next();
    else return res.redirect('/');
}

const login = async (req, res) => {

      
    if (req.method === 'GET') {
        if (req.session.uid) return res.redirect('/');
        return res.render('autenticacao/login', {
            csrfToken: req.csrfToken(),
        });
    }
    else if (req.method === 'POST') {
        try{
            const { cpf, senha } = await req.body;
            const usuario = await UsuarioService.buscarUsuarioPor({cpf: cpf});
       
            if (!usuario){
                console.log("teste");
    
                return res.render('autenticacao/login', {
                    csrfToken: req.csrfToken(),
                    message: "Usuário não cadastrado", type: 'danger'
                })
            }else if(usuario.status == 0){
                return res.render('autenticacao/login', {
                    csrfToken: req.csrfToken(),
                    message: "Usuário bloqueado. Contate a administração.", type: 'danger'
                })
            }

            let isSenhaCorreta = await bcrypt.compare(senha, usuario.senhaHash)
            if (!isSenhaCorreta){
                return res.render('autenticacao/login', {
                    csrfToken: req.csrfToken(),
                    message: "Senha inválida", type: 'danger'
                })
            }

            req.session.uid = usuario.id
            req.session.nome = `${usuario.nomeCompleto.split(' ')[0]}${usuario.nomeCompleto.split(' ').length > 1 ? 
            " "+usuario.nomeCompleto.split(' ')[usuario.nomeCompleto.split(' ').length - 1] : 
            ""}`
            req.session.tipoUsuario = {
                administrador: usuario.administrador,
                coordenador: usuario.coordenador,
                secretaria: usuario.secretaria,
                professor: usuario.professor
            }
            req.session.uid = usuario.id
            return res.redirect('/inicio')
        }catch(err){
            console.log(err);
        }
    }
}

const recuperar_senha = async (req, res) => {
    if (req.method === 'POST') {

        const { email } = req.body

        try {
            const user = await UsuarioService.buscarUsuarioPor({email: email});

            if (!user)
                return res.render('autenticacao/recuperar-senha', {
                    csrfToken: req.csrfToken(),
                    message: "Usuário não encontrado", type: 'danger'
                })
                
            const token = crypto.randomBytes(20).toString('hex')

            const now = new Date()

            now.setHours(now.getHours() + 1)

            // await Usuario.update({
            //     tokenResetSenha: token,
            //     validadeTokenResetSenha: now
            // }, {
            //     where: { id: user.id }
            // })

            await UsuarioService.recuperarSenha(token, now, user.id)

            mailer.sendMail({
                to: email,
                from: 'api@test.com.br',
                subject: 'Forgot Password?',
                template: 'auth/forgot_password',
                context: { token },
            }, (err) => {
                if (err)
                    return res.render('autenticacao/recuperar-senha', {
                        csrfToken: req.csrfToken(),
                        message: "Não foi possível enviar o e-mail de recuperação de senha. Por favor, tente mais tarde",
                        type: 'danger'
                    })

                return res.render('autenticacao/recuperar-senha', {
                    csrfToken: req.csrfToken(),
                    message: "Token enviado para o e-mail cadastrado", type: 'success'
                })
            })

        } catch (err) {
            console.log(err)
            return res.render('autenticacao/recuperar-senha', {
                csrfToken: req.csrfToken(),
                message: "Erro durante a recuperação de senha, tente novamente.",
                type: 'danger'
            })
        }
    }
    else if (req.method === 'GET'){
        return res.render('autenticacao/recuperar-senha', {
            csrfToken: req.csrfToken()
        })
    }
}

const logout = async (req, res) => {
    if (req.method === 'GET') {
        req.session.destroy(function (err) {
            if (err) {
                return console.log(err)
            }
            res.redirect('/login')
        })
    }
}

const verificar = async (req, res,next) => {
    if (!req.session.uid) return res.redirect('/login');
    next();
}
export default { logout, recuperar_senha, login , verificar, autorizarAdmin, autorizarCoord, autorizarProf }