const { ReservaSala } = require('../models');
const { Salas } = require('../models');
const { Usuario } = require('../models');


const listar = async (req, res) => {
    const reservas = await ReservaSala.findAll();
    res.json({ reservas: reservas.map(sala => sala.toJSON()) })
}

const adicionar = async (req, res) => {

    if (req.method === 'GET') {
        const salas = await Salas.findAll();

        res.render('reservas/reservas-adicionar', {
            salas: salas.map(sala => sala.toJSON()),
            nome: req.session.nome,
            UsuarioId: req.session.uid,
            csrf: req.csrfToken(),
            tipoUsuario: req.session.tipoUsuario
        })

    } else if (req.method === 'POST') {


        try {
            let responseError = null;

            if (req.body.dataTermino == "") {
                req.body.dataTermino = req.body.dataInicio
                req.body.dias = ""

            } else {
                console.log(req.body.dia.length)

                if (typeof req.body.dia === 'string') {

                    let dias = req.body.dia
                    req.body.dias = dias
                } else if (req.body.dia) {

                    let dias = req.body.dia.join(', ')
                    req.body.dias = dias
                    console.log(req.body.dias)
                } else {
                    req.body.dias = ""
                }
            }

            console.log({ ...req.body })

            const reserva = await ReservaSala
                .create({
                    ...req.body,
                })
                .catch((err) => {
                    responseError = err;
                });

            if (!reserva) {
                res.redirect('/reservas/gerenciar')
            }

            res.redirect('/reservas/gerenciar')
        } catch (e) {
            console.log(e)
            res.status(500).send({ error: e });
        }
    }
}

const excluir = async (req, res) => {
    const { id } = req.params;
    const reserva = await ReservaSala.findOne({ where: { id: req.params.id } });
    try {
        if (!reserva)
            throw new Error('Sala não encontrado!');

        const reserva_apagada = await ReservaSala.destroy({ where: { id: id } });
        res.redirect('/reservas/gerenciar')

    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e });
    }
};

function converterData(data) {
    const partes = data.split('-');
    return partes[2] + '/' + partes[1] + '/' + partes[0];
}

const gerenciar = async (req, res) => {
    const reservas = await ReservaSala.findAll({
        include: [
            {
                model: Salas,
                as: 'salas',
            }, {
                model: Usuario,
                as: 'usuario',
            }
        ],
    });

    const reservasJSON = reservas.map(reserva => {
        let reservaObj = reserva.toJSON();

        reservaObj.dataInicio = converterData(reservaObj.dataInicio);
        reservaObj.dataTermino = converterData(reservaObj.dataTermino);
        const dataAtual = new Date();
        const dataTerminoReserva = new Date(reservaObj.dataTermino + ' ' + reservaObj.horaTermino);
        reservaObj.terminou = dataTerminoReserva < dataAtual;

        return reservaObj;
    });

    res.render('reservas/reservas-gerenciar', {
        reservas: reservasJSON,
        nome: req.session.nome,
        csrfToken: req.csrfToken(),
        tipoUsuario: req.session.tipoUsuario

    })
}

    const editar = async (req, res) => {

        if (req.method === 'GET') {
            try {
                const salas = await Salas.findAll();
                const reserva = await ReservaSala.findOne({
                    where: {
                        id: req.params.id
                    },
                    include: [
                        {
                            model: Salas, // Include the associated "Post" model
                            as: 'salas', // Alias for the posts association (if defined in the User model)   
                        }
                    ],
                })


                res.render('reservas/reservas-editar', {
                    salas: salas.map(sala => sala.toJSON()),
                    reserva: reserva.toJSON(),
                    csrf: req.csrfToken(),
                    nome: req.session.nome,
                    tipoUsuario: req.session.tipoUsuario

                })

            } catch (error) {
                res.status(500).send({ message: error.message })
            }
        } else if (req.method === 'POST') {
            let responseError = null;

            if (req.body.dataTermino == "") {
                req.body.dataTermino = req.body.dataInicio
                req.body.dias = ""

            } else {


                if (typeof req.body.dia === 'string') {

                    let dias = req.body.dia
                    req.body.dias = dias
                } else if (req.body.dia) {

                    let dias = req.body.dia.join(', ')
                    req.body.dias = dias
                    console.log(req.body.dias)
                } else {
                    req.body.dias = ""
                }
            }

            console.log({ ...req.body })


            try {
                const reserva = await ReservaSala.update({
                    ...req.body
                }, { where: { id: req.params.id } });

                res.redirect('/reservas/gerenciar')

            } catch (error) {

                res.status(500).send({ message: error.message })
            }
        }
    }


export default { adicionar, excluir, gerenciar, editar, listar }