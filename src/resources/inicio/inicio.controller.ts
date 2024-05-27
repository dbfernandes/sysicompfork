import { Request, Response } from 'express'
import path from 'path'

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const inicio = (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      try {
        const { message, type, messageTitle } = req.query
        return res.render(resolveView('inicio'), {
          nome: req.session.nome,
          message,
          type,
          messageTitle,
          tipoUsuario: req.session.tipoUsuario
        })
      } catch (error) {
        return res.status(500).send('O Servidor apresentou um erro interno. Internal Server Error (500)')
      }

    default:
      return res.status(400).send('A requisição enviada ao servidor é invalida. Bad Request (400)')
  }
}

export default { inicio }
