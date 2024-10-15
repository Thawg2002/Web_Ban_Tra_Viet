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

// export const getOrders = async (req, res) => {
//   try {
//     const {
//       status,
//       customerName,
//     } = req.query;

//     // Build query object
//     const query = {};

//     if (status) query.status = status;
//     if (customerName)
//       query["customerInfo.fullName"] = { $regex: customerName, $options: "i" };

//     const orders = await Order.find(query).populate({
//       path: "items.productId",
//       select: "name image regular_price discount countInStock",
//     });

//     if (orders.length === 0) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ error: "No orders found" });
//     }

//     return res.status(StatusCodes.OK).json(orders);
//   } catch (error) {
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ error: "Error fetching orders: " + error.message });
//   }
// };
export const getOrders = async (req, res) => {
  try {
    const { status, customerName } = req.query;

    // Danh sách trạng thái hợp lệ
    const statusList = [
      "Chờ xác nhận",
      "Đã xác nhận",
      "Chờ lấy hàng",
      "Đang giao hàng",
      "Đã giao",
      "Đã hủy",
    ];
    // Tạo object để lưu query
    const query = {};
    // Kiểm tra xem status có nằm trong statusList hay không
    if (status && statusList.includes(status)) {
      query.status = status;
    }
    // Nếu có customerName, sử dụng regex để tìm kiếm khách hàng theo tên
    if (customerName) {
      query["customerInfo.fullName"] = { $regex: customerName, $options: "i" };
    }
    // Tìm kiếm đơn hàng dựa trên điều kiện đã xây dựng
    const orders = await Order.find(query).populate({
      path: "items.productId",
      select: "name image regular_price discount countInStock",
    });
    // Nếu không có đơn hàng nào được tìm thấy
    if (orders.length === 0) {
      return res.status(StatusCodes.OK).json([]);
    }
    // Trả về danh sách đơn hàng
    return res.status(StatusCodes.OK).json(orders);
  } catch (error) {
    // Xử lý lỗi và trả về mã lỗi 500 nếu có vấn đề
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Lấy đơn hàng theo ID
export const getOrderById = async (req, res) => {
  try {
    const { userId, orderId } = req.params;
    const order = await Order.findOne({ userId, _id: orderId });
    console.log("1");
    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Order not found" });
    }
    return res.status(StatusCodes.OK).json(order);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
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
// export const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status, cancellationReason } = req.body;
//     const validStatus = [
//       "Chờ xác nhận",
//       "Đã xác nhận",
//       "Chờ lấy hàng",
//       "Đang giao hàng",
//       "Đã giao",
//       "Đã hủy",
//     ];

//     if (!validStatus.includes(status)) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ error: "Invalid status" });
//     }

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ error: "Order not found" });
//     }

//     console.log(`Current Status: ${order.status}`); // Debug current status

//     if (order.status === "Đã giao" || order.status === "Đã hủy") {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ error: "Order cannot be updated" });
//     }

//     order.status = status;
//     if (status === "Đã hủy" && cancellationReason) {
//       order.cancellationReason = cancellationReason;
//     }
//     await order.save();

//     return res
//       .status(StatusCodes.OK)
//       .json({ message: "Order status updated successfully" });
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ error: "Error updating order status: " + error.message });
//   }
// };
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, cancellationReason } = req.body;

    const validStatus = [
      "Chờ xác nhận",
      "Đã xác nhận",
      "Chờ lấy hàng",
      "Đang giao hàng",
      "Đã giao",
      "Đã hủy",
    ];

    // Hàm xử lý trả về lỗi
    const sendError = (statusCode, message) => {
      return res.status(statusCode).json({ error: message });
    };

    // Kiểm tra trạng thái hợp lệ
    if (!validStatus.includes(status)) {
      return sendError(StatusCodes.BAD_REQUEST, "Invalid status");
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return sendError(StatusCodes.NOT_FOUND, "Order not found");
    }

    console.log(`Current Status: ${order.status}`); // Debug trạng thái hiện tại

    // Kiểm tra trạng thái đơn hàng có thể cập nhật hay không
    if (["Đã giao", "Đã hủy"].includes(order.status)) {
      return sendError(StatusCodes.BAD_REQUEST, "Order cannot be updated");
    }

    // Cập nhật trạng thái
    order.status = status;

    // Nếu đơn hàng bị hủy, yêu cầu phải có lý do
    if (status === "Đã hủy") {
      if (!cancellationReason) {
        return sendError(
          StatusCodes.BAD_REQUEST,
          "Cancellation reason is required"
        );
      }
      order.cancellationReason = cancellationReason;
    }

    // Lưu lại đơn hàng
    await order.save();

    return res
      .status(StatusCodes.OK)
      .json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: `Error updating order status: ${error.message}` });
  }
};

// cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const { note, cancelBy } = req.body;
    let noteCancel = note || "";
    if (cancelBy !== "user" && cancelBy !== "admin" && cancelBy !== "shipper") {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Truyền dữ liệu không thỏa mãn" });
    }
    if (!note) {
      if (cancelBy === "admin") {
        noteCancel =
          "GSản phẩm của chúng tôi không cung cấp được xin lỗi quý kháchao ";
      } else if (cancelBy === "shipper") {
        noteCancel =
          "Giao hàng thất bại bởi không liên lạc được với người dùng";
      }
      console.log("1");
    }
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Bạn chưa chọn đơn hàng" });
    }
    const existingOrder = await Order.findById(id);
    console.log("order", existingOrder);

    if (!existingOrder) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Không có đơn hàng" });
    }
    console.log("2");
    if (existingOrder.status !== "Chờ xác nhận") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Đơn hàng không thể hủy" });
    }
    const cancelSuccess = await Order.findByIdAndUpdate(
      id,
      {
        status: "Đã hủy",
        note: noteCancel,
        cancelBy: cancelBy,
        cancelOrderDate: Date.now(),
      },
      { new: true }
    );
    console.log("success", cancelSuccess);
    return res.status(StatusCodes.OK).json({
      message: "Hủy đơn hàng thành công",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};
export const mergeOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newStatus } = req.body; // Thay đổi trạng thái mới nếu cần

    // Lấy tất cả đơn hàng của người dùng
    const orders = await Order.find({ userId });

    if (orders.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "No orders found for this user" });
    }

    // Gộp các đơn hàng
    const mergedOrder = {
      userId,
      items: [],
      totalPrice: 0,
      status: newStatus || "pending",
      customerInfo: orders[0].customerInfo,
      orderNumber: uuidv4(), // Tạo số đơn hàng mới
    };

    orders.forEach((order) => {
      mergedOrder.items = [...mergedOrder.items, ...order.items];
      mergedOrder.totalPrice += order.totalPrice;
    });

    // Xóa các đơn hàng cũ
    await Order.deleteMany({ userId });

    // Tạo đơn hàng gộp mới
    const createdOrder = await Order.create(mergedOrder);

    return res.status(StatusCodes.CREATED).json(createdOrder);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
