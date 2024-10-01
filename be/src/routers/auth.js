import express from "express";
import { getAllUsers, logout, refreshToken, signin, signup, updateUserRole } from "../controllers/auth";
const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/signin", signin);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/auth/users", getAllUsers);
router.put("/auth/users/:userId", updateUserRole);
export default router;
