import { Router } from "express";
import {
  createCategory,
  deleteCategoryById,
  getAll,
  getCategoryById,
  updateCategoryById,
} from "../controllers/category";

const router = Router();
router.get("/categories", getAll);
router.get("/categories/:id", getCategoryById);
router.delete("/categories/:id", deleteCategoryById);
router.put("/categories/:id", updateCategoryById);
router.post("/categories", createCategory);
export default router;
