// types.ts

export interface Artigo {
    ano: number;
    [key: string]: any;
}
  
export interface Publicacoes {
  artigosConferencias: Artigo[];
  artigosPeriodicos: Artigo[];
  livros: any[]; 
  capitulos: any[]; 
}

export interface Professor {
  id: number;
  nomeCompleto: string;
  [key: string]: any;
}

export interface Projeto {
  inicio: number;
  fim: number;
  [key: string]: any;
}

export interface Orientacao {
  ano: number;
  status: number;
  [key: string]: any;
}

export interface Premio {
  ano: number;
  [key: string]: any;
}
  
  