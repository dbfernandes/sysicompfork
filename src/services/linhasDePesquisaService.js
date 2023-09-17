const { LinhasDePesquisa } = require('../models');

// CRUD da pagina de linhas de pesquisa

const formatDbAnswer = (object) => {
  const array = Array.isArray(object);

  switch(array) {
  case (true): {
    return object.map((linha) => (linha.dataValues));
  };

  case (false): {
    return object.dataValues;
  };

  default:
    return object.dataValues;
  };
};

export default new class LinhasDePesquisaService {
  async list() {
    const allResearchLines = await LinhasDePesquisa.findAll({ attributes: ['id', 'nome', 'sigla']});

    const formatedAnswer = formatDbAnswer(allResearchLines);

    return formatedAnswer;
  }

  async findById(id) {
    const researchLine = await LinhasDePesquisa.findByPk(id);

    const formatedAnswer = formatDbAnswer(researchLine);

    return formatedAnswer;
  }

  async create(newResearchLine) {
    const { nome, iniciais} = newResearchLine;

    await LinhasDePesquisa.create({
      nome,
      iniciais,
    });
  }

  async update(id, newInfo) {
    const { nome, iniciais } = newInfo;

    await LinhasDePesquisa.update(
      {
        nome,
        iniciais,
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
};
