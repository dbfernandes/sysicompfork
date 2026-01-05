import { Usuario } from '@prisma/client';

export type CreateUsuarioDto = Omit<
  Usuario,
  'id' | 'createdAt' | 'updatedAt' | 'status'
>;

export type UpdateUsuarioDto = Partial<
  Omit<Usuario, 'id' | 'createdAt' | 'updatedAt'>
> & { senha?: string };

export type usuarioBodyDTO = {
  nomeCompleto: string;
  cpf: string;
  email: string;
  diretor: string;
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
  professorPPGI: string;
};

export interface ChangePasswordBodyDto {
  newPassword: string;
  currentPassword: string;
}

export interface ChangePasswordServiceDto extends ChangePasswordBodyDto {
  userId: number;
}
