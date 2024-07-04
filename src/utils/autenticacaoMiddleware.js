const { Usuario } = require('../models');

module.exports.isUsuarioAutenticado = async function (req, res, next) {
  const rotasSemAutenticacao = ['/login', '/logout'];
  if (rotasSemAutenticacao.includes(req.path)) {
    return next();
  }

  let usuario;
  if (req.session.uid) {
    usuario = await Usuario.findOne({
      where: { id: req.session.uid },
    });
  }

  console.log(req.session);

  if (!usuario) {
    return res.redirect('/login');
  }

  return next();
};
