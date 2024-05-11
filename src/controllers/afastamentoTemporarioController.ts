import {Request, Response} from 'express'
import afastamentoService from '../services/afastamentoService'
const pageTitle = 'Afastamento Temporário'

const listar = async (req: Request, res: Response) => {
  try {
    if (req.session.tipoUsuario?.administrador) {
      console.log('Acessando como Administrador')
      const afastamentos = await afastamentoService.listarTodos()
      const doesNotExists = !afastamentos || afastamentos.length === 0
      if (doesNotExists) throw new Error('Nenhum pedido de afastamento encontrado')

      return res
        .status(200)
        .render('afastamentoTemporario/pedidos-afastamento',
          {
            afastamentos,
            pageTitle,
            csrfToken: req.csrfToken(),
            tipoUsuario: req.session.tipoUsuario
          })
    } else {
      console.log('Acessando como Usuário')
      const afastamentos = await afastamentoService.listarAfastamentosDoUsuario(req.session.uid!)
      const doesNotExists = !afastamentos || afastamentos.length === 0
      if (doesNotExists) throw new Error('Nenhum pedido de afastamento encontrado')

      return res
        .status(200)
        .render('afastamentoTemporario/pedidos-afastamento',
          {
            afastamentos,
            pageTitle,
            csrfToken: req.csrfToken(),
            tipoUsuario: req.session.tipoUsuario
          })
    }
  } catch (error: any) {
    return res.render('afastamentoTemporario/pedidos-afastamento', {
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
      .render('afastamentoTemporario/solicitar-afastamento', {
        pageTitle, csrfToken: req.csrfToken(), tipoUsuario: req.session.tipoUsuario
      })
  } else {
    try {
      const usuarioId = parseInt(req.session.uid!)
      const usuarioNome = req.session.nome!
      const dataSaida = new Date(req.body.dataSaida)
      const dataRetorno = new Date(req.body.dataRetorno)
      const tipoViagem = req.body.tipoViagem
      const localViagem = req.body.localViagem
      const justificativa = req.body.justificativa
      const planoReposicao = req.body.planoReposicao

      await afastamentoService.criar({
        usuarioId,
        usuarioNome,
        dataSaida,
        dataRetorno,
        tipoViagem,
        localViagem,
        justificativa,
        planoReposicao,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    } catch (error: any) {
      return res.render('afastamentoTemporario/solicitar-afastamento', {
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
    const afastamento = await afastamentoService.vizualizar(req.params.id)
    if (!afastamento) return res.status(400).json({ message: 'Pedido de afastamento não encontrado' })
    return res.render('afastamentoTemporario/vizualizar-afastamento', {
      afastamento,
      pageTitle,
      csrfToken: req.csrfToken(),
      tipoUsuario: req.session.tipoUsuario
    })
  } catch (error: any) {
    return res.render('afastamentoTemporario/pedidos-afastamento', {
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
      await afastamentoService.delete(req.params.id)
      return res.redirect('/afastamentoTemporario/listar')
    } catch (error: any) {
      return res.render('afastamentoTemporario/pedidos-afastamento', {
        pageTitle,
        csrfToken: req.csrfToken(),
        tipoUsuario: req.session.tipoUsuario,
        error: error.message || 'Não foi possível remover o pedido de afastamento!'
      })
    }
  }
}

export default { criar, listar, vizualizar, remover }
