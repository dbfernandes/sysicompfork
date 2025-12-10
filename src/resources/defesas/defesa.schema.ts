import Joi, { custom } from 'joi';
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
  email: Joi.string().email().optional().allow(''),
  instituicao: Joi.string().max(255).optional().allow(''),
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
  candidatoId: Joi.string().required(),
  orientadorId: Joi.number().integer().required(),
  coorientadorId: Joi.number().integer().allow(null).optional(),
  dataHora: Joi.string().isoDate().optional(),
  modalidade: enumJoi(DefesaModalidade).optional(),
  coorientadorExternoNome: Joi.string().allow(null, '').optional(),
  coorientadorExternoInstituicao: Joi.string().allow(null, '').optional(),
});
export const qualiStep2Schema = Joi.object<QualiStep2Dto>({
  localOuLink: Joi.string().max(1000).optional().allow(''),
});
export const qualiStep3Schema = Joi.object<QualiStep3Dto>({
  resumoOuAbstract: Joi.string().max(15000).optional(),
  palavrasChaves: Joi.string().max(1000).optional(),
  creditosMinimosOk: Joi.boolean().required(),
});
export const qualiStep4Schema = Joi.object<QualiStep4Dto>({
  presidenteOrigem: enumJoi(PresidenteOrigem).optional(),
});
export const qualiStep5Schema = Joi.object<QualiStep5Dto>({
  membrosTitulares: Joi.array()
    .items(membroPartial)
    .custom((value, helpers) => {
      if (!value) return value;

      const filledMembers = value.filter((m) => m.nome && m.nome.trim() !== '');
      if (filledMembers.length < 2) {
        return helpers.message({
          custom:
            'É necessário preencher os dados de pelo menos 2 membros titulares.',
        });
      }
      return value;
    })
    .optional(),
});
export const qualiStep6Schema = Joi.object<QualiStep6Dto>({
  suplentes: Joi.array()
    .items(membroPartial)
    .custom((value, helpers) => {
      if (!value) return value;
      const filledMembers = value.filter((m) => m.nome && m.nome.trim() !== '');
      if (filledMembers.length < 2) {
        return helpers.message({
          custom: 'É necessário preencher os dados dos 2 membros suplentes.',
        });
      }
      return value;
    })
    .optional(),
});

export const qualiStep7Schema = Joi.object<QualiStep7Dto>({
  doutoradoArtigoComprovado: Joi.boolean().optional(),
  artigoTitulo: Joi.string().max(500).allow('').optional(),
  artigoVeiculoOuDoi: Joi.string().max(500).allow('').optional(),
  autoavaliacaoPreenchida: Joi.boolean().required().messages({
    'any.required': 'Você deve confirmar o preenchimento da autoavaliação.',
    'boolean.base': 'Confirmação da autoavaliação inválida.',
  }),
});

// ===== FINAL (parciais) =====
export const finalStep1Schema = Joi.object<FinalStep1Dto>({
  tituloTrabalho: Joi.string()
    .max(500)
    .required()
    .messages({ 'any.required': 'O título do trabalho é obrigatório.' }),
  linhaPesquisaId: Joi.string()
    .required()
    .messages({ 'any.required': 'A linha de pesquisa é obrigatória.' }),
  candidatoId: Joi.string()
    .required()
    .messages({ 'any.required': 'O candidato é obrigatório.' }),
  orientadorId: Joi.number()
    .integer()
    .required()
    .messages({ 'any.required': 'O orientador é obrigatório.' }),
  dataHora: Joi.string()
    .isoDate()
    .required()
    .messages({ 'any.required': 'A data e hora são obrigatórias.' }),
  modalidade: enumJoi(DefesaModalidade)
    .required()
    .messages({ 'any.required': 'A modalidade é obrigatória.' }),
}).prefs({ abortEarly: false });
export const finalStep2Schema = Joi.object<FinalStep2Dto>({
  localOuLink: Joi.string().max(1000).optional(),
});
export const finalStep3Schema = Joi.object<FinalStep3Dto>({
  resumoPt: Joi.string()
    .required()
    .messages({ 'any.required': 'Resumo obrigatório.' }),
  palavrasChavePt: Joi.string()
    .required()
    .messages({ 'any.required': 'Palavras-chave PT obrigatórias.' }),
  abstractEn: Joi.string()
    .required()
    .messages({ 'any.required': 'Abstract obrigatório.' }),
  keywordsEn: Joi.string()
    .required()
    .messages({ 'any.required': 'Keywords EN obrigatórias.' }),
  idiomaTese: Joi.string()
    .required()
    .messages({ 'any.required': 'Idioma da tese obrigatório.' }),
  creditosOk: Joi.boolean()
    .required()
    .messages({ 'any.required': 'Confirmação de créditos obrigatória.' }),
  creditosExigidos: Joi.number().valid(16, 36).optional(),
}).prefs({ abortEarly: false });
export const finalStep4Schema = Joi.object<FinalStep4Dto>({
  membrosTitulares: Joi.array()
    .items(membroPartial)
    .custom((value, helpers) => {
      if (!value) return value;
      const filledMembers = value.filter((m) => m.nome && m.nome.trim() !== '');
      if (filledMembers.length < 2) {
        return helpers.message({
          custom:
            'É necessário preencher os dados dos 2 primeiros membros titulares.',
        });
      }
      return value;
    })
    .optional(),
});

export const finalStep5Schema = Joi.object<FinalStep5Dto>({
  suplentes: Joi.array()
    .items(membroPartial)
    .custom((value, helpers) => {
      if (!value) return value;
      const filledMembers = value.filter((m) => m.nome && m.nome.trim() !== '');
      if (filledMembers.length < 2) {
        return helpers.message({
          custom: 'É necessário preencher os dados dos 2 membros suplentes.',
        });
      }
      return value;
    })
    .optional(),
});
export const finalStep6Schema = Joi.object<FinalStep6Dto>({
  artigoEstratoSuperiorOk: Joi.boolean().required().valid(true).messages({
    'any.required': 'Você deve declarar o artigo.',
    'any.only': 'Você deve declarar o artigo.',
  }),
  artigoTitulo: Joi.string().required().messages({
    'any.required': 'O título do artigo é obrigatório.',
    'string.empty': 'O título do artigo é obrigatório.',
  }),
  artigoVeiculoOuDoi: Joi.string().required().messages({
    'any.required': 'O veículo/DOI do artigo é obrigatório.',
    'string.empty': 'O veículo/DOI do artigo é obrigatório.',
  }),
  incluiuAgradecimentosObrigatorios: Joi.boolean()
    .required()
    .valid(true)
    .messages({
      'any.required': 'Você deve declarar os agradecimentos.',
      'any.only': 'Você deve declarar os agradecimentos.',
    }),
  autoavaliacaoPreenchida: Joi.boolean().required().valid(true).messages({
    'any.required': 'Você deve declarar a autoavaliação.',
    'any.only': 'Você deve declarar a autoavaliação.',
  }),
}).prefs({ abortEarly: false });
