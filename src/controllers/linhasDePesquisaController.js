import linhasDePesquisaService from '../services/linhasDePesquisaService';

const locals = {
  layout: "main",
};

const lines = [
  {
    id: 1,
    nome: 'Banco de Dados e Recuperacao de Informacao',
    sigla: 'BD e RI',
    cor: 'rgb(1,68,248)',
  },
  {
    id: 2,
    nome: 'Sistemas Embarcados e Engenharia de Software',
    sigla: 'SE&ES',
    cor: 'rgb(211,236,40)',
  },
  {
    id: 3,
    nome: 'Inteligencia Artificial',
    sigla: 'IA',
    cor: 'rgb(254,216,244)',
  },
  {
    id: 4,
    nome: 'Visao Computacional e Robotica',
    sigla: 'Visao',
    cor: 'rgb(202,56,176)',
  },
  {
    id: 5,
    nome: 'Redes e Telecomunicacoes',
    sigla: 'Redes',
    cor: 'rgb(69,94,35)',
  },
  {
    id: 6,
    nome: 'Otimizacao, Alg. e Complexidade Computacional',
    sigla: 'Otim.',
    cor: 'rgb(48,173,165)',
  },
  {
    id: 7,
    nome: 'Software, Interacao e Aplicacoes',
    sigla: 'SIA',
    cor: 'rgb(56,205,28)',
  },
];

const listar = async (req, res) => {
  switch (req.method) {
    case "GET": {
      // const linhaDePesquisa = await linhasDePesquisaService.list();

      // if (!linhaDePesquisa) res.status(400).json({ message: 'Nenhuma linha de pesquisa cadastrada' });

      return res
        .status(200)
        .render("linhasDePesquisa/linhasDePesquisa-listar", { linhaDePesquisa: lines, ...locals });
    }

    case "POST":
      return res.json({ message: "cant post here" });

    default:
      return res.json("404");
  }
};

export default { listar };
