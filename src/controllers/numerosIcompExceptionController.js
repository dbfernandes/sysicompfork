// Escolha do Layout
const layoutMain = {
    layout: 'numerosIcompMain'
}

const erro404 = async (req, res) => {
    return res.status(404).render('numerosIcomp/error404', { ...layoutMain })
}

// Redirect Routes

const redirectAlunos = async (req, res) => {
    return res.redirect('/numerosIcomp#alunos');
}
const redirectProfessores = async (req, res) => {
    return res.redirect('/numerosIcomp/docentes');
}
const redirectProjetos = async (req, res) => {
    return res.redirect('/numerosIcomp/projetos');
}
const redirectPublicacoes = async (req, res) => {
    return res.redirect('/numerosIcomp/publicacoes');
}


export default {
    erro404,
    redirectAlunos,
    redirectProfessores,
    redirectProjetos,
    redirectPublicacoes
}