import PublicacaoService from "../services/publicacaoService";

// Escolha do Layout
const layoutMain = {
    layout: 'numerosIcompMain'
}

// Listagem Publicações

const publicacao = async (req, res) => {
    switch (req.method) {
        case "GET":
            const {ano, lng} = req.query
            try {
                const conditions = {
                    tipo: [1,2],
                }
                if(ano){
                    conditions["ano"] = ano
                }
                const publicacoes = await PublicacaoService.listarTodos(conditions)
    
                return res.render('numerosIcomp/publicacoes', {
                    lng,
                    ...layoutMain,
                    publicacoes,
                    ano
                });
            } catch (error) {
                return res.status(502).send('O Servidor não obteve uma resposta válida. Bad Gateway (502)');
            }
    
        default:
            return res.status(400)
    }
}

export default publicacao
