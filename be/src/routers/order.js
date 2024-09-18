import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
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
export default router;
