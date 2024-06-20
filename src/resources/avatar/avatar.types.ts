import { Avatar } from "@prisma/client";

export type CreateAvatarDto = Pick<Avatar,
    'idUsuario' | 'nome' | 'caminho'
>