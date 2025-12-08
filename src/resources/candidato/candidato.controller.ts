import { Request, Response } from 'express';
import CandidatoService from './candidato.service';

class CandidatoController {
  async search(req: Request, res: Response) {
    const query = req.query.q as string;

    try {
      const candidatos = await CandidatoService.searchByName(query);
      // O Select2 espera um objeto com uma chave 'results'
      res.json({ results: candidatos });
    } catch (error) {
      console.error('Erro na busca de candidatos:', error);
      res.status(500).json({ message: 'Erro ao buscar candidatos' });
    }
  }
}

export default new CandidatoController();