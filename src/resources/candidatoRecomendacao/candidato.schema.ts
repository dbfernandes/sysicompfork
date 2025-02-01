import Joi from 'joi';

const validPlaces = [
  'conheceEmpresa',
  'conheceGraduacao',
  'conhecePos',
  'conheceOutros',
];
const validRelationships = [
  'orientador',
  'professor',
  'empregador',
  'coordenador',
  'colegaTrabalho',
  'colegaCurso',
  'outrosContatos',
];

export const saveRecomendacaoSchema = Joi.object({
  places: Joi.alternatives()
    .try(
      Joi.string().valid(...validPlaces),
      Joi.array().items(Joi.string().valid(...validPlaces)),
    )
    .required(),

  relationships: Joi.alternatives()
    .try(
      Joi.string().valid(...validRelationships),
      Joi.array().items(Joi.string().valid(...validRelationships)),
    )
    .required(),

  anoContato: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .allow(null)
    .empty(''),
  anoTitulacao: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .allow(null)
    .empty(''),

  aprendizado: Joi.number().integer().min(1).max(5).default(0),
  assiduidade: Joi.number().integer().min(1).max(5).default(0),
  dominio: Joi.number().integer().min(1).max(5).default(0),
  expressao: Joi.number().integer().min(1).max(5).default(0),
  iniciativa: Joi.number().integer().min(1).max(5).default(0),
  relacionamento: Joi.number().integer().min(1).max(5).default(0),
  classificacao: Joi.number().allow(null).empty(''),

  cargo: Joi.string().required(),
  informacoes: Joi.string().required(),
  instituicaoAtual: Joi.string().required(),
  instituicaoTitulacao: Joi.string().required(),
  nome: Joi.string().required(),
  titulacao: Joi.string().required(),

  outrasFuncoes: Joi.when('relationships', {
    is: Joi.alternatives().try(
      Joi.string().valid('outrosContatos'),
      Joi.array().items(Joi.string()).has('outrosContatos'),
    ),
    then: Joi.string().required(),
    otherwise: Joi.any().optional(),
  }),

  outrosLugares: Joi.when('places', {
    is: Joi.alternatives().try(
      Joi.string().valid('conheceOutros'),
      Joi.array().items(Joi.string()).has('conheceOutros'),
    ),
    then: Joi.string().required(),
    otherwise: Joi.any().optional(),
  }),
});
