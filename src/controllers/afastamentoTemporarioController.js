import  afastamentoService  from '../services/afastamentoService.js'
import session from 'express-session';

const pageTitle = 'Afastamento Temporário';

const listar = async (req, res) => {
    
    const afastamentos = await afastamentoService.listar();
    const doesNotExists = !afastamentos || afastamentos.length === 0;
    if (doesNotExists) res.status(400).json({ message: 'Nenhuma pedido de afastamento encontrado' });

    return res
        .status(200)
        .render('afastamentoTemporario/pedidos-afastamento', 
        { afastamentos, pageTitle, csrfToken: req.csrfToken(), tipoUsuario: req.session.tipoUsuario
    });
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

            const usuarioId = 3

            // Criar função para formatar a data
            // const dataSaidaFormatada = dateSaida.split('/').reverse().join('-');

            // Colocar condição para verificar se o usuário já tem um afastamento no período
            // console.log(
            //     "Usuario id..:",idUsuario,
            //     "Local viagem:",localViagem,
            //     "Data inicio:",dateSaida,
            //     "Data fim:",dateRetorno,
            //     "Justificativa:",inputJustificativa,
            //     "Plano reposição:",inputPlanoReposicao,
            //     "Tipo viagem:",inputTipoViagem,
            //     "Data requisição:",dataRequisicao
            // );
            await afastamentoService.criar({
                usuarioId:3,
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

export default { criar, listar };