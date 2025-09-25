import Joi from 'joi';
import {
  DefesaModalidade,
  DefesaNivel,
  DefesaTipo,
  VinculoMembro,
  PresidenteOrigem,
} from '@prisma/client';
import type {
  DefesaInitDto,
  MembroInput,
  QualiStep1Dto,
  QualiStep2Dto,
  QualiStep3Dto,
  QualiStep4Dto,
  QualiStep5Dto,
  QualiStep6Dto,
  QualiStep7Dto,
  FinalStep1Dto,
  FinalStep2Dto,
  FinalStep3Dto,
  FinalStep4Dto,
  FinalStep5Dto,
  FinalStep6Dto,
} from './defesa.types';

const enumJoi = <T extends Record<string, string>>(e: T) =>
  Joi.string().valid(...(Object.values(e) as string[]));

const membroPartial = Joi.object<MembroInput>({
  nome: Joi.string().max(255).required(),
  email: Joi.string().email().optional(),
  instituicao: Joi.string().max(255).optional(),
  vinculo: enumJoi(VinculoMembro).optional(),
});

// ===== init (estrito) =====
export const defesaInitSchema = Joi.object<DefesaInitDto>({
  tipo: enumJoi(DefesaTipo).required(),
  nivel: enumJoi(DefesaNivel).required(),
}).prefs({ abortEarly: false });

// ===== QUALI (parciais) =====
export const qualiStep1Schema = Joi.object<QualiStep1Dto>({
  tituloTrabalho: Joi.string().max(500).optional(),
  coorientadorId: Joi.number().integer().allow(null).optional(),
  dataHora: Joi.string().isoDate().optional(),
  modalidade: enumJoi(DefesaModalidade).optional(),
});
export const qualiStep2Schema = Joi.object<QualiStep2Dto>({
  localOuLink: Joi.string().max(1000).optional(),
});
export const qualiStep3Schema = Joi.object<QualiStep3Dto>({
  resumoOuAbstract: Joi.string().max(15000).optional(),
  palavrasChaves: Joi.string().max(1000).optional(),
  creditosMinimosOk: Joi.boolean().optional(),
});
export const qualiStep4Schema = Joi.object<QualiStep4Dto>({
  presidenteOrigem: enumJoi(PresidenteOrigem).optional(),
});
export const qualiStep5Schema = Joi.object<QualiStep5Dto>({
  membrosTitulares: Joi.array().items(membroPartial).optional(),
});
export const qualiStep6Schema = Joi.object<QualiStep6Dto>({
  suplentes: Joi.array().items(membroPartial).optional(),
});
export const qualiStep7Schema = Joi.object<QualiStep7Dto>({
  doutoradoArtigoComprovado: Joi.boolean().optional(),
  artigoTitulo: Joi.string().max(500).optional(),
  artigoVeiculoOuDoi: Joi.string().max(500).optional(),
  autoavaliacaoPreenchida: Joi.boolean().optional(),
});

// ===== FINAL (parciais) =====
export const finalStep1Schema = Joi.object<FinalStep1Dto>({
  tituloTrabalho: Joi.string().max(500).optional(),
  coorientadorId: Joi.number().integer().allow(null).optional(),
  linhaPesquisaId: Joi.string().optional(),
  dataHora: Joi.string().isoDate().optional(),
  modalidade: enumJoi(DefesaModalidade).optional(),
});
export const finalStep2Schema = Joi.object<FinalStep2Dto>({
  localOuLink: Joi.string().max(1000).optional(),
});
export const finalStep3Schema = Joi.object<FinalStep3Dto>({
  resumoPt: Joi.string().max(15000).optional(),
  palavrasChavePt: Joi.string().max(1000).optional(),
  abstractEn: Joi.string().max(15000).optional(),
  keywordsEn: Joi.string().max(1000).optional(),
  idiomaTese: Joi.string().max(100).optional(),
  creditosOk: Joi.boolean().optional(),
  creditosExigidos: Joi.number().valid(36, 16).optional(),
});
export const finalStep4Schema = Joi.object<FinalStep4Dto>({
  membrosTitulares: Joi.array().items(membroPartial).optional(),
});
export const finalStep5Schema = Joi.object<FinalStep5Dto>({
  suplentes: Joi.array().items(membroPartial).optional(),
});
export const finalStep6Schema = Joi.object<FinalStep6Dto>({
  artigoEstratoSuperiorOk: Joi.boolean().optional(),
  artigoTitulo: Joi.string().max(500).optional(),
  artigoVeiculoOuDoi: Joi.string().max(500).optional(),
  incluiuAgradecimentosObrigatorios: Joi.boolean().optional(),
  textoAgradecimentos: Joi.string().max(4000).allow('').optional(),
  autoavaliacaoPreenchida: Joi.boolean().optional(),
});
