import PublicacaoService from "../services/publicacaoService";

// Escolha do Layout
const layoutMain = {
    layout: 'numerosIcompMain'
}

// Listagem Publicações

const publicacao = async (req, res) => {
    switch (req.method) {
        case "GET":
            try {
                const publicacoes = await PublicacaoService.listarTodos({
                    tipo: [1,2]
                })
    
                return res.render('numerosIcomp/publicacoes', {
                    ...layoutMain,
                    publicacoes,
                });
            } catch (error) {
                return res.status(502).send('O Servidor não obteve uma resposta válida. Bad Gateway (502)');
            }
    
        default:
            return res.status(400)
    }
}

export default publicacao
