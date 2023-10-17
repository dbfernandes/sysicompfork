const {ReservaSala} = require('../models');
const {Salas} = require('../models');
const {Usuario} = require('../models');


const listar = async (req, res) => {
    const reservas = await ReservaSala.findAll();
    res.json( {reservas: reservas.map(sala => sala.toJSON())} )
}

const adicionar = async (req, res) => {
  
    if (req.method === 'GET') {
        const salas = await Salas.findAll();
        //const reservas = await ReservaSala.findAll();
        var reservas = ['teste1', 'teste2']
        res.render('reservas/reservas-adicionar', { 
            salas: salas.map(sala => sala.toJSON()),
            reservas: reservas,
            nome: req.session.nome,
            UsuarioId: req.session.uid,
            csrf: req.csrfToken(),   
        })

    }else if( req.method === 'POST'){

       
        try{
            let responseError = null;
        
            if(req.body.dataTermino == ""){
                req.body.dataTermino = req.body.dataInicio
               
            }else{
                let dias = req.body.dia ? req.body.dia.join(', ') : ""
                req.body.dias = dias
            }

           
            console.log({...req.body})

            
            const reserva = await ReservaSala
                .create({
                    ...req.body,
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
    const reservas = await ReservaSala.findAll({
        include: [
          {
            model: Salas, 
            as: 'salas', 
        },{
            model: Usuario, 
            as: 'usuario', 
        }
        ],
    })
    console.log(reservas)
    
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
                },
                include: [
                    {
                      model: Salas, // Include the associated "Post" model
                      as: 'salas', // Alias for the posts association (if defined in the User model)   
                    }
                  ],
            })


            res.render('reservas/reservas-editar', { 
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

export default { adicionar, excluir, gerenciar , editar, listar }