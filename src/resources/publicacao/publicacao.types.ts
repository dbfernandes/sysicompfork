export interface PublicacaoCount {
  ano: number;
  tipo: number;
  _count: {
    _all: number;
  };
}

export interface ContagemResult {
  contagemTotal: {
    Conferencia: number[];
    Periodico: number[];
  };
  anos: number[];
}
