import { StatusCodes } from "http-status-codes";
import Category from "../models/category";

export const getAll = async (req, res) => {
  try {
    const categories = await Category.find({});
    if (categories.length === 0) {
      return res
        .status(StatusCodes.OK)
        .json({ message: "Không có danh mục nào!" });
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: "Lấy sản phẩm thành công", categories });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    // const products = await Product.find({ category: id });
    const category = await Category.findById(id);

    if (!category) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy danh mục!" });
    }
    return res.status(StatusCodes.OK).json({
      category,
      //   products,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
};
