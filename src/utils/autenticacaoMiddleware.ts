import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

module.exports.isUsuarioAutenticado = async function (req: Request, res: Response, next: NextFunction) {
  const rotasSemAutenticacao = ['/login', '/logout']
  if (rotasSemAutenticacao.includes(req.path)) {
    return next()
  }

  if (!req.session.uid) {
    return res.redirect('/login')
  }

  const usuario = await prisma.usuario.findUnique({
    where: {
      id: Number(req.session.uid)
    }
  })
  
  console.log(req.session)

  if (!usuario) {
    return res.redirect('/login')
  }

  return next()
}
