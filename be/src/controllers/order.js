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
      .json({ error: "Lỗi khi lấy danh sách đơn hàng: " + error.message });
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
    const { status, cancellationReason } = req.body;

    const validStatus = [
      "chờ xử lý",
      "đã xác nhận",
      "đang giao",
      "đã giao",
      "đã hủy",
    ];

    if (!validStatus.includes(status)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Order not found" });
    }

    console.log(`Current Status: ${order.status}`); // Debug current status

    if (order.status === "đã giao" || order.status === "đã hủy") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Order cannot be updated" });
    }

    order.status = status;
    if (status === "đã hủy" && cancellationReason) {
      order.cancellationReason = cancellationReason;
    }
    await order.save();

    return res
      .status(StatusCodes.OK)
      .json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
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

// Thống kê đơn hàng
// Thống kê đơn hàng
export const getOrderStats = async (req, res) => {
  try {
    // Lấy các thông tin thống kê
    const totalOrders = await Order.countDocuments(); // Tổng số đơn hàng
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: "đã hủy" } } }, // Không tính đơn đã hủy
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
    ]);

    const statusCounts = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]); // Số lượng đơn hàng theo từng trạng thái

    const productSales = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.productId", totalSold: { $sum: "$items.quantity" } } },
      { $lookup: {
          from: "products", // Dự kiến "products" là tên collection sản phẩm
          localField: "_id",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $project: { product: { $arrayElemAt: ["$productInfo.name", 0] }, totalSold: 1 } }
    ]); // Số lượng sản phẩm đã bán

    // Thống kê người mua hàng nhiều nhất
    const frequentBuyers = await Order.aggregate([
      { $group: { _id: "$userId", totalOrders: { $sum: 1 } } },
      { $sort: { totalOrders: -1 } },
      { $limit: 5 }, // Top 5 người mua nhiều nhất
      { $lookup: {
          from: "users", // Dự kiến "users" là tên collection người dùng
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $project: { userId: "$_id", totalOrders: 1, userInfo: { $arrayElemAt: ["$userInfo", 0] } } }
    ]);

    return res.status(StatusCodes.OK).json({
      totalOrders,
      totalRevenue: totalRevenue[0] ? totalRevenue[0].totalRevenue : 0,
      statusCounts,
      productSales,
      frequentBuyers
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Lỗi khi lấy thống kê đơn hàng: " + error.message });
  }
};


