import { Usuario } from "@prisma/client";

export type CreateUsuarioDto = Pick<Usuario,
    'nomeCompleto' | 'cpf' | 'senhaHash' | 
    'tokenResetSenha' | 'validadeTokenResetSenha' | 'email' |
    'status' | 'administrador' | 'coordenador' | 'secretaria' |
    'professor' | 'perfil' | 'dataIngresso' | 'endereco' |
    'telCelular' | 'telResidencial' | 'unidade' | 'turno' |
    'idLattes' | 'formacao' | 'formacaoIngles' | 'resumo' |
    'resumoIngles' | 'siape' | 'ultimaAtualizacao'
>

export type UpdateUsuarioDto = Pick<Usuario,
    'nomeCompleto' | 'cpf' | 'senhaHash' | 
    'tokenResetSenha' | 'validadeTokenResetSenha' | 'email' |
    'status' | 'administrador' | 'coordenador' | 'secretaria' |
    'professor' | 'perfil' | 'dataIngresso' | 'endereco' |
    'telCelular' | 'telResidencial' | 'unidade' |  'turno' |
    'idLattes' | 'formacao' | 'formacaoIngles' | 'resumo' |
    'resumoIngles' | 'siape' | 'ultimaAtualizacao'
>