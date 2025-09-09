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
  tipo: DefesaTipo; // QUALIFICACAO | DEFESA_FINAL
  nivel: DefesaNivel; // MESTRADO | DOUTORADO
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
  modalidade: DefesaModalidade | null; // pode estar null enquanto rascunho
  dataHora: string; // ISO ou '' enquanto não definido
  localOuLink?: string;
  status: DefesaStatus;
}

/** Entrada genérica de membro (titular/suplente) — parcial */
export interface MembroInput {
  nome: string;
  email?: string;
  instituicao?: string;
  vinculo?: VinculoMembro; // INTERNO | EXTERNO
}

/* =========================
   QUALIFICAÇÃO — Passos
   ========================= */

export interface QualiStep1Dto {
  tituloTrabalho?: string;
  coorientadorId?: number | null;
  dataHora?: string; // ISO
  modalidade?: DefesaModalidade;
}

export interface QualiStep2Dto {
  localOuLink?: string; // texto (presencial) ou URL (online)
}

export interface QualiStep3Dto {
  resumoOuAbstract?: string;
  palavrasChaves?: string; // separadas por ";"
  creditosMinimosOk?: boolean;
}

export interface QualiStep4Dto {
  presidenteOrigem?: PresidenteOrigem; // ORIENTADOR | COORIENTADOR
}

export interface QualiStep5Dto {
  membrosTitulares?: MembroInput[]; // até 3 além do presidente
}

export interface QualiStep6Dto {
  suplentes?: MembroInput[]; // até 2
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
  coorientadorId?: number | null;
  linhaPesquisaId?: string;
  dataHora?: string; // ISO
  modalidade?: DefesaModalidade;
}

export interface FinalStep2Dto {
  localOuLink?: string; // texto (presencial) ou URL (online)
}

export interface FinalStep3Dto {
  resumoPt?: string;
  palavrasChavePt?: string; // separadas por ";"
  abstractEn?: string;
  keywordsEn?: string; // separated by ";"
  idiomaTese?: string;
  creditosOk?: boolean;
  creditosExigidos?: number; // 36 (M) | 16 (D)
}

export interface FinalStep4Dto {
  membrosTitulares?: MembroInput[]; // M: >=4 ; D: >=3 (checado na submissão)
}

export interface FinalStep5Dto {
  suplentes?: MembroInput[]; // regra checada na submissão
}

export interface FinalStep6Dto {
  artigoEstratoSuperiorOk?: boolean; // deve ser true na submissão
  artigoTitulo?: string;
  artigoVeiculoOuDoi?: string;
  incluiuAgradecimentosObrigatorios?: boolean; // true na submissão
  textoAgradecimentos?: string;
  autoavaliacaoPreenchida?: boolean;
}
