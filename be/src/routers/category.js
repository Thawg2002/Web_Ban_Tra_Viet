import { Router } from "express";
import { getAll, getCategoryById } from "../controllers/category";

const router = Router();
router.get("/categories", getAll);
router.get("/categories/:id", getCategoryById);

export default router;
