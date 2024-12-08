import UsuarioService from '../../src/resources/usuarios/usuario.service';
import { prismaMock } from '../../singleton';
import bcrypt from 'bcrypt';

describe('UsuarioService', () => {
    describe('adicionar', () => {
        it('deve adicionar um novo usuário e retornar seus dados', async () => {
            const mockUsuario = {
                id: 1,
                nomeCompleto: 'Test User',
                senhaHash: 'hashed_password',
                diretor: 1,

            };

            prismaMock.usuario.create.mockResolvedValue(mockUsuario);

            const usuario = await UsuarioService.adicionar({
                nomeCompleto: 'Test User',
                senhaHash: 'plaintext_password',
                diretor: 1,
            });

            expect(usuario).toEqual(mockUsuario);
            expect(prismaMock.usuario.create).toHaveBeenCalled();
        });


    });
});