const {ReservaSala} = require('../models');
const {Salas} = require('../models');

const adicionar = async (req, res) => {
    if (req.method === 'GET') {
        const salas = await Salas.findAll()
        const reservas = await ReservaSala.findAll()
        let salas_livres = salas.filter( sala => !reservas.includes(sala ) );
        res.render('reservas/reservas-adicionar', { 
            salas: salas_livres.map(sala => sala.toJSON()),
            nome: req.session.nome,
            id:   req.session.uid,
            csrf: req.csrfToken(),   
        })

    }else if( req.method === 'POST'){
        try{
            
            let responseError = null;
        
            const reserva = await ReservaSala
                .create({
                    ...req.body
                })
                .catch((err) => {
                    responseError = err;
                });

            if (!reserva) {
                return res.status(400).json({
                    error: responseError.message
                    
                });
            }

            res.redirect('/reservas/gerenciar')
        }catch(e){
            console.log(e)
            res.status(500).send({error: e});
        }
    }
}

const excluir = async (req, res) => {
    const {id} = req.params;
    const reserva = await ReservaSala.findOne({where : {id: req.params.id}});
    try{
        if(!reserva)
            throw new Error('Sala não encontrado!');

        const reserva_apagada = await ReservaSala.destroy({where: {id: id}});
        res.redirect('/reservas/gerenciar')
     
    }catch(e){
        console.log(e);
        res.status(500).json({error: e});
    }
};

const gerenciar = async (req, res) => {
    const reservas = await ReservaSala.findAll()
    res.render('reservas/reservas-gerenciar', { 
        reservas: reservas.map(reservas => reservas.toJSON()),
        nome: req.session.nome,
        csrfToken: req.csrfToken(),  
      
    })
}

const editar = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const reserva = await ReservaSala.findOne({
                where: { 
                    id: req.params.id 
                }
            })

            const salas = await Salas.findAll()
            const reservas = await ReservaSala.findAll()
            let salas_livres = salas.filter( sala => !reservas.includes(sala ) );
            res.render('reservas/reservas-editar', { 
                salas: salas_livres.map(sala => sala.toJSON()),
                reserva: reserva.toJSON(),
                csrf: req.csrfToken(),  
                nome: req.session.nome,
              
            })
    
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }else if( req.method === 'POST'){
    
        try{
            const reserva = await ReservaSala.update({
                ...req.body
            }, {where : {id: req.params.id}});

            res.redirect('/reservas/gerenciar')

        }catch (error) {
            res.status(500).send({ message: error.message })
        }
    }       
}

export default { adicionar, excluir, gerenciar , editar }