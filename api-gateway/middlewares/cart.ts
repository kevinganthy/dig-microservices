import { Request, Response, NextFunction } from 'express';
import { isAllowed } from '../utils/Allows';

export const cartMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const status = await isAllowed(req.currentUser!.role, req.originalUrl, req.method);
    if (status === "no") {
      res.status(403).send('Accès non autorisé');
      return;
    } 
    
    res.locals.status = status;
    next();
  }