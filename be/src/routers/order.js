import { Router } from "express";
import {
  cancelOrder,
  createOrder,
  getOrderById,
  getOrders,
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
router.post("/orders/merge/:userId", mergeOrders);
router.put("/orders/cancelOrder/:id", cancelOrder);

export default router;
