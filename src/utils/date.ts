export function parsePtBrDate(input?: string | null): Date | null {
  if (!input) return null;
  const s = String(input).trim();
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/); // dd/MM/yyyy
  if (!m) return null;

  const day = Number(m[1]);
  const month = Number(m[2]) - 1; // 0-11
  const year = Number(m[3]);

  // Cria no UTC para não “virar” de dia por fuso/horário de verão
  const d = new Date(Date.UTC(year, month, day));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDateBR(d?: Date | null): string {
  if (!d) return '';
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}
