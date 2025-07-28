import { NextFunction, Request, Response } from 'express';
import candidatoService from '@resources/candidato/candidato.service';

import { DateTime } from 'luxon';
import { StatusCodes } from 'http-status-codes';
import { StatusEdital } from '@resources/edital/edital.types';

export function isNoticeExpired(dataFim: Date | string): boolean {
  const agora = DateTime.now().setZone('America/Manaus');
  const fim = DateTime.fromJSDate(new Date(dataFim)).setZone('America/Manaus');
  return agora > fim.endOf('day'); // permite até o fim do dia
}

export const validateCandidateEditInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.session.uid) {
    const id = req.session.uid;
    const candidate = await candidatoService.findByIdComEdital(id);

    const candidateAlreadyFinished = !!candidate.finishedAt;
    const { edital } = candidate;
    const editalAlreadyFinished =
      isNoticeExpired(edital.dataFim) || edital.status !== StatusEdital.ATIVO;

    if (candidateAlreadyFinished || editalAlreadyFinished) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Error ao fazer logout', err);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Erro ao sair');
          return;
        }
      });
      return res.redirect('/');
    }
    return next();
  }
  return next();
};

export const validateCandidateGetInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.session.uid) {
    const id = req.session.uid;
    const candidate = await candidatoService.findByIdComEdital(id);
    if (!candidate) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Error ao fazer logout', err);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Erro ao sair');
          return;
        }
      });
      return res.redirect('/');
    }
    const { edital } = candidate;
    const editalAlreadyFinished =
      isNoticeExpired(edital.dataFim) || edital.status !== StatusEdital.ATIVO;
    if (editalAlreadyFinished) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Error ao fazer logout', err);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Erro ao sair');
          return;
        }
      });
      return res.redirect('/');
    }
    return next();
  }
  return next();
};
