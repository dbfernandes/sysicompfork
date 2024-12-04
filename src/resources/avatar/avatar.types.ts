import { Avatar } from '@prisma/client';

export type CreateAvatarDto = Pick<Avatar, 'usuarioId' | 'nome' | 'caminho'>;
