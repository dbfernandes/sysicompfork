const express = require('express')
const router = express.Router()
const { Usuario } = require('../models')

const bcrypt = require("bcrypt");
const crypto = require('crypto');
const mailer = require('../modules/mailer')

router.get('/login', async (req, res) => {
    return res.render('layouts/autenticacao/login')
})

router.post('/login', async (req, res) => {
    const { cpf, password } = req.body;

    const user = await Usuario.findOne({
        where: { cpf },
        attributes: { 
            exclude: [
                'password_reset_token', 
                'password_reset_expires',
                'confirm_token'
            ]
        }
    })

    if(!user)
        return res.render('layouts/autenticacao/login', {
            message: "Usuário não cadastrado", type: 'danger'
        })
    
    //if(!user.confirmed)
    //    return res.render('layouts/autenticacao/login', {message: "Por favor, confirme seu e-mail para realizar login"})
    
    if(!await bcrypt.compare(password, user.password_hash))
        return res.render('layouts/autenticacao/login', {
            message: "Senha inválida", type: 'danger'
        })

    return res.render('layouts/inicio/inicio')
})

router.get('/recuperar-senha', async (req, res) => {
    return res.render('layouts/autenticacao/recuperar-senha')
})

router.post('/recuperar-senha', async (req, res) => {
    const { email } = req.body

    try{
        const user = await Usuario.findOne({where: { email }})

        if(!user)
            return res.render('layouts/autenticacao/recuperar-senha', {
                message: "Usuário não encontrado", type: 'danger'})
        
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
            if(err)
                return res.render('layouts/autenticacao/recuperar-senha', {
                    message: "Não foi possível enviar o e-mail de recuperação de senha. Por favor, tente mais tarde", 
                    type: 'danger'
                })
            
            return res.render('layouts/autenticacao/recuperar-senha', {
                message: "Token enviado para o e-mail cadastrado", type: 'success'
            })
        })
        
    } catch (err) {
        console.log(err)
        return res.render('layouts/autenticacao/recuperar-senha', {
            message: "Erro durante a recuperação de senha, tente novamente.", 
            type: 'danger'
        })      
    }
})

module.exports = router