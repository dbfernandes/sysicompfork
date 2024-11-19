import { Usuario } from '@prisma/client';

export type CreateUsuarioDto = Pick<
  Usuario,
  | 'nomeCompleto'
  | 'cpf'
  | 'senhaHash'
  | 'tokenResetSenha'
  | 'validadeTokenResetSenha'
  | 'email'
  | 'status'
  | 'administrador'
  | 'coordenador'
  | 'secretaria'
  | 'professor'
  | 'perfil'
  | 'siape'
  | 'dataIngresso'
  | 'endereco'
  | 'telCelular'
  | 'telResidencial'
  | 'unidade'
  | 'turno'
  | 'lattesId'
  | 'formacao'
  | 'formacaoIngles'
  | 'resumo'
  | 'resumoIngles'
  | 'ultimaAtualizacao'
>;

export type UpdateUsuarioDto = Partial<
  Omit<Usuario, 'id' | 'createdAt' | 'updatedAt'>
>;

export interface UpdateUsuarioWithPassword extends UpdateUsuarioDto {
  senha?: string;
}

export type usuarioBodyDTO = {
  nomeCompleto: string;
  cpf: string;
  email: string;
  administrador: string;
  coordenador: string;
  secretaria: string;
  professor: string;
  senha: string;
  endereco: string;
  telefoneCelular: string;
  siape: string;
  telefoneResidencial: string;
  dateDeIngresso: string;
  unidade: string;
  turno: string;
};
export interface UsuarioWithDate extends Omit<UsuarioSelect, 'perfil'> {
  perfil: string;
  DateFormatada: string;
}

export interface UsuarioSelect {
  id: number;
  nomeCompleto: string;
  cpf: string;
  email: string;
  status: number;
  siape: string | null;
  administrador: number;
  secretaria: number;
  professor: number;
  coordenador: number;
  dataIngresso: Date | null;
  endereco: string | null;
  telCelular: string | null;
  telResidencial: string | null;
  unidade: string | null;
  turno: string | null;
  lattesId: bigint | null;
  perfil: string | null;
  createdAt: Date;
}
