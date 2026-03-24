import { Avatar, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class AvatarService {
  async adicionarAvatar(
    usuarioId: number,
    nome: string,
    caminho: string,
  ): Promise<void> {
    await this.remover(usuarioId);
    const caminhoArr = caminho.split('/');
    const caminhoParsed = caminhoArr.slice(caminhoArr.length - 3).join('/');
    const caminhoFormated = '/' + caminhoParsed;
    await prisma.avatar.deleteMany({ where: { usuarioId } });
    await prisma.avatar.create({
      data: {
        usuarioId,
        nome,
        caminho: caminhoFormated,
      },
    });
  }

  async listarUmAvatar(usuarioId: number): Promise<Avatar | null> {
    return prisma.avatar.findFirst({
      where: {
        usuarioId,
      },
    });
  }

  async remover(usuarioId: number): Promise<void | null> {
    // const avatar = await prisma.avatar.findFirst({
    //   where: {
    //     usuarioId,
    //   },
    // });
    // if (avatar) {
    //   const caminho = path.join(__dirname, '..', 'uploads', avatar.nome);
    //   //   __dirname + '/../uploads/' + avatar.nome
    //   fs.unlink(caminho, (err) => {
    //     if (err) {
    //       console.error(err);
    //       return;
    //     }
    //     prisma.avatar.delete({
    //       where: {
    //         id: avatar.id,
    //       },
    //     });
    //   });
    // }
  }
}

export default new AvatarService();
