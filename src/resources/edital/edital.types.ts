export interface CreateEditalDto {
  vagasDoutorado?: number;
  cotasDoutorado?: number;
  vagasMestrado?: number;
  cotasMestrado?: number;
  cartaOrientador: string;
  cartaRecomendacao: string;
  documento: string;
  dataFim: Date;
  dataInicio: Date;
  status: number;
  inscricoesEncerradas: number;
  inscricoesIniciadas: number;
  editalId: number;
}

export interface UpdateEditalDto {
  editalId?: number;
  vagasDoutorado?: number;
  cotasDoutorado?: number;
  vagasMestrado?: number;
  cotasMestrado?: number;
  cartaOrientador?: string;
  cartaRecomendacao?: string;
  documento?: string;
  dataFim?: Date;
  dataInicio?: Date;
  inscricoesEncerradas?: number;
  inscricoesIniciadas?: number;
  id?: number;
}
