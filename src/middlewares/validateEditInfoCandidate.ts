import { NextFunction, Request, Response } from 'express';
import candidatoService from '@resources/candidato/candidato.service';

import { DateTime } from 'luxon';

export function isNoticeExpired(dataFim: Date | string): boolean {
  const agora = DateTime.now().setZone('America/Manaus');
  const fim = DateTime.fromJSDate(new Date(dataFim)).setZone('America/Manaus');
  return agora > fim.endOf('day'); // permite até o fim do dia
}

export const validateEditInfoCandidate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.session.uid) {
    const id = req.session.uid;
    const candidate = await candidatoService.findByIdComEdital(id);

    const candidateAlreadyFinished = !!candidate.finishedAt;
    const editaAlreadyFinished = isNoticeExpired(candidate.edital.dataFim);
    if (candidateAlreadyFinished || editaAlreadyFinished) {
      return res.redirect('/');
    }
    return next();
  }
  return res.redirect('/');
};
