import projetosService from '../../src/resources/projetos/projetos.service'
import { prismaMock } from '../../singleton'

describe('ProjetoService', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    });

    describe('adicionarVarios', () => {


        it('não deve fazer nada se input for undefined ou não conter projetos', async () => {
            await projetosService.adicionarVarios(1, undefined)

            expect(prismaMock.projeto.deleteMany).not.toHaveBeenCalled()
            expect(prismaMock.projeto.createMany).not.toHaveBeenCalled()
        })
    })

    describe('listarAtuais', () => {
        it('deve retornar lista vazia se não houver projetos atuais', async () => {
            prismaMock.projeto.findMany.mockResolvedValue([])

            const result = await projetosService.listarAtuais()

            expect(result).toEqual([])
        })
    })
})
