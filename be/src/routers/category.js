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
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategoryById);
router.delete("/categories/:id", deleteCategoryById);

export default router;
