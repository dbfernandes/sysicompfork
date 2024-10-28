import Joi from 'joi';

export const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  senha: Joi.string().required(),
  idEdital: Joi.string().required(),
  _csrf: Joi.string().required(),
});

export const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  senha: Joi.string().required(),
  idEdital: Joi.string().required(),
  _csrf: Joi.string().required(),
});

export const recoverPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  idEdital: Joi.string().required(),
});
