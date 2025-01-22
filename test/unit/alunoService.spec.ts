import alunoService from '../../src/resources/alunos/aluno.service'
import { prismaMock } from '../../singleton';

describe('AlunoService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('adicionarVarios', () => {
        it('deve remover todos os registros existentes e adicionar novos alunos', async () => {
            const mockAlunos = [
                { nomeCompleto: 'Aluno 1', curso: 'Ciência da Computação', formado: 0, periodoIngresso: "1", periodoConclusao: "0" },
                { nomeCompleto: 'Aluno 2', curso: 'Engenharia de Software', formado: 1, periodoIngresso: "0", periodoConclusao: "1" },
            ];

            await alunoService.adicionarVarios(mockAlunos);

            expect(prismaMock.aluno.deleteMany).toHaveBeenCalled();
            expect(prismaMock.aluno.createMany).toHaveBeenCalledWith({ data: mockAlunos });
        });

        it('não deve fazer nada se a lista de alunos estiver vazia ou indefinida', async () => {
            await alunoService.adicionarVarios([]);
            expect(prismaMock.aluno.deleteMany).not.toHaveBeenCalled();
            expect(prismaMock.aluno.createMany).not.toHaveBeenCalled();
        });
    });

    describe('listarTodos', () => {
        it('deve listar todos os alunos de um curso específico', async () => {
            const mockAlunos = [
                {
                    id: 1,
                    nomeCompleto: 'Aluno 1',
                    curso: 'Ciência da Computação',
                    formado: 0,
                    periodoIngresso: "1",
                    periodoConclusao: "0",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            prismaMock.aluno.findMany.mockResolvedValue(mockAlunos);

            const result = await alunoService.listarTodos('Ciência da Computação', 0);

            expect(prismaMock.aluno.findMany).toHaveBeenCalledWith({
                where: {
                    curso: 'Ciência da Computação',
                    formado: 0,
                },
            });
            expect(result).toEqual(mockAlunos);
        });

        it('deve listar alunos de múltiplos cursos se um array de cursos for passado', async () => {
            const mockAlunos = [
                {
                    id: 1,
                    nomeCompleto: 'Aluno 1',
                    curso: 'Ciência da Computação',
                    formado: 0,
                    periodoIngresso: "1",
                    periodoConclusao: "0",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    nomeCompleto: 'Aluno 2',
                    curso: 'Engenharia de Software',
                    formado: 2,
                    periodoIngresso: "1",
                    periodoConclusao: "0",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            prismaMock.aluno.findMany.mockResolvedValue(mockAlunos);

            const result = await alunoService.listarTodos(['Ciência da Computação', 'Engenharia de Software'], 0);

            expect(prismaMock.aluno.findMany).toHaveBeenCalledWith({
                where: {
                    curso: { in: ['Ciência da Computação', 'Engenharia de Software'] },
                    formado: 0,
                },
            });
            expect(result).toEqual(mockAlunos);
        });
    });

    describe('contarTodos', () => {
        it('deve contar alunos matriculados e egressos corretamente', async () => {
            const mockAlunos = [
                {
                    id: 1,
                    nomeCompleto: 'Aluno 1',
                    curso: 'Ciência da Computação',
                    formado: 0,
                    periodoIngresso: "1",
                    periodoConclusao: "0",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    nomeCompleto: 'Aluno 2',
                    curso: 'Engenharia de Software',
                    formado: 1,
                    periodoIngresso: "1",
                    periodoConclusao: "0",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 3,
                    nomeCompleto: 'Aluno 3',
                    curso: 'Mestrado',
                    formado: 0,
                    periodoIngresso: "1",
                    periodoConclusao: "0",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            prismaMock.aluno.findMany.mockResolvedValue(mockAlunos);

            const result = await alunoService.contarTodos();

            expect(prismaMock.aluno.findMany).toHaveBeenCalledWith({
                where: {
                    curso: { not: 'Processamento de Dados' },
                },
                select: {
                    formado: true,
                    curso: true,
                    createdAt: true,
                },
            });

            expect(result.matriculados.CC).toBe(1);
            expect(result.egressos.ES).toBe(1);
            expect(result.matriculados.M).toBe(1);
        });

        it('deve retornar contagem inicial se não houver alunos', async () => {
            prismaMock.aluno.findMany.mockResolvedValue([]);

            const result = await alunoService.contarTodos();

            expect(result.matriculados.CC).toBe(0);
            expect(result.egressos.ES).toBe(0);
            expect(result.matriculados.M).toBe(0);
        });
    });
});