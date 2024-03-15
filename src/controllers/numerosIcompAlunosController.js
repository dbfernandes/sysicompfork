import AlunoService from "../services/alunoService"

// Escolha do Layout
const layoutMain = {
    layout: 'numerosIcompMain'
}


// Listagem de Alunos

const alunos = async (req, res) => {
    switch (req.method) {
        case 'GET':
            try {
                const {lng} = req.query
                const {curso} = req.params
                const cursos = ["processamento-de-dados","ciencia-computacao","engenharia-de-software", "mestrado", "doutorado"]
                const c = cursos.findIndex(e=>e==curso) + 1
                if(c){
                    const cursoSearch = curso == "ciencia-computacao" ? "Ciência Da Computação" : 
                    curso.split("-").map((p)=> {
                        const palavra = p == 'de' ? p : p.charAt(0).toUpperCase() + p.slice(1) 
                        return palavra
                    }).join(" ")
                    const alunosInfo = await AlunoService.listarTodos(
                        cursoSearch == "Engenharia de Software" ? ["Engenharia de Software", "Sistemas de Informação"] : cursoSearch, 
                        1)
                    const alunosFormados = alunosInfo.length                             
                    return res.status(200).render('numerosIcomp/alunos', {
                        lng,
                        alunosInfo,
                        alunosFormados,
                        ...layoutMain,
                        curso: cursoSearch == "Engenharia de Software" ? cursoSearch +" / Sistemas de Informação" : cursoSearch,
                    });
                }else{
                    return res.redirect(`/numerosIcomp?lng=${lng}#alunos`);
                }
            } catch (error) {
                return res.status(502).send('O Servidor não obteve uma resposta válida. Bad Gateway (502)');
            }
        default:
            return res.status(400).send('A requisição enviada ao servidor é invalida. Bad Request (400)');
    }

}

export default alunos