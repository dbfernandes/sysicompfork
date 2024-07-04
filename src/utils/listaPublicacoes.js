async function getPublicationsArr(publicacoes, id, tipos) {
  const publicArr = [];
  tipos.forEach((tipo) => {
    const { chave } = tipo;
    const publicacoesChave = publicacoes[chave];
    if (publicacoesChave !== undefined) {
      for (const k in publicacoesChave) {
        publicArr.push({
          idProfessor: id,
          idCandidate: id,
          titulo: publicacoesChave[k].titulo,
          ano:
            publicacoesChave[k].ano !== '' && parseInt(publicacoesChave[k].ano)
              ? parseInt(publicacoesChave[k].ano)
              : 0,
          local: publicacoesChave[k].local,
          tipo: tipo.id,
          natureza: publicacoesChave[k].natureza,
          autores: publicacoesChave[k].autores.nomeCompleto.join('; '),
          ISSN:
            publicacoesChave[k].issn !== '' &&
            parseInt(publicacoesChave[k].issn)
              ? parseInt(publicacoesChave[k].issn)
              : 0,
        });
      }
    }
  });
  return publicArr;
}

export default getPublicationsArr;
