import prisma from '../../client';
import { Prisma, ReservaSala } from '@prisma/client';
import { SalaAlreahyReservedError } from '@resources/reservasDeSalas/reservas.erro';
type CreateInput = Prisma.ReservaSalaUncheckedCreateInput;

const PT_WEEKDAYS = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
];

function parseHoraToMinutes(hhmm: string): number {
  // aceita "HH:mm" ou "HH:mm:ss"
  const [h, m] = (hhmm || '00:00').split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function horasSobrepoem(
  aIni: string,
  aFim: string,
  bIni: string,
  bFim: string,
): boolean {
  const ai = parseHoraToMinutes(aIni);
  const af = parseHoraToMinutes(aFim);
  const bi = parseHoraToMinutes(bIni);
  const bf = parseHoraToMinutes(bFim);
  return ai < bf && bi < af;
}

function normDiasToArray(dias?: string | string[]): string[] {
  if (!dias) return [];
  if (Array.isArray(dias)) {
    // pode vir como ["Segunda", "Quarta", "Sexta"] OU ["Segunda, Quarta, Sexta"]
    if (dias.length === 1 && dias[0].includes(',')) {
      return dias[0]
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return dias.map((s) => (s || '').trim()).filter(Boolean);
  }
  // string "Segunda, Quarta, Sexta"
  return dias
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function getWeekdayNamePT(date: Date): string {
  return PT_WEEKDAYS[date.getDay()];
}

function intervalosDeDatasSeSobrepoem(
  aIni: Date,
  aFim: Date,
  bIni: Date,
  bFim: Date,
): boolean {
  // inclusivo: [aIni, aFim] x [bIni, bFim]
  return aIni <= bFim && bIni <= aFim;
}

function isUnica(diasArr: string[], dataInicio: Date, dataFim: Date): boolean {
  // Consideramos "única" quando não há dias marcados e dataInicio == dataFim
  return diasArr.length === 0 && dataInicio.getTime() === dataFim.getTime();
}

/**
 * Verifica conflito contra reservas já existentes no banco.
 * Lança ConflitoReservaError em caso de choque.
 */
async function verificarConflito(dados: CreateInput): Promise<void> {
  // Normalizações
  const salaId = Number(dados.salaId);
  const dataInicio =
    dados.dataInicio instanceof Date
      ? dados.dataInicio
      : new Date(dados.dataInicio as string);
  const dataFim =
    dados.dataFim instanceof Date
      ? dados.dataFim
      : new Date((dados.dataFim as string) || (dados.dataInicio as string));
  const horaInicio = (dados.horaInicio || '').slice(0, 5); // "HH:mm"
  const horaFim = (dados.horaFim || '').slice(0, 5); // "HH:mm"
  const diasNovo = normDiasToArray(dados.dias as any);

  // 1) Busque apenas reservas com datas sobrepostas na mesma sala
  const candidatos = await prisma.reservaSala.findMany({
    where: {
      salaId,
      // [exist.dataInicio, exist.dataFim] sobrepõe [novo.dataInicio, novo.dataFim]
      AND: [{ dataInicio: { lte: dataFim } }, { dataFim: { gte: dataInicio } }],
    },
    select: {
      id: true,
      dataInicio: true,
      dataFim: true,
      horaInicio: true,
      horaFim: true,
      dias: true,
    },
  });

  const novaEhUnica = isUnica(diasNovo, dataInicio, dataFim);

  for (const r of candidatos) {
    const existInicio = new Date(r.dataInicio);
    const existFim = new Date(r.dataFim);
    const existDias = normDiasToArray(r.dias as any);
    const existEhUnica = isUnica(existDias, existInicio, existFim);

    // 2) Checagem de dias
    let diasEmComum = false;

    if (novaEhUnica && existEhUnica) {
      // ambos únicos: datas já sobrepuseram, então os dias "batem" pelo mesmo dia
      diasEmComum = true;
    } else if (novaEhUnica && !existEhUnica) {
      // nova única, existente recorrente → verifica se o dia da nova está nos dias do existente
      const diaNova = getWeekdayNamePT(dataInicio);
      diasEmComum = existDias.includes(diaNova);
    } else if (!novaEhUnica && existEhUnica) {
      // nova recorrente, existente única → dia do existente precisa estar nos dias da nova
      const diaExist = getWeekdayNamePT(existInicio);
      diasEmComum = diasNovo.includes(diaExist);
    } else {
      // ambos recorrentes → interseção de conjuntos
      const setNovo = new Set(diasNovo);
      diasEmComum = existDias.some((d) => setNovo.has(d));
    }

    if (!diasEmComum) continue;

    // 3) Se há dias em comum, checar se os horários se chocam
    const choqueHorario = horasSobrepoem(
      horaInicio,
      horaFim || horaInicio, // fallback se vier vazio
      (r.horaInicio || '').slice(0, 5),
      (r.horaFim || r.horaInicio || '').slice(0, 5),
    );

    if (choqueHorario) {
      // conflito detectado
      throw new SalaAlreahyReservedError();
    }
  }
}

export default new (class ReservaService {
  async listAll(): Promise<ReservaSala[]> {
    return prisma.reservaSala.findMany();
  }

  async listarReservasSalas() {
    return prisma.reservaSala.findMany({
      include: {
        sala: true,
        usuario: {
          select: { id: true, nomeCompleto: true },
        },
      },
    });
  }

  async listarReservasDeUmUsuario(id: number): Promise<ReservaSala[]> {
    return prisma.reservaSala.findMany({
      where: { usuarioId: id },
      include: {
        usuario: {
          select: {
            id: true,
            nomeCompleto: true,
          },
        },
      },
    });
  }

  async buscarReserva(id: number): Promise<ReservaSala | null> {
    return prisma.reservaSala.findUnique({ where: { id } });
  }

  async criar(dados: Prisma.ReservaSalaUncheckedCreateInput) {
    const dataInicio =
      dados.dataInicio instanceof Date
        ? dados.dataInicio
        : new Date(dados.dataInicio as string);

    const dataFim =
      dados.dataFim instanceof Date
        ? dados.dataFim
        : new Date((dados.dataFim as string) || (dados.dataInicio as string));
    await verificarConflito({ ...dados, dataInicio, dataFim });

    return prisma.reservaSala.create({
      data: {
        ...dados,
        dataInicio,
        dataFim,
        salaId: Number(dados.salaId),
        usuarioId: Number(dados.usuarioId),
      },
    });
  }

  async atualizar(
    id: number,
    data: Prisma.ReservaSalaUncheckedUpdateInput,
  ): Promise<ReservaSala> {
    return prisma.reservaSala.update({
      where: { id },
      data,
    });
  }

  async remover(id: number): Promise<ReservaSala> {
    return prisma.reservaSala.delete({ where: { id } });
  }
})();
