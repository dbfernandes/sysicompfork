import { Request, Response } from 'express'
import AlunoService from '../resources/alunos/aluno.service'
import PublicacaoService from '../resources/publicacao/publicacao.service'
 
// Escolha do Layout 
const layoutMain = {
  layout: 'numerosIcompMain'
}  

// Home-page
 
const inicio = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      try {
        const { lng } = req.query
        const contagem = await AlunoService.contarTodos()
        const contagemPublicacoes = await PublicacaoService.contarTodos()
        return res.status(200).render('numerosIcomp/inicio', {
          ...layoutMain,
          contagem,
          contagemPublicacoes,
          lng
        })
      } catch (error) {
        console.log(error)
        return res.status(502).send('O Servidor não obteve uma resposta válida. Bad Gateway (502)')
      }
    default:
      return res.status(400).send('A requisição enviada ao servidor é invalida. Bad Request (400)')
  }
}

export default inicio
