const express = require('express')
const router = express.Router()
const { Sala } = require('../models')

router.get('/adicionar', async (req, res) => {
    res.render('salas/salas-adicionar', { 
        nome: req.session.nome
    })
})

router.post('/adicionar', (req, res) => {
    Sala.create({ 
        nome: req.body.nomeSalaInput,
        numero: req.body.numSalaInput,
        localizacao: req.body.locSalaInput,
    })
    .then(() =>{
        res.status(201)
        res.redirect('/salas/gerenciar')
    })
    .catch((err) => {
        res.status(500).send({ message: err.message })
    })
})

router.delete('/excluir/:id', (req, res) => {
    
        Sala.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(() =>{
            res.sendStatus(200)
            // res.redirect('/salas/gerenciar')
        })
        .catch((err) => {
            res.status(500).send({ message: err.message })
        })

})

router.get('/gerenciar', async (req, res) => {
    const salas = await Sala.findAll()
    res.render('salas/salas-gerenciar', { 
        salas: salas.map(sala => {
            return {
                ...sala.get()
            }
        }),
        nome: req.session.nome
    })
})

router.get('/edit/:id', async (req, res) => {
    try {
        const sala = await Sala.findOne({
            where: { 
                id: req.params.id 
            }
        })

        res.render('salas/salas-editar', { 
            fields_sala: sala.dataValues,
            nome: req.session.nome
        })
  
    } catch (error) {
        res.status(500).send({ message: error.message })
    }

})

router.put('/edit/:id', async (req, res) => {
    try {

        const sala = await Sala.update({
            nome: req.body.nomeSalaInput,
            numero: req.body.numSalaInput,
            localizacao: req.body.locSalaInput,
        }, {
            where: { 
                id: req.params.id, 
            }
        })

        res.render('salas/salas-editar', { 
            fields_sala: sala.dataValues,
            nome: req.session.nome
        })
  
    } catch (error) {
        res.status(500).send({ message: error.message })
    }

})

router.get('/gerenciar', async (req, res) => {
    const salas = await Sala.findAll()
    res.render('salas/salas-gerenciar', { 
        salas: salas.map(sala => {
            return {
                ...sala.get()
            }
        }),
        nome: req.session.nome
    })
})

module.exports = router