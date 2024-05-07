module.exports.isUsuarioAutenticado = async function (req, res, next) {
  const rotasSemAutenticacao = ['/login', '/logout']
  if (rotasSemAutenticacao.includes(req.path)) {
    return next()
  }
  if (req.session.uid) {
    return next()
  }

  return res.redirect('/login')
}
