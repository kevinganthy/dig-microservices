import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CONFIG } from "../config";
import { UserPayload } from "../types/auth";

export const validateJWT = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: "Token manquant" });
      return;
    }

    const payload = jwt.verify(token, CONFIG.TOKEN_SECRET) as UserPayload;
    req.currentUser = payload; // Attacher l'utilisateur au request

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Accès non autorisé" });
  }
};
