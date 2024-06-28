import { Request, Response } from 'express';
import projetosService from '../projetos/projetos.service';

// Escolha do Layout
const layoutMain = {
  layout: 'numerosIcompMain',
};

// Listagem Projetos

const projetos = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      try {
        const { lng } = req.query;
        const projetosFiltrados = await projetosService.listarAtuais();

        return res.status(200).render('numerosIcomp/projetos', {
          lng,
          ...layoutMain,
          projetosFiltrados,
        });
      } catch (error) {
        return res
          .status(502)
          .send('O Servidor não obteve uma resposta válida. Bad Gateway (502)');
      }
    default:
      return res
        .status(400)
        .send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};

export default projetos;
