const { LinhasDePesquisa } = require('../models');

// CRUD da pagina de linhas de pesquisa

const formatDbAnswer = (array) => array.map((linha) => (linha.dataValues));

export default new class LinhasDePesquisaService {
  async list() {
    const allResearchLines = await LinhasDePesquisa.findAll({ attributes: ['id', 'nome', 'sigla', 'icone', 'cor']});

    const formatedAnswer = formatDbAnswer(allResearchLines);

    return formatedAnswer;
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
