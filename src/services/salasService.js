const { Salas } = require('../models');

export default new class SalaService {

    // Pegar todas as Salas
    async listarTodos() {
        const salas = await Salas.findAll();
        return salas;
    }
    // Pegar uma sala
    async listarUm(id) {
        try {
            const sala = await Salas.findByPk(id);
            return sala;
        }
        catch (error) {
            throw error;
        }
    }
    // Criar salas
    async criar(nome, bloco, andar, numero, capacidade) {
        try {
            // const { nome, bloco, andar, numero, capacidade } = newSala;
            await Salas.create({
                nome,
                bloco,
                andar,
                numero,
                capacidade
            }, {});
        } catch (err) {
            throw err;
        }
    }
    // Editar salas
    async editar(id, sala) {
        try {
            const salaEditada = await Salas.update(sala, { where: { id: id } });
            return salaEditada;
        }
        catch (error) {
            throw error;
        }
    }
    // Excluir salas
    async excluir(id) {
        try {
            const salaExcluida = await Salas.destroy({ where: { id: id } });
            return salaExcluida;
        }
        catch (error) {
            throw error;
        }
    }
    
}