import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import jwt from "jsonwebtoken";
import User from "../models/user";
import BlacklistedToken from "../models/black-listed-token";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
const signupSchema = Joi.object({
  name: Joi.string().min(3).max(30).messages({
    "string.min": "Trường Name phải có ít nhất {#limit} ký tự",
    "string.max": "Trường Name không được vượt quá {#limit} ký tự",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Trường Email là bắt buộc",
    "string.empty": "Trường Email không được để trống",
    "string.email": "Trường Email phải là email hợp lệ",
  }),
  password: Joi.string().min(6).max(30).required().messages({
    "any.required": "Trường Password là bắt buộc",
    "string.empty": "Trường Password không được để trống",
    "string.min": "Trường Password phải có ít nhất {#limit} ký tự",
    "string.max": "Trường Password không được vượt quá {#limit} ký tự",
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.required": "Trường Confirm Password là bắt buộc",
    "any.only": "Mật khẩu không trùng khớp",
  }),
  avatar: Joi.string().uri().messages({
    "string.uri": "Trường Avatar phải là đường dẫn hợp lệ",
  }),
});
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_REFRESH_TOKEN, {
    expiresIn: "10d",
  });
};
const generateAccessToken = (payload) => {
  return jwt.sign(payload, "123456", {
    expiresIn: "7d",
  });
};
export const signup = async (req, res) => {
  const { email, password } = req.body;
  const { error } = signupSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((item) => item.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      messages,
    });
  }

  const existUser = await User.findOne({ email });
  if (existUser) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      messages: ["Email đã tồn tại"],
    });
  }
  // Mã hóa mật khẩu
  const hashedPassword = await bcryptjs.hash(password, 10);
  // Nếu không có user nào trong hệ thống thì tạo user đầu tiên là admin
  const role = (await User.countDocuments({})) === 0 ? "admin" : "user";
  const user = await User.create({
    ...req.body,
    password: hashedPassword,
    role,
  });
  return res.status(StatusCodes.CREATED).json({
    user,
  });
};
export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    // user = { _id: , name: , xxx}
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        messages: ["Email không tồn tại"],
      });
    } else {
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          messages: ["Mật khẩu không chính xác"],
        });
      }
      const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      const refreshToken = generateRefreshToken({
        id: user.id,
        email: user.email,
        role: user.role,
      }); // Generate refresh token
      user.password = undefined;
      return res.status(StatusCodes.OK).json({
        user,
        accessToken,
        refreshToken,
      });
    }
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
    console.error(`Error finding user with email ${email}:`, error);
  }
};
export const logout = async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "No token provided" });
    }
    console.log("token", accessToken);
    // Giải mã token để lấy thông tin, bao gồm cả thời gian hết hạn (expiry date)
    const decodedToken = jwt.verify(accessToken, "123456");
    console.log("decoded token", decodedToken);
    const expiryDate = new Date(decodedToken.exp * 1000); // Chuyển thời gian hết hạn thành kiểu Date
    console.log("1");
    // Lưu token vào danh sách đen với `expiryDate`
    const token = accessToken;
    const blacklistedToken = new BlacklistedToken({ token, expiryDate });
    await blacklistedToken.save();

    // Gửi phản hồi thành công
    return res
      .status(StatusCodes.OK)
      .json({ message: "Successfully logged out" });
  } catch (error) {
    console.error(`Error during logout:`, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
export const changeUser = async (req, res) => {
  try {
    const { name, avatar, phone, birthDay } = req.body;
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "No token provided" });
    }
    console.log("token", accessToken);
    // Giải mã token để lấy thông tin, bao gồm cả thời gian hết hạn (expiry date)
    const decodedToken = jwt.verify(accessToken, "123456");
    if (!name || !phone) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Name, phone, and birthDay are required" });
    }
    const updatedUser = await User.findByIdAndUpdate(decodedToken?.userId, {
      name,
      avatar,
      phone,
      birthDay,
    });
    return res.status(StatusCodes.OK).json({
      message: "Cập nhật thông tin thành công!",
      updatedUser,
    });
  } catch (error) {
    console.error(`Error during logout:`, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
// be/src/controllers/auth.js
export const refreshToken = async (req, res) => {
  try {
    const oldToken = req.headers.authorization;
    // Kiểm tra và xử lý oldToken để tạo refreshToken...
    // Đảm bảo bạn đã kiểm tra xem oldToken có trong blacklist hay không

    const userId = "userId từ oldToken"; // Giả sử bạn đã lấy được userId từ oldToken
    const newToken = generateRefreshToken(userId); // Sử dụng hàm generateRefreshToken đã có

    // Trả về refreshToken mới cho client
    res.status(StatusCodes.OK).json({ newToken });
  } catch (error) {
    console.error(`Error during token refresh:`, error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
export const isTokenBlacklisted = async (token) => {
  const tokenInBlacklist = await BlacklistedToken.findOne({ token });
  return !!tokenInBlacklist;
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Không trả về trường password
    return res.status(StatusCodes.OK).json({
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

export const updateUserRole = async (req, res) => {
  const { userId } = req.params; // Lấy ID người dùng từ tham số URL
  const { role } = req.body; // Lấy vai trò mới từ body yêu cầu

  try {
    // Tìm người dùng theo ID và cập nhật vai trò
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true } // Trả về người dùng đã được cập nhật
    ).select("-password"); // Không trả về trường password

    if (!updatedUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    return res.status(StatusCodes.OK).json({
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Trường Email là bắt buộc",
    "string.email": "Trường Email phải là email hợp lệ",
  }),
});

// Tạo endpoint để yêu cầu quên mật khẩu
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const { error } = forgotPasswordSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const messages = error.details.map((item) => item.message);
    return res.status(StatusCodes.BAD_REQUEST).json({ messages });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      messages: ["Email không tồn tại"],
    });
  }

  // Tạo token ngẫu nhiên
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Đặt thời gian hết hạn cho token (ví dụ 1 giờ)
  const tokenExpiry = Date.now() + 3600000; // 1 giờ

  // Cập nhật token và thời gian hết hạn vào user
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiry = tokenExpiry;
  await user.save();

  // Tạo đường dẫn reset mật khẩu
  const resetUrl = `http://localhost:8080/api/v1/auth/reset-password/${resetToken}`;

  // Gửi email chứa đường dẫn reset mật khẩu
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "tung08012004@gmail.com", // Cấu hình email của bạn
      pass: "123456",
    },
  });

  const mailOptions = {
    to: email,
    subject: "Password Reset",
    text: `Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấn vào link sau để đặt lại mật khẩu: ${resetUrl}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Có lỗi xảy ra khi gửi email",
      });
    } else {
      res.status(StatusCodes.OK).json({
        message: "Email đặt lại mật khẩu đã được gửi",
      });
    }
  });
};

// Tạo endpoint để đặt lại mật khẩu
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  // Kiểm tra token
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpiry: { $gt: Date.now() }, // Kiểm tra token có hết hạn không
  });

  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      messages: ["Token không hợp lệ hoặc đã hết hạn"],
    });
  }

  // Kiểm tra confirmPassword và password có khớp không
  if (password !== confirmPassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      messages: ["Mật khẩu không trùng khớp"],
    });
  }

  // Hash mật khẩu mới
  const hashedPassword = await bcryptjs.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined; // Xóa token sau khi đã sử dụng
  user.resetPasswordExpiry = undefined; // Xóa thời gian hết hạn

  await user.save();

  res.status(StatusCodes.OK).json({
    message: "Mật khẩu đã được đặt lại thành công",
  });
};
