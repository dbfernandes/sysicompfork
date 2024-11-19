import Joi from 'joi';
import {
  ChangePasswordDto,
  RecoverPasswordDto,
  SignInDto,
  SignUpDto,
} from './candidato.types';

export const signInSchema = Joi.object<SignInDto>({
  email: Joi.string().email().required(),
  senha: Joi.string().required(),
  editalId: Joi.number().required(),
});

export const signUpSchema = Joi.object<SignUpDto>({
  email: Joi.string().email().required(),
  senha: Joi.string().required(),
  editalId: Joi.number().required(),
});

export const recoverPasswordSchema = Joi.object<RecoverPasswordDto>({
  email: Joi.string().email().required(),
  editalId: Joi.number().required(),
});

export const changePasswordSchema = Joi.object<ChangePasswordDto>({
  token: Joi.string().required(),
  senha: Joi.string().required(),
});
