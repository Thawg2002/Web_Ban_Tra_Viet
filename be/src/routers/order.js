import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  getOrderStats,
  mergeOrders,
  updateOrder,
  updateOrderStatus,
} from "../controllers/order.js";

const router = Router();

router.post("/orders", createOrder);
router.get("/orders", getOrders);
router.get("/orders/:userId/:orderId", getOrderById);
router.put("/orders/:orderId", updateOrder);
router.put("/orders/:orderId/status", updateOrderStatus);
router.delete("/orders/:orderId", deleteOrder);
router.post("/orders/merge/:userId", mergeOrders);
router.get("/orders/stats", getOrderStats);
export default router;
