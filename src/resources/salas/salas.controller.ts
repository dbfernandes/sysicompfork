import { Request, Response } from "express";
import SalaService from "./salas.service";
import path from "path";

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const adicionar = async (req: Request, res: Response) => {
  if (req.method === 'GET') {
    res.render(resolveView('salas-adicionar.hbs'), {
      nome: req.session.nome,
      csrf: req.csrfToken(),
      tipoUsuario: req.session.tipoUsuario
    })
  } else if (req.method === 'POST') {
    try {
      let {
        andar, bloco, nome, numero, capacidade
      } = req.body

      if (!andar || !bloco || !nome) {
        return res.status(400).json({
          error: 'Dados incompletos ou mal formatados'
        })
      }

      // numero = parseInt(numero & numero == ''? 0 : req.body.numero,10)
      numero = parseInt(req.body.numero, 10) || 0
      // capacidade = parseInt(capacidade & capacidade== ''? 0 : req.body.capacidade,10)
      capacidade = parseInt(req.body.capacidade, 10) || 0
      // let responseError = null;

      await SalaService.criar(nome, bloco, andar, numero, capacidade)


      res.redirect('/salas/gerenciar')
    } catch (e) {
      console.log(e)
      res.status(500).send({ error: e })
    }
  }
}

const excluir = async (req: Request, res: Response) => {
  const { id } = req.params
  // const sala = await Salas.findOne({where : {id: req.params.id}});
  const sala = await SalaService.listarUm(parseInt(id))
  try {
    if (!sala) { throw new Error('Sala não encontrado!') }

        // const sala_apagada = await Salas.destroy({where: {id: id}});
        const sala_apagada = await SalaService.excluir(parseInt(id));
        res.redirect('/salas/gerenciar')
     
    }catch(e){
        console.log(e);
        res.status(500).json({error: e});
    }
};

const gerenciar = async (req: Request, res: Response) => {
  const salas = await SalaService.listarTodos()
  res.render(resolveView('salas-gerenciar'), {
    salas: salas,
    csrfToken: req.csrfToken(),
    tipoUsuario: req.session.tipoUsuario
  })
}

const editar = async (req: Request, res: Response) => {
  if (req.method === 'GET') {
    try {
      // const sala = await Salas.findOne({
      //     where: {
      //         id: req.params.id
      //     }
      // })
      const sala = await SalaService.listarUm(parseInt(req.params.id))
      res.render(resolveView('salas-editar'), {
        // sala: sala!.toJSON(),
        sala: JSON.stringify(sala),
        csrf: req.csrfToken(),
        nome: req.session.nome,
        tipoUsuario: req.session.tipoUsuario

      })
    } catch (error: any) {
      res.status(500).send({ message: error.message })
    }
  } else if (req.method === 'POST') {
    try {
      await SalaService.editar(parseInt(req.params.id), req.body)
      res.redirect('/salas/gerenciar')
    } catch (error: any) {
      res.status(500).send({ message: error.message })
    }
  }
}

export default { adicionar, excluir, gerenciar, editar }
