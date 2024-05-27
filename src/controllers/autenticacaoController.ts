import UsuarioService from '../services/usuarioService'
import { Request, Response, NextFunction } from 'express'
import mailer from '../modules/mailer'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

const autorizarAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.tipoUsuario?.administrador || req.session.tipoUsuario?.secretaria) next()
  else return res.redirect('/')
}

const autorizarCoord = async (req: Request, res: Response, next: NextFunction) => {
  if (
    req.session.tipoUsuario?.administrador ||
    req.session.tipoUsuario?.secretaria ||
    req.session.tipoUsuario?.coordenador
  ) next()
  else return res.redirect('/')
}

const autorizarProf = async (req: Request, res: Response, next: NextFunction) => {
  if (
    req.session.tipoUsuario?.administrador ||
    req.session.tipoUsuario?.secretaria ||
    req.session.tipoUsuario?.professor
  ) next()
  else return res.redirect('/')
}

const login = async (req: Request, res: Response) => {
  if (req.method === 'GET') {
    if (req.session.uid) return res.redirect('/')
    return res.render('autenticacao/login', {
      csrfToken: req.csrfToken()
    })
  } else if (req.method === 'POST') {
    try {
      const { cpf, senha } = await req.body
      const usuario = await UsuarioService.buscarUsuarioPor({ cpf: cpf })

      if (!usuario) {
        return res.render('autenticacao/login', {
          csrfToken: req.csrfToken(),
          message: 'Usuário não cadastrado',
          type: 'danger'
        })
      } else if (usuario.status === 0) {
        return res.render('autenticacao/login', {
          csrfToken: req.csrfToken(),
          message: 'Usuário bloqueado. Contate a administração.',
          type: 'danger'
        })
      }

      const isSenhaCorreta = await bcrypt.compare(senha, usuario.senhaHash)
      if (!isSenhaCorreta) {
        return res.render('autenticacao/login', {
          csrfToken: req.csrfToken(),
          message: 'Senha inválida',
          type: 'danger'
        })
      }

      req.session.uid = usuario.id.toString()
      req.session.nome = `${usuario.nomeCompleto.split(' ')[0]}${
        usuario.nomeCompleto.split(' ').length > 1
          ? ' ' +
            usuario.nomeCompleto.split(' ')[
              usuario.nomeCompleto.split(' ').length - 1
            ]
          : ' '
      }`
      req.session.tipoUsuario = {
        administrador: Boolean(usuario.administrador),
        coordenador: Boolean(usuario.coordenador),
        secretaria:Boolean(usuario.secretaria),
        professor:Boolean(usuario.professor)
      }
      req.session.uid = usuario.id.toString()
      return res.redirect('/inicio')
    } catch (err) {
      console.log(err)
    }
  }
}

const recuperarSenha = async (req: Request, res: Response) => {
  if (req.method === 'POST') {
    const { email } = req.body

    try {
      const user = await UsuarioService.buscarUsuarioPor({ email: email })

      if (!user) {
        return res.render('autenticacao/recuperar-senha', {
          csrfToken: req.csrfToken(),
          message: 'Usuário não encontrado',
          type: 'danger'
        })
      }
      const token = crypto.randomBytes(20).toString('hex')

      const now = new Date()

      now.setHours(now.getHours() + 1)

      await UsuarioService.recuperarSenha(token, now, user.id)

      mailer.sendMail(
        {
          to: email,
          from: 'api@test.com.br',
          subject: 'Forgot Password?',
          template: 'auth/forgot_password',
          context: { token }
        },
        (err: any) => {
          if (err) {
            return res.render('autenticacao/recuperar-senha', {
              csrfToken: req.csrfToken(),
              message:
                'Não foi possível enviar o e-mail de recuperação de senha. Por favor, tente mais tarde',
              type: 'danger'
            })
          }

          return res.render('autenticacao/recuperar-senha', {
            csrfToken: req.csrfToken(),
            message: 'Token enviado para o e-mail cadastrado',
            type: 'success'
          })
        }
      )
    } catch (err) {
      console.log(err)
      return res.render('autenticacao/recuperar-senha', {
        csrfToken: req.csrfToken(),
        message: 'Erro durante a recuperação de senha, tente novamente.',
        type: 'danger'
      })
    }
  } else if (req.method === 'GET') {
    return res.render('autenticacao/recuperar-senha', {
      csrfToken: req.csrfToken()
    })
  }
}

const logout = async (req: Request, res: Response) => {
  if (req.method === 'GET') {
    req.session.destroy(function (err) {
      if (err) {
        return console.log(err)
      }
      res.redirect('/login')
    })
  }
}

const verificar = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.uid) return res.redirect('/login')
  next()
}
export default {
  logout,
  recuperarSenha,
  login,
  verificar,
  autorizarAdmin,
  autorizarCoord,
  autorizarProf
}
