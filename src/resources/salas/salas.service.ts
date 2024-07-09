import { PrismaClient, Salas } from "@prisma/client"

const prisma = new PrismaClient()

export default new (class SalaService {
  // Pegar todas as Salas
  async listarTodos (): Promise<Salas[]> {
    return await prisma.salas.findMany()
  }

  // Pegar uma sala
  async listarUmaSala (id: number): Promise<Salas | null>{
    return await prisma.salas.findUnique({ where: { id } })
  }

  // Criar salas
  async criar (sala: any): Promise<Salas> {
    return await prisma.salas.create({ data: sala })
  }

  // Editar salas
  async editar (id: number, sala: any): Promise<Salas> {
    return await prisma.salas.update({ where: { id }, data: sala })
  }

  // Excluir salas
  async excluir (id: number): Promise<Salas>{
    return await prisma.salas.delete({ where: { id } })
  }
})();
