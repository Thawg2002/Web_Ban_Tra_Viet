import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import jwt from "jsonwebtoken";
import User from "../models/user";
import BlacklistedToken from "../models/black-listed-token";
// const crypto = require('crypto')
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
  return jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN, {
    expiresIn: "1d",
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
      res.cookie("token", refreshToken, {
        maxAge: 60 * 24 * 60 * 60 * 1000,
        path: "/",
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
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
export const refreshToken = async (req, res) => {
  try {
    // const oldToken = req.headers.authorization?.split(" ")[1];
    const oldToken = req.cookies.token;
    console.log("token", oldToken);
    if (!oldToken) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Bạn chưa đăng nhập" });
    }
    // Kiểm tra token có hợp lệ không và lấy userId
    jwt.verify(
      oldToken,
      process.env.SECRET_REFRESH_TOKEN,
      async (err, user) => {
        if (err) {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Token đã hết hạn, mời bạn đăng nhập lại",
          });
        }
        if (!user) {
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: "Người dùng không hợp lệ" });
        }
        // Kiểm tra xem token có nằm trong blacklist không
        const isBlacklisted = await isTokenBlacklisted(oldToken);
        if (isBlacklisted) {
          return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: "Token is blacklisted" });
        }

        // Tạo accessToken và refreshToken mới
        const payload = {
          id: user.id,
          email: user.email,
          role: user.role,
        };
        const newAccessToken = await generateAccessToken(payload);
        const newRefreshToken = await generateRefreshToken(payload);

        // Trả về accessToken mới và lưu refreshToken dưới dạng cookie httpOnly
        res.cookie("refreshToken", newRefreshToken, {
          maxAge: 24 * 60 * 60 * 1000 * 60,
          httpOnly: true,
          path: "/",
          sameSite: "none",
          secure: true,
        });

        return res.status(StatusCodes.OK).json({
          message: "Tạo token thành công",
          accessToken: newAccessToken,
        });
      }
    );
  } catch (error) {
    console.error("Error during token refresh:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = req.user;
    console.log("user", user);

    const existUser = await User.findById(user?.id).select("-password");
    if (!existUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "User not found" });
    }
    return res.status(StatusCodes.OK).json({
      message: "Lấy thông tin thành công",
      data: existUser,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "No token provided" });
    }
    // Lưu token vào danh sách đen (blacklist) để ngăn không cho token đó được sử dụng nữa
    const blacklistedToken = new BlacklistedToken({ token });
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

// be/src/controllers/auth.js
// export const refreshToken = async (req, res) => {
//   try {
//     const oldToken = req.headers.authorization?.split(" ")[1];
//     console.log("token", oldToken);
//     if (!oldToken) {
//       return res
//         .status(StatusCodes.UNAUTHORIZED)
//         .json({ error: "Bạn chưa đăng nhập" });
//     }

//     // Kiểm tra token có hợp lệ không và lấy userId
//     jwt.verify(oldToken, process.env.SECRET_ACCESS_TOKEN, async (err, user) => {
//       if (err) {
//         return res.status(StatusCodes.UNAUTHORIZED).json({
//           message: "Token đã hết hạn, mời bạn đăng nhập lại",
//         });
//       }
//       if (!user) {
//         return;
//       }

//       // Kiểm tra xem token có nằm trong blacklist không
//       const isBlacklisted = await isTokenBlacklisted(oldToken);
//       if (isBlacklisted) {
//         return res
//           .status(StatusCodes.UNAUTHORIZED)
//           .json({ error: "Token is blacklisted" });
//       }

//       const payload = {
//         id: user.id,
//         email: user.email,
//         role: user.role,
//       };
//       const NewAccessToken = await generateAccessToken(payload);
//       const NewRefreshToken = await generateRefreshToken(payload);

//       // Trả về token mới cho client
//       return res.status(StatusCodes.OK).json({
//         message: "Tạo token thành công",
//         accessToken: NewAccessToken,
//         refreshToken: NewRefreshToken,
//       });
//     });
//   } catch (error) {
//     console.error("Error during token refresh:", error);
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ error: "Internal Server Error" });
//   }
// };

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
