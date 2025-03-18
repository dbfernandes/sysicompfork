export function formatarData(data: Date | null | undefined): string {
  if (!data || isNaN(new Date(data).getTime())) return 'Data inválida';

  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
