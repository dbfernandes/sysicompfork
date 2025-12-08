// resources/defesas/defesa.types.ts
import {
  DefesaTipo,
  DefesaNivel,
  DefesaModalidade,
  VinculoMembro,
  PresidenteOrigem,
  DefesaStatus,
} from '@prisma/client';

/** Criação mínima (wizard inicia só com isso) */
export interface DefesaInitDto {
  tipo: DefesaTipo;
  nivel: DefesaNivel;
}

/** Filtros da listagem */
export interface ListarParams {
  status?: DefesaStatus;
  tipo?: DefesaTipo;
  nivel?: DefesaNivel;
}

/** Item exibido na listagem (view) */
export interface DefesaListItem {
  id: string;
  candidatoNome: string;
  titulo: string;
  tipo: DefesaTipo;
  nivel: DefesaNivel;
  modalidade: DefesaModalidade | null; 
  dataHora: string;
  localOuLink?: string;
  status: DefesaStatus;
}

/** Entrada genérica de membro (titular/suplente) — parcial */
export interface MembroInput {
  nome: string;
  email?: string;
  instituicao?: string;
  vinculo?: VinculoMembro;
}

/* =========================
   QUALIFICAÇÃO — Passos
   ========================= */

export interface QualiStep1Dto {
  tituloTrabalho?: string;
  candidatoId?: string | null;
  orientadorId?: number | null;
  coorientadorId?: number | null;
  coorientadorExternoNome?: string | null;
  coorientadorExternoInstituicao?: string | null;
  dataHora?: string;
  modalidade?: DefesaModalidade;
}

export interface QualiStep2Dto {
  localOuLink?: string;
}

export interface QualiStep3Dto {
  resumoOuAbstract?: string;
  palavrasChaves?: string;
  creditosMinimosOk?: boolean;
}

export interface QualiStep4Dto {
  presidenteOrigem?: PresidenteOrigem;
}

export interface QualiStep5Dto {
  membrosTitulares?: MembroInput[];
}

export interface QualiStep6Dto {
  suplentes?: MembroInput[];
}

export interface QualiStep7Dto {
  doutoradoArtigoComprovado?: boolean;
  artigoTitulo?: string;
  artigoVeiculoOuDoi?: string;
  autoavaliacaoPreenchida?: boolean;
}

/* =========================
   DEFESA FINAL — Passos
   ========================= */

export interface FinalStep1Dto {
  tituloTrabalho?: string;
  linhaPesquisaId?: string | null;
  candidatoId?: string | null;
  orientadorId?: number | null;
  dataHora?: string;
  modalidade?: DefesaModalidade;
}

export interface FinalStep2Dto {
  localOuLink?: string;
}

export interface FinalStep3Dto {
  resumoPt?: string;
  palavrasChavePt?: string;
  abstractEn?: string;
  keywordsEn?: string;
  idiomaTese?: string;
  creditosOk?: boolean;
  creditosExigidos?: number;
}

export interface FinalStep4Dto {
  membrosTitulares?: MembroInput[];
}

export interface FinalStep5Dto {
  suplentes?: MembroInput[];
}

export interface FinalStep6Dto {
  artigoEstratoSuperiorOk?: boolean;
  artigoTitulo?: string;
  artigoVeiculoOuDoi?: string;
  incluiuAgradecimentosObrigatorios?: boolean;
  autoavaliacaoPreenchida?: boolean;
}
