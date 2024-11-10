import Order from "../models/order";
import Product from "../models/product";

export const getStatistics = async (req, res) => {
  try {
    const { statType } = req.query;

    switch (statType) {
      case "monthly-revenue":
        return await getMonthlyRevenue(req, res);
      case "top-selling":
        return await getTopSelling(req, res);
      case "total-sold":
        return await getTotalSold(req, res);
      case "revenue-stats":
        return await getRevenueStats(req, res);
      case "top-user":
        return await getTopUser(req, res);
      default:
        return res.status(400).json({
          error:
            "Invalid statType. Please choose from 'monthly-revenue', 'top-selling', 'total-sold', 'revenue-stats', 'top-user'.",
        });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

// 1. Thống kê doanh thu theo tháng
const getMonthlyRevenue = async (req, res) => {
  try {
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          status: "đã giao",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: { $sum: "$totalPrice" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1,
        },
      },
    ]);

    return res.json({
      success: true,
      data: monthlyRevenue,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// 2. Thống kê sản phẩm bán chạy nhất
const getTopSelling = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topProducts = await Order.aggregate([
      {
        $match: {
          status: "đã giao",
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          totalQuantity: 1,
          totalRevenue: 1,
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: parseInt(limit) },
    ]);

    return res.json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// 3. Thống kê tổng số lượng đã bán
const getTotalSold = async (req, res) => {
  try {
    const totalSold = await Order.aggregate([
      {
        $match: {
          status: "đã giao",
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    return res.json({
      success: true,
      data: totalSold[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// 4. Thống kê doanh thu tổng quan
const getRevenueStats = async (req, res) => {
  try {
    // Thống kê theo trạng thái đơn hàng
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    // Thống kê theo phương thức thanh toán
    const paymentStats = await Order.aggregate([
      {
        $match: {
          status: "đã giao",
        },
      },
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    return res.json({
      success: true,
      data: {
        orderStats,
        paymentStats,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// 5. Thống kê người dùng mua nhiều nhất
const getTopUser = async (req, res) => {
  try {
    const topUser = await Order.aggregate([
      {
        $match: { status: "đã giao" },
      },
      {
        $group: {
          _id: "$userId",
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { orderCount: -1 },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          userId: "$_id",
          orderCount: 1,
          userName: "$user.name",
          userEmail: "$user.email",
        },
      },
    ]);

    if (topUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found with orders.",
      });
    }

    return res.json({
      success: true,
      data: topUser[0],
    });
  } catch (error) {
    console.error("Error fetching top user by orders:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export default getStatistics;
