const construirStringPerfisDeUsuario = (usuario: any) => {
  let perfis = ''
  if (usuario.get().administrador === '1') perfis += ' Administrador |'
  if (usuario.get().coordenador === '1') perfis += ' Coordenador |'
  if (usuario.get().professor === '1') perfis += ' Professor |'
  if (usuario.get().secretaria === '1') perfis += ' Secretaria'

  if (perfis.endsWith(' |')) { perfis = perfis.substring(0, perfis.length - 2) }

  return {
    ...usuario.get(),
    perfis
  }
}

module.exports = { construirStringPerfisDeUsuario }
