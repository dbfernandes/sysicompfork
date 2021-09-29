const express = require('express')
const router = express.Router()
const { Usuario } = require('../models')

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mailer = require('../modules/mailer');

router.get('/login', async (req, res) => {
    return res.render('autenticacao/login', {})
})

router.post('/login', async (req, res) => {
    const { cpf, senha } = await req.body;
    const usuario = await Usuario.findOne({
        where: { username: cpf }
    })

    if (!usuario)
        return res.render('autenticacao/login', {
            message: "Usuário não cadastrado", type: 'danger'
        })

    let isSenhaCorreta = await bcrypt.compare(senha, usuario.password_hash)
    if (!isSenhaCorreta)
        return res.render('autenticacao/login', {
            message: "Senha inválida", type: 'danger'
        })

    req.session.uid = usuario.id
    req.session.nome = `${usuario.nome.split(' ')[0]} ${usuario.nome.split(' ')[usuario.nome.split(' ').length - 1]}`
    return res.redirect('/inicio')
})

router.get('/recuperar-senha', async (req, res) => {
    return res.render('autenticacao/recuperar-senha')
})

router.post('/recuperar-senha', async (req, res) => {
    const { email } = req.body

    try {
        const user = await Usuario.findOne({ where: { email } })

        if (!user)
            return res.render('autenticacao/recuperar-senha', {
                message: "Usuário não encontrado", type: 'danger'
            })

        const token = crypto.randomBytes(20).toString('hex')

        const now = new Date()

        now.setHours(now.getHours() + 1)

        await Usuario.update({
            password_reset_token: token,
            password_reset_expires: now
        }, {
            where: { id: user.id }
        })

        mailer.sendMail({
            to: email,
            from: 'api@test.com.br',
            subject: 'Forgot Password?',
            template: 'auth/forgot_password',
            context: { token },
        }, (err) => {
            if (err)
                return res.render('autenticacao/recuperar-senha', {
                    message: "Não foi possível enviar o e-mail de recuperação de senha. Por favor, tente mais tarde",
                    type: 'danger'
                })

            return res.render('autenticacao/recuperar-senha', {
                message: "Token enviado para o e-mail cadastrado", type: 'success'
            })
        })

    } catch (err) {
        console.log(err)
        return res.render('autenticacao/recuperar-senha', {
            message: "Erro durante a recuperação de senha, tente novamente.",
            type: 'danger'
        })
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        if (err) {
            return console.log(err)
        }
        res.redirect('/login')
    })
})

module.exports = router