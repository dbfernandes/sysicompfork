const { LinhasDePesquisa } = require('../models');

// CRUD da pagina de linhas de pesquisa

export default new class LinhasDePesquisaService {
  async list() {
    const allResearchLines = await LinhasDePesquisa.findAll();

    return allResearchLines;
  }

  async findById(id) {
    const researchLine = await LinhasDePesquisa.findByPk(id);

    return researchLine;
  }

  async create(newResearchLine) {
    const { nome, icone, iniciais, cor } = newResearchLine;

    await LinhasDePesquisa.create({
      nome,
      icone,
      iniciais,
      cor,
    });
  }

  async update(id, newInfo) {
    const { nome, icone, iniciais, cor } = newInfo;

    await LinhasDePesquisa.update(
      {
        nome,
        icone,
        iniciais,
        cor,
      },
      {
        where: {
          id,
        },
      }
    );
  }

  async delete(id) {
    await LinhasDePesquisa.destroy({
      where: { id },
    });
  }
}
