import linhasDePesquisaService from '../services/linhasDePesquisaService';

const locals = {
  layout: "main",
};

const lines = [
  {
    id: 1,
    nome: 'Banco de Dados e Recuperacao de Informacao',
    sigla: 'BD e RI',
    cor: 'yellow',
  },
  {
    id: 2,
    nome: 'Sistemas Embarcados e Engenharia de Software',
    sigla: 'SE&ES',
    cor: 'blue',
  },
  {
    id: 3,
    nome: 'Inteligencia Artificial',
    sigla: 'IA',
    cor: 'pink',
  },
  {
    id: 4,
    nome: 'Visao Computacional e Robotica',
    sigla: 'Visao',
    cor: 'green',
  },
  {
    id: 5,
    nome: 'Redes e Telecomunicacoes',
    sigla: 'Redes',
    cor: 'magenta',
  },
  {
    id: 6,
    nome: 'Otimizacao, Alg. e Complexidade Computacional',
    sigla: 'Otim.',
    cor: 'red',
  },
  {
    id: 7,
    nome: 'Software, Interacao e Aplicacoes',
    sigla: 'SIA',
    cor: 'violet',
  },
];

const listar = async (req, res) => {
  switch (req.method) {
    case "GET": {
      // const linhaDePesquisa = await linhasDePesquisaService.list();

      // if (!linhaDePesquisa) res.status(400).json({ message: 'Nenhuma linha de pesquisa cadastrada' });

      return res
        .status(200)
        .render("linhasDePesquisa/listaLinhasDePesquisa", { linhaDePesquisa: lines, ...locals });
    }

    case "POST":
      return res.json({ message: "cant post here" });

    default:
      return res.json("404");
  }
};

export default { listar };
