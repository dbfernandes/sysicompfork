import fs from 'fs'
import path from 'path'
import { PrismaClient, Avatar } from "@prisma/client"
// import { CreateAvatarDto } from './avatar.types'

const prisma = new PrismaClient()

class AvatarService {
  async adicionar (avatar: any): Promise<Avatar>{
    await this.remover(avatar.idUsuario)
    const caminhoArr = avatar.caminho.split('/')
    const caminhoParsed = caminhoArr.slice(caminhoArr.length - 3).join('/')
    const caminhoFormated = '/' + caminhoParsed
    const avatarFormated = { ...avatar, caminho: caminhoFormated }

    return await prisma.avatar.create({
      data: avatarFormated
    })
  }

  async listarUmAvatar (idUsuario: number): Promise<Avatar | null>{
    return await prisma.avatar.findFirst({ where: { idUsuario } })
  }

  async remover (idUsuario: number): Promise<void>{
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
