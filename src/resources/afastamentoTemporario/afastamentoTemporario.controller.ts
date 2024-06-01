import {Request, Response} from 'express'
import afastamentoService from './afastamentoTemporario.service'
import path from 'path'
import { CreateAfastamentoTemporarioDto } from './afastamentoTemporario.types'
const pageTitle = 'Afastamento Temporário'

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}


const listar = async (req: Request, res: Response) => {
  try {
    if (req.session.tipoUsuario?.administrador) {
      console.log('Acessando como Administrador')
      const afastamentos = await afastamentoService.listarTodos()
      const doesNotExists = !afastamentos || afastamentos.length === 0
      if (doesNotExists) throw new Error('Nenhum pedido de afastamento encontrado')

      return res
        .status(200)
        .render(resolveView('pedidos-afastamento'),
          {
            afastamentos,
            pageTitle,
            csrfToken: req.csrfToken(),
            tipoUsuario: req.session.tipoUsuario
          })
    } else {
      console.log('Acessando como Usuário')
      const afastamentos = await afastamentoService.listarAfastamentosDoUsuario(parseInt(req.session.uid!))
      const doesNotExists = !afastamentos || afastamentos.length === 0
      if (doesNotExists) throw new Error('Nenhum pedido de afastamento encontrado')

      return res
        .status(200)
        .render(resolveView('pedidos-afastamento'),
          {
            afastamentos,
            pageTitle,
            csrfToken: req.csrfToken(),
            tipoUsuario: req.session.tipoUsuario
          })
    }
  } catch (error: any) {
    return res.render(resolveView('pedidos-afastamento'), {
      pageTitle,
      csrfToken: req.csrfToken(),
      tipoUsuario: req.session.tipoUsuario,
      error: error.message || 'Não foi possível listar os pedidos de afastamento!'
    })
  }
}

const criar = async (req: Request, res: Response) => {
  if (req.method === 'GET') {
    return res.status(200)
      .render(resolveView('solicitar-afastamento'), {
        pageTitle, csrfToken: req.csrfToken(), tipoUsuario: req.session.tipoUsuario
      })
  } else {
    try {
      // const usuarioId = parseInt(req.session.uid!)
      // const usuarioNome = req.session.nome!
      // const dataSaida = new Date(req.body.dataSaida)
      // const dataRetorno = new Date(req.body.dataRetorno)
      // const tipoViagem = req.body.tipoViagem
      // const localViagem = req.body.localViagem
      // const justificativa = req.body.justificativa
      // const planoReposicao = req.body.planoReposicao
      const { uid, nome } = req.session
      const { 
        dataSaida, 
        dataRetorno, 
        tipoViagem, 
        localViagem, 
        justificativa, 
        planoReposicao 
      } = req.body
      const afastamento: CreateAfastamentoTemporarioDto = {
        usuarioId: Number(uid),
        usuarioNome: nome!,
        dataSaida: new Date(dataSaida),
        dataRetorno: new Date(dataRetorno),
        tipoViagem,
        localViagem,
        justificativa,
        planoReposicao
      }
      await afastamentoService.criar(afastamento)
    } catch (error: any) {
      return res.render(resolveView('solicitar-afastamento'), {
        pageTitle,
        csrfToken: req.csrfToken(),
        tipoUsuario: req.session.tipoUsuario,
        error: error.message || 'Não foi possível criar o pedido de afastamento!'
      })
    }
  }
  return res.redirect('/afastamentoTemporario/listar')
}

const vizualizar = async (req: Request, res: Response) => {
  try {
    const afastamento = await afastamentoService.vizualizar(parseInt(req.params.id))
    if (!afastamento) return res.status(400).json({ message: 'Pedido de afastamento não encontrado' })
    return res.render(resolveView('vizualizar-afastamento'), {
      afastamento,
      pageTitle,
      csrfToken: req.csrfToken(),
      tipoUsuario: req.session.tipoUsuario
    })
  } catch (error: any) {
    return res.render(resolveView('pedidos-afastamento'), {
      pageTitle,
      csrfToken: req.csrfToken(),
      tipoUsuario: req.session.tipoUsuario,
      error: error.message || 'Não foi possível vizualizar o pedido de afastamento!'
    })
  }
}

const remover = async (req:Request, res: Response) => {
  if (req.method === 'POST') {
    try {
      console.log(req.params.id)
      await afastamentoService.delete(parseInt(req.params.id))
      return res.redirect('/afastamentoTemporario/listar')
    } catch (error: any) {
      return res.render(resolveView('pedidos-afastamento'), {
        pageTitle,
        csrfToken: req.csrfToken(),
        tipoUsuario: req.session.tipoUsuario,
        error: error.message || 'Não foi possível remover o pedido de afastamento!'
      })
    }
  }
}

export default { criar, listar, vizualizar, remover }
