import { Request, Response, NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Schema } from 'joi';

const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      convert: true, // Garante a conversão de tipos
    });
    if (error) {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        error: error.message,
        message: ReasonPhrases.UNPROCESSABLE_ENTITY,
      });
    } else {
      req.body = value; // Atualiza o req.body com os valores validados e convertidos
      next();
    }
  };
};

export default validate;
