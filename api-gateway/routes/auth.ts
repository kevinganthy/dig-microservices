import express, { Router } from "express";
import { validateLogin } from "../models/user";
import authController from "../controllers/auth";

const router = Router();
router.use(express.json());

router.post("/", validateLogin, authController);

export default router;
