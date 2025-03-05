import express, { Router } from "express";
import { validateLogin } from "../models/user";
import authController from "../controllers/auth";
import { UserService } from "../services/UserService";

const userService = new UserService();

const router = Router();
router.use(express.json());

router.post("/", validateLogin, authController(userService));

export default router;
