import fs from 'fs'
import path from 'path'
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

class AvatarService {
  async adicionar (
    idUsuario: number,
    nome: string,
    caminho: string
  ) {
    await this.remover(idUsuario)
    const caminhoArr = caminho.split('/')
    const caminhoParsed = caminhoArr.slice(caminhoArr.length - 3).join('/')
    const caminhoFormated = '/' + caminhoParsed

    await prisma.avatar.create({
      data: {
        idUsuario,
        nome,
        caminho: caminhoFormated,
        createdAt: new Date(),
        updatedAt: new Date()  
      }
    })
  }

  async listarUmAvatar (idUsuario: number) {
    const avatar = await prisma.avatar.findFirst({
      where: {
        idUsuario
      }
    })
    return avatar
  }

  async remover (idUsuario: number) {
    const avatar = await prisma.avatar.findFirst({
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
        prisma.avatar.delete({
          where: {
            id: avatar.id
          }
        })
        console.log('File deleted successfully')
      })
    }
  }
}

export default new AvatarService()
