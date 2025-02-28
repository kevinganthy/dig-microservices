import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { CONFIG } from "../config";
import { Scrypt } from "../utils/Scrypt";
import { UserPayload } from "../types/auth";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
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
});

export default router;
