import { Request, Response } from "express";
import { UserPayload } from "../types/auth";
import { Scrypt } from "../utils/Scrypt";
import { IUserService } from "../types/user";
import { CONFIG } from "../config";
import jwt from "jsonwebtoken";

export default (userService: IUserService) => async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userService.findOneByEmail(email);
  if (!user) {
    res.status(404).send("User not found");
    return;
  }
  if (!Scrypt.compare(password, user.password)) {
    res.status(401).send("Invalid password");
    return;
  }

  const payload: UserPayload = { userId: user.id, role: user.role_id };

  if (!CONFIG.TOKEN_SECRET) {
    res.status(500).send("Token secret is not defined");
    return;
  }
  const token = jwt.sign(payload, CONFIG.TOKEN_SECRET);

  res.send({ token });
};