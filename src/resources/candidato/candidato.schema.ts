import Joi from 'joi';
import {
  MudarSenhaDto,
  RecuperarSenhaDto,
  SignInDto,
  SignUpDto,
} from './candidato.types';

export const signInSchema = Joi.object<SignInDto>({
  email: Joi.string().email().required(),
  senha: Joi.string().required(),
  editalId: Joi.string().required(),
});

export const signUpSchema = Joi.object<SignUpDto>({
  email: Joi.string().email().required(),
  senha: Joi.string().required(),
  editalId: Joi.string().required(),
});

export const recoverPasswordSchema = Joi.object<RecuperarSenhaDto>({
  email: Joi.string().email().required(),
  editalId: Joi.string().required(),
});

export const changePasswordSchema = Joi.object<MudarSenhaDto>({
  token: Joi.string().required(),
  senha: Joi.string().required(),
});

export const passoDadosSchema = Joi.object({
  nacionalidade: Joi.string().required(),
  dataNascimento: Joi.string().required(),
  cpf: Joi.string().required(),
  passaporte: Joi.string().required(),
  pais: Joi.string().required(),
  condicao: Joi.string().required(),
  bolsista: Joi.string().required(),
  cotista: Joi.string().required(),
});
