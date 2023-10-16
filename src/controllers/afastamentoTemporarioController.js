import  afastamentoService  from '../services/afastamentoService.js'

const pageTitle = 'Afastamento Temporário';

const listar = async (req, res) => {
    //
    res.render('afastamentoTemporario/pedidos-afastamento', {
        nome: req.session.nome,
        csrf: req.csrfToken(),
    });
}

const criar = async (req, res) => {
    
    
    return res.render('afastamentoTemporario/solicitar-afastamento', {
        nome: req.session.nome,
        csrf: req.csrfToken(),
        pageTitle,
    });
}

const deletar = async (req, res) => {
    
}

export default { criar, listar };