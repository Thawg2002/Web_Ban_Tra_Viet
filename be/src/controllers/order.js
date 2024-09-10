import Order from "../models/order.js";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid"; // Sử dụng UUID để tạo số đơn hàng duy nhất

// Tạo đơn hàng mới
export const createOrder = async (req, res) => {
  try {
    const { userId, items, totalPrice, customerInfo, paymentMethod } = req.body;
    const orderNumber = uuidv4(); // Tạo số đơn hàng duy nhất
    const order = await Order.create({
      userId,
      items,
      totalPrice,
      customerInfo,
      orderNumber,
      paymentMethod,
    });
    return res.status(StatusCodes.CREATED).json(order);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

// Lấy tất cả đơn hàng
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    if (orders.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "No orders found" });
    }
    return res.status(StatusCodes.OK).json(orders);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error fetching orders: " + error.message });
  }
};

// Lấy đơn hàng theo ID
export const getOrderById = async (req, res) => {
  try {
    const { userId, orderId } = req.params;
    const order = await Order.findOne({ userId, _id: orderId });
    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Order not found" });
    }
    return res.status(StatusCodes.OK).json(order);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error fetching order: " + error.message });
  }
};

// Cập nhật thông tin đơn hàng
export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      req.body,
      {
        new: true,
      }
    );
    if (!updatedOrder) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Order not found" });
    }
    return res.status(StatusCodes.OK).json(updatedOrder);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error updating order: " + error.message });
  }
};

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatus = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!validStatus.includes(status)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid status" });
    }

    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Order not found" });
    }

    if (order.status === "delivered" || order.status === "cancelled") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Order cannot be updated" });
    }

    order.status = status;
    await order.save();

    return res
      .status(StatusCodes.OK)
      .json({ message: "Order status updated successfully" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error updating order status: " + error.message });
  }
};
// Xóa đơn hàng theo ID
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const result = await Order.deleteOne({ _id: orderId });
    
    if (result.deletedCount === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Order not found" });
    }

    return res.status(StatusCodes.NO_CONTENT).send(); // Trả về 204 No Content
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error deleting order: " + error.message });
  }
};
