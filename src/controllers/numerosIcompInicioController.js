import AlunoService from "../services/alunoService";
import PublicacaoService from "../services/publicacaoService";

// Escolha do Layout
const layoutMain = {
    layout: 'numerosIcompMain'
}

// Home-page

const inicio = async (req, res) => {
    switch (req.method) {
        case 'GET':
            try {
                const contagem = await AlunoService.contarTodos()
                const contagemPublicacoes = await PublicacaoService.contarTodos()
                return res.status(200).render('numerosIcomp/inicio', {
                    ...layoutMain,
                    contagem,
                    contagemPublicacoes
                });
            } catch (error) {
                console.log(error)
                return res.status(502).send('O Servidor não obteve uma resposta válida. Bad Gateway (502)');
            }
        default:
            return res.status(400).send('A requisição enviada ao servidor é invalida. Bad Request (400)');
    }

}

export default inicio
