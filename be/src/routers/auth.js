import { Router } from "express";
import { login, logout, refreshToken, register } from "../controllers/auth";


const authRouter = Router();
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refreshToken", refreshToken);
authRouter.post("/logout", logout);
export default authRouter;