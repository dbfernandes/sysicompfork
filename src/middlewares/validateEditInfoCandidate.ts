import { NextFunction, Request, Response } from 'express';
import candidatoService from '@resources/candidato/candidato.service';

function isNoticeExpired(expirationDate: string | Date): boolean {
  const now = new Date();
  const deadline = new Date(expirationDate);

  // Optional: compare only dates, ignoring time
  now.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);

  return now > deadline;
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
