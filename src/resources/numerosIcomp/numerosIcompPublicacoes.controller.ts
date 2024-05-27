import { Request, Response } from 'express'
import PublicacaoService from '../publicacao/publicacao.service'
import path from 'path'

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}
// Escolha do Layout
const layoutMain = {
  layout: 'numerosIcompMain'
}

// Listagem Publicações

const publicacao = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET': {
      const { ano, lng } = req.query
      try {
        // const conditions = {
        //   tipo: [1, 2]
        // }
        // if (ano) {
        //   conditions.ano = ano
        // }
        const conditions: { tipo: number[]; ano?: string } = {
          tipo: [1, 2],
          ano: ''
        }
        if (ano && typeof ano === 'string') {
          conditions.ano = ano
        }
        const publicacoes = await PublicacaoService.listarTodos(conditions)

        return res.render(resolveView('publicacoes'), {
          lng,
          ...layoutMain,
          publicacoes,
          ano
        })
      } catch (error) {
        return res.status(502).send('O Servidor não obteve uma resposta válida. Bad Gateway (502)')
      }
    }
    default:
      return res.status(400)
  }
}

export default publicacao
