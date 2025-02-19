import EditalService from '../../src/resources/edital/edital.service';
import { prismaMock } from '../../singleton';

describe('EditalService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('criarEdital', () => {
        it('deve criar um novo edital se ele não existir', async () => {
            const editalDados = {
                id: '123',
                vagasDoutorado: 0,
                cotasDoutorado: 0,
                vagasMestrado: 1,
                cotasMestrado: 1,
                cartaOrientador: '',
                cartaRecomendacao: '',
                documento: '',
                dataFim: new Date(),
                dataInicio: new Date(),
                status: 1,
                inscricoesEncerradas: 1,
                inscricoesIniciadas: 1,
            };

            (prismaMock.edital.findFirst as jest.Mock).mockResolvedValue(null);
            (prismaMock.edital.create as jest.Mock).mockResolvedValue(editalDados);

            const result = await EditalService.criarEdital(editalDados);

            expect(prismaMock.edital.findFirst).toHaveBeenCalledWith({
                where: { id: editalDados.id },
            });
            expect(prismaMock.edital.create).toHaveBeenCalledWith({ data: editalDados });
            expect(result).toEqual(editalDados);
        });

        it('deve lançar erro se o edital já existir', async () => {
            const editalDados = {
                id: '123',
                vagasDoutorado: 0,
                cotasDoutorado: 0,
                vagasMestrado: 1,
                cotasMestrado: 1,
                cartaOrientador: '',
                cartaRecomendacao: '',
                documento: '',
                dataFim: new Date(),
                dataInicio: new Date(),
                status: 1,
                inscricoesEncerradas: 1,
                inscricoesIniciadas: 1,
            };

            (prismaMock.edital.findFirst as jest.Mock).mockResolvedValue(editalDados);

            await expect(EditalService.criarEdital(editalDados)).rejects.toThrow(
                `Edital de número ${editalDados.id} já existe`,
            );
        });
    });

    describe('listEdital', () => {
        it('deve retornar todos os editais', async () => {
            const mockEditais = [
                {
                    id: '123',
                    vagasDoutorado: 0,
                    cotasDoutorado: 0,
                    vagasMestrado: 1,
                    cotasMestrado: 1,
                    cartaOrientador: '',
                    cartaRecomendacao: '',
                    documento: '',
                    dataFim: new Date(),
                    dataInicio: new Date(),
                    status: 1,
                    inscricoesEncerradas: 1,
                    inscricoesIniciadas: 1,
                },
            ];

            (prismaMock.edital.findMany as jest.Mock).mockResolvedValue(mockEditais);

            const result = await EditalService.listEdital();

            expect(prismaMock.edital.findMany).toHaveBeenCalled();
            expect(result).toEqual(mockEditais);
        });

        it('deve lançar erro se falhar ao listar editais', async () => {
            (prismaMock.edital.findMany as jest.Mock).mockRejectedValue(new Error('Erro ao listar editais'));

            await expect(EditalService.listEdital()).rejects.toThrow(undefined);
        })
    });

    describe('delete', () => {
        it('deve lançar erro se o edital não existir', async () => {
            const editalId = '123';

            (prismaMock.edital.findFirst as jest.Mock).mockResolvedValue(null);

            await expect(EditalService.delete(editalId)).rejects.toThrow(
                `Não existe edital de número ${editalId}`,
            );
        });
    });

    describe('listCandidatos', () => {
        it('deve lançar erro se falhar ao listar candidatos', async () => {
            const editalId = '123';

            (prismaMock.candidato.findMany as jest.Mock).mockRejectedValue(
                new Error('Erro ao listar candidatos'),
            );

            await expect(EditalService.listCandidatos(editalId)).rejects.toThrow(
                'Não foi possivel listar os candidatos',
            );
        });
    });
});