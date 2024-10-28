import express from "express";
import {
  currentUser,
  forgotPassword,
  getAllUsers,
  logout,
  refreshToken,
  signin,
  signup,
  updateUserRole,
} from "../controllers/auth";
import authentication from "../middleware/authentication";
const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/signin", signin);
router.post("/auth/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/auth/users", getAllUsers);
router.get("/auth/current", authentication, currentUser);

router.put("/auth/users/:userId", updateUserRole);
router.post("/auth/forgot-password", forgotPassword);
export default router;
