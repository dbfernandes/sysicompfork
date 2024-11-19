import { Prisma } from '@prisma/client';

// id 1 === Ativo
// id 2 === Inativo
// id 3 === Suspenso

import moment from 'moment-timezone';
const data = moment.tz('America/Manaus').format('YYYY-MM-DDTHH:mm:ssZ');

const dataAtual = new Date();
const year = dataAtual.getFullYear();

const umDiaEmMs = 24 * 60 * 60 * 1000;

const initValid = new Date(dataAtual.getTime() - umDiaEmMs * 1);
const endValid = new Date(dataAtual.getTime() + umDiaEmMs * 1);

const initInvalid = new Date(dataAtual.getTime() - umDiaEmMs * 30);
const endInvalid = new Date(dataAtual.getTime() - umDiaEmMs * 1);

export const editais: Prisma.EditalCreateManyInput[] = [
  {
    id: 1,
    editalCodigo: '001',
    vagaDoutorado: 2,
    cotasDoutorado: 2,
    vagaMestrado: 5,
    cotasMestrado: 5,
    cartaOrientador: '1',
    cartaRecomendacao: '1',
    documento: 'http://www.propesp.ufam.edu.br',
    dataInicio: initValid.toISOString(),
    dataFim: endValid.toISOString(),
    status: '1',
    inscricoesIniciadas: 0,
    inscricoesEncerradas: 0,
    createdAt: data,
    updatedAt: data,
  },
  {
    id: 2,
    editalCodigo: '002',
    vagaDoutorado: 2,
    cotasDoutorado: 2,
    vagaMestrado: 5,
    cotasMestrado: 5,
    cartaOrientador: '1',
    cartaRecomendacao: '1',
    documento: 'http://www.propesp.ufam.edu.br',
    dataInicio: initInvalid.toISOString(),
    dataFim: endInvalid.toISOString(),
    status: '1',
    inscricoesIniciadas: 0,
    inscricoesEncerradas: 0,
    createdAt: data,
    updatedAt: data,
  },
  {
    id: 3,
    editalCodigo: '003',
    vagaDoutorado: 2,
    cotasDoutorado: 2,
    vagaMestrado: 5,
    cotasMestrado: 5,
    cartaOrientador: '1',
    cartaRecomendacao: '1',
    documento: 'http://www.propesp.ufam.edu.br',
    dataInicio: initValid.toISOString(),
    dataFim: endValid.toISOString(),
    status: '0',
    inscricoesIniciadas: 0,
    inscricoesEncerradas: 0,
    createdAt: data,
    updatedAt: data,
  },
  {
    editalCodigo: '002-2024',
    vagaDoutorado: 6,
    cotasDoutorado: 8,
    vagaMestrado: 1,
    cotasMestrado: 3,
    cartaOrientador: '0',
    cartaRecomendacao: '1',
    documento: 'http://www.propesp.ufam.edu.br',
    dataInicio: new Date(year, 3, 1).toISOString(),
    dataFim: new Date(year, 5, 30).toISOString(),
    status: '0',
    inscricoesIniciadas: 0,
    inscricoesEncerradas: 0,
    createdAt: data,
    updatedAt: data,
  },
  {
    editalCodigo: '003-2024',
    vagaDoutorado: 9,
    cotasDoutorado: 2,
    vagaMestrado: 2,
    cotasMestrado: 3,
    cartaOrientador: '1',
    cartaRecomendacao: '0',
    documento: 'http://www.propesp.ufam.edu.br',
    dataInicio: new Date(year, 6, 1).toISOString(),
    dataFim: new Date(year, 8, 30).toISOString(),
    status: '1',
    inscricoesIniciadas: 0,
    inscricoesEncerradas: 0,
    createdAt: data,
    updatedAt: data,
  },
  {
    editalCodigo: '004-2024',
    vagaDoutorado: 5,
    cotasDoutorado: 2,
    vagaMestrado: 10,
    cotasMestrado: 3,
    cartaOrientador: '0',
    cartaRecomendacao: '0',
    documento: 'http://www.propesp.ufam.edu.br',
    dataInicio: new Date(year, 9, 1).toISOString(),
    dataFim: new Date(year, 11, 31).toISOString(),
    status: '1',
    inscricoesIniciadas: 0,
    inscricoesEncerradas: 0,
    createdAt: data,
    updatedAt: data,
  },
];
