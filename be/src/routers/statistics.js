import { Router } from "express";
import { getStatistics } from "../controllers/statistics";

const router = Router();

router.get("/statistics", getStatistics);
export default router;
