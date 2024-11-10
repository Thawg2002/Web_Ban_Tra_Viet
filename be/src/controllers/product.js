import { StatusCodes } from "http-status-codes";
import Product from "../models/product";
import Category from "../models/category";
import Order from "../models/order";
// export const getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     if (products.length === 0) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ message: "Không có sản phẩm nào!" });
//     }
//     return res
//       .status(StatusCodes.OK)
//       .json({ message: "Lấy toàn bộ sản phẩm thành công", products });
//   } catch (error) {
//     return res.status(400).json({ message: error.message });
//   }
// };
export const create = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    // Cập nhật các danh mục với sản phẩm mới
    if (req.body.category && req.body.category.length > 0) {
      await Category.findByIdAndUpdate(
        req.body.category,
        { $push: { products: product._id } },
        { new: true }
      );
    }

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Thêm sản phẩm thành công", product });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

// export const getAllProducts = async (req, res) => {
//   const {
//     _page = 1,
//     _limit = 20,
//     _sort = "createdAt",
//     _order = "asc",
//     _expand,
//   } = req.query;
//   const options = {
//     page: _page,
//     limit: _limit,
//     sort: { [_sort]: _order === "desc" ? -1 : 1 },
//   };
//   const populateOptions = _expand ? [{ path: "category", select: "name" }] : [];
//   try {
//     const result = await Product.paginate(
//       { categoryId: null },
//       { ...options, populate: populateOptions }
//     );
//     if (result.docs.length === 0) throw new Error("No products found");
//     const response = {
//       data: result.docs,
//       pagination: {
//         currentPage: result.page,
//         totalPages: result.totalPages,
//         totalItems: result.totalDocs,
//       },
//     };
//     return res.status(200).json(response);
//   } catch (error) {
//     return res.status(400).json({ message: error.message });
//   }
// };
export const getAllProducts = async (req, res) => {
  const {
    _page = 1, // Current page number
    _limit = 20, // Items per page
    _sort = "createdAt", // Field to sort by
    _order = "asc", // Sorting order (asc/desc)
    category, // Filter by category
    priceRange,
    search, // Filter by price range (e.g., "100-500" -> min: 100, max: 500)
  } = req.query;

  const filters = {};

  // Filter by category if provided
  if (category) {
    filters.category = { $in: category.split(",") }; // Support multiple categories
  }
  if (search) {
    filters.name = { $regex: search, $options: "i" }; // Case-insensitive search
  }

  // Filter by price range if provided
  if (priceRange) {
    const [minPrice, maxPrice] = priceRange.split("-").map(Number);
    filters.price = { $gte: minPrice, $lte: maxPrice };
  }

  const options = {
    page: parseInt(_page, 10),
    limit: parseInt(_limit, 10),
    sort: { [_sort]: _order === "desc" ? -1 : 1 },
  };

  try {
    const result = await Product.paginate(filters, options);

    if (!result.docs.length) {
      return res.status(404).json({ message: "No products found" });
    }

    const response = {
      data: result.docs,
      pagination: {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.totalDocs,
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product.length === 0)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy sản phẩm nào!" });
    return res
      .status(StatusCodes.OK)
      .json({ message: "Lấy sản phẩm theo id thành công", product });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};
export const deleteProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    return res
      .status(StatusCodes.OK)
      .json({ message: "Xóa sản phẩm thành công", product });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};
export const updateProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res
      .status(StatusCodes.OK)
      .json({ message: "Cập nhật sản phẩm thành công", product });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

// export const related = async (req, res) => {
//   try {
//     const product = await Product.find({
//       category: req.params.categoryId,
//       _id: { $ne: req.params.productId },
//     });
//     return res.status(StatusCodes.OK).json(product);
//   } catch (error) {}
// };

// API để lấy sản phẩm liên quan
// export const getRelatedProducts = async (req, res) => {
//   const { categoryIds, productId } = req.params;
//   // console.log("req.params", req.params);

//   try {
//     // Tìm tất cả các sản phẩm có cùng danh mục và không trùng với ID của sản phẩm hiện tại
//     const relatedProducts = await Product.find({
//       category: { $in: categoryIds.split(",") },
//       _id: { $ne: productId },
//     });

//     return res.status(StatusCodes.OK).json(relatedProducts);
//   } catch (error) {
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
//   }
// };
export const getRelatedProducts = async (req, res) => {
  const { productId } = req.params;

  try {
    // Lấy sản phẩm hiện tại
    const product = await Product.findById(productId).populate("category");
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Sản phẩm không tồn tại!" });
    }

    // Lấy tất cả các ID danh mục của sản phẩm hiện tại
    const categoryIds = product.category.map((cat) => cat._id);

    // Tìm các sản phẩm khác cùng danh mục
    const relatedProducts = await Product.find({
      category: { $in: categoryIds },
      _id: { $ne: productId },
    });

    return res.status(StatusCodes.OK).json(relatedProducts);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};
export const getProductStats = async (req, res) => {
  try {
    const { month, year, statType } = req.query;

    // Kiểm tra tham số statType hợp lệ
    if (
      !statType ||
      ![
        "monthly-revenue",
        "top-selling",
        "total-sold",
        "revenue-stats",
      ].includes(statType)
    ) {
      return res
        .status(400)
        .json({
          error:
            "Invalid statType. Please choose from 'monthly-revenue', 'top-selling', 'total-sold', 'revenue-stats'.",
        });
    }

    const startDate =
      month && year ? new Date(year, month - 1, 1) : new Date(0); // Default to Unix epoch if no month/year
    const endDate = month && year ? new Date(year, month, 0) : new Date(); // Default to now if no month/year

    // Điều kiện chung cho các thống kê theo tháng
    const matchCondition = {
      createdAt: { $gte: startDate, $lt: endDate },
      status: "đã giao", // chỉ tính các đơn đã hoàn thành
    };

    let aggregationPipeline = [];

    // 1. Thống kê doanh thu sản phẩm bán được trong tháng
    if (statType === "monthly-revenue") {
      aggregationPipeline = [
        { $unwind: "$items" },
        {
          $match: matchCondition,
        },
        {
          $group: {
            _id: "$items.productId",
            totalRevenue: { $sum: "$items.quantity" }, // Tính tổng số lượng sản phẩm bán ra
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        { $unwind: "$productInfo" },
        {
          $project: {
            productName: "$productInfo.name",
            totalRevenue: 1,
            totalSold: 1,
          },
        },
        { $sort: { totalRevenue: -1 } },
      ];
    }

    // 2. Thống kê sản phẩm bán chạy nhất (theo số lượng bán)
    else if (statType === "top-selling") {
      aggregationPipeline = [
        { $unwind: "$items" },
        {
          $match: matchCondition,
        },
        {
          $group: {
            _id: "$items.productId",
            totalSold: { $sum: "$items.quantity" },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        { $unwind: "$productInfo" },
        {
          $project: {
            productName: "$productInfo.name",
            totalSold: 1,
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 10 },
      ];
    }

    // 3. Thống kê tổng số sản phẩm đã bán
    else if (statType === "total-sold") {
      aggregationPipeline = [
        { $unwind: "$items" },
        {
          $match: matchCondition,
        },
        {
          $group: {
            _id: "$items.productId",
            totalSold: { $sum: "$items.quantity" },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        { $unwind: "$productInfo" },
        {
          $project: {
            productName: "$productInfo.name",
            totalSold: 1,
          },
        },
      ];
    }

    // 4. Thống kê doanh thu tổng thể của sản phẩm
    else if (statType === "revenue-stats") {
      aggregationPipeline = [
        { $unwind: "$items" },
        {
          $match: matchCondition,
        },
        {
          $group: {
            _id: "$items.productId",
            totalRevenue: {
              $sum: { $multiply: ["$items.quantity", "$items.price"] },
            },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        { $unwind: "$productInfo" },
        {
          $project: {
            productName: "$productInfo.name",
            totalRevenue: 1,
          },
        },
        { $sort: { totalRevenue: -1 } },
      ];
    }

    if (aggregationPipeline.length === 0) {
      return res
        .status(400)
        .json({ error: "No valid statistics found for the given statType." });
    }

    const result = await Order.aggregate(aggregationPipeline);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};