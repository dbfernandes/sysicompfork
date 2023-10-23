import  afastamentoService  from '../services/afastamentoService.js'
import UsuarioService from '../services/usuarioService.js'
import session from 'express-session';

const pageTitle = 'Afastamento Temporário';

const listar = async (req, res) => {
    try {

        const afastamentos = await afastamentoService.listar();
        const doesNotExists = !afastamentos || afastamentos.length === 0;
        if (doesNotExists) throw new Error('Nenhum pedido de afastamento encontrado');
    
        return res
            .status(200)
            .render('afastamentoTemporario/pedidos-afastamento', 
            { afastamentos, 
                pageTitle, 
                csrfToken: req.csrfToken(), 
                tipoUsuario: req.session.tipoUsuario
        });
    } catch (error) {
        return res.status(400).json({ error: error.message || 'Não foi possível listar os pedidos de afastamento' });
    }
}

const criar = async (req, res) => {
    if (req.method == 'GET') {
        return res.status(200).
        render('afastamentoTemporario/solicitar-afastamento', { 
            pageTitle, csrfToken: req.csrfToken(), tipoUsuario: req.session.tipoUsuario ,
        });
    } else {
        try {
            
            const dataSaida = req.body.dataSaida;
            const dataRetorno = req.body.dataRetorno;
            const tipoViagem = req.body.tipoViagem;
            const localViagem = req.body.localViagem;
            const justificativa = req.body.justificativa;
            const planoReposicao = req.body.planoReposicao;

            const usuarioNome = req.session.nomeCompleto;

            // Criar função para formatar a data
            // const dataSaidaFormatada = dateSaida.split('/').reverse().join('-');

            await afastamentoService.criar({
                usuarioNome:usuarioNome,
                dataSaida,
                dataRetorno,
                tipoViagem,
                localViagem,
                justificativa,
                planoReposicao,
            });

        } catch (error) {
            console.log(error)
            return res.render('afastamentoTemporario/solicitar-afastamento', {
                pageTitle, csrfToken: req.csrfToken(), 
                tipoUsuario: req.session.tipoUsuario ,
                error: error.message || 'Não foi possível criar o pedido de afastamento!'
            });
        }
    }

    return res.redirect('/afastamentoTemporario/listar');
}

const vizualizar = async (req, res) => {
    try {
        const afastamento = await afastamentoService.vizualizar(req.params.id);
        if (!afastamento) return res.status(400).json({ message: 'Pedido de afastamento não encontrado' });
        return res.render("afastamentoTemporario/vizualizar-afastamento", { 
            afastamento, 
            pageTitle, 
            csrfToken: req.csrfToken(), 
            tipoUsuario: req.session.tipoUsuario 
        })
    } catch (error) {
        return res.status(400).json({ message: 'Não foi possível vizualizar o pedido de afastamento' });
    }
}

export default { criar, listar, vizualizar };