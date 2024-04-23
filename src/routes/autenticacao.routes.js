import express from 'express';
import autenticacaoController from '../controllers/autenticacaoController';

const router = express.Router()

const { Usuario } = require('../models')

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mailer = require('../utils/mailer');

router.get('/login', autenticacaoController.login)

router.post('/login', autenticacaoController.login)

router.get('/recuperar-senha',autenticacaoController.recuperar_senha )

router.post('/recuperar-senha',autenticacaoController.recuperar_senha)

router.get('/logout', autenticacaoController.logout)

export default router;