import ProjetoService from '../services/projetoService'

// Escolha do Layout
const layoutMain = {
  layout: 'numerosIcompMain'
}

// Listagem Projetos

const projetos = async (req, res) => {
  switch (req.method) {
    case 'GET':
      try {
        const { lng } = req.query
        const projetosFiltrados = await ProjetoService.listarAtuais()

        return res.status(200).render('numerosIcomp/projetos', {
          lng,
          ...layoutMain,
          projetosFiltrados
        })
      } catch (error) {
        return res.status(502).send('O Servidor não obteve uma resposta válida. Bad Gateway (502)')
      }
    default:
      return res.status(400).send('A requisição enviada ao servidor é invalida. Bad Request (400)')
  }
}

export default projetos
