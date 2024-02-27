const inicio = (req, res) => {
    switch (req.method) {
        case 'GET':
            try {
                const { message, type, messageTitle } = req.query;
                return res.render('inicio/inicio',{
                    nome: req.session.nome,
                    message,
                    type,
                    messageTitle,
                    tipoUsuario: req.session.tipoUsuario
                })
            } catch (error) {
                return res.status(500).send('O Servidor apresentou um erro interno. Internal Server Error (500)');
                
            }
            
        default:
            return res.status(400).send('O Servidor não pode processar a requisição. Bad Request (400)');
    }
        
    
}

export default { inicio }