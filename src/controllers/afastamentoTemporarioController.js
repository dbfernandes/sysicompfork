const {afastamentoTemp} = require('../models');

const pageTitle = 'Afastamento Temporário';

const listar = async (req, res) => {
    res.render('afastamentoTemporario/pedidos-afastamento', {
        nome: req.session.nome,
        csrf: req.csrfToken(),
    });
}

const criar = async (req, res) => {
    if (req.method === 'GET') {
        return res.status(200).
        render('afastamentoTemporario/solicitar-afastamento',{ 
            pageTitle, csrfToken: req.csrfToken() 
        });
    } else {
        try {
            const dados = {
                localViagem: req.body.localViagem,
                dataInicio: req.body.dataInicio,
                dataFim: req.body.dateRetorno,
                justificativa: req.body.inputJustificativa,
                plano: req.body.inputPlanoReposicao,
                idUsuario: req.session.idUsuario,
                tipoViagem: req.body.inputTipoViagem,
            }
            await afastamentoTemp.create({
                usuarioId: dados.idUsuario,
                dataSaida: dados.dataInicio,
                dataRetorno: dados.dataFim,
                tipoViagem: dados.tipoViagem,
                localViagem: dados.localViagem,
                justificativa: dados.justificativa,
                planoReposicao: dados.plano,
            });
        }
        catch (error) {
            return res.render('afastamentoTemporario/solicitar-afastamento', {
                pageTitle, csrfToken: req.csrfToken(), 
                error: error.message || 'Não foi possível criar o pedido de afastamento!'
            });
        }
    }
    
    return res.redirect('/afastamentoTemporario/listar');
}

const deletar = async (req, res) => {
    
}

export default { criar, listar };