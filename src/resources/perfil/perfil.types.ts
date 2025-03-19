import { Usuario } from '@prisma/client';

export type UpdatePerfilDto = Pick<
  Usuario,
  | 'id'
  | 'administrador'
  | 'coordenador'
  | 'secretaria'
  | 'professor'
  | 'email'
  | 'endereco'
  | 'telResidencial'
  | 'telCelular'
  | 'siape'
  | 'dataIngresso'
  | 'unidade'
  | 'turno'
  | 'nomeCompleto'
  | 'cpf'
  | 'senhaHash'
>;
