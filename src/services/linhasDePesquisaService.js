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
    const allResearchLines = await LinhasDePesquisa.findAll({ attributes: ['id', 'nome', 'sigla', 'icone', 'cor']});

    const formatedAnswer = formatDbAnswer(allResearchLines);

    return formatedAnswer;
  }

  async findById(id) {
    const researchLine = await LinhasDePesquisa.findByPk(id);

    const formatedAnswer = formatDbAnswer(researchLine);

    return formatedAnswer;
  }

  async create(newResearchLine) {
    const { nome, icone, sigla, cor } = newResearchLine;

    await LinhasDePesquisa.create({
      nome,
      icone,
      sigla,
      cor,
    });
  }

  async update(id, newInfo) {
    const { nome, icone, sigla, cor } = newInfo;

    await LinhasDePesquisa.update(
      {
        nome,
        icone,
        sigla,
        cor,
      },
      {
        where: {
          id,
        },
      }
    );
  }

  async remove(id) {
    await LinhasDePesquisa.destroy({
      where: { id },
    });
  }
};
