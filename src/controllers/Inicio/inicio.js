const adicionar =  (req,res) => {
    if(req.method === 'GET'){
        return res.render('inicio/inicio', { 
            nome: req.session.nome
        })
    }
}

const inicio = (req, res) => {
    if(req.method === 'GET'){
        return res.redirect('/inicio')
    }
}

export default { adicionar, inicio }