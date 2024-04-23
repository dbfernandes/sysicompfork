import fs from 'fs'
import path from 'path'
const { Avatar } = require('../models')

class AvatarService {
  async adicionar (
    idUsuario,
    nome,
    caminho
  ) {
    await this.remover(idUsuario)
    const caminhoArr = caminho.split('/')
    const caminhoParsed = caminhoArr.slice(caminhoArr.length - 3).join('/')
    const caminhoFormated = '/' + caminhoParsed

    await Avatar.create({
      idUsuario,
      nome,
      caminho: caminhoFormated
    }, {})
  }

  async listarUm (idUsuario) {
    const avatar = await Avatar.findOne({
      where: {
        idUsuario
      }
    })
    const avatarDict = avatar == null ? avatar : avatar.get()
    return avatarDict
  }

  async remover (idUsuario) {
    const avatar = await Avatar.findOne({
      where: {
        idUsuario
      }
    })
    if (avatar) {
      const caminho = path.join(__dirname, '..', 'uploads', avatar.nome)
      //   __dirname + '/../uploads/' + avatar.nome
      fs.unlink(caminho, (err) => {
        if (err) {
          console.error(err)
          return
        }
        avatar.destroy()
        console.log('File deleted successfully')
      })
    }
  }
}

export default new AvatarService()
