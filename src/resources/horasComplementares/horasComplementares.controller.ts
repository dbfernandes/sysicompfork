import { Request, Response } from 'express';

const listarHoras = async (_req: Request, res: Response) => {
  const MockHoras = [
    {
      id: 1,
      descricao: 'descrição 01',
      atividade: '9.1: Carga Horária Optativa Excedente',
      data_inicio: '02/05/2023',
      data_termino: '24/06/2023',
      horaTotal: 32,
      horaAprovada: 32,
      status: 'deferido',
    },
    {
      id: 2,
      descricao: 'descrição 02',
      atividade: '9.1: Carga Horária Optativa Excedente',
      data_inicio: '02/05/2023',
      data_termino: '24/06/2023',
      horaTotal: 70,
      horaAprovada: 60,
      status: 'deferido',
    },
  ];

  return res.status(200).render('horasComplementares/main', {
    atividadesRealizadas: MockHoras,
    tipoUsuario: _req.session?.tipoUsuario,
  });
};

const adicionarAtividade = async (_req: Request, res: Response) => {
  const MockAtividades = [
    {
      name: '3.3: Participação em congressos, seminários, simpósios, conferências, fóruns, workshops, semana de curso',
    },
    {
      name: '3.3: Participação em congressos, seminários, simpósios, conferências, fóruns, workshops, semana de curso',
    },
    { name: '9.1: Carga Horária Optativa Excedente' },
  ];

  return res.status(200).render('horasComplementares/adicionar-atividade', {
    atividades: MockAtividades,
    tipoUsuario: _req.session?.tipoUsuario,
  });
};

export default { listarHoras, adicionarAtividade };
