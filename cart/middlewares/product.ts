import { Request, Response, NextFunction } from 'express';
import Joi from "joi"


export const validateProductInsertion = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    quantity: Joi.number().required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    res.status(400).send(validation.error);
    return;
  }

  next()
}