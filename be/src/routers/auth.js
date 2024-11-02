import express from "express";
import {
  forgotPassword,
  getAllUsers,
  logout,
  refreshToken,
  signin,
  signup,
  updateUserRole,
} from "../controllers/auth";
const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/signin", signin);
router.post("/refresh-token", refreshToken);
router.post("/auth/logout", logout);
router.get("/auth/users", getAllUsers);
router.put("/auth/users/:userId", updateUserRole);
router.post("/auth/forgot-password", forgotPassword);
export default router;
