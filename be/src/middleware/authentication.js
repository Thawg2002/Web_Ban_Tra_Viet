import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import User from "../models/user";
import dotenv from "dotenv";
dotenv.config();
const authentication = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    console.log("token", token);
    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Bạn chưa đăng nhập" });
    }
    jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, async (err, user) => {
      if (err) {
        let message = "Lỗi token";
        console.log("Error: ", err.message);
        if (err.message === "invalid token") {
          message = "Token không hợp lệ";
        }
        if (err.message === "jwt expired") {
          message = "Token đã hết hạn";
        }
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: message,
        });
      }
      const existUser = await User.findById(user.id);
      if (!existUser) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Tài khoản không tồn tại" });
      }
      req.user = {
        id: existUser.id,
        email: existUser.email,
        role: existUser.role,
      };
      next();
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};
export default authentication;
