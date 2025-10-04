import { Publicacao, TipoPublicacao } from '@prisma/client';

async function getPublicationsArr(
  publicacoes: any,
  id: number,
  tipos: TipoPublicacao[],
) {
  const publicArr: any = [];
  tipos.forEach((tipo) => {
    const { chave } = tipo;
    const publicacoesChave = publicacoes[chave];
    if (publicacoesChave !== undefined) {
      for (const k in publicacoesChave) {
        publicArr.push({
          titulo: publicacoesChave[k].titulo,
          ano:
            publicacoesChave[k].ano !== '' && parseInt(publicacoesChave[k].ano)
              ? parseInt(publicacoesChave[k].ano)
              : 0,
          local: publicacoesChave[k].local,
          tipoId: tipo.id,
          natureza: publicacoesChave[k].natureza,
          autores: publicacoesChave[k].autores.nomeCompleto.join('; '),
          issn:
            publicacoesChave[k].issn !== '' && publicacoesChave[k].issn
              ? publicacoesChave[k].issn
              : '0',
        });
      }
    }
  });
  return publicArr;
}

export default getPublicationsArr;
