import Joi from 'joi';

export const createByTemplateSchema = Joi.object({
  titulo: Joi.string().min(1).max(255).required(),
  descricao: Joi.string().allow('', null),
  usarIA: Joi.boolean().default(false),
  templateKey: Joi.string()
    .valid('vazio', 'padrao', 'inscricao', 'homologacao')
    .when('usarIA', { is: true, then: Joi.optional().allow(null, '') }),
});

export const createByUploadSchema = Joi.object({
  titulo: Joi.string().min(3).max(255).required(),
  descricao: Joi.string().allow('', null),
  xmlStoredPath: Joi.string().required(),
  xmlOriginalName: Joi.string().allow('', null),
  xmlMimeType: Joi.string().allow('', null),
  xmlSize: Joi.number().integer().min(1).required(),
});
