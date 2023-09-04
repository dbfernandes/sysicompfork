const {Salas} = require('../models');

const adicionar = async (req, res) => {
    if (req.method === 'GET') {
        res.render('salas/salas-adicionar', { 
            nome: req.session.nome,
            csrf: req.csrfToken(),   
        })

    }else if( req.method === 'POST'){
        try{
            const {
                andar, bloco,
            } = req.body;

            if (!andar || !bloco) {
                return res.status(400).json({
                    error: 'Dados incompletos ou mal formatados'
                });
            }

            let responseError = null;
            const sala = await Salas
                .create({
                    ...req.body,
                })
                .catch((err) => {
                    responseError = err;
                });

            if (!sala) {
                return res.status(400).json({
                    error: responseError.message
                    
                });
            }

            res.render('salas/salas-gerenciar', { 
                nome: req.session.nome,
            })
        }catch(e){
            console.log(e)
            res.status(500).send({error: e});
        }
    }
}

const excluir = async (req, res) => {
    const {id} = req.params;
    const sala = await Salas.findOne({where : {id: req.params.id}});
    try{
        if(!sala)
            throw new Error('Sala não encontrado!');

        const sala_apagada = await Salas.destroy({where: {id: id}});
        res.status(200).json({sala_apagada,message:'Sala removido com sucesso!'});  

    }catch(e){
        console.log(e);
        res.status(500).json({error: e});
    }
};

const gerenciar = async (req, res) => {
    const salas = await Salas.findAll()
    res.render('salas/salas-gerenciar', { 
        salas: salas.map(sala => sala.toJSON()),
        nome: req.session.nome,
      
    })
}

const editar = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const sala = await Salas.findOne({
                where: { 
                    id: req.params.id 
                }
            })

            res.render('salas/salas-editar', { 
                sala: sala.toJSON(),
                nome: req.session.nome,
              
            })
    
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }else if( req.method === 'PUT'){
        try{
            const sala = await Salas.update({
                ...req.body
            }, {where : {id: req.params.id}});

            res.render('salas/salas-editar', { 
                sala: sala.toJSON(),
                nome: req.session.nome,
               
            })

        }catch (error) {
            res.status(500).send({ message: error.message })
        }
    }       
}

export default { adicionar, excluir, gerenciar , editar }