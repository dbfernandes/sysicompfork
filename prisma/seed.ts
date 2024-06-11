import { PrismaClient } from '@prisma/client'
import moment from 'moment-timezone'
const prisma = new PrismaClient()

async function main() {
    await prisma.usuario.create({
        data: {
            nomeCompleto: 'Usuario de teste inicial',
            cpf: '111.111.111-11',
            senhaHash: '$2a$12$8T7iExFehnA52apHy4ux3.ILtp41fcNq/aFuJ6OtxGZaAee5sGvNa',
            tokenResetSenha: null,
            validadeTokenResetSenha: null,
            email: 'user@icomp.ufam.edu.br',
            status: 1,
            administrador: 1,
            coordenador: 0,
            secretaria: 0,
            professor: 1,
            siape: '0401114',
            dataIngresso: '27/11/1989',
            endereco: 'Rua Real, Nº 171, Conjunto Real, Bairro Real, Manaus-AM, CEP 00000-000',
            telCelular: '(92) 00000-0000',
            telResidencial: '(92) 00000-0000',
            unidade: 'IComp', 
            turno: 'Matutino e Vespertino',
            idLattes: 1234567891011121,
            createdAt: new Date(),
            updatedAt: new Date()
        },
    })
    await prisma.usuario.create({
        data: {
            nomeCompleto: 'JhonDoe',
            cpf: '222.222.222-22',
            senhaHash: '$2a$12$8T7iExFehnA52apHy4ux3.ILtp41fcNq/aFuJ6OtxGZaAee5sGvNa',
            tokenResetSenha: null,
            validadeTokenResetSenha: null,
            email: 'Jhoe@icomp.ufam.edu.br',
            status: 1,
            administrador: 0,
            coordenador: 0,
            secretaria: 0,
            professor: 1,
            siape: '0401114',
            dataIngresso: '27/11/1989',
            endereco: 'Rua Real, Nº 171, Conjunto Real, Bairro Real, Manaus-AM, CEP 00000-000',
            telCelular: '(92) 00000-0000',
            telResidencial: '(92) 00000-0000',
            unidade: 'IComp',
            turno: 'Matutino e Vespertino',
            idLattes: 126842094567,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    })
    await prisma.linhasDePesquisa.create({
        data: {
            id: 1,
            nome: 'Banco de Dados e Recuperacao de Informacao',
            sigla: 'BD e RI',
            createdAt: new Date(),
            updatedAt: new Date()
        },
    })

    const data = moment.tz('America/Manaus').format('YYYY-MM-DD HH:mm:ss')

    await prisma.edital.createMany({
        data: [
            {
                editalId: '001-2023',
                vagaDoutorado: 2,
                cotasDoutorado: 2,
                vagaMestrado: 5,
                cotasMestrado: 5,
                cartaOrientador: '1',
                cartaRecomendacao: '1',
                documento: 'http://www.propesp.ufam.edu.br',
                dataInicio: '2023-08-23',
                dataFim: '2023-09-09',
                status: '1',
                inscricoesIniciadas: 0,
                inscricoesEncerradas: 0,
                createdAt: data,
                updatedAt: data
              },
              {
                editalId: '002-2023',
                vagaDoutorado: 6,
                cotasDoutorado: 8,
                vagaMestrado: 1,
                cotasMestrado: 3,
                cartaOrientador: '0',
                cartaRecomendacao: '1',
                documento: 'http://www.propesp.ufam.edu.br',
                dataInicio: '2023-05-27',
                dataFim: '2023-06-027',
                status: '0',
                inscricoesIniciadas: 0,
                inscricoesEncerradas: 0,
                createdAt: data,
                updatedAt: data
              },
              {
                editalId: '003-2023',
                vagaDoutorado: 9,
                cotasDoutorado: 2,
                vagaMestrado: 2,
                cotasMestrado: 3,
                cartaOrientador: '1',
                cartaRecomendacao: '0',
                documento: 'http://www.propesp.ufam.edu.br',
                dataInicio: '2023-07-14',
                dataFim: '2023-08-01',
                status: '1',
                inscricoesIniciadas: 0,
                inscricoesEncerradas: 0,
                createdAt: data,
                updatedAt: data
              },
              {
                editalId: '004-2023',
                vagaDoutorado: 5,
                cotasDoutorado: 2,
                vagaMestrado: 10,
                cotasMestrado: 3,
                cartaOrientador: '0',
                cartaRecomendacao: '0',
                documento: 'http://www.propesp.ufam.edu.br',
                dataInicio: '2023-08-02',
                dataFim: '2023-09-30',
                status: '1',
                inscricoesIniciadas: 0,
                inscricoesEncerradas: 0,
                createdAt: data,
                updatedAt: data
              },
        ]
    })
}
// Gera todas as seeds
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
    })
