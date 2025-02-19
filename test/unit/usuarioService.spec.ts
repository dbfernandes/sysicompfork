import UsuarioService from '../../src/resources/usuarios/usuario.service';
import { prismaMock } from '../../singleton';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

jest.mock('bcrypt', () => ({
    genSalt: jest.fn(),
    hash: jest.fn(),
}));

jest.mock('crypto', () => ({
    randomBytes: jest.fn(),
}));

const mockUsuario = {
    id: 1,
    nomeCompleto: 'Teste 1',
    email: 'user@email.com',
    senhaHash: 'hashedPassword',
    cpf: '12345612345',
    tokenResetSenha: 'token',
    validadeTokenResetSenha: new Date(),
    status: 1,
    administrador: 1,
    coordenador: 1,
    secretaria: 1,
    diretor: 1,
    professor: 1,
    perfil: 'perfil',
    lattesId: null,
    siape: '123456',
    dataIngresso: new Date(),
    endereco: 'endereco',
    telCelular: '123456789',
    telResidencial: '123456789',
    unidade: 'unidade',
    turno: 'turno',
    formacao: 'formacao',
    formacaoIngles: 'formacaoIngles',
    resumo: 'resumo',
    resumoIngles: 'resumoIngles',
    ultimaAtualizacao: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
};

const mockUsuarios = [
    {
        id: 1,
        nomeCompleto: 'Teste 1',
        email: 'user@email.com',
        senhaHash: 'hashedPassword',
        cpf: '12345612345',
        tokenResetSenha: 'token',
        validadeTokenResetSenha: new Date(),
        status: 1,
        administrador: 1,
        coordenador: 1,
        secretaria: 1,
        diretor: 1,
        professor: 1,
        perfil: 'perfil',
        lattesId: null,
        siape: '123456',
        dataIngresso: new Date(),
        endereco: 'endereco',
        telCelular: '123456789',
        telResidencial: '123456789',
        unidade: 'unidade',
        turno: 'turno',
        formacao: 'formacao',
        formacaoIngles: 'formacaoIngles',
        resumo: 'resumo',
        resumoIngles: 'resumoIngles',
        ultimaAtualizacao: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 2,
        nomeCompleto: 'Teste 2',
        email: 'user@email.com',
        senhaHash: 'hashedPassword',
        cpf: '12345612345',
        tokenResetSenha: 'token',
        validadeTokenResetSenha: new Date(),
        status: 1,
        administrador: 1,
        coordenador: 1,
        secretaria: 1,
        diretor: 1,
        professor: 1,
        perfil: 'perfil',
        lattesId: null,
        siape: '123456',
        dataIngresso: new Date(),
        endereco: 'endereco',
        telCelular: '123456789',
        telResidencial: '123456789',
        unidade: 'unidade',
        turno: 'turno',
        formacao: 'formacao',
        formacaoIngles: 'formacaoIngles',
        resumo: 'resumo',
        resumoIngles: 'resumoIngles',
        ultimaAtualizacao: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    }
];

describe('UsuarioService', () => {
    describe('listarTodos', () => {
        it('deve listar todos os usuários', async () => {

            prismaMock.usuario.findMany.mockResolvedValue(mockUsuarios);

            const result = await UsuarioService.listarTodos();

            expect(prismaMock.usuario.findMany).toHaveBeenCalled();
            expect(result).toEqual(mockUsuarios);
        });
    });

    describe('listarUmUsuario', () => {
        it('deve retornar um usuário com perfil formatado', async () => {

            prismaMock.usuario.findUnique.mockResolvedValue(mockUsuario);

            const result = await UsuarioService.listarUmUsuario(1);

            expect(prismaMock.usuario.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                select: expect.any(Object),
            });
            expect(result.perfil).toContain('Administrador');
        });

        it('deve lançar um erro se o usuário não for encontrado', async () => {
            prismaMock.usuario.findUnique.mockResolvedValue(null);

            await expect(UsuarioService.listarUmUsuario(999)).rejects.toThrow('Usuário não encontrado');
        });
    });

    describe('adicionar', () => {
        it('deve lançar um erro se houver um erro ao adicionar o usuário', async () => {

            // Mock bcrypt
            (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

            // Mock findFirst e update
            prismaMock.usuario.findFirst.mockResolvedValue(null);
            prismaMock.usuario.create.mockRejectedValue(new Error('Erro ao adicionar usuário'));

            await expect(UsuarioService.adicionar(mockUsuario)).rejects.toThrow('Erro ao adicionar usuário');
        });
    });

    describe('alterar', () => {
        it('deve alterar um usuário e configurar o diretor corretamente', async () => {

            // Mock bcrypt
            (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

            await UsuarioService.alterar(1, mockUsuario);

            expect(prismaMock.usuario.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { ...mockUsuario, senhaHash: 'hashedPassword' },
            });
        });

        it('deve lançar um erro se houver um erro ao alterar o usuário', async () => {

            // Mock bcrypt
            (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

            // Mock findFirst e update
            prismaMock.usuario.findFirst.mockResolvedValue(null);
            prismaMock.usuario.update.mockRejectedValue(new Error('Erro ao alterar usuário'));

            await expect(UsuarioService.alterar(1, mockUsuario)).rejects.toThrow('Erro ao alterar usuário');
        });
    });

    describe('RecuperarSenha', () => {
        it('deve lançar um erro se a atualização falhar', async () => {
            const mockDate = new Date();
            prismaMock.usuario.update.mockRejectedValue(new Error('Erro ao recuperar senha'));

            await expect(UsuarioService.recuperarSenha('token', mockDate, 1)).rejects.
                toThrow('Erro ao recuperar senha');
        });
    });

});