import { Request, Response } from 'express'
import AlunoService from '../alunos/aluno.service'
import path from 'path'

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

// Escolha do Layout
const layoutMain = {
  layout: 'numerosIcompMain'
}

// Listagem de Alunos

const alunos = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      try {
        const { lng } = req.query
        const { curso } = req.params
        const cursos = ['processamento-de-dados', 'ciencia-computacao', 'engenharia-de-software', 'mestrado', 'doutorado']
        const c = cursos.findIndex(e => e === curso) + 1
        if (c) {
          const cursoSearch = curso === 'ciencia-computacao'
            ? 'Ciência Da Computação'
            : curso.split('-').map((p) => {
              const palavra = p === 'de' ? p : p.charAt(0).toUpperCase() + p.slice(1)
              return palavra
            }).join(' ')
          const alunosInfo = await AlunoService.listarTodos(
            cursoSearch === 'Engenharia de Software' ? ['Engenharia de Software', 'Sistemas de Informação'] : cursoSearch,
            1)
          const alunosFormados = alunosInfo.length
          return res.status(200).render(resolveView('alunos'), {
            lng,
            alunosInfo,
            alunosFormados,
            ...layoutMain,
            curso: cursoSearch === 'Engenharia de Software' ? cursoSearch + ' / Sistemas de Informação' : cursoSearch
          })
        } else {
          return res.redirect(`/numerosIcomp?lng=${lng}#alunos`)
        }
      } catch (error) {
        return res.status(502).send('O Servidor não obteve uma resposta válida. Bad Gateway (502)')
      }
    default:
      return res.status(400).send('A requisição enviada ao servidor é invalida. Bad Request (400)')
  }
}

export default alunos
