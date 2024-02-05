import AlunoService from "../services/alunoService";

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
                return res.status(200).render('numerosIcomp/inicio', {
                    ...layoutMain,
                    contagem
                });
            } catch (error) {
                return res.status(502).send('O Servidor não obteve uma resposta válida. Bad Gateway (502)');
            }
        default:
            return res.status(400).send('O Servidor não pode processar a requisição. Bad Request (400)');
    }

}

export default inicio
