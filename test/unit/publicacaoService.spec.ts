import publicacaoService from '../../src/resources/publicacao/publicacao.service';
import { prismaMock } from '../../singleton'


describe('PublicacaoService', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('adicionarVarios', () => {
        it('não deve adicionar publicações se a lista estiver vazia', async () => {
            const professorId = 1;

            await publicacaoService.adicionarVarios(professorId, []);

            expect(prismaMock.publicacao.create).not.toHaveBeenCalled();
            expect(prismaMock.usuarioPublicacao.create).not.toHaveBeenCalled();
        });
    });

    describe('listarTodos', () => {
        it('deve listar publicações com filtros aplicados', async () => {
            const mockPublicacoes = [
                {
                    id: 1,
                    titulo: 'Publicação 1',
                    ano: 2023,
                    tipoId: 1,
                    local: 'Local 1',
                    natureza: 'Natureza 1',
                    autores: 'Autor 1',
                    issn: '1234-5678',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            prismaMock.publicacao.findMany.mockResolvedValue(mockPublicacoes);

            const result = await publicacaoService.listarTodos([1], 2023);

            expect(prismaMock.publicacao.findMany).toHaveBeenCalledWith({
                where: {
                    tipoId: { in: [1] },
                    ano: { in: [2023] },
                },
                include: { usuarioPublicacoes: true },
            });
            expect(result).toEqual(mockPublicacoes);
        });
    });

    describe('contarTodos', () => {
        it('deve retornar a contagem correta de publicações', async () => {
            const mockCounts = [
                { ano: 2023, tipo: 1, total: 5 },
                { ano: 2023, tipo: 2, total: 3 },
            ];

            prismaMock.$queryRaw.mockResolvedValue(mockCounts);

            const result = await publicacaoService.contarTodos();

            expect(prismaMock.$queryRaw).toHaveBeenCalled();
            expect(result.contagemTotal.Conferencia).toContain(5);
            expect(result.contagemTotal.Periodico).toContain(3);
        });
    });
});
