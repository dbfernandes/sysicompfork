/*const adicionar =  (req,res) => {
    if(req.method === 'GET'){
        return res.render('inicio/inicio', { 
            nome: req.session.nome
        })
    }
}*/

const inicio = (req, res) => {
    if(req.method === 'GET'){
        const { message, type, messageTitle } = req.query;
        return res.render('inicio/inicio',{
            nome: req.session.nome,
            message,
            type,
            messageTitle,
            tipoUsuario: req.session.tipoUsuario
        })
    }
}

export default { inicio }